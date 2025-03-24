'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authStyles } from './AuthStyles'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { signInWithMagicLink } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      setMessage(null)
      setLoading(true)
      await signInWithMagicLink(email)
      setMessage('¡Revisa tu email! Te hemos enviado un enlace mágico para iniciar sesión.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al enviar el enlace')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={authStyles.form}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className={authStyles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authStyles.input}
            placeholder="tu@email.com"
          />
        </div>
      </div>

      {error && (
        <div className={authStyles.errorText}>{error}</div>
      )}

      {message && (
        <div className="text-green-600 text-sm mt-2 bg-green-50 p-3 rounded-md">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={authStyles.button}
      >
        {loading ? (
          <>
            <svg className={authStyles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2">Enviando enlace mágico...</span>
          </>
        ) : (
          'Enviar enlace mágico'
        )}
      </button>
    </form>
  )
} 