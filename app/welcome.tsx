// app/welcome.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import AuthModal from "../components/AuthModal";

export default function WelcomeScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Botón arriba a la derecha */}
      <View style={styles.topRight}>
        <Pressable onPress={() => setShowModal(true)}>
          <Text style={styles.loginText}>Regístrate | Inicia Sesión</Text>
        </Pressable>
      </View>

      {/* Contenido de bienvenida */}
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a Vinted Ecuador 👋</Text>
        <Text style={styles.subtitle}>Compra y vende ropa de segunda mano con facilidad.</Text>
      </View>

      <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", paddingHorizontal: 40 },
});
