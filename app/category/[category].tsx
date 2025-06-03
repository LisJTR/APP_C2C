import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,  Modal,
Pressable, } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import { API_BASE_URL } from "@/utils/config"; // Usa esto
import { Product } from "@/types/Product";
import { useRouter } from "expo-router"; 



const sizeOptions = ["XS", "S", "M", "L", "XL"];
const conditionOptions = ["Nuevo", "Muy bueno", "Bueno", "Aceptable"];

export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null);

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);

  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    if (category) {
      const key = `explore.categories.${category}`;
      const translated = t(key);
      
      const finalTitle =
        typeof translated === "string" && !translated.startsWith("explore.categories.")
          ? translated
          : "Categoría";
  
      navigation.setOptions({
        title: finalTitle,
        headerShown: true,
        headerBackTitle: "atrás",
      });
    }
  }, [category, t]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`, {
          params: { category },
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error al cargar productos por categoría", error);
      }
    };
  
    if (category) fetchProducts();
  }, [category]);
  

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => (selectedSize ? product.size === selectedSize : true))
    .filter((product) =>
      selectedCondition ? product.condition === selectedCondition : true
    )
    .sort((a, b) => {
      if (!priceOrder) return 0;
      return priceOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t("explore.searchPlaceholder")}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filtros */}
      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={() => setShowSizeModal(true)}>
          <Text style={styles.filterBtn}>
            Talla: {selectedSize ?? "Todas"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowConditionModal(true)}>
          <Text style={styles.filterBtn}>
            Estado: {selectedCondition ?? "Todos"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setPriceOrder(priceOrder === "asc" ? "desc" : "asc")
          }
        >
          <Text style={styles.filterBtn}>
            Precio {priceOrder === "asc" ? "↓" : priceOrder === "desc" ? "↑" : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de talla */}
      <Modal transparent visible={showSizeModal} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowSizeModal(false)}>
          <View style={styles.modalContent}>
            {sizeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedSize(option === selectedSize ? null : option);
                  setShowSizeModal(false);
                }}
              >
                <Text style={styles.modalItem}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Modal de estado */}
      <Modal transparent visible={showConditionModal} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowConditionModal(false)}>
          <View style={styles.modalContent}>
            {conditionOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedCondition(option === selectedCondition ? null : option);
                  setShowConditionModal(false);
                }}
              >
                <Text style={styles.modalItem}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Productos */}
      <FlatList
          data={filteredProducts}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
      <View style={styles.card}>
        {item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.productImage} />
        )}
        <Text style={styles.name}>{item.title}</Text>
        <Text>{item.price} €</Text>
        <Text>{item.size}</Text>
        <Text>{item.condition}</Text>
      </View>
    </TouchableOpacity>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
      {t("category.empty")}
    </Text>
  }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  filterBtn: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "600",
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  productImage: {
     width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 8,
    marginBottom: 8,
  },
});