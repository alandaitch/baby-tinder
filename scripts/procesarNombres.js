const fs = require('fs');
const path = require('path');

// Ruta al archivo CSV y al archivo de salida
const csvPath = path.join(__dirname, '..', 'nombres-2010-2014.csv');
const outputPath = path.join(__dirname, '..', 'data', 'nombresArgentinos.js');

try {
  // Leer el archivo CSV
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split('\n');
  
  // Saltar la cabecera
  const nombres = [];
  let id = 1;
  
  // Procesar solo nombres simples (no compuestos)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [nombre, cantidad, anio] = line.split(',');
    
    // Saltar nombres compuestos (que contienen espacios)
    if (nombre.includes(' ')) continue;
    
    nombres.push({
      id: id++,
      nombre,
      cantidad: parseInt(cantidad || '0'),
      anio: parseInt(anio || '0')
    });
  }
  
  // Crear el contenido del archivo JavaScript
  const jsContent = `// Archivo generado automáticamente a partir de nombres-2010-2014.csv
// Contiene nombres argentinos sin nombres compuestos

export const nombresArgentinos = ${JSON.stringify(nombres, null, 2)};

export default nombresArgentinos;`;
  
  // Escribir el archivo JavaScript
  fs.writeFileSync(outputPath, jsContent);
  
  console.log(`Procesamiento completado. Se han extraído ${nombres.length} nombres.`);
} catch (error) {
  console.error('Error al procesar el archivo:', error);
}
