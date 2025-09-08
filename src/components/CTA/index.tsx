import Link from 'next/link';
import styles from './styles.module.css';

const CTA = () => {
  return (
    <section className={styles.cta}>
      <div className="container">
        <h2 className={styles.title}>Tem um imóvel para alugar?</h2>
        <p className={styles.subtitle}>
          Deixe que especialistas cuidem do seu patrimônio com a segurança e a rentabilidade que você merece.
        </p>
        <Link href="/cadastro" className={styles.ctaButton}>
          Quero cadastrar meu imóvel
        </Link>
      </div>
    </section>
  );
};

export default CTA;

