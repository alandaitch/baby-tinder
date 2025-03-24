const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wnfqepwickqdhxehyplg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZnFlcHdpY2txZGh4ZWh5cGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjg1NTEwMCwiZXhwIjoyMDU4NDMxMTAwfQ.PhzShnWegOOamKMNYChNmIqlsNLw6QUJSHwSmpY5cKY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing connection...')
  
  // Intentar insertar un registro de prueba
  const { data, error } = await supabase
    .from('nombres')
    .insert([
      {
        nombre: 'Test',
        cantidad: 1,
        anio: 2024
      }
    ])
    .select()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success! Data:', data)
  }
}

testConnection() 