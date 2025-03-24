'use client'

import SignInForm from '@/components/auth/SignInForm'
import { authStyles } from '@/components/auth/AuthStyles'

export default function AuthPage() {
  return (
    <div className={authStyles.container}>
      <div className={authStyles.formContainer}>
        <div>
          <h1 className={authStyles.title}>
            Baby Tinder
          </h1>
          <h2 className={authStyles.subtitle}>
            Ingresa tu email para recibir un enlace mágico y comenzar a buscar el nombre perfecto
          </h2>
        </div>

        <SignInForm />
      </div>
    </div>
  )
} 