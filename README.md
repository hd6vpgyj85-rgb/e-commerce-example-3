# NET.LY — catálogo con panel de administración en Firebase

E-commerce de catálogo (Next.js + Tailwind) con panel de administración para publicar
productos y colecciones en Firebase. Los clientes arman su carrito y al finalizar
se abre WhatsApp con el detalle del pedido para acordar un punto medio de recogida
— no hay pago en línea.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Firebase: Firestore (productos, colecciones, pedidos), Authentication (acceso del
  administrador), Storage (imágenes)

## Desarrollo local

```bash
npm install
npm run dev
```

Sin variables de entorno de Firebase configuradas, el sitio carga igual (catálogo
vacío) para poder revisar el diseño. Para probar con datos reales, configura Firebase
como se indica abajo.

## Configurar Firebase

1. **Crear el proyecto**: entra a [console.firebase.google.com](https://console.firebase.google.com/)
   y crea un proyecto nuevo (o usa uno existente).
2. **Habilitar Authentication**: en el proyecto, ve a *Build → Authentication →
   Sign-in method* y habilita el proveedor **Correo/contraseña**. Luego, en la
   pestaña *Users*, crea manualmente el usuario del administrador (correo y
   contraseña) — con esa cuenta se entra a `/admin`.
3. **Habilitar Firestore**: *Build → Firestore Database → Create database* (modo
   producción, cualquier región).
4. **Habilitar Storage**: *Build → Storage → Get started* (para las imágenes de
   productos y colecciones).
5. **Registrar una app web**: en *Project settings → General → Your apps*, agrega
   una app web y copia sus credenciales (`apiKey`, `authDomain`, etc.).
6. **Variables de entorno**: copia `.env.example` a `.env.local` y llena los valores
   con las credenciales del paso anterior:

   ```bash
   cp .env.example .env.local
   ```

7. **Reglas de seguridad e índices**: con la [Firebase CLI](https://firebase.google.com/docs/cli)
   instalada y sesión iniciada (`firebase login`), enlaza este proyecto y despliega
   las reglas incluidas en el repo:

   ```bash
   firebase use --add        # selecciona tu proyecto de Firebase
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

   Las reglas (`firestore.rules`, `storage.rules`) dejan lectura pública solo para
   productos/colecciones marcados como visibles, y restringen la escritura y la
   lectura de pedidos a la cuenta autenticada del administrador.

Con esto, `npm run dev` ya debería conectar con tu proyecto real: entra a
`/admin/login`, inicia sesión con el usuario que creaste, y empieza a publicar
colecciones y productos.

## Emuladores de Firebase (opcional, para desarrollo sin tocar datos reales)

```bash
firebase emulators:start --only auth,firestore,storage
```

Y en `.env.local` agrega:

```
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

## Modelo de datos

- **collections**: `name`, `slug`, `imageUrl`, `order`, `visible`
- **products**: `name`, `slug`, `description`, `price`, `discountPrice`, `stock`,
  `images[]`, `collectionIds[]`, `variants[]` (`{ name, options[] }`), `visible`
- **orders**: `items[]`, `total`, `status` (`pendiente` / `contactado` /
  `completado`), `contactMessage`, `createdAt` — se crea automáticamente cuando un
  cliente confirma el checkout.

Cada colección creada en `/admin/colecciones` con `visible: true` aparece de forma
automática en el menú desplegable del sitio y en `/coleccion/[slug]`.

## Despliegue

El proyecto es una app Next.js estándar: se puede desplegar en
[Vercel](https://vercel.com) (recomendado, cero configuración) o en Firebase
Hosting usando la [integración de Next.js de Firebase](https://firebase.google.com/docs/hosting/frameworks/nextjs).
En ambos casos, configura las mismas variables de entorno de `.env.local` en el
panel del proveedor de hosting.
