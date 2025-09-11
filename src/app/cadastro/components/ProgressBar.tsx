import React from 'react';
import styles from '../cadastro.module.css';

interface ProgressBarProps {
    currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
    return (
        <div className={styles.progressBar} style={{ '--step': currentStep } as React.CSSProperties}>
            <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''}`}>
                <span>1</span>
                <p>Pessoal</p>
            </div>
            <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''}`}>
                <span>2</span>
                <p>Detalhes</p>
            </div>
            <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <span>3</span>
                <p>Proposta</p>
            </div>
            <div className={`${styles.progressStep} ${currentStep >= 4 ? styles.active : ''}`}>
                <span>4</span>
                <p>Documentos</p>
            </div>
        </div>
    );
};

export default ProgressBar;