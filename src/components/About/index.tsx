import styles from './styles.module.css';

const About = () => {
  return (
    <section id="sobre" className={styles.about}>
      <div className={`container ${styles.aboutContainer}`}>
        <div className={styles.textColumn}>
          <h2 className={styles.title}>Nossa História</h2>
          <p>
            A Imobiliza Imóveis nasceu com um propósito muito claro: cuidar dos imóveis de nossos clientes com dedicação, profissionalismo e transparência.
          </p>
          <p>
            Nosso fundador é Administrador de Empresas desde 2009 e reúne mais de 20 anos de experiência exclusiva na gestão de aluguéis, tendo atuado por anos nas maiores imobiliárias do mercado alagoano antes de empreender de forma independente.
          </p>
          <p>
            Essa vivência consolidou a expertise que hoje é o diferencial da Imobiliza: <strong>somos especialistas em locação</strong>. Nosso foco não está dividido com outros segmentos, e sim voltado integralmente para oferecer ao proprietário a melhor gestão do seu patrimônio.
          </p>
          <p>
            Somos uma empresa da terra, conduzida por alagoanos que conhecem profundamente o mercado local, suas oportunidades e desafios. Essa proximidade nos permite oferecer soluções sob medida, que unem conhecimento técnico, experiência prática e atendimento próximo.
          </p>
        </div>
        <div className={styles.imageColumn}>
           {/* Você pode adicionar uma imagem institucional aqui */}
           <div className={styles.imagePlaceholder}>
             [Imagem de um corretor de imóveis sorrindo com um casal de clientes]
           </div>
        </div>
      </div>
    </section>
  );
};

export default About;
