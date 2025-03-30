-- Función de depuración para comprobar cuántas preferencias tiene un usuario
CREATE OR REPLACE FUNCTION debug_check_user_prefs(user_uuid UUID)
RETURNS TABLE (
  preference_count BIGINT,
  liked_count BIGINT,
  disliked_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    count(*) as preference_count,
    sum(CASE WHEN liked = true THEN 1 ELSE 0 END) as liked_count,
    sum(CASE WHEN liked = false THEN 1 ELSE 0 END) as disliked_count
  FROM user_preferences
  WHERE user_id = user_uuid;
$$; 