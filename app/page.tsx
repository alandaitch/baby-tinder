'use client';

import { useState, useEffect, useMemo } from 'react';
import BabyCard from '../components/BabyCard';
import FavoritesList from '../components/FavoritesList';
import NameStats from '../components/NameStats';
import { nombresArgentinos } from '../data/nombresArgentinos';
import { NombreArgentino } from '../types/types';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<NombreArgentino[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [lastAction, setLastAction] = useState<'like' | 'dislike' | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [pendingName, setPendingName] = useState<NombreArgentino | null>(null);
  const [pendingDirection, setPendingDirection] = useState<string | null>(null);

  // Nombres que aún no se han visto
  const remainingNames = useMemo(() => {
    const seenIds = [...favorites.map(f => f.id), ...rejected];
    return nombresArgentinos.filter(name => !seenIds.includes(name.id));
  }, [favorites, rejected]);

  // Efecto para procesar la acción pendiente después de que la animación termine
  useEffect(() => {
    if (!showAnimation && pendingName && pendingDirection) {
      // La animación ha terminado, ahora actualiza los estados reales
      if (pendingDirection === 'right') {
        setFavorites(prev => [...prev, pendingName as NombreArgentino]);
      } else {
        setRejected(prev => [...prev, pendingName.id]);
      }

      // Avanzar al siguiente nombre
      setCurrentIndex(prevIndex => 
        prevIndex < remainingNames.length - 1 ? prevIndex + 1 : prevIndex
      );

      // Limpiar el estado pendiente
      setPendingName(null);
      setPendingDirection(null);
    }
  }, [showAnimation, pendingName, pendingDirection, remainingNames]);

  // Manejar el deslizamiento de tarjetas
  const handleSwipe = (direction: string) => {
    const currentName = remainingNames[currentIndex];
    
    // Guardar la acción pendiente para procesarla después de la animación
    setPendingName(currentName);
    setPendingDirection(direction);
    
    // Establecer la acción para la animación
    if (direction === 'right') {
      setLastAction('like');
    } else {
      setLastAction('dislike');
    }
    
    // Mostrar animación
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 800);
  };

  // Eliminar un nombre de favoritos
  const handleRemoveFavorite = (id: number) => {
    setFavorites(prev => prev.filter(name => name.id !== id));
  };

  // Reiniciar todo
  const handleReset = () => {
    setFavorites([]);
    setRejected([]);
    setCurrentIndex(0);
    setPendingName(null);
    setPendingDirection(null);
  };

  // Cambiar entre vista de tarjetas y favoritos
  const toggleView = () => {
    setShowFavorites(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50">
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Baby Tinder</h1>
          <button 
            onClick={toggleView}
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            {showFavorites ? 'Ver Tarjetas' : 'Ver Favoritos'}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        {!showFavorites ? (
          <div>
            <div className="flex flex-col items-center">
              <div className="relative w-72 h-96 mb-8">
                {/* Animación de like/dislike */}
                {showAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    {lastAction === 'like' ? (
                      <div className="text-green-500 text-9xl animate-ping opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-red-500 text-9xl animate-ping opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                
                {remainingNames.length > currentIndex ? (
                  <BabyCard
                    nombre={remainingNames[currentIndex].nombre}
                    cantidad={remainingNames[currentIndex].cantidad}
                    anio={remainingNames[currentIndex].anio}
                    onSwipe={handleSwipe}
                  />
                ) : (
                  <div className="w-72 h-96 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center bg-gray-100">
                    <p className="text-xl text-center text-gray-600 mb-4">
                      ¡No hay más nombres para mostrar!
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
                    >
                      Reiniciar
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <p className="text-center text-gray-600">
                  Has guardado {favorites.length} {favorites.length === 1 ? 'nombre' : 'nombres'} y 
                  rechazado {rejected.length} {rejected.length === 1 ? 'nombre' : 'nombres'}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FavoritesList favorites={favorites} onRemove={handleRemoveFavorite} />
            </div>
            <div>
              <NameStats favorites={favorites} />
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white mt-8 border-t">
        <div className="container mx-auto text-center text-gray-600">
          <p>Baby Tinder - Encuentra el nombre perfecto para tu bebé</p>
        </div>
      </footer>
    </div>
  );
}
