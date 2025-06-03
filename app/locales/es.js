import { changeLanguage } from "i18next";

export default {
    tab: {
      home: "Inicio",
      explore: "Explorar",
      profile: "Perfil",
    },
    explore: {
      title: "Explorar Categorías",
      searchPlaceholder: "Buscar categorías...",
      categories: {
        clothes: "👕 Ropa",
        shoes: "👟 Zapatos",
        accessories: "🎒 Accesorios",
        electronics: "📱 Electrónica",
        home: "🏠 Hogar",
        petss: "🐶 Mascotas",
        woman: "🙍 Mujer",
        man: "🙍‍♂️ Hombre",
        children: "👶 Niños",
      },
    },
    home:{
      welcome: "¡Bienvenido!",
      subtitle: "Compra y vende ropa fácilmente",
      search: "Buscar",
      category: {
        woman: "Mujer",
        man: "Hombre",
        kids: "Niños",
        home: "Hogar",
      },
      newProducts: "PRODUCTOS NUEVOS"
    },
    profile: {
      title: "👤 Perfil",
      subtitle: "Aquí puedes ver y editar tu información.",
      placeholder: "Nombre de usuario",
    },
    auth: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      username: "Nombre de usuario",
      skip: "Saltar",
      noAccount: "¿No tienes cuenta? Regístrate",
      haveAccount: "¿Ya tienes cuenta? Inicia sesión",
      requiredFields: "Todos los campos son obligatorios.",
      shortPassword: "La contraseña debe tener al menos 6 caracteres.",
      loginSuccess: "Inicio de sesión exitoso",
      loginError: "Credenciales incorrectas.",
      registerSuccess: "Registro exitoso",
      registerError: "No se pudo registrar.",
      messageSuccess: "Ya puedes iniciar sesión"
    },
    loginScreen: {
      userTitle: "Usuario",
      placeholderUser: "Nombre de usuario o e-mail",
      placeholderPassword: "Contraseña",
      invalidEmail: "El correo no es válido",
      emptyField: "Este campo no puede estar vacío",
      loginBtn: "Inicia sesión",
      forgotPassword: "¿Olvidaste tu contraseña?",
      needHelp: "¿Necesitas ayuda?",
      loginError: "Credenciales incorrectas."
    },
    registerScreen: {
      title: "Regístrate",
      usernamePlaceholder: "Nombre de usuario",
      emailPlaceholder: "E-mail",
      passwordPlaceholder: "Contraseña",
      errorUsernameEmpty: "El nombre de usuario no puede quedar en blanco",
      errorUsernameInvalid: "Solo puede incluir letras y números",
      errorUsernameLength: "Debe tener entre 3 y 20 caracteres",
      errorEmailEmpty: "Introduce e-mail para continuar",
      errorEmailInvalid: "E-mail es incorrecto",
      errorPasswordEmpty: "La contraseña no puede quedar en blanco",
      errorPasswordShort: "Debe tener al menos 6 caracteres",
      offers: "Quiero recibir ofertas personalizadas y novedades por e-mail.",
      terms: "Al registrarme, confirmo que acepto los Términos y condiciones, he leído la Política de privacidad y tengo al menos 18 años.",
      registerBtn: "Regístrate",
      needHelp: "¿Necesitas ayuda?",
      registerError: "No se pudo registrar."
    },
    welcomeScreenMobile: {
      register: "Regístrate en KCL",
      begin:"Usa tu cuenta para comenzar",
      continueGoogle:"Continuar con Google",
      continueFacebook:"Continuar con Facebook",
      continueEmail:"Continuar con Email",
      skip: "Saltar",
      changeLanguage:"Cambiar idioma",
      save:"Guardar",
      close:"cerrar sesion",
      textInf:"Únete y vende  artículos que no necesitas",
      textCreateProfile:"Crea tu perfil en KCL Trading",
      textPlatform:"Nuestra plataforma",
      haveAnAccount:"Ya tengo una cuenta",
      about: " Sobre KCL Trading:",
      errorlogin: "Error al iniciar sesión con Google",
      errorLoginGoogle: "Error en login con Google",
      

    },
    welcomeScreen: {
      register: "Regístrate", 
      login: "Iniciar Sesión",
      welcome: "¡Bienvenido!",
      textWelcome: "Compra y vende ropa de segunda mano con facilidad",
    },
    messages: {
      title: "Mensajes",
      subtitle: "Aquí verás todas tus conversaciones",
    },
    sell: {
      title: "Vende un producto",
      subtitle: "Publica lo que ya no usas",
    },
    category: {
      title: "Productos en: {{category}}",
      empty: "No hay productos en esta categoría todavía"
    }
    
  };
  