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
    <section className="py-20 bg-gradient-to-br from-pink-500 to-blue-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full shadow-lg bg-white text-pink-600 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pink-500 focus:ring-white transition-all duration-200 transform hover:scale-105"
                >
                  Comenzar Gratis
                </Link>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full shadow-lg bg-white text-pink-600 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pink-500 focus:ring-white transition-all duration-200 transform hover:scale-105"
                >
                  Explorar Nombres
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