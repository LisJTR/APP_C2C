import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import Header from "@/components/Bridges/HeadersWeb/Header";
import Footer from "@/components/Bridges/HeadersWeb/Footer";
import ProductGrid from "@/components/Bridges/HeadersWeb/ProductGrid";
import AuthModal from "@/components/Bridges/ModalsWeb/AuthModal";
import { useState } from "react";

export default function SearchPage() {
  const { query } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <>
          <View style={{ position: "relative", zIndex: 10 }}>
            <Header onLoginPress={() => setShowModal(true)} onSearch={() => {}} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Resultados para: {query}</Text>
            <ProductGrid searchQuery={query as string} onProductClick={() => setShowModal(true)} />
            <Footer />
            <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
          </ScrollView>
        </>
      ) : (
        <Text style={styles.title}>Resultados para: {query}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
