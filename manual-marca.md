# Manual de Marca - Baby Swiper

Este documento define las directrices visuales y de estilo para la aplicación Baby Swiper. El objetivo es mantener una identidad de marca coherente en toda la aplicación y materiales relacionados.

## 1. Logotipo y Favicon

- **Logotipo Principal**: El texto "Baby Swiper" con la tipografía principal y el gradiente de marca.
- **Favicon**: Un icono cuadrado con esquinas redondeadas, fondo blanco y las letras "BS" en la tipografía principal con el gradiente de marca. Se proporcionan versiones en `.svg`, `.ico` y `.png` (para `apple-touch-icon`).

## 2. Paleta de Colores

La paleta de colores busca ser amigable, moderna y transmitir confianza y emoción.

### 2.1. Colores Principales (Gradiente)

Se utiliza un gradiente lineal como elemento principal de la marca.

- **Rosa Principal**: `#ec4899` (Equivalente a `pink-500` en Tailwind)
- **Azul Principal**: `#3b82f6` (Equivalente a `blue-500` en Tailwind)
- **Dirección del Gradiente**: Generalmente de izquierda a derecha (`to-r`) o de arriba-izquierda a abajo-derecha (`to-br`).

### 2.2. Colores de Acento

Se usan para CTAs (Call to Actions) y elementos destacados.

- **Rosa Acento (Hover/Active)**: `#db2777` (Equivalente a `pink-600`)
- **Azul Acento (Hover/Active)**: `#2563eb` (Equivalente a `blue-600`)
- **Verde (Match/Éxito)**: `#10b981` (Equivalente a `green-500`) y sus variantes más claras como `#d1fae5` (`green-100`).
- **Rojo (Descarte/Error)**: `#ef4444` (Equivalente a `red-500`) y sus variantes más claras como `#fee2e2` (`red-100`).

### 2.3. Colores Neutros

Para fondos, texto y elementos de interfaz generales.

- **Blanco**: `#ffffff`
- **Gris Claro (Fondos)**: `#f9fafb` (Equivalente a `gray-50`)
- **Gris Medio (Bordes/Fondos Secundarios)**: `#e5e7eb` (Equivalente a `gray-200`), `#d1d5db` (`gray-300`)
- **Gris Oscuro (Texto)**: `#6b7280` (Equivalente a `gray-500`), `#4b5563` (`gray-600`), `#374151` (`gray-700`)
- **Negro (Texto Principal/Énfasis)**: `#1f2937` (Equivalente a `gray-800`), `#11182c` (`gray-900`)

## 3. Tipografía

La tipografía debe ser clara, legible y amigable.

- **Fuente Principal**: **Inter** (Importada a través de `next/font/google`). Se utiliza para la mayoría del texto, incluyendo cuerpo, botones y elementos de interfaz.
- **Fuente para Títulos (Opcional)**: Aunque actualmente se usa Inter en negrita para títulos, se podría considerar una fuente sans-serif redondeada y amigable como **Quicksand** o **Nunito** para títulos principales si se desea diferenciar más. Por ahora, mantener **Inter Bold**.

### 3.1. Pesos y Estilos

- **Normal**: `400`
- **Medio**: `500` (para botones, labels)
- **Semi-Bold**: `600` (para subtítulos)
- **Bold**: `700` (para títulos principales)

## 4. Iconografía

Se prefiere un estilo de iconos de línea (outline), limpio y moderno.

- **Librería Recomendada**: **Heroicons** (`@heroicons/react`) o **React Icons** (`react-icons`). Actualmente se usan SVGs directamente o de Heroicons. Mantener la consistencia en el estilo de línea (`strokeWidth={1.5}` o `strokeWidth={2}` según el tamaño).
- **Color de Iconos**: Generalmente usar colores neutros (`gray-500`, `gray-700`) o los colores principales (Rosa/Azul) para iconos destacados o dentro de elementos coloreados.

## 5. Parámetros Generales de Diseño

- **Bordes Redondeados**: Uso generoso de bordes redondeados (`rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`) para botones, tarjetas e inputs, transmitiendo suavidad y amigabilidad.
- **Sombras**: Sombras sutiles (`shadow-sm`, `shadow-md`, `shadow-lg`) para dar profundidad a tarjetas y elementos elevados. Evitar sombras muy duras.
- **Botones**:
    - **Primarios**: Fondo con gradiente Rosa-Azul, texto blanco, `rounded-full`. Efecto `hover` intensificando los colores del gradiente y/o con `scale-105`.
    - **Secundarios**: Fondo blanco, borde de color neutro o principal, texto del color principal.
    - **Iconos**: Redondos, con fondo claro (`*-100`) y color del icono principal (`*-500`).
- **Tarjetas**: Fondo blanco o gris muy claro (`gray-50`), `rounded-xl`, `shadow-sm` o `shadow-md`.
- **Espaciado**: Uso consistente del sistema de espaciado de Tailwind (`p-4`, `p-6`, `mb-4`, `space-x-4`, etc.). Mantener buena legibilidad y aire entre elementos.
- **Animaciones**: Sutiles y funcionales (`transition`, `hover:scale`, `animate-ping` para notificaciones). Deben mejorar la experiencia sin ser distractivas.

## 6. Tono de Voz

- **Amigable y Cercano**: Usar un lenguaje claro, sencillo y positivo.
- **Empático**: Reconocer la emoción y la importancia de elegir un nombre.
- **Moderno**: Evitar formalismos excesivos.
- **Inclusivo**: Dirigirse a "parejas" o "futuros padres" de forma general.

---

*Este manual debe ser revisado y actualizado a medida que la aplicación evoluciona.* 