'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
    // Aquí podrías emitir un evento o usar un contexto para notificar al resto de la app
    window.dispatchEvent(new CustomEvent('toggleFavorites', { detail: { showFavorites: !showFavorites } }))
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Baby Tinder
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:flex ml-6 space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium"
                >
                  Explorar
                </Link>
                <Link 
                  href="/partner" 
                  className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium"
                >
                  Mi Pareja
                </Link>
                <Link 
                  href="/matches" 
                  className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium"
                >
                  Coincidencias
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={toggleFavorites}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {showFavorites ? 'Ver Tarjetas' : 'Ver Favoritos'}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block">{user.email}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/partner"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mi Pareja
                      </Link>
                      <Link
                        href="/matches"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Coincidencias
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
} 