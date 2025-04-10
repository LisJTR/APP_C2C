import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Image } from "react-native";


type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  imageUrl: string; 
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("mujer");
  const [products, setProducts] = useState<Product[]>([]);


  const categories = [
    { key: "mujer", label: t("home.category.woman") },
    { key: "hombre", label: t("home.category.man") },
    { key: "ninos", label: t("home.category.kids") },
    { key: "hogar", label: t("home.category.home") },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // IMPORTANTE: cambiar esta URL por la del servidor en producción (por ejemplo, https://api.midominio.com)
        const res = await axios.get("http://192.168.1.35:5000/api/products", {
          params: {
            category: selectedCategory,
            query: query,
          },
        });
        setProducts(res.data); // <-- Asegúrate que el backend responde con un array
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

    {/*TÍTULO DE LA SECCIÓN DE PRODUCTOS */}
    <Text style={styles.sectionTitle}>{t("home.newProducts")}</Text>

      <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.productImage} 
          /> 
          <Text>{item.price}€</Text>
          <Text>{item.size}</Text>
        </View>
  )}
/>

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
  },
  categoryText: {
    fontSize: 16,
    color: "#888",
    paddingVertical: 5,
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
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
});
