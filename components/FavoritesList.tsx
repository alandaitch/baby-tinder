import React from 'react';
import { FiX } from 'react-icons/fi';
import { NombreArgentino } from '@/types/types';

interface FavoritesListProps {
  favorites: NombreArgentino[];
  onRemove: (id: number) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onRemove }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Nombres Favoritos</h2>
      
      {favorites.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-600 mb-3">Aún no has guardado ningún nombre favorito.</p>
          <p className="text-sm text-gray-500">Desliza a la derecha o haz clic en el corazón para guardar nombres que te gusten.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {favorites.map((baby) => (
            <li 
              key={baby.id} 
              className="flex justify-between items-center p-3 bg-pink-50 rounded-md hover:bg-pink-100 transition"
            >
              <div>
                <span className="font-medium text-gray-800">{baby.nombre}</span>
                <span className="text-sm text-gray-600 ml-2">({baby.cantidad} en {baby.anio})</span>
              </div>
              <button 
                onClick={() => onRemove(baby.id)}
                className="p-1 text-red-500 hover:text-red-700 transition"
                aria-label={`Eliminar ${baby.nombre}`}
              >
                <FiX size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;
