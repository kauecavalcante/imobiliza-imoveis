// src/app/fiador/hooks/useFiadorForm.ts
import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'sonner';
import { maskCPF, maskPhone, maskCurrency, unmask } from '@/lib/formatters';
import { IFormDataFiador, IFileStateFiador } from '../types';
import { validateStepFiador } from '../utils/validationFiador';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const initialState: IFormDataFiador = {
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
    conjugeNome: '',
    conjugeNacionalidade: 'Brasileiro(a)',
    conjugeNacionalidadeOutra: '',
    conjugeProfissao: '',
    conjugeRg: '',
    conjugeCpf: '',
    conjugeTelefone: '',
    rendaMensal: '',
    referenciaPessoal01Nome: '',
    referenciaPessoal01Telefone: '',
    referenciaPessoal02Nome: '',
    referenciaPessoal02Telefone: '',
    cartorioFirma: '',
    aceiteObservacoes: false,
    aceiteReserva: false,
    aceiteVeracidade: false,
    dataPreenchimento: new Date().toISOString().split('T')[0],
    locatarioPrincipal: '',
};

const fileInitialState: IFileStateFiador = {
    documentosPessoais: [],
    comprovanteRenda: [],
    documentosConjuge: [],
};

export const useFiadorForm = (locatario: string | null) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<IFormDataFiador>({...initialState, locatarioPrincipal: locatario || ''});
    const [files, setFiles] = useState<IFileStateFiador>(fileInitialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        if (locatario) {
            setFormData(prev => ({...prev, locatarioPrincipal: locatario}));
        }
    }, [locatario]);

    useEffect(() => {
        if (validationErrors.length > 0) setValidationErrors([]);
    }, [formData, validationErrors.length]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let finalValue = value;
        if (name === 'cpf' || name === 'conjugeCpf') finalValue = maskCPF(value);
        else if (['telefone', 'conjugeTelefone', 'referenciaPessoal01Telefone', 'referenciaPessoal02Telefone'].includes(name)) finalValue = maskPhone(value);
        else if (name === 'rendaMensal') finalValue = maskCurrency(value);

        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : finalValue }));
    };
    
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, cep: cep }));

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
            const MAX_FILE_SIZE = 10 * 1024 * 1024;
            const newFiles: File[] = Array.from(inputFiles);

            const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
            if (oversizedFiles.length > 0) {
                toast.error(`O arquivo "${oversizedFiles[0].name}" é muito grande. O tamanho máximo é 10 MB.`);
                return;
            }

            setFiles(prev => ({
                ...prev,
                [name as keyof IFileStateFiador]: [...prev[name as keyof IFileStateFiador], ...newFiles]
            }));
        }
        e.target.value = '';
    };

    const handleRemoveFile = (fieldName: keyof IFileStateFiador, indexToRemove: number) => {
        setFiles(prev => ({
            ...prev,
            [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove)
        }));
    };

    const scrollToTop = () => {
        const formContainer = document.getElementById('form-container-fiador');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const nextStep = () => {
        const errors = validateStepFiador(step, formData);
        setValidationErrors(errors);

        if (errors.length === 0) {
            setStep(prev => prev + 1);
            scrollToTop();
        } else {
            toast.error('Por favor, preencha todos os campos obrigatórios (*).');
            setTimeout(() => {
                const firstErrorField = document.querySelector(`.error input, .error select, .error textarea`);
                if (firstErrorField) (firstErrorField as HTMLElement).focus();
            }, 100);
        }
    };

    const prevStep = () => {
        setValidationErrors([]);
        setStep(prev => prev - 1);
        scrollToTop();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.aceiteObservacoes || !formData.aceiteVeracidade) {
            toast.error('Você deve concordar com todos os termos para finalizar.');
            return;
        }
        setIsLoading(true);

        try {
            const uploadFile = async (file: File, path: string) => {
                const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
                await uploadBytes(fileRef, file);
                const url = await getDownloadURL(fileRef);
                return { path: fileRef.fullPath, url: url, name: file.name };
            };

            const uploadMultipleFiles = (fileList: File[], path: string) => {
                return Promise.all(fileList.map(file => uploadFile(file, path)));
            };

            const [docsPessoaisFiles, comprovanteRendaFiles, docsConjugeFiles] = await Promise.all([
                uploadMultipleFiles(files.documentosPessoais, 'fiador-documentos-pessoais'),
                uploadMultipleFiles(files.comprovanteRenda, 'fiador-comprovantes-renda'),
                uploadMultipleFiles(files.documentosConjuge, 'fiador-documentos-conjuge')
            ]);

            const filePaths = {
                documentosPessoais: docsPessoaisFiles.map(f => f.path),
                comprovanteRenda: comprovanteRendaFiles.map(f => f.path),
                documentosConjuge: docsConjugeFiles.map(f => f.path)
            };

            const unmaskedData = {
                cpf: unmask(formData.cpf),
                conjugeCpf: unmask(formData.conjugeCpf),
                telefone: unmask(formData.telefone),
                conjugeTelefone: unmask(formData.conjugeTelefone),
                rendaMensal: unmask(formData.rendaMensal),
                referenciaPessoal01Telefone: unmask(formData.referenciaPessoal01Telefone),
                referenciaPessoal02Telefone: unmask(formData.referenciaPessoal02Telefone),
            };

            const finalFormData = { ...formData, ...unmaskedData };

            if (finalFormData.estadoCivil !== 'Casado(a)') {
                Object.keys(finalFormData).forEach(key => {
                    if (key.startsWith('conjuge')) {
                        // @ts-expect-error We are dynamically clearing spouse data
                        finalFormData[key as keyof IFormDataFiador] = '';
                    }
                });
            }

            await addDoc(collection(db, "propostasFiador"), {
                ...finalFormData,
                filePaths: filePaths,
                dataEnvio: new Date().toISOString()
            });

            const filesForEmail = {
                documentosPessoais: docsPessoaisFiles,
                comprovanteRenda: comprovanteRendaFiles,
                documentosConjuge: docsConjugeFiles
            };

            await fetch('/api/send-notification-fiador', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formData: finalFormData,
                    files: filesForEmail
                })
            });

            setIsSuccess(true);
        } catch (err) {
            console.error("Erro detalhado:", err);
            toast.error('Ocorreu um erro ao enviar sua proposta. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        step,
        formData,
        files,
        isLoading,
        isSuccess,
        isCepLoading,
        validationErrors,
        handleInputChange,
        handleCepChange,
        handleFileChange,
        handleRemoveFile,
        nextStep,
        prevStep,
        handleSubmit,
        setFormData
    };
};