import { Platform } from "react-native";

const Footer = Platform.OS === "web"
  ? require("../../web/Footer").default
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/FooterApp").default;

export default Footer;