// Importamos Platform para detectar si la app se está ejecutando en entorno web o nativo (Android/iOS)
import { Platform } from "react-native";

// Según la plataforma, asignamos el componente Header correspondiente:
// - En entorno web, se carga el Header desde la carpeta 'web'
// - En entorno móvil (app), se carga HeaderApp desde la ruta correspondiente
const Header = Platform.OS === "web"
  ? require("../../web/Header").default       // Header para la versión web
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/HeaderApp").default; // Header para app móvil

// Exportamos el Header seleccionado para que pueda ser utilizado como componente común
export default Header;
