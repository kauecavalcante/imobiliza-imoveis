import styles from '../cadastro.module.css';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FileList = ({ files, onRemove }: FileListProps) => {
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

export default FileList;