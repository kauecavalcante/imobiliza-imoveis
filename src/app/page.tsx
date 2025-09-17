import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import About from '@/components/About';
import Commitment from '@/components/Commitment';
import styles from './page.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll'; // Importe o componente

export default function Home() {
  return (
    <main className={styles.mainContent}>
     <Header /> 
      <Hero />
      {/* ATUALIZADO: Cada seção é envolvida pelo componente de animação */}
      <AnimateOnScroll animationClass="fade-in-up">
        <About />
      </AnimateOnScroll>
      
      {/* A classe 'stagger-container' aciona a animação em cascata para os cards */}
      <AnimateOnScroll animationClass="stagger-container">
        <Commitment />
      </AnimateOnScroll>
      
      <AnimateOnScroll animationClass="fade-in-up">
        <CTA />
      </AnimateOnScroll> 
      
      <Footer />
    </main>
  );
}