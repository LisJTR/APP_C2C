# Backend API 

Este proyecto es el back-end de la aplicación C2C, desarrollado con Node.js y Express. 
Utiliza PostgreSQL como base de datos, **alojada y gestionada en Supabase (platoforma Baas en la nube).
Nota: La estructura tiene capa de abstracción, por lo tanto si en un futuro se desea migrar de Supabase a otra plataforma (como Firebase, Railway o AWS), bastaria con actualizar el URI en el archivo `.env`.

## Tecnologías

- **Node.js** + **Express**
- **PostgreSQL** (via Supabase)
- **JWT** para autenticación
- **bcryptjs** para encriptar contraseñas
- **dotenv** para variables de entorno
- **axios** para llamadas externas (ej: Google)
- **React Native** (Frontend conectado con esta API)

## 📁 Estructura

- `config/db.js`: configuración de conexión a la base de datos.
- `controllers/authRoutes.js`: registro, login, login con Google.
- `controllers/userRoutes.js`: perfil, actualización y eliminación de usuario.
- `middlewares/authMiddleware.js`: Verifica tokens JWT en rutas protegidas
- `prisma/schema.prisma`: Definición del modelo prismas (actualmente NO utilziado)
- `.env`: Variables de entorno
- `.gitignore`:  Archivo para introducir herramientas que no se desean utilizar
- `server.js`: Punto de entrada del servidor
- `testDb.js`: Script para probar conexión a la base de datos de prueba
- `package.json`: Dependencias y scripts

## Comnados útiles

```bash

npm install     # Instalar dependencias
npm start       # Iniciar servidor en http://localhost:5000

```

## Rutas de la API

### Autenticación (/api/auth)

#### POST - /register - Registro de usuario



#### POST - /login - Iniciarr sesión con email o usuarname 


#### POST - /google - Login con cuenta de Google

#### POST - /facebook - Login con cuenta de Facebook
 
### Usuario (/api/users)

Nota: La autentificación se hace mediante JWT 
      Envia el token en el header: Authorization: Bearer <token>

GET - /profile - Obtener perfil del usuario
PUT - /update - Actualizar nombre/email
DELETE - /delete - Eliminar cuenta 







