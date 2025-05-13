// components/Bridges/HeadersWeb/Header.tsx:
import { Platform } from "react-native";

const Header = Platform.OS === "web"
  ? require("../../web/Header").default
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/HeaderApp").default;

export default Header;