import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image } from "react-native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import { ALL_CATEGORIES } from "@/constants/categories";
import { Product } from "@/types/Product";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const categories = ALL_CATEGORIES.filter((cat) =>
    ["ropa", "calzado", "accesorios", "hogar"].includes(cat.key)
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params: Record<string, any> = { query };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

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
          <View style={styles.productCard}>
            <Text style={styles.productTitle}>{item.title}</Text>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.productImage} />
            )}
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
