import { Platform } from "react-native";

const EmailVerification =
  Platform.OS === "web"
   ? require("../../web/ScreensModal/EmailVerification").default
    : require("../../../app/(webfrontend)/Bridges/HeadersApp/EmailVerificationApp").default;

export default EmailVerification;