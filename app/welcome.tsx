// app/welcome.tsx
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { usePathname } from "expo-router";
import AuthModal from "../components/web/ScreensModal/AuthModalWeb";
import Header from "../components/web/Header";
import HeroSection from "../components/web/HeroSection";
import ProductGrid from "../components/web/products/ProductGrid";
import Footer from "../components/web/Footer";
import { useTranslation } from "react-i18next";

export default function WelcomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

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
          <Header onLoginPress={() => setShowModal(true)} onSearch={(q) => setSearchQuery(q)} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={{ backgroundColor: "#fff" }}
          >
            <View style={styles.heroContainer}>
              <HeroSection onLoginPress={() => setShowModal(true)} />
            </View>
            <ProductGrid onProductClick={() => setShowModal(true)} searchQuery={searchQuery} />
            <Footer />
          </ScrollView>
        </>
      ) : (
        <>
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
