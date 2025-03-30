'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateInvitationCode, redeemInvitationCode, getUserPartner, disconnectPartner } from '@/lib/relationshipService';
import Link from 'next/link';

export default function PartnerPage() {
  const { user, loading } = useAuth();
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [partner, setPartner] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar información de la pareja al iniciar
  useEffect(() => {
    const loadPartnerInfo = async () => {
      if (!loading && user) {
        setIsLoading(true);
        try {
          const { partner } = await getUserPartner(user);
          setPartner(partner);
        } catch (error) {
          console.error('Error loading partner info:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!loading) {
        setIsLoading(false);
      }
    };
    
    loadPartnerInfo();
  }, [user, loading]);

  // Generar un código de invitación
  const handleGenerateCode = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    setError('');
    setSuccess('');
    
    try {
      const { code, error } = await generateInvitationCode(user);
      
      if (error) {
        setError(error);
      } else {
        setInvitationCode(code);
        setSuccess('Código generado correctamente');
      }
    } catch (error: any) {
      setError(error.message || 'Error al generar código');
    } finally {
      setIsGenerating(false);
    }
  };

  // Conectar con otro usuario usando un código
  const handleConnectPartner = async () => {
    if (!user || !codeInput.trim()) return;
    
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      const { success, error } = await redeemInvitationCode(user, codeInput.trim());
      
      if (error) {
        setError(error);
      } else if (success) {
        setSuccess('Conexión establecida correctamente');
        setCodeInput('');
        
        // Recargar la información de la pareja
        const { partner } = await getUserPartner(user);
        setPartner(partner);
      }
    } catch (error: any) {
      setError(error.message || 'Error al conectar con la pareja');
    } finally {
      setIsConnecting(false);
    }
  };

  // Desconectar de la pareja actual
  const handleDisconnect = async () => {
    if (!user || !partner) return;
    
    if (!window.confirm('¿Estás seguro de que quieres desvincularte de tu pareja?')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { success, error } = await disconnectPartner(user);
      
      if (error) {
        setError(error);
      } else if (success) {
        setSuccess('Te has desvinculado de tu pareja');
        setPartner(null);
      }
    } catch (error: any) {
      setError(error.message || 'Error al desvincularse');
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar código al portapapeles
  const handleCopyCode = () => {
    navigator.clipboard.writeText(invitationCode);
    setSuccess('Código copiado al portapapeles');
  };

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
        <div className="text-lg text-gray-800 mb-4">Inicia sesión para conectar con tu pareja</div>
        <Link href="/auth" className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Conectar con tu Pareja</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          {success}
        </div>
      )}
      
      {partner ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tu Pareja</h2>
          <div className="flex items-center space-x-4">
            {partner.avatar_url && (
              <img 
                src={partner.avatar_url} 
                alt={partner.full_name || 'Avatar'} 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="text-lg font-medium">{partner.full_name || partner.email}</p>
              {partner.email && <p className="text-gray-600">{partner.email}</p>}
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Desvincularse
            </button>
            
            <Link href="/matches" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Ver Coincidencias
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generar Código</h2>
            <p className="text-gray-600 mb-4">
              Genera un código y compártelo con tu pareja para conectarse.
            </p>
            
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition disabled:opacity-50"
            >
              {isGenerating ? 'Generando...' : 'Generar Código'}
            </button>
            
            {invitationCode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu código de invitación:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={invitationCode}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-900 transition"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Este código expira en 7 días.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Conectar con Pareja</h2>
            <p className="text-gray-600 mb-4">
              Introduce el código que recibiste de tu pareja.
            </p>
            
            <div className="mb-4">
              <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-1">
                Código de invitación:
              </label>
              <input
                id="code-input"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Introduce el código"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              onClick={handleConnectPartner}
              disabled={isConnecting || !codeInput.trim()}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50"
            >
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 