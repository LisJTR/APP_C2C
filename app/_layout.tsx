// app/_layout.tsx
import { Stack, useRouter, useRootNavigationState, useSegments } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { StyleSheet } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

// Muestra la pantalla de carga hasta que se carguen las fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const { user, invitado } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigation = useRootNavigationState();

   useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  //  Redirige solo si está logueado (NO invitado) y está en Welcome
   useEffect(() => {
    if (!rootNavigation?.key) return;

     const estaEnWelcome = segments.join("/").includes("welcome");

    // Solo redirige si está logueado, no como invitado, y está en pantalla Welcome
    if (user && !invitado && estaEnWelcome) {
      router.replace("/(tabs)/home");
    }
  }, [rootNavigation?.key, user, invitado, segments]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/WelcomeScreenMobile" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
