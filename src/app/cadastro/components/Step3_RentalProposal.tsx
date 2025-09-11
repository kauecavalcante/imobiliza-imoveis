import React from 'react';
import styles from '../cadastro.module.css';
import { useCadastroForm } from '../hooks/useCadastroForm';

interface StepProps {
  form: ReturnType<typeof useCadastroForm>;
}

const Step3_RentalProposal: React.FC<StepProps> = ({ form }) => {
  const { formData, validationErrors, handleInputChange, nextStep, prevStep } = form;

  return (
    <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
      <h2 className={styles.stepTitle}>Sobre a Locação</h2>
      <div className={`${styles.inputGroup} ${validationErrors.includes('imovelDesejado') ? styles.error : ''}`}>
        <label htmlFor="imovelDesejado">Qual imóvel deseja alugar? *</label>
        <input type="text" name="imovelDesejado" id="imovelDesejado" value={formData.imovelDesejado} onChange={handleInputChange} placeholder="Ex: Apto 302 no Ed. Sol Nascente" required />
      </div>
      <div className={`${styles.inputGroup} ${validationErrors.includes('condicaoProposta') ? styles.error : ''}`}>
        <label htmlFor="condicaoProposta">Nos informe se há alguma CONDIÇÃO para a locação E/OU se existe alguma PROPOSTA pendente? *</label>
        <textarea name="condicaoProposta" id="condicaoProposta" rows={4} value={formData.condicaoProposta} onChange={handleInputChange} required></textarea>
      </div>
      <div className={styles.inputGroup}>
        <label>Qual a preferência de vencimento do boleto do aluguel? *</label>
        <div className={styles.radioGroup}>
          <label><input type="radio" name="vencimentoAluguel" value="5" checked={formData.vencimentoAluguel === '5'} onChange={handleInputChange} />Dia 5</label>
          <label><input type="radio" name="vencimentoAluguel" value="10" checked={formData.vencimentoAluguel === '10'} onChange={handleInputChange} />Dia 10</label>
          <label><input type="radio" name="vencimentoAluguel" value="15" checked={formData.vencimentoAluguel === '15'} onChange={handleInputChange} />Dia 15</label>
          <label><input type="radio" name="vencimentoAluguel" value="20" checked={formData.vencimentoAluguel === '20'} onChange={handleInputChange} />Dia 20</label>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label>Qual a GARANTIA contratual? *</label>
        <div className={styles.radioGroupVertical}>
          <label><input type="radio" name="garantiaContratual" value="FIADOR" checked={formData.garantiaContratual === 'FIADOR'} onChange={handleInputChange} /><strong>FIADOR</strong> - Preenchimento de cadastro específico + Documentos pessoais (iguais aos do Locatário).</label>
          <label><input type="radio" name="garantiaContratual" value="CAUÇÃO" checked={formData.garantiaContratual === 'CAUÇÃO'} onChange={handleInputChange} /><strong>CAUÇÃO</strong> - Depósito no total de 03 (três) vezes o valor do aluguel.</label>
          <label><input type="radio" name="garantiaContratual" value="SEGURO" checked={formData.garantiaContratual === 'SEGURO'} onChange={handleInputChange} /><strong>SEGURO FIANÇA</strong> - Contratação junto a seguradora (Recomendamos a LOFT).</label>
        </div>
      </div>
      {formData.garantiaContratual === 'FIADOR' && (
        <div className={`${styles.inputGroup} ${styles.conditionalField} ${validationErrors.includes('emailFiador') ? styles.error : ''}`}>
          <label htmlFor="emailFiador">E-mail do Fiador *</label>
          <input type="email" name="emailFiador" id="emailFiador" value={formData.emailFiador} onChange={handleInputChange} required />
        </div>
      )}
      <div className={styles.buttonGroup}>
        <button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button>
        <button type="button" onClick={nextStep} className={styles.nextButton}>Avançar</button>
      </div>
    </div>
  );
};

export default Step3_RentalProposal;