import React from 'react';
import styles from '@/app/cadastro/cadastro.module.css';
import { useFiadorForm } from '../hooks/useFiadorForm';
import FileList from '@/app/cadastro/components/FileList';

interface StepProps {
  form: ReturnType<typeof useFiadorForm>;
}

const Step3_DocumentosFiador: React.FC<StepProps> = ({ form }) => {
  const { formData, files, handleFileChange, handleRemoveFile, handleInputChange, prevStep, isLoading } = form;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className={`${styles.formStep} ${styles.animateFadeIn}`}>
      <h2 className={styles.stepTitle}>Anexar Documentos (Opcional)</h2>
      
      <div className={styles.inputGroup}>
        <label>Documentos pessoais do fiador</label>
        <small className={styles.fieldDescription}>Cópias legíveis: RG e CPF (ou CNH); Comprovante de residência atualizado; Comprovante de estado civil.</small>
        <label htmlFor="documentosPessoais" className={styles.fileUploadLabel}><i className='bx bxs-cloud-upload'></i><span>Selecionar Arquivos</span></label>
        <input type="file" name="documentosPessoais" id="documentosPessoais" className={styles.fileUploadInput} onChange={handleFileChange} multiple />
        <FileList files={files.documentosPessoais} onRemove={(index) => handleRemoveFile('documentosPessoais', index)} />
      </div>

      <div className={styles.inputGroup}>
        <label>Comprovação de renda</label>
        <small className={styles.fieldDescription}>Holerites, contracheques, DECORE, extratos bancários, etc.</small>
        <label htmlFor="comprovanteRenda" className={styles.fileUploadLabel}><i className='bx bxs-cloud-upload'></i><span>Selecionar Arquivos</span></label>
        <input type="file" name="comprovanteRenda" id="comprovanteRenda" className={styles.fileUploadInput} onChange={handleFileChange} multiple />
        <FileList files={files.comprovanteRenda} onRemove={(index) => handleRemoveFile('comprovanteRenda', index)} />
      </div>

      {formData.estadoCivil === 'Casado(a)' && (
        <div className={styles.inputGroup}>
          <label>Documentos do cônjuge/companheiro(a)</label>
          <small className={styles.fieldDescription}>RG e CPF (ou CNH).</small>
          <label htmlFor="documentosConjuge" className={styles.fileUploadLabel}><i className='bx bxs-cloud-upload'></i><span>Selecionar Arquivos</span></label>
          <input type="file" name="documentosConjuge" id="documentosConjuge" className={styles.fileUploadInput} onChange={handleFileChange} multiple />
          <FileList files={files.documentosConjuge} onRemove={(index) => handleRemoveFile('documentosConjuge', index)} />
        </div>
      )}

      <h2 className={styles.stepTitle} style={{ marginTop: '3rem' }}>Termos e Declarações</h2>
      <div className={styles.termsBox}>
        <p><strong>OBSERVAÇÕES IMPORTANTES (FIADOR):</strong></p>
        <p>1 - O não envio dos documentos exigidos, bem como a ausência de preenchimento dos campos obrigatórios, implicará a imediata desconsideração da proposta, sendo o cadastro automaticamente considerado REPROVADO, sem que assista ao pretendente qualquer direito de prioridade ou reserva sobre o imóvel.</p>
        <p>2 - No que se refere à certidão de casamento e à outorga conjugal (uxória ou marital), cumpre esclarecer que o artigo 1.647, inciso I, do Código Civil, exige expressamente a outorga do cônjuge apenas nos casos de prestação de fiança em contratos de locação. No entanto, a apresentação da certidão de casamento pelo LOCATÁRIO é recomendável como medida de segurança jurídica, uma vez que permite comprovar seu estado civil, viabiliza a inclusão do cônjuge como co-locatário, quando necessário, e previne alegações futuras de desconhecimento ou ausência de ciência quanto às obrigações assumidas</p>
      </div>
      <div className={styles.checkboxGroup}>
        <label><input type="checkbox" name="aceiteObservacoes" checked={formData.aceiteObservacoes} onChange={handleInputChange} required /><span>Sim, li e estou ciente das observações importantes. *</span></label>
        <label><input type="checkbox" name="aceiteVeracidade" checked={formData.aceiteVeracidade} onChange={handleInputChange} required /><span>Declaro que todas as informações prestadas são verdadeiras... *</span></label>
      </div>
      <div className={styles.inputGroup}>
        <label>Data</label>
        <p className={styles.dateDisplay}>
          {formatDate(formData.dataPreenchimento)}
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Enviando...' : 'Finalizar Cadastro'}</button>
      </div>
    </div>
  );
};

export default Step3_DocumentosFiador;
