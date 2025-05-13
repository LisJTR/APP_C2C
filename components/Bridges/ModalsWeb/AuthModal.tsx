// components/Bridges/ModalsWeb/AuthModal.tsx
import { Platform } from "react-native";

const AuthModal =
  Platform.OS === "web"
    ? require("../../web/ScreensModal/AuthModalWeb").default
    : require("../../../app/(webfrontend)/Bridges/ModalsApp/AuthModalApp").default;

export default AuthModal;