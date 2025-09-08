import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        {/* Adicione seu logo na pasta /public e atualize o src */}
        <Image 
          src="/logo-imobiliza.jpeg" // Exemplo de caminho
          alt="Logo Imobiliza Imóveis" 
          width={200} 
          height={50}
          priority
        />
        <nav className={styles.nav}>
          <Link href="#sobre" className={styles.navLink}>Sobre Nós</Link>
          <Link href="#compromisso" className={styles.navLink}>Nosso Compromisso</Link>
          <Link href="/cadastro" className={styles.ctaButton}>
            Cadastre seu Imóvel
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;