'use client';

import { useEffect, useRef, useState } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const steps: Step[] = [
    {
      number: 1,
      title: 'Crea tu cuenta',
      description: 'Regístrate en menos de un minuto con tu email y comienza a explorar nombres.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
      )
    },
    {
      number: 2,
      title: 'Desliza y selecciona',
      description: 'Explora cientos de nombres con un simple deslizamiento. Izquierda para "no me gusta", derecha para "me gusta".',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      number: 3,
      title: 'Conecta con tu pareja',
      description: 'Invita a tu pareja a unirse con un código simple y vean los nombres que les gustan a ambos.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      )
    },
    {
      number: 4,
      title: 'Descubre coincidencias',
      description: 'Recibe notificaciones cuando tú y tu pareja coinciden en un nombre que les gusta a ambos.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      )
    }
  ];
  
  // Cambiar automáticamente el paso activo cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-16 bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cómo funciona</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            El proceso es simple, intuitivo y está diseñado para hacer divertida la elección del nombre
          </p>
        </div>
        
        {/* Versión móvil - Paginación vertical */}
        <div className="md:hidden">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold">
                {steps[activeStep].number}
              </div>
              <h3 className="ml-4 text-xl font-semibold">{steps[activeStep].title}</h3>
            </div>
            <p className="text-gray-600">{steps[activeStep].description}</p>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeStep ? 'bg-pink-500' : 'bg-gray-300'
                }`}
                aria-label={`Ver paso ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Versión desktop - Línea de tiempo horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Línea de conexión */}
            <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-200" />
            
            <div className="grid grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center transition-opacity duration-300 ${
                    activeStep === index ? 'opacity-100' : 'opacity-70'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-20 h-20 rounded-full bg-white flex items-center justify-center border-2 z-10
                      ${activeStep === index ? 'border-pink-500 shadow-lg scale-110' : 'border-gray-200'}
                      transition-all duration-300
                    `}>
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        ${activeStep === index ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white' : 'bg-gray-100 text-gray-500'}
                        transition-all duration-300
                      `}>
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 