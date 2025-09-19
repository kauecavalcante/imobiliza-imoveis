import React from 'react';
// Importa o CSS do formulário de cadastro para reutilizar os estilos dos "steps"
import cadastroStyles from '@/app/cadastro/cadastro.module.css';
// Importa o novo CSS específico do fiador para o alinhamento
import fiadorStyles from '../components/fiador.module.css';

interface ProgressBarProps {
    currentStep: number;
}

const ProgressBarFiador: React.FC<ProgressBarProps> = ({ currentStep }) => {
    return (
        // Usa a nova classe para a barra de progresso do fiador
        <div className={fiadorStyles.progressBarFiador} style={{ '--step': currentStep } as React.CSSProperties}>
            {/* As classes dos steps internos continuam as mesmas do CSS original */}
            <div className={`${cadastroStyles.progressStep} ${currentStep >= 1 ? cadastroStyles.active : ''}`}>
                <span>1</span>
                <p>Pessoal</p>
            </div>
            <div className={`${cadastroStyles.progressStep} ${currentStep >= 2 ? cadastroStyles.active : ''}`}>
                <span>2</span>
                <p>Detalhes</p>
            </div>
            <div className={`${cadastroStyles.progressStep} ${currentStep >= 3 ? cadastroStyles.active : ''}`}>
                <span>3</span>
                <p>Documentos</p>
            </div>
        </div>
    );
};

export default ProgressBarFiador;