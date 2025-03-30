import { supabase } from '@/lib/supabase';
import { NombreArgentino } from '@/types/types';
import { User } from '@supabase/supabase-js';
import { getUserPartner } from './relationshipService';

/**
 * Guarda la preferencia de un usuario sobre un nombre (like o dislike)
 */
export async function saveNamePreference(
  user: User, 
  nombre: NombreArgentino, 
  liked: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar que el nombre exista en la base de datos
    const { data: nombreExistente, error: nombreError } = await supabase
      .from('nombres')
      .select('id')
      .eq('id', nombre.id)
      .single();
    
    if (nombreError) {
      console.error('Error verificando existencia del nombre:', nombreError);
      
      // Si el nombre no existe en la base de datos, intentar insertarlo
      if (nombreError.code === 'PGRST116') { // No data found
        const { error: insertNombreError } = await supabase
          .from('nombres')
          .insert({
            id: nombre.id,
            nombre: nombre.nombre,
            cantidad: nombre.cantidad,
            anio: nombre.anio
          });
        
        if (insertNombreError) {
          throw new Error(`El nombre no existe en la base de datos y no se pudo crear: ${insertNombreError.message}`);
        }
      } else {
        throw nombreError;
      }
    }
    
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
    // Primero, obtener información de la pareja del usuario
    const { partner, error: partnerError } = await getUserPartner(user);
    
    if (partnerError) throw new Error(partnerError);
    
    // Si el usuario no tiene pareja, no buscar coincidencias
    if (!partner) return [];
    
    // Verificar si a la pareja también le gusta este nombre
    const { data: partnerPreferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', partner.id)
      .eq('nombre_id', nombreId)
      .eq('liked', true);
    
    if (prefsError) throw prefsError;
    
    if (!partnerPreferences || partnerPreferences.length === 0) {
      // No hay match con la pareja
      return [];
    }
    
    // Hay un match, registrarlo en la tabla de coincidencias
    // Determinar el orden de los IDs de usuario para mantener consistencia
    const [user1Id, user2Id] = [user.id, partner.id].sort();
    
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
    
    // Retornar información de la pareja
    return [{
      user_id: partner.id,
      profile: partner
    }];
  } catch (error) {
    console.error('Error checking for matches:', error);
    return [];
  }
}

/**
 * Obtiene los nombres que han gustado a ambos miembros de la pareja
 */
export async function getMatchesWithPartner(user: User): Promise<{
  matches: NombreArgentino[];
  error?: string;
}> {
  try {
    // 1. Obtener información de la pareja
    const { partner, error: partnerError } = await getUserPartner(user);
    
    if (partnerError) throw new Error(partnerError);
    
    // Si el usuario no tiene pareja, retornar un array vacío
    if (!partner) return { matches: [] };
    
    // 2. Obtener los IDs de nombres que le gustan al usuario actual
    const { data: userLikes, error: userLikesError } = await supabase
      .from('user_preferences')
      .select('nombre_id')
      .eq('user_id', user.id)
      .eq('liked', true);
    
    if (userLikesError) throw userLikesError;
    
    // Si el usuario no tiene nombres que le gusten, retornar un array vacío
    if (!userLikes || userLikes.length === 0) return { matches: [] };
    
    const userLikedIds = userLikes.map(like => like.nombre_id);
    
    // 3. Obtener los IDs de nombres que le gustan a la pareja
    const { data: partnerLikes, error: partnerLikesError } = await supabase
      .from('user_preferences')
      .select('nombre_id')
      .eq('user_id', partner.id)
      .eq('liked', true);
    
    if (partnerLikesError) throw partnerLikesError;
    
    // Si la pareja no tiene nombres que le gusten, retornar un array vacío
    if (!partnerLikes || partnerLikes.length === 0) return { matches: [] };
    
    const partnerLikedIds = partnerLikes.map(like => like.nombre_id);
    
    // 4. Encontrar las coincidencias (nombres que le gustan a ambos)
    const matchedIds = userLikedIds.filter(id => partnerLikedIds.includes(id));
    
    if (matchedIds.length === 0) return { matches: [] };
    
    // 5. Obtener los detalles completos de los nombres que coinciden
    const { data: matchedNames, error: matchedNamesError } = await supabase
      .from('nombres')
      .select('*')
      .in('id', matchedIds);
    
    if (matchedNamesError) throw matchedNamesError;
    
    return { matches: matchedNames || [] };
  } catch (error: any) {
    console.error('Error getting matches with partner:', error);
    return { matches: [], error: error.message };
  }
} 