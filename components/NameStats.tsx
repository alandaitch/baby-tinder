import React, { useMemo } from 'react';

interface NameStatsProps {
  favorites: Array<{
    id: number;
    nombre: string;
    cantidad: number;
    anio: number;
  }>;
}

const NameStats: React.FC<NameStatsProps> = ({ favorites }) => {
  // Calcular estadísticas de popularidad
  const popularityStats = useMemo(() => {
    if (favorites.length === 0) return null;
    
    // Ordenar por popularidad (cantidad)
    const sortedByPopularity = [...favorites].sort((a, b) => b.cantidad - a.cantidad);
    
    // Obtener el más popular y el menos popular
    const mostPopular = sortedByPopularity[0];
    const leastPopular = sortedByPopularity[sortedByPopularity.length - 1];
    
    // Calcular la popularidad promedio
    const averagePopularity = Math.round(
      favorites.reduce((sum, name) => sum + name.cantidad, 0) / favorites.length
    );
    
    return { mostPopular, leastPopular, averagePopularity };
  }, [favorites]);
  
  // Calcular estadísticas por año
  const yearStats = useMemo(() => {
    if (favorites.length === 0) return null;
    
    // Contar nombres por año
    const yearCounts: Record<number, number> = {};
    favorites.forEach(name => {
      yearCounts[name.anio] = (yearCounts[name.anio] || 0) + 1;
    });
    
    // Convertir a array para ordenar
    const yearsArray = Object.entries(yearCounts).map(([year, count]) => ({
      year: parseInt(year),
      count
    }));
    
    // Ordenar por cantidad
    const sortedYears = yearsArray.sort((a, b) => b.count - a.count);
    
    return sortedYears;
  }, [favorites]);
  
  if (favorites.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas</h2>
        <p className="text-gray-600">Guarda algunos nombres para ver estadísticas.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas</h2>
      
      {popularityStats && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Popularidad</h3>
          
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Más popular:</span> {popularityStats.mostPopular.nombre} ({popularityStats.mostPopular.cantidad} nacimientos)
            </p>
            
            <p className="text-gray-600">
              <span className="font-medium">Menos popular:</span> {popularityStats.leastPopular.nombre} ({popularityStats.leastPopular.cantidad} nacimientos)
            </p>
            
            <p className="text-gray-600">
              <span className="font-medium">Popularidad promedio:</span> {popularityStats.averagePopularity} nacimientos
            </p>
          </div>
        </div>
      )}
      
      {yearStats && yearStats.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Distribución por Año</h3>
          
          <div className="space-y-2">
            {yearStats.map(yearData => (
              <div key={yearData.year} className="flex items-center">
                <span className="w-16 text-gray-700">{yearData.year}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-pink-500 h-full rounded-full" 
                    style={{ width: `${(yearData.count / favorites.length) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-gray-600 text-sm">{yearData.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NameStats;
