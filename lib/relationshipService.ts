import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

/**
 * Genera un código de invitación para un usuario
 */
export async function generateInvitationCode(user: User): Promise<{ code: string; error?: string }> {
  try {
    // Verificar si el usuario ya tiene un código activo
    const { data: existingCodes, error: queryError } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('creator_user_id', user.id)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString());

    if (queryError) throw queryError;

    // Si existe un código activo, devolverlo
    if (existingCodes && existingCodes.length > 0) {
      return { code: existingCodes[0].code };
    }

    // Generar un nuevo código
    const code = nanoid(8); // Código de 8 caracteres
    
    // Establecer fecha de expiración (7 días)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Guardar el código en la base de datos
    const { error: insertError } = await supabase
      .from('invitation_codes')
      .insert({
        creator_user_id: user.id,
        code,
        expires_at: expiresAt.toISOString(),
        used: false
      });
    
    if (insertError) throw insertError;
    
    return { code };
  } catch (error: any) {
    console.error('Error generating invitation code:', error);
    return { code: '', error: error.message };
  }
}

/**
 * Redime un código de invitación para conectar con otro usuario
 */
export async function redeemInvitationCode(user: User, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar el código en la base de datos
    const { data: codes, error: queryError } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString());
    
    if (queryError) throw queryError;
    
    // Verificar si el código existe y es válido
    if (!codes || codes.length === 0) {
      return { success: false, error: 'El código de invitación no es válido o ha expirado' };
    }
    
    const invitationCode = codes[0];
    
    // Verificar que el usuario no esté intentando usar su propio código
    if (invitationCode.creator_user_id === user.id) {
      return { success: false, error: 'No puedes usar tu propio código de invitación' };
    }
    
    // Obtener los IDs de usuario
    const currentUserId = user.id;
    const invitationCreatorId = invitationCode.creator_user_id;
    
    // Ordenar los IDs para mantener consistencia en la tabla
    // El ID menor será siempre user1_id y el mayor será user2_id
    let user1Id, user2Id;
    if (currentUserId < invitationCreatorId) {
      user1Id = currentUserId;
      user2Id = invitationCreatorId;
    } else {
      user1Id = invitationCreatorId;
      user2Id = currentUserId;
    }
    
    // Verificar si ya existe una relación entre estos usuarios
    const { data: existingRelationships, error: relationshipQueryError } = await supabase
      .from('user_relationships')
      .select('*')
      .eq('user1_id', user1Id)
      .eq('user2_id', user2Id);
    
    if (relationshipQueryError) throw relationshipQueryError;
    
    // Si ya existe una relación, no crear una nueva
    if (existingRelationships && existingRelationships.length > 0) {
      // Marcar el código como usado de todos modos
      await supabase
        .from('invitation_codes')
        .update({ used: true })
        .eq('id', invitationCode.id);
      
      return { success: true };
    }
    
    // Crear la relación entre los usuarios
    const { error: insertError } = await supabase
      .from('user_relationships')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        status: 'active'
      });
    
    if (insertError) throw insertError;
    
    // Marcar el código como usado
    const { error: updateError } = await supabase
      .from('invitation_codes')
      .update({ used: true })
      .eq('id', invitationCode.id);
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error redeeming invitation code:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene la información de la pareja del usuario
 */
export async function getUserPartner(user: User): Promise<{ partner: any; error?: string }> {
  try {
    console.log('getUserPartner called with user ID:', user.id);
    
    // Buscar relaciones donde el usuario es user1 o user2
    const query = `user1_id.eq.${user.id},user2_id.eq.${user.id}`;
    console.log('Relationship query condition:', query);
    
    const { data: relationships, error: queryError } = await supabase
      .from('user_relationships')
      .select('*')
      .or(query)
      .eq('status', 'active');
    
    console.log('Relationship query result:', { relationships, error: queryError });
    
    if (queryError) throw queryError;
    
    // Si no hay relaciones, el usuario no tiene pareja
    if (!relationships || relationships.length === 0) {
      console.log('No relationships found for user:', user.id);
      return { partner: null };
    }
    
    const relationship = relationships[0];
    console.log('Found relationship:', relationship);
    
    // Identificar el ID de la pareja
    const partnerId = relationship.user1_id === user.id 
      ? relationship.user2_id 
      : relationship.user1_id;
    
    console.log('Partner ID identified:', partnerId);
    
    // Obtener los detalles del perfil de la pareja
    const { data: partner, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', partnerId)
      .single();
    
    console.log('Partner profile query result:', { partner, error: profileError });
    
    if (profileError) throw profileError;
    
    return { partner };
  } catch (error: any) {
    console.error('Error getting user partner:', error);
    return { partner: null, error: error.message };
  }
}

/**
 * Verifica si dos usuarios están vinculados como pareja
 */
export async function areUsersPartners(userId1: string, userId2: string): Promise<boolean> {
  try {
    // Ordenar los IDs para consistencia
    const [user1Id, user2Id] = [userId1, userId2].sort();
    
    // Buscar la relación en la base de datos
    const { data, error } = await supabase
      .from('user_relationships')
      .select('*')
      .eq('user1_id', user1Id)
      .eq('user2_id', user2Id)
      .eq('status', 'active');
    
    if (error) throw error;
    
    // Si hay datos, los usuarios son pareja
    return !!(data && data.length > 0);
  } catch (error) {
    console.error('Error checking user relationship:', error);
    return false;
  }
}

/**
 * Desvincula a dos usuarios que estaban conectados como pareja
 */
export async function disconnectPartner(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar relaciones donde el usuario es user1 o user2
    const { data: relationships, error: queryError } = await supabase
      .from('user_relationships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('status', 'active');
    
    if (queryError) throw queryError;
    
    // Si no hay relaciones, no hay nada que hacer
    if (!relationships || relationships.length === 0) {
      return { success: true };
    }
    
    // Cambiar el estado de la relación a 'inactive'
    const { error: updateError } = await supabase
      .from('user_relationships')
      .update({ status: 'inactive' })
      .eq('id', relationships[0].id);
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error disconnecting partner:', error);
    return { success: false, error: error.message };
  }
} 