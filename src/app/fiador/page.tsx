"use client";

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../cadastro/cadastro.module.css'; // Reutilizando os mesmos estilos
import { useFiadorForm } from './hooks/useFiadorForm';

import ProgressBar from './components/ProgressBarFiador';
import Step1 from './components/Step1_DadosFiador';
import Step2 from './components/Step2_DetalhesAdicionaisFiador';
import Step3 from './components/Step3_DocumentosFiador';
import SuccessState from './components/SuccessStateFiador';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

// Um componente wrapper para usar o useSearchParams, pois ele precisa do Suspense
const FiadorFormContent = () => {
    const searchParams = useSearchParams();
    // Pega o nome do locatário da URL, com um valor padrão caso não encontre
    const locatarioNome = searchParams.get('locatario') || 'Não identificado';
    const form = useFiadorForm(locatarioNome);

    if (form.isSuccess) {
        return <SuccessState />;
    }

    return (
        <main className={styles.pageContainer}>
            <div className="container">
                <div id="form-container" className={styles.formWrapper}>
                    <h1 className={styles.pageTitle}>Ficha Cadastral para Fiador</h1>
                    <p className={styles.pageSubtitle}>
                        Preencha os campos abaixo para concluir seu cadastro como fiador.
                    </p>
                    
                    <ProgressBar currentStep={form.step} />

                    <form onSubmit={form.handleSubmit} noValidate>
                        {/* Passa o nome do locatário para a Etapa 1 */}
                        {form.step === 1 && <Step1 form={form} locatarioNome={locatarioNome} />}
                        {form.step === 2 && <Step2 form={form} />}
                        {form.step === 3 && <Step3 form={form} />}
                    </form>
                </div>
            </div>
        </main>
    );
};


export default function FiadorPage() {
    return (
        <>
            <Header />
            {/* O Suspense é necessário para o Next.js renderizar a página enquanto os parâmetros de busca são lidos */}
            <Suspense fallback={<div className={styles.pageContainer}><div className="container"><p>Carregando formulário...</p></div></div>}>
                <FiadorFormContent />
            </Suspense>
            <Footer />
        </>
    );
}

