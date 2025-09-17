// src/app/cadastro/page.tsx
"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './cadastro.module.css';
import { useCadastroForm } from './hooks/useCadastroForm';

import ProgressBar from './components/ProgressBar';
import Step1 from './components/Step1_PersonalData';
import Step2 from './components/Step2_AdditionalDetails';
import Step3 from './components/Step3_RentalProposal';
import Step4 from './components/Step4_Documents';
import SuccessState from './components/SuccessState';


export default function CadastroPage() {
    const form = useCadastroForm();

    if (form.isSuccess) {
        return <SuccessState />;
    }

    return (
        <>
            <Header />
            <main className={styles.pageContainer}>
                <div className="container">
                    {/* Adicionado um ID para ser o alvo da rolagem */}
                    <div id="form-container" className={styles.formWrapper}>
                        <h1 className={styles.pageTitle}>Ficha Cadastral para Locação</h1>
                        <p className={styles.pageSubtitle}>
                            Preencha os campos abaixo para iniciar sua proposta de locação.
                        </p>
                        
                        <ProgressBar currentStep={form.step} />

                        <form onSubmit={form.handleSubmit} noValidate>
                            {form.step === 1 && <Step1 form={form} />}
                            {form.step === 2 && <Step2 form={form} />}
                            {form.step === 3 && <Step3 form={form} />}
                            {form.step === 4 && <Step4 form={form} />}
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
