import Link from 'next/link';
import styles from './styles.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={`container ${styles.heroContent}`}>
        {/* TEXTO VOLTOU AO ORIGINAL */}
        <h1 className={styles.title}>
          A gestão de aluguel que valoriza seu patrimônio e seu tempo.
        </h1>
        {/* SUBTÍTULO VOLTOU AO ORIGINAL */}
        <p className={styles.subtitle}>
          Deixe a burocracia conosco. Somos especialistas em locação e cuidamos do seu imóvel como se fosse nosso.
        </p>
        {/* BOTÃO VOLTOU AO ORIGINAL */}
        <Link href="/cadastro" className={styles.ctaButton}>
          Quero tranquilidade na minha locação
        </Link>
      </div>
    </section>
  );
};

export default Hero;