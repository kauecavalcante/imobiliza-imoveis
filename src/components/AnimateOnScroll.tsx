"use client";

import { useRef, useEffect, useState, FC, ReactNode } from 'react';

// Tipos para as props do componente
interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string; // Classes CSS adicionais que você queira passar
  animationClass: string; // Classe da animação a ser aplicada (ex: 'fade-in-up')
  threshold?: number; // Quão visível o elemento deve estar para animar (0 a 1)
}

const AnimateOnScroll: FC<AnimateOnScrollProps> = ({ 
  children, 
  className = '', 
  animationClass,
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se o elemento estiver intersectando a viewport, atualiza o estado
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Para de observar o elemento após a animação para otimizar
          observer.unobserve(entry.target);
        }
      },
      {
        threshold, // A animação dispara quando 10% do elemento está visível
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Limpa o observer quando o componente é desmontado
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      // Aplica as classes: a original, a de animação, e 'visible' quando o elemento aparece
      className={`${className} ${animationClass} ${isVisible ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
