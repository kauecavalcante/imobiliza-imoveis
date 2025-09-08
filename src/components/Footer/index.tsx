import styles from './styles.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>&copy; {currentYear} Imobiliza Imóveis. Todos os direitos reservados.</p>
       
      </div>
    </footer>
  );
};

export default Footer;

