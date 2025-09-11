import React from 'react';
import styles from '../cadastro.module.css';
import { useCadastroForm } from '../hooks/useCadastroForm';
import FileList from './FileList';

interface StepProps {
  form: ReturnType<typeof useCadastroForm>;
}

const Step4_Documents: React.FC<StepProps> = ({ form }) => {
  const { formData, files, handleFileChange, handleRemoveFile, handleInputChange, prevStep, isLoading } = form;

  return (
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
          <input type="file" name="documentosConjuge" id="documentosConjuge" className={styles.fileUploadInput} onChange={handleFileChange} multiple required={formData.estadoCivil === 'Casado(a)'} />
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
      <div className={styles.inputGroup}>
        <label htmlFor="dataPreenchimento">Data</label>
        <input type="date" name="dataPreenchimento" id="dataPreenchimento" value={formData.dataPreenchimento} onChange={handleInputChange} readOnly />
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Enviando...' : 'Finalizar Proposta'}</button>
      </div>
    </div>
  );
};

export default Step4_Documents;