// Importamos 'Platform' desde 'react-native' para detectar si la app se está ejecutando en web o en móvil.
import { Platform } from "react-native";

// Usamos una evaluación condicional para importar dinámicamente el componente ProductGrid adecuado:
// - En entorno web, se carga el componente desde 'components/web/products/ProductGrid'.
// - En entorno móvil, se carga desde 'Bridges/HeadersApp/ProductGridApp'.
const ProductGrid = Platform.OS === "web"
  ? require("../../web/products/ProductGrid").default   // Versión web del grid de productos
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/ProductGridApp").default; // Versión móvil

// Se exporta el componente apropiado como valor por defecto.
export default ProductGrid;
