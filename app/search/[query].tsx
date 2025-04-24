// app/search/[query].tsx
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SearchPage() {
  const { query } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Resultados para: {query}</Text>
      {/* Aquí puedes reutilizar ProductGrid con searchQuery={query} */}
    </View>
  );
}
