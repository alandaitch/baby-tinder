'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const cards = [
    {
      title: "Registro Simple",
      description: "Crea tu cuenta y comienza en menos de un minuto sin complicaciones",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
      bgColor: "from-blue-400 to-blue-600",
      rotation: -5,
      translateX: "-5%",
      translateY: "5%"
    },
    {
      title: "Explora Nombres",
      description: "Desliza entre miles de opciones organizadas por origen, popularidad y significado",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      bgColor: "from-pink-400 to-pink-600",
      rotation: 0,
      translateX: "0%",
      translateY: "0%"
    },
    {
      title: "Conecta en Pareja",
      description: "Comparte tus selecciones con tu pareja y descubran sus gustos en común",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      bgColor: "from-purple-400 to-purple-600",
      rotation: 5,
      translateX: "5%",
      translateY: "-5%"
    },
    {
      title: "Encuentra Coincidencias",
      description: "Recibe alertas cuando ambos coincidan en un nombre que les encanta",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      ),
      bgColor: "from-green-400 to-green-600",
      rotation: -3,
      translateX: "3%",
      translateY: "3%"
    }
  ];
  
  // Navegar a la tarjeta anterior
  const goToPrevCard = () => {
    setActiveCard((current) => (current - 1 + cards.length) % cards.length);
  };

  // Navegar a la siguiente tarjeta
  const goToNextCard = () => {
    setActiveCard((current) => (current + 1) % cards.length);
  };
  
  // Auto rotación de tarjetas (a velocidad reducida)
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      goToNextCard();
    }, 6000); // Velocidad reducida a la mitad (de 3000ms a 6000ms)
    
    return () => clearInterval(interval);
  }, [cards.length, isHovering]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Cómo funciona Baby Swiper</h2>
          </div>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Un proceso divertido y sencillo para elegir el nombre de tu bebé
          </p>
        </div>
        
        {/* Perspectiva 3D con botones de navegación */}
        <div className="relative">
          {/* Flecha izquierda */}
          <button 
            onClick={goToPrevCard}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 md:left-4"
            aria-label="Tarjeta anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          {/* Flecha derecha */}
          <button 
            onClick={goToNextCard}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 md:right-4"
            aria-label="Siguiente tarjeta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          <div 
            className="relative perspective-[1000px] h-[500px] md:h-[600px] mx-auto"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Cubos flotantes de fondo */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8 opacity-10 rounded bg-gradient-to-br from-pink-400 to-blue-500"
                  initial={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    rotate: Math.random() * 180,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    x: [null, Math.random() * 300 - 150],
                    y: [null, Math.random() * 300 - 150],
                    rotate: [null, Math.random() * 360],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Círculos flotantes de fondo */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i + 100}
                  className="absolute w-12 h-12 opacity-10 rounded-full bg-gradient-to-br from-blue-400 to-pink-500"
                  initial={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    x: [null, Math.random() * 300 - 150],
                    y: [null, Math.random() * 300 - 150],
                    scale: [null, Math.random() * 0.5 + 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Tarjetas 3D */}
            <div className="relative flex items-center justify-center h-full">
              {cards.map((card, index) => {
                // Calcular posición 3D
                const isActive = activeCard === index;
                const offset = ((index - activeCard + cards.length) % cards.length);
                let zIndex = cards.length - offset;
                let opacity = 1 - (offset * 0.2);
                
                let rotateY = offset * 15; // Rotación en el eje Y
                if (offset > cards.length / 2) {
                  rotateY = (cards.length - offset) * -15;
                  zIndex = offset;
                  opacity = 0.5;
                }
                
                // Posición en círculo
                let translateZ = -100; // Base Z
                if (isActive) {
                  translateZ = 0;
                }
                
                return (
                  <motion.div
                    key={index}
                    className="absolute cursor-pointer"
                    initial={false}
                    animate={{
                      rotateY: `${rotateY}deg`,
                      z: translateZ,
                      opacity: opacity,
                      x: isActive ? card.translateX : "0%", 
                      y: isActive ? card.translateY : "0%", 
                      rotate: isActive ? card.rotation : 0
                    }}
                    transition={{
                      type: 'spring',
                      damping: 20,
                      stiffness: 100
                    }}
                    style={{
                      zIndex: zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={() => setActiveCard(index)}
                    whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                  >
                    <div className={`w-64 md:w-80 h-72 md:h-96 rounded-2xl overflow-hidden bg-white shadow-xl transform-gpu`}>
                      {/* Decoración superior */}
                      <div className={`h-1/3 bg-gradient-to-r ${card.bgColor} p-6 text-white flex items-start justify-between`}>
                        <span className="inline-block rounded-full px-3 py-1 bg-white/20 text-xs md:text-sm font-semibold">
                          Paso {index + 1}
                        </span>
                        <div className="p-2 bg-white/20 rounded-full">
                          {card.icon}
                        </div>
                      </div>
                      
                      {/* Contenido */}
                      <div className="p-6 relative">
                        {/* Decoración */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-white rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        
                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
                          {card.title}
                        </h3>
                        <p className="text-gray-700 text-sm md:text-base">
                          {card.description}
                        </p>
                        
                        {/* Indicador para tarjeta activa */}
                        {isActive && (
                          <motion.div 
                            className="absolute bottom-4 left-6 right-6 h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Navegación de tarjetas */}
        <div className="flex justify-center mt-8 space-x-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCard(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeCard === index 
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ver tarjeta ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 