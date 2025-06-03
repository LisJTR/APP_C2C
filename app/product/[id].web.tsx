// app/product/[id].web.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/config';
import HeaderLoggedIn from '../(webfrontend)/components/HeaderLoggedIn';
import Footer from '@/components/Bridges/HeadersWeb/Footer';

export default function ProductWebPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Al montar el componente, obtiene el producto y su propietario
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(res.data);

      const userRes = await axios.get(`${API_BASE_URL}/users/${res.data.user_id}`);
      setUser(userRes.data);
    };
    if (id) fetch();
  }, [id]);

  if (!product) return <Text style={{ padding: 32 }}>Cargando producto...</Text>;

 return (
  <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }}>
    {/* Cabecera con sesión iniciada */}
    <HeaderLoggedIn onSearch={() => {}} />

    <View style={styles.container}>
       {/* Galería de imágenes */}
      <View style={styles.gallerySection}>
        <Image source={{ uri: product.images?.[0] }} style={styles.mainImage} />
        <View style={styles.thumbRow}>
          {product.images?.slice(1).map((img: string, i: number) => (
            <Image key={i} source={{ uri: img }} style={styles.thumbImage} />
          ))}
        </View>
      </View>
      {/* Detalles del producto */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.subtitle}>
          {product.size} · {product.condition} · {product.brand}
        </Text>
        <Text style={styles.price}>{product.price} €</Text>

        <View style={styles.meta}>
          <Text style={styles.label}>Marca:</Text>
          <Text>{product.brand}</Text>

          <Text style={styles.label}>Tamaño:</Text>
          <Text>{product.size}</Text>

          <Text style={styles.label}>Condición:</Text>
          <Text>{product.condition}</Text>

          <Text style={styles.label}>Categoría:</Text>
          <Text>{product.category}</Text>

          <Text style={styles.label}>Descripción:</Text>
          <Text>{product.description}</Text>
        </View>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>Comprar</Text>
        </TouchableOpacity>
        {/* Info del vendedor */}
        {user && (
          <TouchableOpacity onPress={() => router.push(`/user/${user.id}`)}>
            <Text style={styles.seller}>Publicado por: {user.username}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    <Footer />
  </ScrollView>
);
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexDirection: 'row',
    padding: 32,
    gap: 40,
  },
  gallerySection: {
    flex: 2,
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  thumbImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  infoSection: {
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
  price: {
    fontSize: 24,
    color: 'green',
    fontWeight: '600',
    marginVertical: 10,
  },
  meta: {
    marginTop: 10,
    gap: 6,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  buyButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  seller: {
    marginTop: 14,
    color: '#2F70AF',
    textDecorationLine: 'underline',
  },
});
