// app/index.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { getToken } from "@/utils/storage";
import { useTranslation } from "react-i18next";



export default function IndexRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const redirect = async () => {
      const token = await getToken("userToken");

      // Si no hay token => usuario NO logueado
      if (!token) {
        if (Platform.OS === "web") {
          router.replace("./welcome");
        } else {
          router.replace("/screens/WelcomeScreenMobile");
        }
      } else {
        // Si hay token => usuario logueado, lo mandamos al home principal
        router.replace("./(tabs)");
      }
    };

    redirect();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
