import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/useAuthStore"; // Asegura la ruta correcta

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username || ""); // ✅ Agregado

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil</Text>
      <Text style={styles.subtitle}>Aquí puedes ver y editar tu información.</Text>
      
      {/* Campo para editar nombre de usuario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    width: "80%",
  },
});
