"use client";

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { maskCPF, maskPhone, maskCurrency, validateCPF, unmask } from '@/lib/formatters';
import { toast } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './cadastro.module.css';

interface FileState {
  documentosPessoais: File[];
  comprovanteRenda: File[];
  documentosConjuge: File[];
}

const initialState = {
  email: '',
  nomeCompleto: '',
  nacionalidade: 'Brasileira',
  nacionalidadeOutra: '',
  estadoCivil: 'Solteiro(a)',
  profissao: '',
  rg: '',
  cpf: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  telefone: '',
  emailComunicacao: '',
  conjugeNome: '',
  conjugeNacionalidade: 'Brasileiro(a)',
  conjugeNacionalidadeOutra: '',
  conjugeProfissao: '',
  conjugeRg: '',
  conjugeCpf: '',
  conjugeTelefone: '',
  rendaMensal: '',
  referenciaPessoal01: '',
  referenciaPessoal02: '',
  imovelDesejado: '',
  condicaoProposta: '',
  vencimentoAluguel: '5',
  animaisEstimacao: '',
  garantiaContratual: 'FIADOR',
  emailFiador: '',
  cartorioFirma: '',
  aceiteObservacoes: false,
  aceiteReserva: false,
  aceiteVeracidade: false,
  dataPreenchimento: new Date().toISOString().split('T')[0],
};

const fileInitialState: FileState = {
  documentosPessoais: [],
  comprovanteRenda: [],
  documentosConjuge: [],
}

const FileList = ({ files, onRemove }: { files: File[], onRemove: (index: number) => void }) => {
  if (files.length === 0) {
    return <p className={styles.fileListItem}>Nenhum arquivo selecionado.</p>;
  }
  return (
    <div className={styles.fileList}>
      {files.map((file, index) => (
        <div key={index} className={styles.fileListItem}>
          <span><i className='bx bxs-file'></i> {file.name}</span>
          <button type="button" onClick={() => onRemove(index)} className={styles.removeFileButton}>
            <i className='bx bx-x'></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState<FileState>(fileInitialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // REMOVIDO: O estado de erro não é mais necessário
  // const [error, setError] = useState(''); 
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Limpa apenas os erros visuais dos campos
    if(validationErrors.length > 0) setValidationErrors([]);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue = value;
    if (name === 'cpf' || name === 'conjugeCpf') finalValue = maskCPF(value);
    else if (name === 'telefone' || name === 'conjugeTelefone') finalValue = maskPhone(value);
    else if (name === 'rendaMensal') finalValue = maskCurrency(value);

    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const checked = isCheckbox ? e.target.checked : undefined;
    
    if (name === 'garantiaContratual' && value !== 'FIADOR') {
      setFormData(prev => ({ ...prev, garantiaContratual: value, emailFiador: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : finalValue }));
    }
  };
  
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({...prev, cep: cep}));

    if (cep.length === 8) {
      setIsCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({ ...prev, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf }));
          document.getElementById('numero')?.focus();
        } else {
            toast.error("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error("Não foi possível buscar o CEP. Tente novamente.");
      } finally { setIsCepLoading(false); }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles && inputFiles.length > 0) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
      const newFiles: File[] = Array.from(inputFiles);
      
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        toast.error(`O arquivo "${oversizedFiles[0].name}" é muito grande. O tamanho máximo é 10 MB.`);
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [name]: [...prev[name as keyof FileState], ...newFiles]
      }));
    }
    e.target.value = '';
  };
  
  const handleRemoveFile = (fieldName: keyof FileState, indexToRemove: number) => {
    setFiles(prev => ({
        ...prev,
        [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateStep = () => {
    const errors: string[] = [];
    let requiredFields: (keyof typeof initialState)[] = [];

    switch (step) {
      case 1:
        requiredFields = ['nomeCompleto', 'email', 'nacionalidade', 'profissao', 'estadoCivil', 'rg', 'cpf', 'cep', 'rua', 'numero', 'telefone', 'emailComunicacao'];
        if (formData.nacionalidade === 'Outra') requiredFields.push('nacionalidadeOutra');
        if (formData.estadoCivil === 'Casado(a)') {
          requiredFields.push('conjugeNome', 'conjugeNacionalidade', 'conjugeProfissao', 'conjugeRg', 'conjugeCpf', 'conjugeTelefone');
          if (formData.conjugeNacionalidade === 'Outra') requiredFields.push('conjugeNacionalidadeOutra');
        }
        break;
      case 2:
        requiredFields = ['rendaMensal', 'referenciaPessoal01', 'referenciaPessoal02', 'animaisEstimacao', 'cartorioFirma'];
        break;
      case 3:
        requiredFields = ['imovelDesejado', 'condicaoProposta', 'garantiaContratual'];
        if (formData.garantiaContratual === 'FIADOR') requiredFields.push('emailFiador');
        break;
      default:
        break;
    }

    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !(formData[field] as string).trim())) {
        errors.push(field);
      }
    });
    
    // As validações de CPF agora retornam a mensagem de erro específica
    if(step === 1) {
        if (formData.cpf && !validateCPF(formData.cpf)) {
            errors.push('cpf');
            toast.error('CPF do pretendente é inválido.');
        }
        if (formData.estadoCivil === 'Casado(a)' && formData.conjugeCpf && !validateCPF(formData.conjugeCpf)) {
            errors.push('conjugeCpf');
            toast.error('CPF do cônjuge é inválido.');
        }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
        // ATUALIZADO: A mensagem de erro geral agora é um toast
        toast.error('Por favor, preencha todos os campos obrigatórios (*).');
        setTimeout(() => {
          const firstErrorField = document.querySelector(`.${styles.error} input, .${styles.error} select, .${styles.error} textarea`);
          if (firstErrorField) (firstErrorField as HTMLElement).focus();
        }, 100);
    }
  };

  const prevStep = () => {
      setValidationErrors([]);
      setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ATUALIZADO: Erros de aceite e de arquivos agora são toasts
    if (!formData.aceiteObservacoes || !formData.aceiteReserva || !formData.aceiteVeracidade) {
      toast.error('Você deve concordar com todos os termos para finalizar.');
      return;
    }
    if (files.documentosPessoais.length === 0 || files.comprovanteRenda.length === 0) {
        toast.error('Por favor, anexe os documentos obrigatórios.');
        return;
    }
    setIsLoading(true);

    try {
      const uploadFile = async (file: File, path: string) => {
        const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      };
      
      const uploadMultipleFiles = (fileList: File[], path: string) => {
          const promises = fileList.map(file => uploadFile(file, path));
          return Promise.all(promises);
      };

      const [docsPessoaisUrls, comprovanteRendaUrls, docsConjugeUrls] = await Promise.all([
        uploadMultipleFiles(files.documentosPessoais, 'documentos-pessoais'),
        uploadMultipleFiles(files.comprovanteRenda, 'comprovantes-renda'),
        uploadMultipleFiles(files.documentosConjuge, 'documentos-conjuge')
      ]);

      const finalFormData = { ...formData, cpf: unmask(formData.cpf), conjugeCpf: unmask(formData.conjugeCpf), telefone: unmask(formData.telefone), conjugeTelefone: unmask(formData.conjugeTelefone), rendaMensal: unmask(formData.rendaMensal) };
      if (finalFormData.estadoCivil !== 'Casado(a)') {
        Object.keys(finalFormData).forEach(key => {
            if (key.startsWith('conjuge')) {
                // @ts-ignore
                finalFormData[key] = '';
            }
        });
      }

      await addDoc(collection(db, "propostasLocacao"), {
        ...finalFormData,
        fileURLs: { documentosPessoais: docsPessoaisUrls, comprovanteRenda: comprovanteRendaUrls, documentosConjuge: docsConjugeUrls },
        dataEnvio: new Date().toISOString()
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      // ATUALIZADO: Erro no envio final também é um toast
      toast.error('Ocorreu um erro ao enviar sua proposta. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

    if (isSuccess) {
    return (
      <>
        <Header />
        <main className={`${styles.pageContainer} ${styles.successContainer}`}>
          <div className="container">
            <i className={`bx bxs-check-circle ${styles.successIcon}`}></i>
            <h1 className={styles.pageTitle}>Proposta Enviada!</h1>
            <p className={styles.pageSubtitle}>
              Recebemos suas informações com sucesso. Nossa equipe analisará e entrará em contato em breve.
            </p>
            <a href="/" className={styles.backButton}>Voltar para a Página Inicial</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <div className="container">
          <div className={styles.formWrapper}>
            <h1 className={styles.pageTitle}>Ficha Cadastral para Locação</h1>
            <p className={styles.pageSubtitle}>
              Preencha os campos abaixo para iniciar sua proposta de locação.
            </p>
            {/* REMOVIDO: A caixa de erro estática não é mais necessária */}
            {/* {error && <p className={styles.errorText}>{error}</p>} */}

            <div className={styles.progressBar} style={{ '--step': step } as React.CSSProperties}>
              <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}><span>1</span><p>Pessoal</p></div>
              <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}><span>2</span><p>Detalhes</p></div>
              <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}><span>3</span><p>Proposta</p></div>
              <div className={`${styles.progressStep} ${step >= 4 ? styles.active : ''}`}><span>4</span><p>Documentos</p></div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
                  <h2 className={styles.stepTitle}>Dados do Pretendente (Locatário)</h2>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('nomeCompleto') ? styles.error : ''}`}><label htmlFor="nomeCompleto">Nome Completo *</label><input type="text" name="nomeCompleto" id="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} required /></div>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('email') ? styles.error : ''}`}><label htmlFor="email">Email *</label><input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required /></div>
                  <div className={styles.inputGrid}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('nacionalidade') ? styles.error : ''}`}><label htmlFor="nacionalidade">Nacionalidade *</label><select name="nacionalidade" id="nacionalidade" value={formData.nacionalidade} onChange={handleInputChange}><option value="Brasileira">Brasileira</option><option value="Outra">Outra</option></select>{formData.nacionalidade === 'Outra' && (<input type="text" name="nacionalidadeOutra" placeholder="Digite a nacionalidade" value={formData.nacionalidadeOutra} onChange={handleInputChange} required className={`${styles.subInput} ${validationErrors.includes('nacionalidadeOutra') ? styles.errorInput : ''}`}/>)}</div>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('profissao') ? styles.error : ''}`}><label htmlFor="profissao">Profissão *</label><input type="text" name="profissao" id="profissao" value={formData.profissao} onChange={handleInputChange} required /></div>
                  </div>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('estadoCivil') ? styles.error : ''}`}><label>Estado Civil *</label><div className={styles.radioGroup}><label><input type="radio" name="estadoCivil" value="Solteiro(a)" checked={formData.estadoCivil === 'Solteiro(a)'} onChange={handleInputChange}/>Solteiro(a)</label><label><input type="radio" name="estadoCivil" value="Casado(a)" checked={formData.estadoCivil === 'Casado(a)'} onChange={handleInputChange}/>Casado(a)</label><label><input type="radio" name="estadoCivil" value="Divorciado(a)" checked={formData.estadoCivil === 'Divorciado(a)'} onChange={handleInputChange}/>Divorciado(a)</label><label><input type="radio" name="estadoCivil" value="Viúvo(a)" checked={formData.estadoCivil === 'Viúvo(a)'} onChange={handleInputChange}/>Viúvo(a)</label><label><input type="radio" name="estadoCivil" value="Separado(a) judicialmente" checked={formData.estadoCivil === 'Separado(a) judicialmente'} onChange={handleInputChange}/>Separado(a)</label></div></div>
                  <div className={styles.inputGrid}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('rg') ? styles.error : ''}`}><label htmlFor="rg">Carteira de Identidade (RG) + Órgão emissor / Estado *</label><input type="text" name="rg" id="rg" value={formData.rg} onChange={handleInputChange} required /></div>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('cpf') ? styles.error : ''}`}><label htmlFor="cpf">CPF *</label><input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleInputChange} required maxLength={14} /></div>
                  </div>
                  
                  <h3 className={styles.subStepTitle}>Endereço Residencial</h3>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('cep') ? styles.error : ''}`}>
                    <label htmlFor="cep">CEP *</label>
                    <input type="text" name="cep" id="cep" value={formData.cep} onChange={handleCepChange} maxLength={9} required />
                    {isCepLoading && <small>Buscando endereço...</small>}
                  </div>
                  <div className={styles.inputGrid}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('rua') ? styles.error : ''}`}><label htmlFor="rua">Rua *</label><input type="text" name="rua" id="rua" value={formData.rua} onChange={handleInputChange} readOnly /></div>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('bairro') ? styles.error : ''}`}><label htmlFor="bairro">Bairro *</label><input type="text" name="bairro" id="bairro" value={formData.bairro} onChange={handleInputChange} readOnly /></div>
                  </div>
                  <div className={styles.inputGrid}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('cidade') ? styles.error : ''}`}><label htmlFor="cidade">Cidade *</label><input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={handleInputChange} readOnly /></div>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('estado') ? styles.error : ''}`}><label htmlFor="estado">Estado *</label><input type="text" name="estado" id="estado" value={formData.estado} onChange={handleInputChange} readOnly /></div>
                  </div>
                  <div className={styles.inputGrid}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('numero') ? styles.error : ''}`}><label htmlFor="numero">Número *</label><input type="text" name="numero" id="numero" value={formData.numero} onChange={handleInputChange} required /></div>
                    <div className={styles.inputGroup}><label htmlFor="complemento">Complemento (Edifício, Apto, etc.)</label><input type="text" name="complemento" id="complemento" value={formData.complemento} onChange={handleInputChange} /></div>
                  </div>

                  <div className={styles.inputGrid} style={{marginTop: '2rem'}}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('telefone') ? styles.error : ''}`}><label htmlFor="telefone">Telefone para Contato (com DDD) *</label><input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleInputChange} required maxLength={15}/></div>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('emailComunicacao') ? styles.error : ''}`}><label htmlFor="emailComunicacao">Endereço de e-mail para comunicação geral *</label><input type="email" name="emailComunicacao" id="emailComunicacao" value={formData.emailComunicacao} onChange={handleInputChange} required /></div>
                  </div>
                  
                  {formData.estadoCivil === 'Casado(a)' && (
                    <div className={styles.conjugeSection}>
                        <h3 className={styles.subStepTitle}>Dados do Cônjuge *</h3>
                        <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeNome') ? styles.error : ''}`}><label htmlFor="conjugeNome">Cônjuge: Nome Completo *</label><input type="text" name="conjugeNome" id="conjugeNome" value={formData.conjugeNome} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} /></div>
                        <div className={styles.inputGrid}>
                            <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeNacionalidade') ? styles.error : ''}`}><label htmlFor="conjugeNacionalidade">Cônjuge: Nacionalidade *</label><select name="conjugeNacionalidade" id="conjugeNacionalidade" value={formData.conjugeNacionalidade} onChange={handleInputChange}><option value="Brasileiro(a)">Brasileiro(a)</option><option value="Outra">Outra</option></select>{formData.conjugeNacionalidade === 'Outra' && (<input type="text" name="conjugeNacionalidadeOutra" placeholder="Digite a nacionalidade" value={formData.conjugeNacionalidadeOutra} onChange={handleInputChange} required className={`${styles.subInput} ${validationErrors.includes('conjugeNacionalidadeOutra') ? styles.errorInput : ''}`} />)}</div>
                            <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeProfissao') ? styles.error : ''}`}><label htmlFor="conjugeProfissao">Cônjuge: Profissão *</label><input type="text" name="conjugeProfissao" id="conjugeProfissao" value={formData.conjugeProfissao} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} /></div>
                        </div>
                        <div className={styles.inputGrid}>
                            <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeRg') ? styles.error : ''}`}><label htmlFor="conjugeRg">Cônjuge: Carteira de Identidade (RG) + Órgão emissor / Estado *</label><input type="text" name="conjugeRg" id="conjugeRg" value={formData.conjugeRg} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} /></div>
                            <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeCpf') ? styles.error : ''}`}><label htmlFor="conjugeCpf">Cônjuge: CPF *</label><input type="text" name="conjugeCpf" id="conjugeCpf" value={formData.conjugeCpf} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} maxLength={14}/></div>
                        </div>
                        <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeTelefone') ? styles.error : ''}`}><label htmlFor="conjugeTelefone">Cônjuge: Telefone para Contato (com DDD) *</label><input type="tel" name="conjugeTelefone" id="conjugeTelefone" value={formData.conjugeTelefone} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} maxLength={15}/></div>
                    </div>
                  )}

                  <div className={styles.buttonGroup}><button type="button" onClick={nextStep} className={styles.nextButton}>Avançar</button></div>
                </div>
              )}
              {step === 2 && (
                <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
                  <h2 className={styles.stepTitle}>Detalhes Adicionais</h2>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('rendaMensal') ? styles.error : ''}`}><label htmlFor="rendaMensal">Renda mensal (média) *</label><input type="text" name="rendaMensal" id="rendaMensal" value={formData.rendaMensal} onChange={handleInputChange} placeholder="R$ 0,00" required /></div>
                  <div className={styles.inputGrid}>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('referenciaPessoal01') ? styles.error : ''}`}><label htmlFor="referenciaPessoal01">Referência pessoal 01: Nome + número de telefone *</label><input type="text" name="referenciaPessoal01" id="referenciaPessoal01" value={formData.referenciaPessoal01} onChange={handleInputChange} required /></div>
                    <div className={`${styles.inputGroup} ${validationErrors.includes('referenciaPessoal02') ? styles.error : ''}`}><label htmlFor="referenciaPessoal02">Referência pessoal 02: Nome + número de telefone *</label><input type="text" name="referenciaPessoal02" id="referenciaPessoal02" value={formData.referenciaPessoal02} onChange={handleInputChange} required /></div>
                  </div>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('animaisEstimacao') ? styles.error : ''}`}><label htmlFor="animaisEstimacao">Tem ou pretende ter animais de estimação morando no mesmo imóvel? Se sim, quantos e quais? *</label><input type="text" name="animaisEstimacao" id="animaisEstimacao" value={formData.animaisEstimacao} onChange={handleInputChange} required /></div>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('cartorioFirma') ? styles.error : ''}`}><label htmlFor="cartorioFirma">Em qual cartório tem firma aberta? *</label><input type="text" name="cartorioFirma" id="cartorioFirma" value={formData.cartorioFirma} onChange={handleInputChange} required /></div>
                  <div className={styles.buttonGroup}><button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button><button type="button" onClick={nextStep} className={styles.nextButton}>Avançar</button></div>
                </div>
              )}
              {step === 3 && (
                <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
                  <h2 className={styles.stepTitle}>Sobre a Locação</h2>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('imovelDesejado') ? styles.error : ''}`}><label htmlFor="imovelDesejado">Qual imóvel deseja alugar? *</label><input type="text" name="imovelDesejado" id="imovelDesejado" value={formData.imovelDesejado} onChange={handleInputChange} placeholder="Ex: Apto 302 no Ed. Sol Nascente" required /></div>
                  <div className={`${styles.inputGroup} ${validationErrors.includes('condicaoProposta') ? styles.error : ''}`}><label htmlFor="condicaoProposta">Nos informe se há alguma CONDIÇÃO para a locação E/OU se existe alguma PROPOSTA pendente? *</label><textarea name="condicaoProposta" id="condicaoProposta" rows={4} value={formData.condicaoProposta} onChange={handleInputChange} required></textarea></div>
                  <div className={styles.inputGroup}><label>Qual a preferência de vencimento do boleto do aluguel? *</label><div className={styles.radioGroup}><label><input type="radio" name="vencimentoAluguel" value="5" checked={formData.vencimentoAluguel === '5'} onChange={handleInputChange}/>Dia 5</label><label><input type="radio" name="vencimentoAluguel" value="10" checked={formData.vencimentoAluguel === '10'} onChange={handleInputChange}/>Dia 10</label><label><input type="radio" name="vencimentoAluguel" value="15" checked={formData.vencimentoAluguel === '15'} onChange={handleInputChange}/>Dia 15</label><label><input type="radio" name="vencimentoAluguel" value="20" checked={formData.vencimentoAluguel === '20'} onChange={handleInputChange}/>Dia 20</label></div></div>
                  
                  <div className={styles.inputGroup}>
                    <label>Qual a GARANTIA contratual? *</label>
                    <div className={styles.radioGroupVertical}>
                      <label><input type="radio" name="garantiaContratual" value="FIADOR" checked={formData.garantiaContratual === 'FIADOR'} onChange={handleInputChange}/><strong>FIADOR</strong> - Preenchimento de cadastro específico + Documentos pessoais (iguais aos do Locatário).</label>
                      <label><input type="radio" name="garantiaContratual" value="CAUÇÃO" checked={formData.garantiaContratual === 'CAUÇÃO'} onChange={handleInputChange}/><strong>CAUÇÃO</strong> - Depósito no total de 03 (três) vezes o valor do aluguel.</label>
                      <label><input type="radio" name="garantiaContratual" value="SEGURO" checked={formData.garantiaContratual === 'SEGURO'} onChange={handleInputChange}/><strong>SEGURO FIANÇA</strong> - Contratação junto a seguradora (Recomendamos a LOFT).</label>
                    </div>
                  </div>

                  {formData.garantiaContratual === 'FIADOR' && (
                    <div className={`${styles.inputGroup} ${styles.conditionalField} ${validationErrors.includes('emailFiador') ? styles.error : ''}`}>
                      <label htmlFor="emailFiador">E-mail do Fiador *</label>
                      <input type="email" name="emailFiador" id="emailFiador" value={formData.emailFiador} onChange={handleInputChange} required />
                    </div>
                  )}

                  <div className={styles.buttonGroup}><button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button><button type="button" onClick={nextStep} className={styles.nextButton}>Avançar</button></div>
                </div>
              )}
              {step === 4 && (
                <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
                  <h2 className={styles.stepTitle}>Anexar Documentos</h2>
                  <div className={styles.inputGroup}>
                    <label>Documentos pessoais do pretendente (locatário) *</label>
                    <small className={styles.fieldDescription}>Cópias legíveis: RG e CPF (ou CNH); Comprovante de residência atualizado; Comprovante de estado civil.</small>
                    <label htmlFor="documentosPessoais" className={styles.fileUploadLabel}><i className='bx bxs-cloud-upload'></i><span>Selecionar Arquivos</span></label>
                    <input type="file" name="documentosPessoais" id="documentosPessoais" className={styles.fileUploadInput} onChange={handleFileChange} multiple required />
                    <FileList files={files.documentosPessoais} onRemove={(index) => handleRemoveFile('documentosPessoais', index)} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Comprovação de renda *</label>
                    <small className={styles.fieldDescription}>Holerites, contracheques, DECORE, extratos bancários, etc.</small>
                    <label htmlFor="comprovanteRenda" className={styles.fileUploadLabel}><i className='bx bxs-cloud-upload'></i><span>Selecionar Arquivos</span></label>
                    <input type="file" name="comprovanteRenda" id="comprovanteRenda" className={styles.fileUploadInput} onChange={handleFileChange} multiple required />
                    <FileList files={files.comprovanteRenda} onRemove={(index) => handleRemoveFile('comprovanteRenda', index)} />
                  </div>
                  {formData.estadoCivil === 'Casado(a)' && (
                    <div className={styles.inputGroup}>
                      <label>Documentos do cônjuge/companheiro(a) *</label>
                      <small className={styles.fieldDescription}>RG e CPF (ou CNH).</small>
                      <label htmlFor="documentosConjuge" className={styles.fileUploadLabel}><i className='bx bxs-cloud-upload'></i><span>Selecionar Arquivos</span></label>
                      <input type="file" name="documentosConjuge" id="documentosConjuge" className={styles.fileUploadInput} onChange={handleFileChange} multiple required={formData.estadoCivil === 'Casado(a)'}/>
                      <FileList files={files.documentosConjuge} onRemove={(index) => handleRemoveFile('documentosConjuge', index)} />
                    </div>
                  )}
                  
                  <h2 className={styles.stepTitle} style={{ marginTop: '3rem' }}>Termos e Declarações</h2>
                  <div className={styles.termsBox}>
                      <p><strong>OBSERVAÇÕES IMPORTANTES:</strong></p>
                      <p>1 - O não envio dos documentos exigidos, bem como a ausência de preenchimento dos campos obrigatórios, implicará a imediata desconsideração da proposta...</p>
                      <p>2 - A apresentação da certidão de casamento pelo LOCATÁRIO é recomendável como medida de segurança jurídica...</p>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" name="aceiteObservacoes" checked={formData.aceiteObservacoes} onChange={handleInputChange} required /><span>Sim, li e estou ciente das observações importantes. *</span></label>
                    <label><input type="checkbox" name="aceiteReserva" checked={formData.aceiteReserva} onChange={handleInputChange} required /><span>Reconheço que não há qualquer forma de reserva ou preferência... *</span></label>
                    <label><input type="checkbox" name="aceiteVeracidade" checked={formData.aceiteVeracidade} onChange={handleInputChange} required /><span>Declaro que todas as informações prestadas são verdadeiras... *</span></label>
                  </div>
                  <div className={styles.inputGroup}><label htmlFor="dataPreenchimento">Data</label><input type="date" name="dataPreenchimento" id="dataPreenchimento" value={formData.dataPreenchimento} onChange={handleInputChange} readOnly /></div>

                  <div className={styles.buttonGroup}><button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button><button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Enviando...' : 'Finalizar Proposta'}</button></div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}