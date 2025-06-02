//app/tabs/home.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import { ALL_CATEGORIES } from "@/constants/categories";
import { Product } from "@/types/Product";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";


export default function HomeScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAccessModal, setShowAccessModal] = useState(false); 

  const { user, invitado } = useAuthStore();
  const router = useRouter();

  const categories = ALL_CATEGORIES.filter((cat) =>
    ["ropa", "calzado", "accesorios", "hogar"].includes(cat.key)
  );
   const buildFullImageUrl = (relativePath: string) => {
  if (relativePath.startsWith("/uploads")) {
    const BASE_SERVER_URL = API_BASE_URL.replace("/api", "");
    return `${BASE_SERVER_URL}${relativePath}`;
  }
  return relativePath;
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params: Record<string, any> = { query };
        if (selectedCategory) params.category = selectedCategory;

        const res = await axios.get(`${API_BASE_URL}/products`, { params });
        setProducts(res.data);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t("home.search")}
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.categoriesContainer}>
        <Text
          key="all"
          onPress={() => setSelectedCategory(null)}
          style={[
            styles.categoryText,
            selectedCategory === null && styles.categoryTextSelected,
          ]}
        >
          {t("Todo")}
        </Text>

        {categories.map((cat) => (
          <Text
            key={cat.key}
            onPress={() => setSelectedCategory(cat.key)}
            style={[
              styles.categoryText,
              selectedCategory === cat.key && styles.categoryTextSelected,
            ]}
          >
            {cat.label}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t("home.newProducts")}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => {
              if (!user && invitado) {
                setShowAccessModal(true);
                return;
              }
              router.push(`/product/${item.id}`);
            }}
          >
            <Text style={styles.productTitle}>{item.title}</Text>
            {item.image_url && (
              <Image source={{ uri: buildFullImageUrl(item.image_url) }} style={styles.productImage} />

            )}
            <Text>{item.price}€</Text>
            <Text>{item.size}</Text>
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
                router.push("/screens/WelcomeScreenMobile");
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
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
    flexWrap: "wrap",
  },
  categoryText: {
    fontSize: 16,
    color: "#888",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  categoryTextSelected: {
    color: "#2F70AF",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#2F70AF",
  },
  productCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: "48%",
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
