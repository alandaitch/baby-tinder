-- Create the nombres table
CREATE TABLE nombres (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on nombre for faster searches
CREATE INDEX nombres_nombre_idx ON nombres(nombre);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nombres_updated_at
    BEFORE UPDATE ON nombres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a table for user favorites
CREATE TABLE user_favorites (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_id INTEGER REFERENCES nombres(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, nombre_id)
);

-- Enable RLS
ALTER TABLE nombres ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Nombres are viewable by everyone" ON nombres
    FOR SELECT USING (true);

CREATE POLICY "User favorites are viewable by the owner" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);
