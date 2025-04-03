'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  statsCount?: number; // Número de parejas que han encontrado nombres
  onCtaClick?: () => void; // Función para manejar el clic en el CTA
}

export default function HeroSection({ statsCount = 1500, onCtaClick }: HeroSectionProps) {
  const { user } = useAuth();
  const [animationFrame, setAnimationFrame] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Nombres de ejemplo para la animación
  const exampleNames = ['Sofía', 'Mateo', 'Emma', 'Lucas', 'Olivia', 'Benjamín'];
  
  // Asegurarnos de que el componente está montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Efecto para la animación de cartas
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % exampleNames.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [exampleNames.length]);

  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-white to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Encuentra el nombre perfecto para tu bebé. Juntos.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Baby Swiper conecta a parejas para descubrir y coincidir en nombres que ambos adoran. 
              ¡Más de {statsCount.toLocaleString()} parejas ya encontraron el nombre ideal!
            </p>
            
            {mounted && (
              <>
                {!user ? (
                  <Link
                    href="/auth"
                    onClick={onCtaClick}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition-transform hover:scale-105"
                  >
                    Comenzar Ahora
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition-transform hover:scale-105"
                  >
                    Seguir Explorando
                  </Link>
                )}
              </>
            )}
          </div>
          
          <div className="relative h-96 max-w-md mx-auto">
            {/* Animación de tarjetas */}
            <div className="relative w-72 h-96 mx-auto">
              {exampleNames.map((name, index) => {
                const isActive = index === animationFrame;
                const offset = (index - animationFrame + exampleNames.length) % exampleNames.length;
                const zIndex = exampleNames.length - offset;
                
                return (
                  <div
                    key={name}
                    className={`absolute w-full h-full rounded-2xl shadow-xl bg-white p-6 flex flex-col justify-center items-center transition-all duration-500 transform ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                    }`}
                    style={{
                      zIndex,
                      transform: `translateY(${offset * 4}px) scale(${1 - offset * 0.05}) rotate(${offset * -2}deg)`,
                    }}
                  >
                    <div className="text-5xl mb-4">{name}</div>
                    <div className="text-sm text-gray-500">Desliza para elegir</div>
                    <div className="flex mt-8 gap-8">
                      <div className="p-3 rounded-full bg-red-100 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="p-3 rounded-full bg-green-100 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 