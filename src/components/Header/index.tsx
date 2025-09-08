"use client"; // Necessário para usar estado e interatividade (useState, onClick)

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'; // Importa o hook de estado do React
import styles from './styles.module.css';

const Header = () => {
  // Estado para controlar a visibilidade do menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para fechar o menu ao clicar em um link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" onClick={handleLinkClick}>
            <Image 
              src="/logo-imobiliza.png"
              alt="Logo Imobiliza Imóveis" 
              width={180} // Levemente ajustado para melhor proporção
              height={45}
              priority
            />
        </Link>
        
        {/* Adicionando classe condicional para abrir/fechar o menu */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link href="#sobre" className={styles.navLink} onClick={handleLinkClick}>
            Sobre Nós
          </Link>
          <Link href="#compromisso" className={styles.navLink} onClick={handleLinkClick}>
            Nosso Compromisso
          </Link>
          <Link href="/cadastro" className={styles.ctaButton} onClick={handleLinkClick}>
            Cadastre seu Imóvel
          </Link>
        </nav>

        {/* Botão do Menu Hambúrguer (só aparece em telas pequenas) */}
        <button 
          className={styles.mobileMenuButton} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? (
            <i className='bx bx-x'></i> // Ícone de "X" para fechar
          ) : (
            <i className='bx bx-menu'></i> // Ícone de "hambúrguer" para abrir
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;