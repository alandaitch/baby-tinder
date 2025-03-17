import React from 'react';
import TinderCard from 'react-tinder-card';

interface BabyCardProps {
  name: string;
  gender: 'male' | 'female' | 'unisex';
  origin: string;
  meaning: string;
  onSwipe: (direction: string) => void;
}

const BabyCard: React.FC<BabyCardProps> = ({ name, gender, origin, meaning, onSwipe }) => {
  // Determinar el color de fondo según el género
  const getBgColor = () => {
    switch (gender) {
      case 'male':
        return 'bg-blue-100';
      case 'female':
        return 'bg-pink-100';
      case 'unisex':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <TinderCard
      className="absolute"
      onSwipe={onSwipe}
      preventSwipe={['up', 'down']}
    >
      <div className={`w-72 h-96 rounded-2xl shadow-xl p-6 flex flex-col justify-between ${getBgColor()} transition-all duration-300 hover:shadow-2xl`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 bg-white bg-opacity-70 py-2 rounded-lg shadow-sm">{name}</h2>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Género:</span> {gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : 'Unisex'}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Origen:</span> {origin}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Significado:</span> {meaning}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer transform transition-transform hover:scale-110" onClick={() => onSwipe('left')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer transform transition-transform hover:scale-110" onClick={() => onSwipe('right')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </TinderCard>
  );
};

export default BabyCard;
