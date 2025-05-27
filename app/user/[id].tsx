import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from "@/utils/config";
import { Product } from "@/types/Product";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resUser = await axios.get(`${API_BASE_URL}/users/${id}`);
      setUser(resUser.data);

      const resProducts = await axios.get(`${API_BASE_URL}/users/${id}/products`);
      setProducts(resProducts.data);
    };

    if (id) fetchData();
  }, [id]);

  if (!user) return <Text style={{ textAlign: 'center' }}>Cargando...</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={styles.container}
      ListHeaderComponent={() => (
        <View style={{ alignItems: 'center' }}>
          {user.avatar_url ? (
            <Image
              source={{ uri: `${API_BASE_URL.replace("/api", "")}${user.avatar_url}` }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={[styles.username, { fontSize: 28 }]}>👤</Text>
            </View>
          )}
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.info}>📍 {user.location || "Ubicación no disponible"}</Text>
          <Text style={styles.info}>📝 {user.bio || "Sin descripción"}</Text>
          <Text style={styles.sectionTitle}>Productos publicados</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => router.push(`/product/${item.id}`)}
        >
          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
          )}
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text>{item.price}€</Text>
          <Text>{item.size}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 22,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#555',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#444',
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginVertical: 15,
    alignSelf: 'flex-start',
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
productImage: {
  width: "100%",
  aspectRatio: 1, // cuadrado
  resizeMode: "contain", // <-- CLAVE
  borderRadius: 8,
  marginBottom: 8,
},
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});

