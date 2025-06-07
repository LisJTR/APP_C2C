###  APP Multiplataforma 👕📱  

Este proyecto consiste en el desarrollo de una **plataforma de compra-venta de productos entre usuarios**, permitiendo publicar productos, gestionar perfiles de usuario, realizar búsquedas y visualizar detalles de los artículos disponibles.

####  Objetivo  
Crear una aplicación funcional para la **compra y venta de productos de segunda mano**, donde los usuarios puedan:  

- **Publicar artículos en venta** 📸  
- **Explorar productos disponibles** 🔍  
- **Contactar con vendedores** 💬  
- **Realizar transacciones seguras** 💳  

### 💡 Tecnologías utilizadas  

##### 🖥️ **Frontend**  
- React Native + Expo Router  

##### 🗄️ **Estado global**  
- Zustand  

##### ⚙️ **Backend**  
- Node.js + Express  

##### 🗃️ **Base de datos**  
- PostgreSQL  

##### 🔐 **Autenticación**  
- JWT + SecureStore  

##### 💳 **Pagos**  
- MercadoPago  



### 📥 Instalación y ejecución  

##### 1️⃣ Clonar el proyecto  

```sh
git clone https://github.com/usuario/proyecto.git
cd proyecto
nmp install
npx expo start
```


###  Funciones Principales

##### 🔐 Autenticación  
- Los usuarios pueden **registrarse** e **iniciar sesión** utilizando credenciales seguras, también se ha implementado para dispositivos móviles poder saltar esos pasos e iniciar la navegación en la aplicación registrarse.
- Se utiliza **JWT (JSON Web Token)** para autenticar sesiones.  
- Los tokens de usuario se almacenan de forma segura en **SecureStore** en móviles y en **LocalStorage** en la web.  

##### 🧭 Navegación  
- Implementada con **Expo Router**, permitiendo una experiencia fluida y organizada.  
- Soporta **navegación con pestañas** (Home, Explorar, Perfil).  
- Compatible con **dispositivos móviles (Android/iOS) y Web**.  

##### 💾 Almacenamiento de Datos  
- La información de los usuarios y productos se guarda en **PostgreSQL**.  
- Se utiliza **Zustand** para la gestión del estado global en el frontend.  
- Los datos del usuario permanecen sincronizados en **diferentes dispositivos** (móvil y web).  
