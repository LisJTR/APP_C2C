// Importamos Platform para detectar en qué entorno se ejecuta la app (web, iOS o Android)
import { Platform } from "react-native";

// Según la plataforma, asignamos un componente Footer diferente:
// - Si estamos en web, usamos el Footer de la carpeta 'web'
// - Si estamos en una app móvil, usamos FooterApp desde la carpeta de frontend móvil
const Footer = Platform.OS === "web"
  ? require("../../web/Footer").default // Footer para entorno web
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/FooterApp").default; // Footer para app móvil

// Exportamos el componente Footer ya resuelto según la plataforma actual
export default Footer;
