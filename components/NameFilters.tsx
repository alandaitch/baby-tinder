import React from 'react';

interface NameFiltersProps {
  genderFilter: string;
  setGenderFilter: (gender: string) => void;
}

const NameFilters: React.FC<NameFiltersProps> = ({ genderFilter, setGenderFilter }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Filtrar por género</h3>
      <div className="flex space-x-2">
        <button
          onClick={() => setGenderFilter('all')}
          className={`px-4 py-2 rounded-full ${
            genderFilter === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setGenderFilter('male')}
          className={`px-4 py-2 rounded-full ${
            genderFilter === 'male'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          Masculino
        </button>
        <button
          onClick={() => setGenderFilter('female')}
          className={`px-4 py-2 rounded-full ${
            genderFilter === 'female'
              ? 'bg-pink-500 text-white'
              : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
          }`}
        >
          Femenino
        </button>
        <button
          onClick={() => setGenderFilter('unisex')}
          className={`px-4 py-2 rounded-full ${
            genderFilter === 'unisex'
              ? 'bg-purple-500 text-white'
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
        >
          Unisex
        </button>
      </div>
    </div>
  );
};

export default NameFilters;
