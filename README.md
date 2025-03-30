# Baby Tinder

Una aplicación para elegir nombres de bebés inspirada en la mecánica de Tinder. Desliza a la derecha para guardar un nombre que te gusta, o a la izquierda para descartarlo.

## Características

- **Interfaz tipo Tinder**: Desliza o haz clic en los botones para marcar nombres como favoritos o descartarlos.
- **Autenticación de usuarios**: Inicia sesión para guardar tus preferencias de nombres.
- **Persistencia de datos**: Todas tus preferencias se guardan en la base de datos.
- **Conexión entre parejas**: Conecta con tu pareja mediante códigos de invitación para comparar preferencias.
- **Coincidencias entre parejas**: Recibe notificaciones cuando tú y tu pareja coinciden en gustar el mismo nombre.
- **Estadísticas de nombres**: Ve estadísticas sobre tus nombres favoritos.

## Tecnologías utilizadas

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Supabase para autenticación y base de datos
- **Animaciones**: React Spring para deslizamientos suaves

## Estructura de la base de datos

- **profiles**: Información de los usuarios
- **nombres**: Catálogo de nombres disponibles
- **user_preferences**: Guarda si a un usuario le gusta o no un nombre
- **user_favorites**: Lista de nombres favoritos de cada usuario
- **couple_matches**: Registra cuando dos usuarios coinciden en gustar un nombre
- **invitation_codes**: Códigos para conectar parejas
- **user_relationships**: Relaciones entre usuarios (parejas)

## Cómo conectar con tu pareja

1. En la sección "Mi Pareja", genera un código de invitación.
2. Comparte este código con tu pareja.
3. La otra persona introduce el código en su perfil.
4. ¡Ya están conectados! Ahora podrán ver las coincidencias en sus preferencias de nombres.

## Instalación

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Uso

1. Inicia sesión con tu correo electrónico
2. Conecta con tu pareja usando el sistema de códigos
3. Explora los nombres deslizando a la derecha (me gusta) o a la izquierda (no me gusta)
4. Revisa tu lista de nombres favoritos
5. Ve a la sección "Coincidencias" para ver qué nombres les gustaron a ambos

## Próximas características

- Filtrado de nombres por popularidad o año
- Categorización de nombres por origen
- Modo oscuro

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
