import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const login = useAuthStore((state) => state.login);

  // 🔹 Cargar sesión desde SecureStore
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        setToken(storedToken ?? null);
      } catch (error) {
        console.error("Error cargando el token:", error);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  // 🔹 Redirigir a la pantalla de autenticación si el usuario no ha iniciado sesión
  useEffect(() => {
    if (!loading && !token) {
      router.replace("/auth"); // Redirige a la pantalla de autenticación
    }
  }, [loading, token]);

  // 🔹 Mostrar pantalla de carga mientras se verifica la sesión
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* ✅ Si el usuario no ha iniciado sesión, se le redirige a "/auth" */}
      <Stack.Screen name="auth/index" options={{ headerShown: false }} />
      {/* ✅ Si el usuario ha iniciado sesión, se muestra la navegación principal */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
