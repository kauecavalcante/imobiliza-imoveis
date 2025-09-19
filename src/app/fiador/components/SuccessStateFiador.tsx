import styles from '../../cadastro/cadastro.module.css';
import Link from 'next/link';

const SuccessStateFiador = () => (
    <main className={`${styles.pageContainer} ${styles.successContainer}`}>
      <div className="container">
        <i className={`bx bxs-check-circle ${styles.successIcon}`}></i>
        <h1 className={styles.pageTitle}>Cadastro Enviado!</h1>
        <p className={styles.pageSubtitle}>
          Recebemos suas informações de fiador com sucesso. Obrigado!
        </p>
        <Link href="/" className={styles.backButton}>Voltar para a Página Inicial</Link>
      </div>
    </main>
);

export default SuccessStateFiador;
