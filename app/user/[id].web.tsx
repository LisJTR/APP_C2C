// app/user/[id].web.tsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from "@/utils/config";
import Footer from '@/components/Bridges/HeadersWeb/Footer';
import HeaderLoggedIn from '../(webfrontend)/components/HeaderLoggedIn';

export default function UserProfileWeb() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const resUser = await axios.get(`${API_BASE_URL}/users/${id}`);
      setUser(resUser.data);
      const resProducts = await axios.get(`${API_BASE_URL}/users/${id}/products`);
      setProducts(resProducts.data);
    };
    if (id) fetch();
  }, [id]);

  if (!user) return <Text>Cargando...</Text>;

return (
  <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }}>
    <HeaderLoggedIn onSearch={() => {}} />

    <View style={styles.container}>
      <View style={styles.header}>
        {user.avatar_url ? (
          <Image source={{ uri: `${API_BASE_URL.replace("/api", "")}${user.avatar_url}` }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}><Text style={styles.initial}>{user.username?.[0]}</Text></View>
        )}

        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.details}>📍 {user.location}</Text>
          <Text style={styles.details}>📧 {user.email}</Text>
          <Text style={styles.details}>📝 {user.bio || "Sin descripción"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{products.length} artículos</Text>
      <View style={styles.grid}>
        {products.map((item: any) => (
          <TouchableOpacity key={item.id} style={styles.productCard} onPress={() => router.push(`/product/${item.id}`)}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text>{item.price} €</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <Footer />
  </ScrollView>
);
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 32 },
  header: { flexDirection: 'row', gap: 24, marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center',
  },
  initial: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  userInfo: { flex: 1, justifyContent: 'center' },
  username: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  details: { fontSize: 14, color: '#555', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16,
    justifyContent: 'flex-start',
  },
  productCard: {
    width: '22%', backgroundColor: '#f9f9f9', padding: 12,
    borderRadius: 8, borderWidth: 1, borderColor: '#ddd',
  },
  productImage: { width: '100%', aspectRatio: 1, borderRadius: 6, marginBottom: 6 },
  productTitle: { fontWeight: 'bold', marginBottom: 4 },
});
