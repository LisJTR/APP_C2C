import { Platform } from "react-native";

const ProductGrid = Platform.OS === "web"
  ? require("../../web/products/ProductGrid").default
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/ProductGridApp").default;

export default ProductGrid;