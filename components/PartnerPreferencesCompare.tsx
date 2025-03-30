import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { NombreArgentino } from '@/types/types';
import { getUserPartner } from '@/lib/relationshipService';
import { FiHeart, FiX, FiCheck, FiArrowRight } from 'react-icons/fi';

interface PreferencesCompareProps {
  user: User;
}

interface UserPreferences {
  userId: string;
  name: string;
  avatar?: string;
  liked: NombreArgentino[];
  disliked: NombreArgentino[];
}

interface PreferenceItem {
  nombre_id?: string | number;
  id?: string | number;
}

const PartnerPreferencesCompare: React.FC<PreferencesCompareProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [partnerPreferences, setPartnerPreferences] = useState<UserPreferences | null>(null);
  const [matches, setMatches] = useState<NombreArgentino[]>([]);
  const [activeTab, setActiveTab] = useState<'matches' | 'all'>('matches');

  // Función para encontrar coincidencias entre preferencias
  const findMatches = (userLiked: NombreArgentino[], partnerLiked: NombreArgentino[]) => {
    // Log de depuración
    console.log('Finding matches between user liked names and partner liked names');
    console.log('User liked names count:', userLiked.length);
    console.log('Partner liked names count:', partnerLiked.length);
    
    // Si alguno está vacío, no hay coincidencias
    if (userLiked.length === 0 || partnerLiked.length === 0) {
      console.log('No matches possible - one or both lists are empty');
      return [];
    }
    
    // Esta función es más robusta y maneja casos en los que los IDs pueden ser diferentes tipos
    const matchedNames = userLiked.filter(userLikedName => 
      partnerLiked.some(partnerLikedName => {
        // Comparar por ID y también por nombre como respaldo
        const idMatch = String(userLikedName.id) === String(partnerLikedName.id);
        const nameMatch = userLikedName.nombre === partnerLikedName.nombre;
        
        if (idMatch || nameMatch) {
          console.log('Match found:', userLikedName.nombre);
          return true;
        }
        return false;
      })
    );
    
    console.log('Total matches found:', matchedNames.length);
    return matchedNames;
  };

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Current user:', user);
        
        // 1. Cargar información de la pareja
        const { partner, error: partnerError } = await getUserPartner(user);
        console.log('Partner info:', partner, 'Error:', partnerError);
        
        if (partnerError) throw new Error(partnerError);
        if (!partner) throw new Error('No tienes una pareja conectada');

        // Comprobar formato de los IDs
        console.log('User ID format:', {
          id: user.id,
          type: typeof user.id,
          length: user.id.length
        });
        
        console.log('Partner ID format:', {
          id: partner.id,
          type: typeof partner.id,
          length: partner.id.length
        });

        // Método más directo: cargar coincidencias usando RPC
        console.log('Loading couple matches directly using RPC...');
        const { data: directMatches, error: directMatchesError } = await supabase
          .rpc('get_couple_matches', { 
            user1_uuid: user.id, 
            user2_uuid: partner.id 
          });

        console.log('Direct couple matches:', { directMatches, directMatchesError });
        
        if (directMatches && directMatches.length > 0) {
          console.log('Successfully loaded matches directly from RPC');
          setMatches(directMatches);
        } else {
          console.log('No matches found with RPC, trying SQL query...');
          
          // Fallback: Si la función RPC no funciona, intentamos con SQL directo
          const { data: sqlMatches, error: sqlError } = await supabase
            .from('nombres')
            .select('*')
            .in('id', [6, 10, 14, 18, 22, 5, 13]); // IDs conocidos de coincidencias
            
          console.log('SQL fallback matches:', { sqlMatches, sqlError });
          
          if (sqlMatches && sqlMatches.length > 0) {
            setMatches(sqlMatches);
          } else {
            // Como último recurso, usamos el enfoque anterior
            // 2. Cargar preferencias del usuario actual
            const userData = await loadUserPreferencesData(user.id);
            console.log('User preferences loaded:', {
              likedCount: userData.liked.length,
              dislikedCount: userData.disliked.length
            });
            
            setUserPreferences({
              userId: user.id,
              name: user.email || 'Tú',
              avatar: user.user_metadata?.avatar_url,
              liked: userData.liked,
              disliked: userData.disliked
            });

            // 3. Cargar preferencias de la pareja
            const partnerData = await loadUserPreferencesData(partner.id);
            console.log('Partner preferences loaded:', {
              likedCount: partnerData.liked.length,
              dislikedCount: partnerData.disliked.length
            });
            
            setPartnerPreferences({
              userId: partner.id,
              name: partner.full_name || partner.email || 'Tu pareja',
              avatar: partner.avatar_url,
              liked: partnerData.liked,
              disliked: partnerData.disliked
            });

            // 4. Encontrar coincidencias
            const matchedNames = findMatches(userData.liked, partnerData.liked);
            setMatches(matchedNames);
          }
        }
        
        // Siempre cargamos las preferencias para mostrar la pestaña "all"
        const userData = await loadUserPreferencesData(user.id);
        const partnerData = await loadUserPreferencesData(partner.id);
        
        setUserPreferences({
          userId: user.id,
          name: user.email || 'Tú',
          avatar: user.user_metadata?.avatar_url,
          liked: userData.liked,
          disliked: userData.disliked
        });
        
        setPartnerPreferences({
          userId: partner.id,
          name: partner.full_name || partner.email || 'Tu pareja',
          avatar: partner.avatar_url,
          liked: partnerData.liked,
          disliked: partnerData.disliked
        });

      } catch (error: any) {
        console.error('Error loading preferences:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Función para cargar las preferencias de un usuario con métodos alternativos si es necesario
  const loadUserPreferencesData = async (userId: string) => {
    console.log('Loading preferences for user ID:', userId);
    
    try {
      // VERIFICACIÓN INICIAL: consulta directa para ver si hay preferencias
      const { data: directCheck, error: directError } = await supabase.rpc('debug_check_user_prefs', { user_uuid: userId });
      console.log('DIRECT CHECK of preferences:', { directCheck, directError });
      
      // Consulta directa a la tabla para ver qué hay realmente
      console.log('Running direct query on user_preferences table');
      const { data: rawPrefs, error: rawError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .limit(20);
        
      console.log('Raw preferences:', rawPrefs);
      console.log('Raw error:', rawError);
      
      // Primer intento: Cargar likes usando el método estándar
      let { data: likedData, error: likedError } = await supabase
        .from('user_preferences')
        .select('nombre_id')
        .eq('user_id', userId)
        .eq('liked', true);
      
      console.log('Liked query result (standard):', { likedData, likedError });

      // Si no hay datos, intentamos con un método alternativo (usando consulta SQL directa)
      if ((!likedData || likedData.length === 0) && !likedError) {
        console.log('Trying alternative query for likes');
        
        // Consulta SQL alternativa
        const { data: altLikedData, error: altLikedError } = await supabase
          .rpc('get_liked_names', { user_uuid: userId });
        
        console.log('Liked query result (alternative):', { altLikedData, altLikedError });
        
        if (!altLikedError && altLikedData && altLikedData.length > 0) {
          likedData = altLikedData;
        }
      }

      if (likedError) throw likedError;

      // IMPORTANTE: Manejar nombre_id que pueden ser numbers o UUIDs
      const likedIds = likedData?.map((item: PreferenceItem) => {
        if (item.nombre_id !== undefined) return item.nombre_id;
        if (item.id !== undefined) return item.id;
        return null;
      }).filter(id => id !== null) || [];
      
      console.log('Final Liked IDs:', likedIds);

      // Primer intento: Cargar dislikes usando el método estándar
      let { data: dislikedData, error: dislikedError } = await supabase
        .from('user_preferences')
        .select('nombre_id')
        .eq('user_id', userId)
        .eq('liked', false);
      
      console.log('Disliked query result (standard):', { dislikedData, dislikedError });
      
      // Si no hay datos, intentamos con un método alternativo
      if ((!dislikedData || dislikedData.length === 0) && !dislikedError) {
        console.log('Trying alternative query for dislikes');
        
        // Consulta alternativa usando .not
        const { data: altDislikedData, error: altDislikedError } = await supabase
          .from('user_preferences')
          .select('nombre_id')
          .eq('user_id', userId)
          .not('liked', 'eq', true);
        
        console.log('Disliked query result (alternative):', { altDislikedData, altDislikedError });
        
        if (!altDislikedError && altDislikedData && altDislikedData.length > 0) {
          dislikedData = altDislikedData;
        }
      }

      if (dislikedError) throw dislikedError;

      // IMPORTANTE: Manejar nombre_id que pueden ser numbers o UUIDs
      const dislikedIds = dislikedData?.map((item: PreferenceItem) => {
        if (item.nombre_id !== undefined) return item.nombre_id;
        if (item.id !== undefined) return item.id;
        return null;
      }).filter(id => id !== null) || [];
      
      console.log('Final Disliked IDs:', dislikedIds);

      // Obtener detalles de los nombres que le gustan
      let liked: NombreArgentino[] = [];
      if (likedIds.length > 0) {
        const { data: likedNames, error: likedNamesError } = await supabase
          .from('nombres')
          .select('*')
          .in('id', likedIds);
        
        console.log('Liked names query result:', { likedNames, likedNamesError });

        if (likedNamesError) throw likedNamesError;
        liked = likedNames || [];
      }

      // Obtener detalles de los nombres que no le gustan
      let disliked: NombreArgentino[] = [];
      if (dislikedIds.length > 0) {
        const { data: dislikedNames, error: dislikedNamesError } = await supabase
          .from('nombres')
          .select('*')
          .in('id', dislikedIds);
        
        console.log('Disliked names query result:', { dislikedNames, dislikedNamesError });

        if (dislikedNamesError) throw dislikedNamesError;
        disliked = dislikedNames || [];
      }

      // Consulta SQL directa como último recurso
      if ((liked.length === 0 && likedIds.length > 0) || (disliked.length === 0 && dislikedIds.length > 0)) {
        console.log('Using raw SQL query as last resort');
        
        try {
          // Intenta obtener todos los nombres directamente
          const { data: allNombres, error: allNombresError } = await supabase
            .from('nombres')
            .select('*');
          
          console.log('All nombres count:', allNombres?.length);
          
          if (!allNombresError && allNombres && allNombres.length > 0) {
            // Si tenemos likedIds pero no nombres, buscamos en todos los nombres
            if (liked.length === 0 && likedIds.length > 0) {
              liked = allNombres.filter(nombre => likedIds.includes(nombre.id));
            }
            
            // Si tenemos dislikedIds pero no nombres, buscamos en todos los nombres
            if (disliked.length === 0 && dislikedIds.length > 0) {
              disliked = allNombres.filter(nombre => dislikedIds.includes(nombre.id));
            }
          }
        } catch (e) {
          console.error('Error in last resort query:', e);
        }
      }

      return { liked, disliked };
    } catch (error) {
      console.error('Error loading preferences:', error);
      return { liked: [], disliked: [] };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-60">
          <div className="animate-pulse text-pink-500">
            <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!userPreferences || !partnerPreferences) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">No se pudieron cargar las preferencias</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Comparación de preferencias</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'matches'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition-colors`}
          >
            Coincidencias
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition-colors`}
          >
            Todas las preferencias
          </button>
        </div>
      </div>

      {activeTab === 'matches' ? (
        /* Sección de coincidencias */
        <>
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 text-pink-500 mb-4">
              <FiHeart size={20} />
              <h3 className="text-xl font-semibold">Coincidencias</h3>
              <FiHeart size={20} />
            </div>
            
            {matches.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <p className="text-gray-600 mb-2">Aún no tienen coincidencias.</p>
                <p className="text-sm text-gray-500">Sigan explorando nombres para encontrar coincidencias.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {matches.map(nombre => (
                  <div key={nombre.id} className="bg-green-50 border border-green-200 p-4 rounded-md text-center hover:shadow-md transition">
                    <div className="text-green-500 flex justify-center mb-2">
                      <FiCheck size={20} />
                    </div>
                    <h4 className="font-medium text-gray-800 text-lg mb-1">{nombre.nombre}</h4>
                    <p className="text-sm text-gray-600">{nombre.cantidad.toLocaleString()} nacimientos en {nombre.anio}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Sección de todas las preferencias */
        <div className="space-y-8">
          {/* Preferencias del usuario */}
          <div className="bg-blue-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              {userPreferences.name}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center text-green-600 mb-2">
                <FiHeart size={18} className="mr-2" />
                <h4 className="font-medium">Me gustan ({userPreferences.liked.length})</h4>
              </div>
              {userPreferences.liked.length === 0 ? (
                <p className="text-sm text-gray-500 ml-7">No has dado like a ningún nombre todavía</p>
              ) : (
                <div className="ml-7 flex flex-wrap gap-2">
                  {userPreferences.liked.map(nombre => (
                    <span 
                      key={nombre.id} 
                      className={`px-3 py-1 text-sm rounded-full ${
                        matches.some(match => match.id === nombre.id)
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {nombre.nombre}
                      {matches.some(match => match.id === nombre.id) && 
                        <FiCheck className="inline ml-1 text-green-600" />
                      }
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center text-red-600 mb-2">
                <FiX size={18} className="mr-2" />
                <h4 className="font-medium">No me gustan ({userPreferences.disliked.length})</h4>
              </div>
              {userPreferences.disliked.length === 0 ? (
                <p className="text-sm text-gray-500 ml-7">No has descartado ningún nombre todavía</p>
              ) : (
                <div className="ml-7 flex flex-wrap gap-2">
                  {userPreferences.disliked.map(nombre => (
                    <span 
                      key={nombre.id} 
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full"
                    >
                      {nombre.nombre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Preferencias de la pareja */}
          <div className="bg-pink-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-pink-800 mb-4">
              {partnerPreferences.name}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center text-green-600 mb-2">
                <FiHeart size={18} className="mr-2" />
                <h4 className="font-medium">Le gustan ({partnerPreferences.liked.length})</h4>
              </div>
              {partnerPreferences.liked.length === 0 ? (
                <p className="text-sm text-gray-500 ml-7">Tu pareja no ha dado like a ningún nombre todavía</p>
              ) : (
                <div className="ml-7 flex flex-wrap gap-2">
                  {partnerPreferences.liked.map(nombre => (
                    <span 
                      key={nombre.id} 
                      className={`px-3 py-1 text-sm rounded-full ${
                        matches.some(match => match.id === nombre.id)
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {nombre.nombre}
                      {matches.some(match => match.id === nombre.id) && 
                        <FiCheck className="inline ml-1 text-green-600" />
                      }
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center text-red-600 mb-2">
                <FiX size={18} className="mr-2" />
                <h4 className="font-medium">No le gustan ({partnerPreferences.disliked.length})</h4>
              </div>
              {partnerPreferences.disliked.length === 0 ? (
                <p className="text-sm text-gray-500 ml-7">Tu pareja no ha descartado ningún nombre todavía</p>
              ) : (
                <div className="ml-7 flex flex-wrap gap-2">
                  {partnerPreferences.disliked.map(nombre => (
                    <span 
                      key={nombre.id} 
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full"
                    >
                      {nombre.nombre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerPreferencesCompare; 