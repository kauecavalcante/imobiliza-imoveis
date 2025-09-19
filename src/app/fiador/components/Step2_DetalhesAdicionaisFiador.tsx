import React from 'react';
import styles from '@/app/cadastro/cadastro.module.css';
import { useFiadorForm } from '../hooks/useFiadorForm';

interface StepProps {
  form: ReturnType<typeof useFiadorForm>;
}

const Step2_DetalhesAdicionaisFiador: React.FC<StepProps> = ({ form }) => {
  const { formData, validationErrors, handleInputChange, nextStep, prevStep } = form;

  return (
    <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
      <h2 className={styles.stepTitle}>Detalhes Adicionais do Fiador</h2>
      <div className={`${styles.inputGroup} ${validationErrors.includes('rendaMensal') ? styles.error : ''}`}>
        <label htmlFor="rendaMensal">Renda mensal (média) *</label>
        <input type="text" name="rendaMensal" id="rendaMensal" value={formData.rendaMensal} onChange={handleInputChange} placeholder="R$ 0,00" required />
      </div>

      <div className={styles.inputGroup}>
        <label>Referência Pessoal 01 *</label>
        <div className={styles.inputGrid}>
            <div className={validationErrors.includes('referenciaPessoal01Nome') ? styles.error : ''}>
                <input type="text" name="referenciaPessoal01Nome" placeholder="Nome completo" value={formData.referenciaPessoal01Nome} onChange={handleInputChange} required />
            </div>
            <div className={validationErrors.includes('referenciaPessoal01Telefone') ? styles.error : ''}>
                <input type="tel" name="referenciaPessoal01Telefone" placeholder="Telefone com DDD" value={formData.referenciaPessoal01Telefone} onChange={handleInputChange} required maxLength={15} />
            </div>
        </div>
      </div>
      
      <div className={styles.inputGroup}>
        <label>Referência Pessoal 02 *</label>
        <div className={styles.inputGrid}>
            <div className={validationErrors.includes('referenciaPessoal02Nome') ? styles.error : ''}>
                <input type="text" name="referenciaPessoal02Nome" placeholder="Nome completo" value={formData.referenciaPessoal02Nome} onChange={handleInputChange} required />
            </div>
            <div className={validationErrors.includes('referenciaPessoal02Telefone') ? styles.error : ''}>
                <input type="tel" name="referenciaPessoal02Telefone" placeholder="Telefone com DDD" value={formData.referenciaPessoal02Telefone} onChange={handleInputChange} required maxLength={15} />
            </div>
        </div>
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

export default Step2_DetalhesAdicionaisFiador;
