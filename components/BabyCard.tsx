import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { FiHeart, FiX } from 'react-icons/fi';

interface BabyCardProps {
  nombre: string;
  cantidad: number;
  anio: number;
  onSwipe: (direction: string) => void;
}

const BabyCard: React.FC<BabyCardProps> = ({ nombre, cantidad, anio, onSwipe }) => {
  const [gone, setGone] = useState(false);
  
  // Configuración de la animación de la tarjeta
  const [{ x, y, rotate }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    config: { friction: 50, tension: 500 }
  }));

  // Configuración del gesto de arrastre
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], velocity: [vx] }: {
    active: boolean;
    movement: number[];
    direction: number[];
    velocity: number[];
  }) => {
    // Velocidad para considerar que la tarjeta fue arrastrada lo suficiente
    const trigger = vx > 0.2;
    
    // Dirección del arrastre
    const dir = xDir < 0 ? -1 : 1;
    
    // Si la tarjeta fue arrastrada con suficiente velocidad
    if (!active && trigger) {
      setGone(true);
      // Llamar a la función onSwipe con la dirección
      onSwipe(dir === 1 ? 'right' : 'left');
    }
    
    // Actualizar la posición y rotación de la tarjeta
    api.start({
      x: active ? mx : 0,
      y: active ? 0 : 0,
      rotate: active ? mx / 10 : 0,
      config: { friction: 50, tension: active ? 800 : 500 }
    });
  });

  return (
    <animated.div
      {...bind()}
      style={{
        transform: x.to((x) => `translateX(${x}px) rotate(${rotate.get()}deg)`)
      }}
      className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{nombre}</h2>
          <div className="mt-4 text-gray-600">
            <p className="text-lg">
              <span className="font-medium">{cantidad}</span> nacimientos en {anio}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              setGone(true);
              onSwipe('left');
            }}
            className="p-4 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
          >
            <FiX size={24} />
          </button>
          
          <button
            onClick={() => {
              setGone(true);
              onSwipe('right');
            }}
            className="p-4 rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition"
          >
            <FiHeart size={24} />
          </button>
        </div>
      </div>
    </animated.div>
  );
};

export default BabyCard;
