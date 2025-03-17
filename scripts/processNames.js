const fs = require('fs');
const path = require('path');

// Lista de nombres comúnmente masculinos y femeninos para determinar el género
const commonMaleNames = [
  'Benjamin', 'Bautista', 'Joaquín', 'Juan', 'Santiago', 'Santino', 'Valentino', 
  'Mateo', 'Agustín', 'Francisco', 'Tomàs', 'Felipe', 'Lautaro', 'Ignacio', 
  'Facundo', 'Maximo', 'Nicolas', 'Thiago', 'Valentin', 'Matias', 'Martin', 
  'Franco', 'Bruno', 'Pedro', 'Lucas', 'Simon', 'Manuel', 'Lorenzo', 'Benicio', 
  'Ramiro', 'Tiziano', 'Dante', 'Julian', 'Luciano', 'Sebastian', 'Gonzalo', 
  'Luca', 'Ciro', 'Salvador', 'Jeremias', 'Federico'
];

const commonFemaleNames = [
  'Sofia', 'Martina', 'Valentina', 'Catalina', 'Delfina', 'Isabella', 'Julieta', 
  'Victoria', 'Josefina', 'Morena', 'Lucía', 'Juana', 'Camila', 'Guadalupe', 
  'Mia', 'Emma', 'Jazmin', 'Lola', 'Agustina', 'Pilar', 'Alma', 'Emilia', 
  'Renata', 'Malena', 'Olivia', 'Bianca', 'Julia', 'Milagros', 'Lara', 'Mora', 
  'Candela', 'Uma', 'Clara', 'Abril', 'Guillermina', 'Paloma', 'Antonella', 
  'Paulina', 'Francesca', 'Micaela'
];

// Orígenes comunes para nombres argentinos
const origins = [
  'Español', 'Italiano', 'Hebreo', 'Latín', 'Griego', 'Germánico', 
  'Inglés', 'Francés', 'Árabe', 'Indígena', 'Celta'
];

// Significados comunes (simplificados)
const meanings = {
  'masculino': [
    'Bendecido por Dios', 'Fuerte y valiente', 'Protector', 'Regalo de Dios', 
    'Victorioso', 'Amado', 'Luz', 'Noble', 'Sabio', 'Justo', 'Pacífico', 
    'Trabajador', 'Líder', 'Guerrero', 'Leal', 'Generoso'
  ],
  'femenino': [
    'Sabiduría', 'Bella', 'Amada', 'Luz', 'Gracia de Dios', 'Pura', 'Victoriosa', 
    'Luminosa', 'Protectora', 'Noble', 'Valiente', 'Dulce', 'Pacífica', 'Fértil', 
    'Melodiosa', 'Generosa'
  ]
};

// Función para determinar el género de un nombre
function determineGender(name) {
  // Extraer el primer nombre para casos como "Juan Ignacio"
  const firstName = name.split(' ')[0];
  
  if (commonMaleNames.some(male => firstName.toLowerCase() === male.toLowerCase())) {
    return 'male';
  } else if (commonFemaleNames.some(female => firstName.toLowerCase() === female.toLowerCase())) {
    return 'female';
  } else {
    // Si termina en 'a' es más probable que sea femenino, si termina en 'o' probablemente masculino
    if (firstName.endsWith('a')) {
      return 'female';
    } else if (firstName.endsWith('o')) {
      return 'male';
    } else {
      // Para nombres que no podemos determinar fácilmente, asignamos aleatoriamente
      return Math.random() > 0.5 ? 'male' : 'female';
    }
  }
}

// Función para obtener un origen aleatorio
function getRandomOrigin() {
  return origins[Math.floor(Math.random() * origins.length)];
}

// Función para obtener un significado aleatorio basado en el género
function getRandomMeaning(gender) {
  const meaningList = gender === 'male' ? meanings.masculino : meanings.femenino;
  return meaningList[Math.floor(Math.random() * meaningList.length)];
}

// Leer el archivo CSV
const csvPath = path.join(__dirname, '..', 'nombres-2010-2014.csv');
const outputPath = path.join(__dirname, '..', 'data', 'argentineNames.ts');

try {
  // Leer el archivo CSV
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split('\n');
  
  // Saltar la cabecera
  const namesMap = new Map();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [name, count, year] = line.split(',');
    if (!name) continue;
    
    // Actualizar el contador para este nombre
    if (namesMap.has(name)) {
      const currentCount = namesMap.get(name);
      namesMap.set(name, currentCount + parseInt(count || '0'));
    } else {
      namesMap.set(name, parseInt(count || '0'));
    }
  }
  
  // Convertir el mapa a un array y ordenar por popularidad
  const sortedNames = Array.from(namesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100); // Tomar los 100 nombres más populares
  
  // Crear la estructura de datos para nuestra aplicación
  const argentineNames = sortedNames.map(([name, count], index) => {
    const gender = determineGender(name);
    return {
      id: index + 1,
      name,
      gender,
      origin: getRandomOrigin(),
      meaning: getRandomMeaning(gender),
      popularity: count
    };
  });
  
  // Crear el contenido del archivo TypeScript
  const tsContent = `interface BabyName {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  origin: string;
  meaning: string;
  popularity?: number;
}

export const argentineNames: BabyName[] = ${JSON.stringify(argentineNames, null, 2)};

export default argentineNames;`;
  
  // Escribir el archivo TypeScript
  fs.writeFileSync(outputPath, tsContent);
  
  console.log(`Procesamiento completado. Se han extraído los ${argentineNames.length} nombres más populares.`);
} catch (error) {
  console.error('Error al procesar el archivo:', error);
}
