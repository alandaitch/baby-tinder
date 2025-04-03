'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function StatCard({ value, label, suffix = '', prefix = '', duration = 2000 }: StatCardProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const countUp = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(countUp);
      }
    };
    
    animationFrame = requestAnimationFrame(countUp);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
        <span ref={countRef}>{prefix}{count.toLocaleString()}{suffix}</span>
      </div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      value: 150000,
      label: 'Nombres explorados',
      suffix: '+'
    },
    {
      value: 82,
      label: 'Parejas encuentran un nombre en menos de una semana',
      suffix: '%'
    },
    {
      value: 5000,
      label: 'Coincidencias encontradas',
      suffix: '+'
    },
    {
      value: 4.9,
      label: 'Calificación promedio',
      suffix: '/5'
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Los números hablan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Baby Swiper en cifras que demuestran su efectividad
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              value={stat.value} 
              label={stat.label} 
              suffix={stat.suffix}
              prefix={stat.prefix}
              duration={2000 + index * 500}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 