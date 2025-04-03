'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  statsCount?: number; // Número de parejas que han encontrado nombres
  onCtaClick?: () => void; // Función para manejar el clic en el CTA
}

interface ExampleName {
  name: string;
  origin: string;
  meaning: string;
  gender: 'male' | 'female';
}

export default function HeroSection({ statsCount = 1500, onCtaClick }: HeroSectionProps) {
  const { user } = useAuth();
  const [animationFrame, setAnimationFrame] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Nombres de ejemplo para la animación con datos mejorados
  const exampleNames: ExampleName[] = [
    {
      name: 'Sofía',
      origin: 'Griego',
      meaning: 'Sabiduría',
      gender: 'female'
    },
    {
      name: 'Mateo',
      origin: 'Hebreo',
      meaning: 'Regalo de Dios',
      gender: 'male'
    },
    {
      name: 'Emma',
      origin: 'Germánico',
      meaning: 'Universal, completa',
      gender: 'female'
    },
    {
      name: 'Lucas',
      origin: 'Latín',
      meaning: 'Luminoso, brillante',
      gender: 'male'
    },
    {
      name: 'Olivia',
      origin: 'Latín',
      meaning: 'Olivo, símbolo de paz',
      gender: 'female'
    },
    {
      name: 'Benjamín',
      origin: 'Hebreo',
      meaning: 'Hijo de la mano derecha',
      gender: 'male'
    }
  ];
  
  // Función para manejar la animación hacia la izquierda (rechazo)
  const handleReject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    setTimeout(() => {
      setAnimationFrame((prev) => (prev + 1) % exampleNames.length);
      setDirection(null);
      setIsAnimating(false);
    }, 500);
  };

  // Función para manejar la animación hacia la derecha (aceptación)
  const handleAccept = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    setTimeout(() => {
      setAnimationFrame((prev) => (prev + 1) % exampleNames.length);
      setDirection(null);
      setIsAnimating(false);
    }, 500);
  };
  
  // Asegurarnos de que el componente está montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Efecto para la animación automática de cartas cada 3 segundos
  // Solo funciona cuando no hay una animación en curso
  useEffect(() => {
    if (isAnimating) return;
    
    const interval = setInterval(() => {
      // Alternar dirección en la animación automática (una vez a la izquierda, otra a la derecha)
      const autoDirection = animationFrame % 2 === 0 ? 'right' : 'left';
      setDirection(autoDirection);
      setIsAnimating(true);
      
      setTimeout(() => {
        setAnimationFrame((prev) => (prev + 1) % exampleNames.length);
        setDirection(null);
        setIsAnimating(false);
      }, 500);
    }, 5000); // Aumentado a 5s para que haya tiempo suficiente entre animaciones
    
    return () => clearInterval(interval);
  }, [animationFrame, exampleNames.length, isAnimating]);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-br from-white to-pink-50">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 rounded-full bg-pink-200 blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 rounded-full bg-blue-200 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/3 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full bg-purple-200 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Contenido de texto */}
          <div className="max-w-lg mx-auto md:mx-0 text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Encuentra el nombre perfecto para tu bebé. Juntos.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Baby Swiper conecta a parejas para descubrir y coincidir en nombres que ambos adoran. 
              ¡Más de {statsCount.toLocaleString()} parejas ya encontraron el nombre ideal!
            </p>
            
            {mounted && (
              <>
                {!user ? (
                  <Link
                    href="/auth"
                    onClick={onCtaClick}
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition-transform hover:scale-105"
                  >
                    Comenzar Ahora
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition-transform hover:scale-105"
                  >
                    Seguir Explorando
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Sección de tarjetas de nombres */}
          <div className="relative h-[400px] sm:h-[450px] mb-8 md:mb-0 order-1 md:order-2">
            {/* Capa para indicadores visuales de swipe */}
            <div className="absolute inset-0 pointer-events-none z-10 flex">
              {/* Indicador de rechazo (izquierda) */}
              <div className={`w-1/2 flex items-center justify-center transition-opacity duration-300 ${direction === 'left' ? 'opacity-70' : 'opacity-0'}`}>
                <div className="bg-red-100 rounded-full p-3 shadow-md transform scale-150">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              
              {/* Indicador de aceptación (derecha) */}
              <div className={`w-1/2 flex items-center justify-center transition-opacity duration-300 ${direction === 'right' ? 'opacity-70' : 'opacity-0'}`}>
                <div className="bg-green-100 rounded-full p-3 shadow-md transform scale-150">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Animación de tarjetas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence>
                {exampleNames.map((nameData, index) => {
                  // Solo mostramos la tarjeta activa y algunas detrás
                  if ((index - animationFrame + exampleNames.length) % exampleNames.length > 3) {
                    return null;
                  }
                  
                  const isActive = index === animationFrame;
                  const offset = (index - animationFrame + exampleNames.length) % exampleNames.length;
                  const zIndex = exampleNames.length - offset;
                  
                  // Colores específicos de género
                  const gradientColors = nameData.gender === 'female' 
                    ? 'from-pink-200 to-purple-100' 
                    : 'from-blue-200 to-cyan-100';
                  
                  // Definir variantes de animación para swipe
                  const variants = {
                    center: { 
                      x: 0, 
                      rotate: 0,
                      scale: 1,
                      opacity: 1 
                    },
                    left: { 
                      x: '-150%', 
                      rotate: -30,
                      opacity: 0,
                      transition: { duration: 0.5 }
                    },
                    right: { 
                      x: '150%', 
                      rotate: 30,
                      opacity: 0,
                      transition: { duration: 0.5 }
                    },
                    behind: {
                      scale: 1 - offset * 0.05,
                      y: offset * 4,
                      rotate: offset * -1,
                      opacity: 1 - offset * 0.2,
                      transition: { duration: 0.3 }
                    }
                  };
                  
                  return (
                    <motion.div
                      key={nameData.name}
                      className={`absolute w-[250px] h-[370px] sm:w-[280px] sm:h-[400px] md:w-[260px] md:h-[380px] lg:w-[280px] lg:h-[400px] rounded-xl sm:rounded-2xl shadow-xl overflow-hidden bg-white`}
                      initial={isActive ? 'center' : 'behind'}
                      animate={
                        isActive 
                          ? direction 
                            ? direction 
                            : 'center' 
                          : 'behind'
                      }
                      variants={variants}
                      style={{ 
                        zIndex,
                        boxShadow: isActive ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : ''
                      }}
                    >
                      {/* Encabezado de la tarjeta */}
                      <div className={`w-full h-32 sm:h-36 md:h-32 lg:h-36 bg-gradient-to-br ${gradientColors} p-4 sm:p-5 relative`}>
                        {/* Patrón decorativo */}
                        <div className="absolute inset-0 opacity-20">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute w-16 h-16 sm:w-20 sm:h-20 border-2 border-white rounded-full"
                              style={{ 
                                top: `${Math.random() * 100}%`, 
                                left: `${Math.random() * 100}%`,
                                transform: `scale(${Math.random() * 0.5 + 0.5})` 
                              }}
                            ></div>
                          ))}
                        </div>
                        
                        <div className="relative z-10">
                          <div className="text-xs font-medium uppercase text-gray-600 tracking-wider mb-1">
                            {nameData.origin}
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                            {nameData.name}
                          </div>
                        </div>
                      </div>
                      
                      {/* Cuerpo de la tarjeta */}
                      <div className="p-4 sm:p-5 flex flex-col h-[calc(100%-8rem)] sm:h-[calc(100%-9rem)] md:h-[calc(100%-8rem)] lg:h-[calc(100%-9rem)]">
                        <div className="mb-6">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Significado</div>
                          <div className="text-sm text-gray-700">{nameData.meaning}</div>
                        </div>
                        
                        {isActive && (
                          <div className="text-center mt-auto mb-3">
                            <p className="text-sm text-gray-500 mb-4">¿Te gusta este nombre?</p>
                            
                            <div className="flex justify-center gap-6 sm:gap-8">
                              <button 
                                className="p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors shadow-sm transform hover:scale-110"
                                onClick={handleReject}
                                disabled={isAnimating}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <button 
                                className="p-3 rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition-colors shadow-sm transform hover:scale-110"
                                onClick={handleAccept}
                                disabled={isAnimating}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 