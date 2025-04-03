'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CtaSection() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Asegurarnos de que el componente está montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <section className="py-20 bg-gradient-to-br from-pink-500 to-blue-500 text-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64 absolute -top-20 -left-20 text-white">
          <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.5a3 3 0 0 0 3 3h4.5a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-4.5Zm0 9.75a3 3 0 0 0-3 3v4.5a3 3 0 0 0 3 3h4.5a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-4.5Zm9.75-9.75a3 3 0 0 0-3 3v4.5a3 3 0 0 0 3 3h4.5a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-4.5Z" clipRule="evenodd" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-96 h-96 absolute -bottom-48 -right-16 text-white">
          <path fillRule="evenodd" d="M11.54 22.351.07 9.331a1.03 1.03 0 0 1 0-1.142L11.54 1.648a1.158 1.158 0 0 1 1.15 0L23.457 8.19a1.03 1.03 0 0 1 0 1.142L12.69 22.351a1.158 1.158 0 0 1-1.15 0Z" clipRule="evenodd" />
        </svg>
      </div>
    
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Encuentra el nombre perfecto para tu bebé hoy mismo
          </h2>
          <p className="text-xl mb-10 opacity-90">
            No pierdas más tiempo con listas interminables. Baby Swiper hace divertido y eficiente el proceso de elegir un nombre.
          </p>
          
          {mounted && (
            <>
              {!user ? (
                <Link 
                  href="/auth"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full shadow-lg bg-white text-pink-600 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pink-500 focus:ring-white transition-all duration-200 transform hover:scale-105 group"
                >
                  <span className="mr-2">Comenzar Gratis</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full shadow-lg bg-white text-pink-600 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pink-500 focus:ring-white transition-all duration-200 transform hover:scale-105 group"
                >
                  <span className="mr-2">Explorar Nombres</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </Link>
              )}
            </>
          )}
          
          <p className="mt-6 text-sm opacity-80">
            Sin compromisos. Sin tarjeta de crédito.
          </p>
        </div>
      </div>
    </section>
  );
} 