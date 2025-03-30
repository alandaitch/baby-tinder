-- Función para obtener los nombres que le gustan a un usuario
CREATE OR REPLACE FUNCTION get_liked_names(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  nombre VARCHAR,
  descripcion VARCHAR,
  origen VARCHAR,
  genero VARCHAR
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT n.id, n.nombre, n.descripcion, n.origen, n.genero
  FROM nombres n
  JOIN user_preferences up ON n.id = up.nombre_id
  WHERE up.user_id = user_uuid AND up.liked = true;
$$;

-- Función para obtener los nombres que no le gustan a un usuario
CREATE OR REPLACE FUNCTION get_disliked_names(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  nombre VARCHAR,
  descripcion VARCHAR,
  origen VARCHAR,
  genero VARCHAR
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT n.id, n.nombre, n.descripcion, n.origen, n.genero
  FROM nombres n
  JOIN user_preferences up ON n.id = up.nombre_id
  WHERE up.user_id = user_uuid AND up.liked = false;
$$;

-- Función para obtener todos los matches entre dos usuarios
CREATE OR REPLACE FUNCTION get_couple_matches(user1_uuid UUID, user2_uuid UUID)
RETURNS TABLE (
  id UUID,
  nombre VARCHAR,
  descripcion VARCHAR,
  origen VARCHAR,
  genero VARCHAR
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT n.id, n.nombre, n.descripcion, n.origen, n.genero
  FROM nombres n
  JOIN user_preferences up1 ON n.id = up1.nombre_id
  JOIN user_preferences up2 ON n.id = up2.nombre_id
  WHERE up1.user_id = user1_uuid AND up2.user_id = user2_uuid
    AND up1.liked = true AND up2.liked = true;
$$; 