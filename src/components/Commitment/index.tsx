import styles from './styles.module.css';

const Commitment = () => {
  const commitments = [
    {
      icon: 'bxs-check-shield',
      title: 'Segurança Jurídica',
      description: 'Contratos claros e completos, garantindo total segurança para locadores e locatários.',
    },
    {
      icon: 'bxs-user-check',
      title: 'Análise Criteriosa',
      description: 'Rigor na análise de perfis para selecionar inquilinos confiáveis e garantir sua tranquilidade.',
    },
    {
      icon: 'bxs-bar-chart-alt-2',
      title: 'Gestão Financeira',
      description: 'Acompanhamento detalhado de aluguéis, taxas e obrigações, com relatórios transparentes.',
    },
    {
      icon: 'bxs-wrench',
      title: 'Suporte Completo',
      description: 'Assistência contínua, da vistoria inicial à manutenção e resolução de problemas.',
    },
    {
      icon: 'bxs-show',
      title: 'Transparência Total',
      description: 'Sem custos ocultos ou surpresas. Nossos processos são claros para maximizar sua rentabilidade.',
    },
  ];

  return (
    <section id="compromisso" className={styles.commitment}>
      <div className="container">
        <h2 className={styles.title}>Nosso Compromisso</h2>
        <p className={styles.subtitle}>
          Cuidamos de cada imóvel como se fosse nosso. Trabalhamos com processos bem estruturados para garantir:
        </p>
        
        <div className={styles.commitmentGrid}>
          {commitments.map((item, index) => (
            // ATUALIZADO: Adicionada classe 'stagger-child' e o estilo de atraso
            <div 
              key={index} 
              className={`${styles.commitmentCard} stagger-child`}
              style={{ '--delay': `${index * 150}ms` } as React.CSSProperties}
            >
              <div className={styles.iconWrapper}>
                <i className={`bx ${item.icon} ${styles.icon}`}></i>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>

        <p className={styles.conclusionText}>
            Com a Imobiliza, o locador tem a <strong>tranquilidade</strong> de saber que seu imóvel está em boas mãos e, acima de tudo, ganha mais tempo para dedicar ao que realmente importa: <strong>família, trabalho, lazer e qualidade de vida.</strong>
        </p>
      </div>
    </section>
  );
};

export default Commitment;
