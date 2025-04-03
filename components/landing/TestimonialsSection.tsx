'use client';

import { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Nota: En producción, estas imágenes deberían ser reemplazadas con fotos reales
  // Descripción de placeholders:
  // 1. "Pareja joven sonriendo con un bebé recién nacido" - Para Ana y Roberto
  // 2. "Pareja en casa sosteniendo un libro de nombres" - Para Lucía y Martín
  // 3. "Pareja mirando una aplicación móvil juntos y sonriendo" - Para Carlos y María
  
  const testimonials = [
    {
      quote: "Baby Swiper nos ayudó a encontrar el nombre perfecto para nuestra hija. ¡Sin discusiones!",
      author: "Ana y Roberto",
      childName: "Valentina"
    },
    {
      quote: "Llevábamos meses sin poder decidir un nombre, pero con esta app encontramos uno que nos encantó a los dos en solo una semana.",
      author: "Lucía y Martín",
      childName: "Mateo"
    },
    {
      quote: "Super intuitiva y divertida. Nos hizo mucho más fácil la decisión y además nos divertimos en el proceso.",
      author: "Carlos y María",
      childName: "Emma"
    }
  ];
  
  // Auto-rotación de testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lo que dicen las parejas</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de parejas ya encontraron el nombre perfecto con Baby Swiper
          </p>
        </div>
        
        <div className="relative">
          {/* Versión móvil - Carrusel */}
          <div className="block md:hidden">
            <div className="relative w-full">
              <div className="transition-opacity duration-500">
                <TestimonialCard {...testimonials[activeIndex]} />
              </div>
              
              {/* Indicadores de página */}
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeIndex ? 'bg-pink-500' : 'bg-gray-300'
                    }`}
                    aria-label={`Ver testimonio ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Versión desktop - Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 