import { supabase } from '@/lib/supabase';
import { NombreArgentino } from '@/types/types';
import { User } from '@supabase/supabase-js';

/**
 * Guarda la preferencia de un usuario sobre un nombre (like o dislike)
 */
export async function saveNamePreference(
  user: User, 
  nombre: NombreArgentino, 
  liked: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar si ya existe una preferencia para este usuario y nombre
    const { data: existingPreferences, error: queryError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .eq('nombre_id', nombre.id);
    
    if (queryError) throw queryError;
    
    const existingPreference = existingPreferences && existingPreferences.length > 0 
      ? existingPreferences[0] 
      : null;

    if (existingPreference) {
      // Actualizar preferencia existente
      const { error } = await supabase
        .from('user_preferences')
        .update({ liked, updated_at: new Date() })
        .eq('id', existingPreference.id);
      
      if (error) throw error;
    } else {
      // Crear nueva preferencia
      const { error } = await supabase
        .from('user_preferences')
        .insert({ 
          user_id: user.id,
          nombre_id: nombre.id,
          liked
        });
      
      if (error) throw error;
    }

    // Si es un "like", también lo guardamos en la tabla de favoritos
    if (liked) {
      // Verificar si ya existe en favoritos
      const { data: existingFavorites, error: favQueryError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('nombre_id', nombre.id);
      
      if (favQueryError) throw favQueryError;
      
      const existingFavorite = existingFavorites && existingFavorites.length > 0 
        ? existingFavorites[0] 
        : null;

      if (!existingFavorite) {
        // Agregar a favoritos
        const { error } = await supabase
          .from('user_favorites')
          .insert({ 
            user_id: user.id,
            nombre_id: nombre.id
          });
        
        if (error) throw error;
      }
    } else {
      // Si es un "dislike", eliminamos de favoritos si existe
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('nombre_id', nombre.id);
      
      if (error && error.code !== 'PGRST116') throw error; // Ignorar error si no existe
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving name preference:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene todos los nombres que le gustaron a un usuario
 */
export async function getLikedNames(user: User): Promise<NombreArgentino[]> {
  try {
    // Primero obtenemos los IDs de los nombres que le gustaron al usuario
    const { data: likedNamesIds, error: prefsError } = await supabase
      .from('user_preferences')
      .select('nombre_id')
      .eq('user_id', user.id)
      .eq('liked', true);
    
    if (prefsError) throw prefsError;
    if (!likedNamesIds || likedNamesIds.length === 0) return [];
    
    // Luego consultamos los detalles de esos nombres
    const { data, error } = await supabase
      .from('nombres')
      .select(`
        id,
        nombre,
        cantidad,
        anio
      `)
      .in('id', likedNamesIds.map(item => item.nombre_id));

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching liked names:', error);
    return [];
  }
}

/**
 * Obtiene todos los nombres que el usuario descartó
 */
export async function getDislikedNames(user: User): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('nombre_id')
      .eq('user_id', user.id)
      .eq('liked', false);

    if (error) throw error;
    
    return data?.map(item => item.nombre_id) || [];
  } catch (error) {
    console.error('Error fetching disliked names:', error);
    return [];
  }
}

/**
 * Elimina una preferencia de nombre específica
 */
export async function removeNamePreference(
  user: User,
  nombreId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Eliminar de preferencias
    const { error: prefError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', user.id)
      .eq('nombre_id', nombreId);
    
    if (prefError) throw prefError;
    
    // Eliminar de favoritos
    const { error: favError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('nombre_id', nombreId);
    
    if (favError && favError.code !== 'PGRST116') throw favError; // Ignorar error si no existe

    return { success: true };
  } catch (error: any) {
    console.error('Error removing name preference:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Comprueba si hay match con alguna pareja
 * Retorna los matches encontrados
 */
export async function checkForMatches(
  user: User,
  nombreId: number
): Promise<any[]> {
  try {
    // 1. Buscar otros usuarios que también les guste este nombre
    const { data: userPreferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('nombre_id', nombreId)
      .eq('liked', true)
      .neq('user_id', user.id);
    
    if (prefsError) throw prefsError;
    if (!userPreferences || userPreferences.length === 0) return [];
    
    // 2. Obtener datos de perfiles para estos usuarios
    const matchUserIds = userPreferences.map(pref => pref.user_id);
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', matchUserIds);
    
    if (profilesError) throw profilesError;
    
    // 3. Combinar datos de preferencias con perfiles
    const matchesWithProfiles = userPreferences.map(pref => {
      const profile = profiles?.find(p => p.id === pref.user_id);
      return {
        user_id: pref.user_id,
        profile: profile || { full_name: null, email: null, avatar_url: null }
      };
    });
    
    // 4. Crear registros de match para cada pareja encontrada
    if (matchesWithProfiles.length > 0) {
      for (const match of matchesWithProfiles) {
        // Determinar el orden de los IDs de usuario para mantener consistencia
        const [user1Id, user2Id] = [user.id, match.user_id].sort();
        
        // Comprobar si ya existe este match
        const { data: existingMatches, error: matchQueryError } = await supabase
          .from('couple_matches')
          .select('*')
          .eq('user1_id', user1Id)
          .eq('user2_id', user2Id)
          .eq('nombre_id', nombreId);
        
        if (matchQueryError) throw matchQueryError;
        
        const existingMatch = existingMatches && existingMatches.length > 0 
          ? existingMatches[0] 
          : null;
        
        if (!existingMatch) {
          // Crear nuevo match
          await supabase
            .from('couple_matches')
            .insert({
              user1_id: user1Id,
              user2_id: user2Id,
              nombre_id: nombreId
            });
        }
      }
    }
    
    return matchesWithProfiles;
  } catch (error) {
    console.error('Error checking for matches:', error);
    return [];
  }
} 