import styles from './styles.module.css';

const Commitment = () => {
  const commitments = [
    "Segurança jurídica, com contratos claros e completos.",
    "Rigor nas análises de perfil, assegurando inquilinos confiáveis.",
    "Acompanhamento financeiro detalhado, incluindo aluguel, taxas e obrigações.",
    "Suporte contínuo, desde a vistoria até a manutenção.",
    "Transparência total, sem custos ocultos ou cláusulas que reduzam a rentabilidade do proprietário.",
  ];

  return (
    <section id="compromisso" className={styles.commitment}>
      <div className="container">
        <h2 className={styles.title}>Nosso Compromisso</h2>
        <p className={styles.subtitle}>
            Cuidamos de cada imóvel como se fosse nosso. Trabalhamos com processos bem estruturados para garantir:
        </p>
        <ul className={styles.commitmentList}>
          {commitments.map((item, index) => (
            <li key={index} className={styles.commitmentItem}>
              <span className={styles.checkIcon}>✔</span>
              {item}
            </li>
          ))}
        </ul>
        <p className={styles.conclusion}>
            Com a Imobiliza, o locador tem a tranquilidade de saber que seu imóvel está em boas mãos e, acima de tudo, ganha mais tempo para dedicar ao que realmente importa: família, trabalho, lazer e qualidade de vida.
        </p>
      </div>
    </section>
  );
};

export default Commitment;