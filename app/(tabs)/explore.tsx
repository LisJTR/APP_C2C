import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { ALL_CATEGORIES } from "@/constants/categories";
import { useAuthStore } from "../../store/useAuthStore";

export default function ExploreScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, invitado } = useAuthStore();
  const [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(() => {
    console.log("✅ ExploreScreen");
    console.log("👉 user:", user);
    console.log("👉 invitado:", invitado);
  }, []);

    useEffect(() => {
  let isMounted = true;

  if (!user && invitado) {
    setTimeout(() => {
      if (isMounted) {
        setShowAccessModal(true); // Mostrar modal en lugar de redirigir
      }
    }, 0);
  }

  return () => {
    isMounted = false; // Evita que el alert y router se disparen si ya cambiaste de pantalla
  };
}, []);

  const categories = ALL_CATEGORIES.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t("explore.searchPlaceholder")}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.title}>{t("explore.title")}</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              router.push({ pathname: "/category/[category]", params: { category: item.key } })
            }

          >
            <Text style={styles.categoryText}>{item.label}</Text>
          </TouchableOpacity>
        )}

      />

      {showAccessModal && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Acceso restringido</Text>
          <Text style={styles.modalText}>
            Debes registrarte o iniciar sesión para continuar.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowAccessModal(false);
              useAuthStore.getState().setInvitado(false);
              router.replace("/screens/WelcomeScreenMobile");
            }}
          >
            <Text style={styles.modalLink}>Registrate ahora</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}


    </View>
    
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  categoryButton: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "500",
  },
  modalOverlay: {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},
modalContainer: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
  width: "80%",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},
modalText: {
  fontSize: 16,
  textAlign: "center",
  marginBottom: 10,
},
modalLink: {
  color: "#2F70AF",
  fontWeight: "bold",
  textDecorationLine: "underline",
  fontSize: 16,
},

});
