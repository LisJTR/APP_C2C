import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "expo-router";
import AuthModal from "../components/Bridges/ModalsWeb/AuthModal";
import Header from "../components/Bridges/HeadersWeb/Header";
import HeroSection from "../components/Bridges/HeadersWeb/HeroSection";
import ProductGrid from "../components/Bridges/HeadersWeb/ProductGrid";
import Footer from "../components/Bridges/HeadersWeb/Footer";
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "@/utils/auth"; 

export default function WelcomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Si cambia la ruta, cierra el modal automáticamente
  useEffect(() => {
    if (pathname !== "/welcome") {
      setShowModal(false);
    }
  }, [pathname]);

  // Al cargar, comprobamos si ya hay sesión iniciada
  useEffect(() => {
    const check = async () => {
      const logged = await isLoggedIn();
      if (logged) {
        router.replace("/(webfrontend)"); // o "/home"
      } else {
        setLoading(false);
      }
    };
    check();
  }, []);

  // Mientras revisa si hay sesión no renderiza nada
  if (loading) return null;

   // Renderizado principal
  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <>
        {/* Versión WEB */}
          <View style={{ position: "relative", zIndex: 10 }}>
            <Header
              onLoginPress={() => setShowModal(true)}
              onSearch={(q: string) => setSearchQuery(q)}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={{ backgroundColor: "#fff" }}
          >
            <View style={styles.heroContainer}>
              <HeroSection onLoginPress={() => setShowModal(true)} />
            </View>
            {/* Grid de productos destacados */}
            <ProductGrid onProductClick={() => setShowModal(true)} />
            <Footer />
          </ScrollView>
        </>
      ) : (
        <>
        {/* Versión MÓVIL */}
          <View style={styles.topRight}>
            <Pressable onPress={() => setShowModal(true)}>
              <Text style={styles.loginText}>
                {t("welcomeScreen.register")} | {t("welcomeScreen.login")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{t("welcomeScreen.welcome")}</Text>
            <Text style={styles.subtitle}>{t("welcomeScreen.textWelcome")}</Text>
          </View>
        </>
      )}
      {/* Modal de login/registro */}
      <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 60,
    backgroundColor: "#fff",
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
    marginTop: 0,
    padding: 0,
    backgroundColor: "#fff",
  },
});
