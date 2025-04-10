import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/useAuthStore"; // Asegura la ruta correcta
import { useTranslation } from "react-i18next";



export default function ProfileScreen() {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username || ""); // ✅ Agregado
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("profile.title")}</Text>
      <Text style={styles.subtitle}>{t("profile.subtitle")}</Text>
      
      {/* Campo para editar nombre de usuario */}
      <TextInput
        style={styles.input}
        placeholder={t("profile.placeholder")}
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
