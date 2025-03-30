'use client';

import { useState, useEffect, useMemo } from 'react';
import BabyCard from '../components/BabyCard';
import FavoritesList from '../components/FavoritesList';
import NameStats from '../components/NameStats';
import { nombresArgentinos } from '../data/nombresArgentinos';
import { NombreArgentino } from '../types/types';
import { useAuth } from '@/contexts/AuthContext';
import { saveNamePreference, getLikedNames, getDislikedNames, removeNamePreference, checkForMatches } from '@/lib/nameService';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<NombreArgentino[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [lastAction, setLastAction] = useState<'like' | 'dislike' | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [pendingName, setPendingName] = useState<NombreArgentino | null>(null);
  const [pendingDirection, setPendingDirection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matchAlert, setMatchAlert] = useState<string | null>(null);

  // Cargar favoritos y rechazados desde Supabase cuando el usuario inicia sesión
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!loading && user) {
        setIsLoading(true);
        try {
          // Cargar los nombres favoritos
          const likedNames = await getLikedNames(user);
          setFavorites(likedNames);
          
          // Cargar los nombres rechazados
          const dislikedIds = await getDislikedNames(user);
          setRejected(dislikedIds);
        } catch (error) {
          console.error('Error loading user preferences:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!loading) {
        setIsLoading(false);
      }
    };
    
    loadUserPreferences();
  }, [user, loading]);

  // Nombres que aún no se han visto
  const remainingNames = useMemo(() => {
    const seenIds = [...favorites.map(f => f.id), ...rejected];
    return nombresArgentinos.filter(name => !seenIds.includes(name.id));
  }, [favorites, rejected]);

  // Efecto para procesar la acción pendiente después de que la animación termine
  useEffect(() => {
    if (!showAnimation && pendingName && pendingDirection) {
      const processSwipe = async () => {
        const liked = pendingDirection === 'right';
        
        if (user) {
          try {
            // Guardar preferencia en Supabase
            await saveNamePreference(user, pendingName, liked);
            
            // Si fue un "like", comprobar matches
            if (liked) {
              const matches = await checkForMatches(user, pendingName.id);
              if (matches && matches.length > 0) {
                const matchNames = matches.map((m: any) => 
                  m.profile?.full_name || m.profile?.email || 'otro usuario'
                ).join(', ');
                setMatchAlert(`¡Match! A ${matchNames} también le gustó ${pendingName.nombre}`);
                setTimeout(() => setMatchAlert(null), 5000);
              }
            }
          } catch (error) {
            console.error('Error saving preference:', error);
          }
        }
        
        // La animación ha terminado, ahora actualiza los estados locales
        if (liked) {
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
      };
      
      processSwipe();
    }
  }, [showAnimation, pendingName, pendingDirection, remainingNames, user]);

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
  const handleRemoveFavorite = async (id: number) => {
    if (user) {
      try {
        // Eliminar preferencia en Supabase
        await removeNamePreference(user, id);
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
    
    // Actualizar estado local
    setFavorites(prev => prev.filter(name => name.id !== id));
  };

  // Reiniciar todo
  const handleReset = () => {
    setFavorites([]);
    setRejected([]);
    setCurrentIndex(0);
    setPendingName(null);
    setPendingDirection(null);
    // Nota: Esto no elimina los datos de Supabase, solo restablece la vista local
  };

  // Cambiar entre vista de tarjetas y favoritos
  const toggleView = () => {
    setShowFavorites(prev => !prev);
  };

  useEffect(() => {
    const handleToggleFavorites = (event: CustomEvent) => {
      setShowFavorites(event.detail.showFavorites);
    };

    window.addEventListener('toggleFavorites', handleToggleFavorites as EventListener);
    return () => {
      window.removeEventListener('toggleFavorites', handleToggleFavorites as EventListener);
    };
  }, []);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-800 mb-4">Inicia sesión para guardar tus nombres favoritos</div>
        <Link href="/auth" className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {matchAlert && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md shadow-sm animate-pulse">
            {matchAlert}
          </div>
        )}

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
      </div>
    </div>
  );
}
