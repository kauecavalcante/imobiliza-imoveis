import React from 'react';
import styles from '../cadastro.module.css';
import { useCadastroForm } from '../hooks/useCadastroForm';

interface StepProps {
  form: ReturnType<typeof useCadastroForm>;
}

const Step2_AdditionalDetails: React.FC<StepProps> = ({ form }) => {
  const { formData, validationErrors, handleInputChange, nextStep, prevStep } = form;

  return (
    <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
      <h2 className={styles.stepTitle}>Detalhes Adicionais</h2>
      <div className={`${styles.inputGroup} ${validationErrors.includes('rendaMensal') ? styles.error : ''}`}>
        <label htmlFor="rendaMensal">Renda mensal (média) *</label>
        <input type="text" name="rendaMensal" id="rendaMensal" value={formData.rendaMensal} onChange={handleInputChange} placeholder="R$ 0,00" required />
      </div>
      <div className={styles.inputGrid}>
        <div className={`${styles.inputGroup} ${validationErrors.includes('referenciaPessoal01') ? styles.error : ''}`}>
          <label htmlFor="referenciaPessoal01">Referência pessoal 01: Nome + número de telefone *</label>
          <input type="text" name="referenciaPessoal01" id="referenciaPessoal01" value={formData.referenciaPessoal01} onChange={handleInputChange} required />
        </div>
        <div className={`${styles.inputGroup} ${validationErrors.includes('referenciaPessoal02') ? styles.error : ''}`}>
          <label htmlFor="referenciaPessoal02">Referência pessoal 02: Nome + número de telefone *</label>
          <input type="text" name="referenciaPessoal02" id="referenciaPessoal02" value={formData.referenciaPessoal02} onChange={handleInputChange} required />
        </div>
      </div>
      <div className={`${styles.inputGroup} ${validationErrors.includes('animaisEstimacao') ? styles.error : ''}`}>
        <label htmlFor="animaisEstimacao">Tem ou pretende ter animais de estimação morando no mesmo imóvel? Se sim, quantos e quais? *</label>
        <input type="text" name="animaisEstimacao" id="animaisEstimacao" value={formData.animaisEstimacao} onChange={handleInputChange} required />
      </div>
      <div className={`${styles.inputGroup} ${validationErrors.includes('cartorioFirma') ? styles.error : ''}`}>
        <label htmlFor="cartorioFirma">Em qual cartório tem firma aberta? *</label>
        <input type="text" name="cartorioFirma" id="cartorioFirma" value={formData.cartorioFirma} onChange={handleInputChange} required />
      </div>
      <div className={styles.buttonGroup}>
        <button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button>
        <button type="button" onClick={nextStep} className={styles.nextButton}>Avançar</button>
      </div>
    </div>
  );
};

export default Step2_AdditionalDetails;