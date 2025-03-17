import React from 'react';

interface BabyName {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  origin: string;
  meaning: string;
}

interface FavoritesListProps {
  favorites: BabyName[];
  onRemove: (id: number) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onRemove }) => {
  if (favorites.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Aún no has guardado ningún nombre favorito.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Nombres Favoritos</h2>
      <ul className="space-y-2">
        {favorites.map((baby) => (
          <li 
            key={baby.id} 
            className={`p-3 rounded-lg flex justify-between items-center ${
              baby.gender === 'male' 
                ? 'bg-blue-50' 
                : baby.gender === 'female' 
                  ? 'bg-pink-50' 
                  : 'bg-purple-50'
            }`}
          >
            <div>
              <span className="font-medium">{baby.name}</span>
              <p className="text-sm text-gray-600">{baby.meaning}</p>
            </div>
            <button 
              onClick={() => onRemove(baby.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
