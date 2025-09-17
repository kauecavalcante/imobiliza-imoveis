// src/app/cadastro/components/SuccessState.tsx
import styles from '../cadastro.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const SuccessState = () => (
  <>
    <Header />
    <main className={`${styles.pageContainer} ${styles.successContainer}`}>
      <div className="container">
        <i className={`bx bxs-check-circle ${styles.successIcon}`}></i>
        <h1 className={styles.pageTitle}>Proposta Enviada!</h1>
        <p className={styles.pageSubtitle}>
          Recebemos suas informações com sucesso. Nossa equipe analisará e entrará em contato em breve.
        </p>
        <Link href="/" className={styles.backButton}>Voltar para a Página Inicial</Link>
      </div>
    </main>
    <Footer />
  </>
);

export default SuccessState;