import React from 'react';
import styles from '@/app/cadastro/cadastro.module.css'; // Usando o CSS do cadastro
import { useFiadorForm } from '../hooks/useFiadorForm';

interface StepProps {
  form: ReturnType<typeof useFiadorForm>;
  locatarioNome: string;
}

const Step1_DadosFiador: React.FC<StepProps> = ({ form, locatarioNome }) => {
  const { formData, validationErrors, handleInputChange, handleCepChange, isCepLoading, nextStep } = form;

  return (
    <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
      {/* Exibe para qual locatário este cadastro de fiador se destina */}
      {locatarioNome && locatarioNome !== 'Não identificado' && (
        <div className={styles.termsBox} style={{marginBottom: '2rem'}}>
          <p>Você está preenchendo o cadastro como fiador para: <strong>{locatarioNome}</strong></p>
        </div>
      )}

      <h2 className={styles.stepTitle}>Dados do Fiador</h2>
      
      <div className={`${styles.inputGroup} ${validationErrors.includes('nomeCompleto') ? styles.error : ''}`}>
        <label htmlFor="nomeCompleto">Nome Completo *</label>
        <input type="text" name="nomeCompleto" id="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} required />
      </div>
      <div className={`${styles.inputGroup} ${validationErrors.includes('email') ? styles.error : ''}`}>
        <label htmlFor="email">Email *</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div className={styles.inputGrid}>
        <div className={`${styles.inputGroup} ${validationErrors.includes('nacionalidade') ? styles.error : ''}`}>
          <label htmlFor="nacionalidade">Nacionalidade *</label>
          <select name="nacionalidade" id="nacionalidade" value={formData.nacionalidade} onChange={handleInputChange}>
            <option value="Brasileira">Brasileira</option>
            <option value="Outra">Outra</option>
          </select>
          {formData.nacionalidade === 'Outra' && (
            <input type="text" name="nacionalidadeOutra" placeholder="Digite a nacionalidade" value={formData.nacionalidadeOutra} onChange={handleInputChange} required className={`${styles.subInput} ${validationErrors.includes('nacionalidadeOutra') ? styles.errorInput : ''}`} />
          )}
        </div>
        <div className={`${styles.inputGroup} ${validationErrors.includes('profissao') ? styles.error : ''}`}>
          <label htmlFor="profissao">Profissão *</label>
          <input type="text" name="profissao" id="profissao" value={formData.profissao} onChange={handleInputChange} required />
        </div>
      </div>
      <div className={`${styles.inputGroup} ${validationErrors.includes('estadoCivil') ? styles.error : ''}`}>
        <label>Estado Civil *</label>
        <div className={styles.radioGroup}>
          <label><input type="radio" name="estadoCivil" value="Solteiro(a)" checked={formData.estadoCivil === 'Solteiro(a)'} onChange={handleInputChange} />Solteiro(a)</label>
          <label><input type="radio" name="estadoCivil" value="Casado(a)" checked={formData.estadoCivil === 'Casado(a)'} onChange={handleInputChange} />Casado(a)</label>
          <label><input type="radio" name="estadoCivil" value="Divorciado(a)" checked={formData.estadoCivil === 'Divorciado(a)'} onChange={handleInputChange} />Divorciado(a)</label>
          <label><input type="radio" name="estadoCivil" value="Viúvo(a)" checked={formData.estadoCivil === 'Viúvo(a)'} onChange={handleInputChange} />Viúvo(a)</label>
          <label><input type="radio" name="estadoCivil" value="Separado(a) judicialmente" checked={formData.estadoCivil === 'Separado(a) judicialmente'} onChange={handleInputChange} />Separado(a)</label>
        </div>
      </div>
      <div className={styles.inputGrid}>
        <div className={`${styles.inputGroup} ${validationErrors.includes('rg') ? styles.error : ''}`}>
          <label htmlFor="rg">Carteira de Identidade (RG) + Órgão emissor / Estado *</label>
          <input type="text" name="rg" id="rg" value={formData.rg} onChange={handleInputChange} required />
        </div>
        <div className={`${styles.inputGroup} ${validationErrors.includes('cpf') ? styles.error : ''}`}>
          <label htmlFor="cpf">CPF *</label>
          <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleInputChange} required maxLength={14} />
        </div>
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
       <div className={`${styles.inputGroup} ${validationErrors.includes('telefone') ? styles.error : ''}`} style={{marginTop: '1.5rem'}}><label htmlFor="telefone">Telefone para Contato (com DDD) *</label><input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleInputChange} required maxLength={15} /></div>
      

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
            <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeCpf') ? styles.error : ''}`}><label htmlFor="conjugeCpf">Cônjuge: CPF *</label><input type="text" name="conjugeCpf" id="conjugeCpf" value={formData.conjugeCpf} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} maxLength={14} /></div>
          </div>
          <div className={`${styles.inputGroup} ${validationErrors.includes('conjugeTelefone') ? styles.error : ''}`}><label htmlFor="conjugeTelefone">Cônjuge: Telefone para Contato (com DDD) *</label><input type="tel" name="conjugeTelefone" id="conjugeTelefone" value={formData.conjugeTelefone} onChange={handleInputChange} required={formData.estadoCivil === 'Casado(a)'} maxLength={15} /></div>
        </div>
      )}

      <div className={styles.buttonGroup}><button type="button" onClick={nextStep} className={styles.nextButton}>Avançar</button></div>
    </div>
  );
};

export default Step1_DadosFiador;
