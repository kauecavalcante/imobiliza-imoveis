import Link from 'next/link';
import styles from './styles.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroContainer}`}>
        <h1 className={styles.title}>
          A gestão de aluguel que valoriza seu patrimônio e seu tempo.
        </h1>
        <p className={styles.subtitle}>
          Deixe a burocracia conosco. Somos especialistas em locação e cuidamos do seu imóvel como se fosse nosso.
        </p>
        <Link href="/cadastro" className={styles.heroButton}>
          Quero tranquilidade na minha locação
        </Link>
      </div>
    </section>
  );
};

export default Hero;
