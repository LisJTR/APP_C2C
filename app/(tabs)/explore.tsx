import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

const categories = [
  { id: "1", name: "👕 Ropa", screen: "ropa" },
  { id: "2", name: "👟 Zapatos", screen: "zapatos" },
  { id: "3", name: "🎒 Accesorios", screen: "accesorios" },
  { id: "4", name: "📱 Electrónica", screen: "electronica" },
  { id: "5", name: "🏠 Hogar", screen: "hogar" },
  { id: "6", name: "🐶 Mascotas", screen: "mascotas" },
  { id: "7", name: "🙍 Mujer", screen: "mujer" },
  { id: "8", name: "🙍‍♂️ Hombre", screen: "hombre" },
  { id: "9", name: "👶 Niños", screen: "ninos" },
];

export default function ExploreScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar Categorías</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => alert(`Navegando a ${item.name}`)} // Aquí se conecta con la pantalla correspondiente
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
});
