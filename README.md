# Tinta — Directorio de tatuadores

App en Next.js (App Router) + Tailwind con perfiles de tatuadores: foto, contacto,
galería de trabajos, estilos y lista de precios por tamaño, con buscador y filtros
por tipo de tatuaje, ciudad y presupuesto. Cada tatuador se registra con su cuenta
de Google y carga su propio perfil desde `/panel` — los datos viven en Supabase
(Postgres + Auth + Storage), no en el código.

## Setup de Supabase (una vez)

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com).
2. Andá a **SQL Editor** y corré, en orden:
   - [supabase/schema.sql](supabase/schema.sql) — tablas, RLS, storage y el
     trigger que crea el perfil al primer login.
   - [supabase/seed.sql](supabase/seed.sql) — opcional, carga los 8 tatuadores
     de ejemplo (quedan sin dueño, nadie los puede editar) para que el
     directorio no arranque vacío.
3. Habilitá el login con Google:
   - En [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
     creá credenciales OAuth 2.0 de tipo "Aplicación web".
   - En **Authorized redirect URIs** poné la URL de callback de **Supabase**
     (no la de esta app): `https://<tu-proyecto>.supabase.co/auth/v1/callback`
     (la encontrás en Supabase → Authentication → Providers → Google).
   - Copiá el Client ID y Client Secret a Supabase → Authentication →
     Providers → Google, y activá el provider.
   - En Supabase → Authentication → URL Configuration, agregá
     `http://localhost:3000/**` (y tu dominio de producción cuando lo tengas)
     a las Redirect URLs.
4. Copiá `.env.local.example` a `.env.local` y completá con los datos de
   Supabase → Settings → API:

```bash
cp .env.local.example .env.local
```

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## Correr en local

```bash
npm install
npm run dev       # http://localhost:3000
```

Otros comandos:

```bash
npm run build     # build de producción
npm start         # servir el build
node scripts/generar-imagenes.mjs   # regenera los placeholders de public/img
```

## Cómo cargan su perfil los tatuadores

Ya no se edita en código. Cada tatuador entra a `/login`, inicia sesión con
Google (se le crea un perfil vacío automáticamente con un slug único) y desde
`/panel` completa:

- Foto de perfil.
- Datos: nombre, ciudad, estudio, bio, años de experiencia, contacto
  (Instagram, WhatsApp, email, web).
- Tipos de tatuaje que hace (tags libres — alimentan los filtros del
  directorio solos).
- Precios por tamaño (`pequeno`, `mediano`, `grande`, `sesion` — etiquetas y
  descripciones en [data/tatuadores.ts](data/tatuadores.ts)).
- Fotos de trabajos (portafolio), con título y estilo por foto.

Row Level Security en Supabase garantiza que cada tatuador solo puede editar
su propio perfil, precios y trabajos.

## Fotos

Las imágenes actuales son placeholders SVG generados por
[scripts/generar-imagenes.mjs](scripts/generar-imagenes.mjs). Para usar fotos reales:

1. Copiá los archivos a `public/img/perfil/` y `public/img/trabajos/`.
2. Apuntá `foto` e `imagen` a esas rutas (`/img/perfil/mi-foto.jpg`).
3. Usá imágenes cuadradas de ~1000×1000 px; las tarjetas y la galería recortan a cuadrado.

## Deploy en Vercel

Opción rápida, desde esta carpeta:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # producción
```

Opción con Git (recomendada, hace deploy en cada push):

1. `git init && git add . && git commit -m "Primera versión"`
2. Creá un repo vacío en GitHub y `git push`.
3. En [vercel.com/new](https://vercel.com/new) importá el repo.
4. Cargá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en las
   Environment Variables del proyecto en Vercel.
5. Agregá la URL de producción a Supabase → Authentication → URL
   Configuration → Redirect URLs (`https://tu-dominio.vercel.app/**`).

## Estructura

```
app/
  layout.tsx                     header, footer y estilos globales
  page.tsx                       home: hero + directorio (lee Supabase, ISR)
  tatuadores/[slug]/page.tsx     perfil de cada tatuador (lee Supabase, ISR)
  login/page.tsx                 botón de login con Google
  panel/page.tsx                 dashboard del tatuador (protegido)
  auth/callback/route.ts         intercambia el code de OAuth por sesión
  auth/signout/route.ts          cierra sesión
components/
  Directorio.tsx                 buscador, filtros y grilla de resultados
  TarjetaTatuador.tsx            tarjeta de la grilla
  Galeria.tsx                    galería con visor a pantalla completa
  NavAuth.tsx                    "Ingresar" / "Mi panel" según sesión
  panel/                         formularios del dashboard (perfil, foto,
                                  estilos, precios, portafolio)
data/tatuadores.ts               tipos y constantes (Tamano, Precio, Tatuador…)
lib/data/tatuadores.ts           acceso a datos (Supabase → forma Tatuador)
lib/filtros.ts                   búsqueda, filtrado, orden y formato de precios
lib/supabase/                    clientes de Supabase (browser, server, middleware)
supabase/schema.sql              tablas, RLS, storage y trigger de alta
supabase/seed.sql                datos demo opcionales
```

## Próximos pasos posibles

- Reflejar los filtros en la URL (`?estilo=realismo&max=80000`) para poder compartir búsquedas.
- Formulario de contacto/turnos por perfil.
- Reordenar fotos del portafolio (drag & drop) y editar título/estilo después de subidas.
