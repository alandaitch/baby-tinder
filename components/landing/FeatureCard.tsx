import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
} 