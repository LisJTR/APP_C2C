// app/email-verification/[email].tsx
import EmailVerification from "@/components/web/ScreensModal/EmailVerification";
import { useLocalSearchParams } from "expo-router";

export default function EmailVerificationPage() {
  const { email } = useLocalSearchParams();

  if (typeof email !== "string") return null;

  return <EmailVerification email={email} />;
}
