// Importamos 'Platform' desde 'react-native' para detectar si la aplicación se ejecuta en web o en entorno móvil.
import { Platform } from "react-native";

// Según la plataforma, importamos dinámicamente el componente modal de autenticación:
// - En entorno web, se utiliza el componente desde 'components/web/ScreensModal/AuthModalWeb'.
// - En entorno móvil, se usa el componente desde 'Bridges/ModalsApp/AuthModalApp'.
const AuthModal =
  Platform.OS === "web"
    ? require("../../web/ScreensModal/AuthModalWeb").default   // Versión web del modal
    : require("../../../app/(webfrontend)/Bridges/ModalsApp/AuthModalApp").default; // Versión móvil del modal

// Se exporta el componente adecuado para su uso en otras partes de la aplicación.
export default AuthModal;
