// app/email-verification/[email].tsx
import { Platform } from "react-native";

const EmailVerification =
  Platform.OS === "web"
    ? require("../../components/Bridges/ModalsWeb/EmailVerification").default
    : require("../../components/Bridges/Mobile/EmailVerificationApp").default;
import { useLocalSearchParams } from "expo-router";

export default function EmailVerificationPage() {
  const { email } = useLocalSearchParams();

  if (typeof email !== "string") return null;

  return <EmailVerification email={email} />;
}