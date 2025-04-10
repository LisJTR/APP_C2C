import React, { useState,  useLayoutEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";


const rawCategories = [
  { id: "1", key: "clothes", screen: " clothes" },
  { id: "2", key :"shoes", screen: "shoes" },
  { id: "3", key: "accessories", screen: "accessories" },
  { id: "4", key: "electronics", screen: "electronics" },
  { id: "5", key: "home", screen: "home" },
  { id: "6", key: "petss", screen: "petss" },
  { id: "7", key: "woman", screen: "woman" },
  { id: "8", key: "man", screen: "man" },
  { id: "9", key: "children", screen: "children" },
];


export default function ExploreScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();




  const categories = rawCategories
    .map((item) => ({
      ...item,
      name: t(`explore.categories.${item.key}`),
    }))
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              router.push({
                pathname: "/category/[category]",
                params: { category: item.screen },
              })
            }

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
});
