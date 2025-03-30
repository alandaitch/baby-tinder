'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPartner } from '@/lib/relationshipService';
import { getMatchesWithPartner } from '@/lib/nameService';
import PartnerPreferencesCompare from '@/components/PartnerPreferencesCompare';
import Link from 'next/link';

export default function MatchesPage() {
  const { user, loading } = useAuth();
  const [partner, setPartner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Cargar información de la pareja
  useEffect(() => {
    const loadPartnerInfo = async () => {
      if (!loading && user) {
        setIsLoading(true);
        try {
          // Obtener información de la pareja
          const { partner, error: partnerError } = await getUserPartner(user);
          
          if (partnerError) {
            throw new Error(partnerError);
          }
          
          if (!partner) {
            setError('No tienes una pareja conectada. Conecta con tu pareja primero.');
            setIsLoading(false);
            return;
          }
          
          setPartner(partner);
        } catch (error: any) {
          console.error('Error loading partner info:', error);
          setError(error.message || 'Error al cargar la información de la pareja');
        } finally {
          setIsLoading(false);
        }
      } else if (!loading) {
        setIsLoading(false);
      }
    };
    
    loadPartnerInfo();
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-800 mb-4">Inicia sesión para ver tus matches</div>
        <Link href="/auth" className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Coincidencias</h1>
        
        <div className="bg-red-100 text-red-800 p-6 rounded-lg shadow-md mb-6">
          <p>{error}</p>
        </div>
        
        <Link href="/partner" className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition">
          Conectar con Pareja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Preferencias con <span className="text-pink-600">{partner.full_name || partner.email}</span>
      </h1>
      
      <PartnerPreferencesCompare user={user} />
      
      <div className="mt-8 flex justify-center">
        <Link href="/" className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition shadow-md">
          Explorar Más Nombres
        </Link>
      </div>
    </div>
  );
} 