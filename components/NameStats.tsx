import React from 'react';

interface BabyName {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  origin: string;
  meaning: string;
}

interface NameStatsProps {
  favorites: BabyName[];
}

const NameStats: React.FC<NameStatsProps> = ({ favorites }) => {
  // Calcular estadísticas
  const totalNames = favorites.length;
  const maleNames = favorites.filter(name => name.gender === 'male').length;
  const femaleNames = favorites.filter(name => name.gender === 'female').length;
  const unisexNames = favorites.filter(name => name.gender === 'unisex').length;

  // Agrupar por origen
  const originCounts: Record<string, number> = {};
  favorites.forEach(name => {
    originCounts[name.origin] = (originCounts[name.origin] || 0) + 1;
  });

  // Ordenar orígenes por cantidad
  const sortedOrigins = Object.entries(originCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Top 3 orígenes

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Distribución por género</h3>
        <div className="flex h-6 rounded-full overflow-hidden">
          {totalNames > 0 ? (
            <>
              <div 
                className="bg-blue-400" 
                style={{ width: `${(maleNames / totalNames) * 100}%` }}
                title={`Masculino: ${maleNames}`}
              />
              <div 
                className="bg-pink-400" 
                style={{ width: `${(femaleNames / totalNames) * 100}%` }}
                title={`Femenino: ${femaleNames}`}
              />
              <div 
                className="bg-purple-400" 
                style={{ width: `${(unisexNames / totalNames) * 100}%` }}
                title={`Unisex: ${unisexNames}`}
              />
            </>
          ) : (
            <div className="bg-gray-200 w-full" />
          )}
        </div>
        <div className="flex text-sm mt-1 text-gray-600 justify-between">
          <span>Masculino: {maleNames}</span>
          <span>Femenino: {femaleNames}</span>
          <span>Unisex: {unisexNames}</span>
        </div>
      </div>

      {totalNames > 0 && (
        <div>
          <h3 className="font-medium mb-2">Orígenes más comunes</h3>
          <ul className="space-y-1">
            {sortedOrigins.map(([origin, count]) => (
              <li key={origin} className="flex justify-between">
                <span>{origin}</span>
                <span className="text-gray-600">{count} {count === 1 ? 'nombre' : 'nombres'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NameStats;
