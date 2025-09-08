import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import About from '@/components/About';
import Commitment from '@/components/Commitment';


export default function Home() {
  return (
    <main>
     <Header /> 
      <Hero />
      <About />
      <Commitment />
      <CTA />
      <Footer />
    </main>
  );
}
