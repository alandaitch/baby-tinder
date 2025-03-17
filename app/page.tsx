'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import BabyCard from '../components/BabyCard';
import FavoritesList from '../components/FavoritesList';
import NameFilters from '../components/NameFilters';
import NameStats from '../components/NameStats';
import { babyNames } from '../data/babyNames';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<typeof babyNames>([]);
  const [rejected, setRejected] = useState<number[]>([]);
  const [genderFilter, setGenderFilter] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);

  // Filtrar nombres por género
  const filteredNames = useMemo(() => {
    return babyNames.filter(name => 
      genderFilter === 'all' || name.gender === genderFilter
    );
  }, [genderFilter]);

  // Nombres que aún no se han visto
  const remainingNames = useMemo(() => {
    const seenIds = [...favorites.map(f => f.id), ...rejected];
    return filteredNames.filter(name => !seenIds.includes(name.id));
  }, [filteredNames, favorites, rejected]);

  // Manejar el deslizamiento de tarjetas
  const handleSwipe = (direction: string) => {
    const currentName = remainingNames[currentIndex];
    
    if (direction === 'right') {
      // Me gusta - añadir a favoritos
      setFavorites(prev => [...prev, currentName]);
    } else {
      // No me gusta - añadir a rechazados
      setRejected(prev => [...prev, currentName.id]);
    }
    
    // Avanzar al siguiente nombre
    setCurrentIndex(prevIndex => 
      prevIndex < remainingNames.length - 1 ? prevIndex + 1 : prevIndex
    );
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
            <div className="mb-6">
              <NameFilters 
                genderFilter={genderFilter} 
                setGenderFilter={setGenderFilter} 
              />
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-72 h-96 mb-8">
                {remainingNames.length > currentIndex ? (
                  <BabyCard
                    name={remainingNames[currentIndex].name}
                    gender={remainingNames[currentIndex].gender}
                    origin={remainingNames[currentIndex].origin}
                    meaning={remainingNames[currentIndex].meaning}
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

              {remainingNames.length > currentIndex && (
                <div className="flex space-x-8">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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
