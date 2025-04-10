// app/welcome.tsx
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { useState, useEffect } from "react";
import { usePathname } from "expo-router";
import AuthModal from "../components/web/ScreensModal/AuthModalWeb";
import Header from "../components/web/Header";
import HeroSection from "../components/web/HeroSection";

export default function WelcomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/welcome") {
      setShowModal(false);
    }
  }, [pathname]);

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <>
          <View style={{ position: "relative", zIndex: 10 }}>
            <Header onLoginPress={() => setShowModal(true)} />
          </View>

          {/* 👇 HeroSection aquí debajo del Header */}
          <View style={styles.heroContainer}>
            <HeroSection onLoginPress={() => setShowModal(true)} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.topRight}>
            <Pressable onPress={() => setShowModal(true)}>
              <Text style={styles.loginText}>Regístrate | Inicia Sesión</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Bienvenido a Vinted Ecuador 👋</Text>
            <Text style={styles.subtitle}>
              Compra y vende ropa de segunda mano con facilidad.
            </Text>
          </View>
        </>
      )}

      <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    overflow: "visible",
  },
  topRight: {
    alignItems: "flex-end",
    padding: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  heroContainer: {
    marginTop: 20,
  },
});
