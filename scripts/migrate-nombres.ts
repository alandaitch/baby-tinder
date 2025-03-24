const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

interface Nombre {
  nombre: string
  cantidad: number
  anio: number
}

const supabaseUrl = 'https://wnfqepwickqdhxehyplg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZnFlcHdpY2txZGh4ZWh5cGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjg1NTEwMCwiZXhwIjoyMDU4NDMxMTAwfQ.PhzShnWegOOamKMNYChNmIqlsNLw6QUJSHwSmpY5cKY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateNombres() {
  console.log('Starting migration...')
  
  // Leer el archivo original
  const nombresFile = fs.readFileSync(path.join(__dirname, '../data/nombresArgentinos.js'), 'utf8')
  
  // Extraer el array de nombres usando una expresión regular
  const match = nombresFile.match(/export const nombresArgentinos = (\[[\s\S]*?\]);/)
  if (!match) {
    console.error('No se pudo encontrar el array de nombres')
    return
  }
  
  // Parsear el array de nombres
  const nombresArgentinos = JSON.parse(match[1]) as Nombre[]
  
  // Insertar los nombres en lotes de 100
  const batchSize = 100
  for (let i = 0; i < nombresArgentinos.length; i += batchSize) {
    const batch = nombresArgentinos.slice(i, i + batchSize)
    const { error } = await supabase
      .from('nombres')
      .insert(
        batch.map((nombre: Nombre) => ({
          nombre: nombre.nombre,
          cantidad: nombre.cantidad,
          anio: nombre.anio
        }))
      )
    
    if (error) {
      console.error(`Error inserting batch ${i/batchSize + 1}:`, error)
    } else {
      console.log(`Successfully inserted batch ${i/batchSize + 1} of ${Math.ceil(nombresArgentinos.length/batchSize)}`)
    }
  }
  
  console.log('Migration completed!')
}

migrateNombres() 