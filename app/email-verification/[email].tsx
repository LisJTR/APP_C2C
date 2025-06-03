// app/email-verification/[email].tsx
import { useLocalSearchParams } from "expo-router";
import { Platform } from "react-native";

export default function EmailVerificationPage() {
  const { email } = useLocalSearchParams();

  if (typeof email !== "string") return null;

  const EmailVerification =
    Platform.OS === "web"
      ? require("@/components/Bridges/ModalsWeb/EmailVerification").default
      : require("@/components/Bridges/Mobile/EmailVerificationApp").default;

  return <EmailVerification email={email} />;
}
