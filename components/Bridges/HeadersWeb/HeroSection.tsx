import { Platform } from "react-native";

const HeroSection = Platform.OS === "web"
  ? require("../../../components/web/HeroSection").default
  : require("../../../app/(webfrontend)/Bridges/HeadersApp/HeroSectionApp").default;

export default HeroSection;