// Importamos el módulo 'Platform' de React Native, el cual permite determinar si la app se está ejecutando en entorno web o móvil.
import { Platform } from "react-native";

// Definimos el componente 'EmailVerification' usando importación condicional:
// - Si la plataforma es web, se importa la versión ubicada en 'components/web/ScreensModal/EmailVerification'.
// - Si la plataforma es móvil (por ejemplo, Android o iOS), se importa desde 'Bridges/HeadersApp/EmailVerificationApp'.
const EmailVerification =
  Platform.OS === "web"
    ? require("../../web/ScreensModal/EmailVerification").default   // Componente para entorno web
    : require("../../../app/(webfrontend)/Bridges/HeadersApp/EmailVerificationApp").default; // Componente para móvil

// Exportamos el componente que corresponde según la plataforma, permitiendo su uso en otras partes de la aplicación.
export default EmailVerification;
