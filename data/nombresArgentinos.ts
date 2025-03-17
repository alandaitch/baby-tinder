// Archivo de nombres argentinos procesados
import { NombreArgentino } from '../types/types';

// Importamos los datos del archivo JS generado por el script
import { nombresArgentinos as nombresData } from './nombresArgentinos.js';

// Tipamos los datos correctamente
export const nombresArgentinos: NombreArgentino[] = nombresData.map(nombre => ({
  id: nombre.id,
  nombre: nombre.nombre,
  cantidad: nombre.cantidad || 0, // Aseguramos que cantidad nunca sea null
  anio: nombre.anio
}));
