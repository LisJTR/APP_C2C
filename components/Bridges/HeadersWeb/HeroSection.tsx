// Importamos Platform desde react-native para detectar si estamos en entorno web o móvil
import { Platform } from "react-native";

// Selección condicional del componente HeroSection según la plataforma:
// - Si la app se ejecuta en un navegador web, se importa el componente de la carpeta 'web'
// - Si se ejecuta en un entorno móvil (Android/iOS), se importa el componente de la versión App
const HeroSection = Platform.OS === "web"
  ? require("../../../components/web/HeroSection").default         // Versión web
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/HeroSectionApp").default; // Versión app

// Exportamos el componente seleccionado como default
export default HeroSection;
