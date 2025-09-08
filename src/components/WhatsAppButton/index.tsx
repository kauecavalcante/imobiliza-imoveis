import React from 'react';
import styles from './styles.module.css';

const WhatsAppButton = () => {
  // IMPORTANTE: Substitua este número pelo WhatsApp da imobiliária
  const phoneNumber = '5582999999999'; // Ex: 55 (DDI) + 82 (DDD) + 999999999 (Número)
  const message = 'Olá, vim do site! Gostaria de mais informações.';

  // Codifica a mensagem para ser usada na URL
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      className={styles.whatsappButton}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale Conosco pelo WhatsApp"
    >
      {/* Ícone do Boxicons */}
      <i className={`bx bxl-whatsapp ${styles.whatsappIcon}`}></i>
    </a>
  );
};

export default WhatsAppButton;