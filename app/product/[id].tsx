import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Modal from 'react-native-modal';
import { API_BASE_URL } from '@/utils/config';
import { Product } from '@/types/Product';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductAndUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}`);
        const productData = res.data;
        setProduct(productData);

        const userRes = await axios.get(`${API_BASE_URL}/users/${productData.user_id}`);
        setUser(userRes.data);
      } catch (err) {
        console.error("Error al cargar producto o usuario:", err);
      }
    };
    if (id) fetchProductAndUser();
  }, [id]);

  const handleBuy = async () => {
    try {
      const token = useAuthStore.getState().token;

      await axios.post(`${API_BASE_URL}/orders`, {
        product_id: product?.id,
        seller_id: product?.user_id,
        total_price: product?.price,
        status: "pendiente",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("✅ Compra registrada", "Tu orden ha sido generada correctamente");
    } catch (error) {
      console.error("🟥 Error al registrar compra", error);
      Alert.alert("Error", "No se pudo completar la compra");
    }
  };

  if (!product) return <Text>Cargando producto...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedImageIndex}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.fullscreenImage} />
            )}
          />
        </View>
      </Modal>

      <FlatList
        data={product.images}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => {
            setSelectedImageIndex(index);
            setModalVisible(true);
          }}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>{product.title}</Text>

      {user && (
        <TouchableOpacity onPress={() => router.push(`/user/${user.id}`)}>
          <Text style={[styles.user, { fontFamily: 'Poppins_500Medium' }]}>
            Publicado por: <Text style={{ color: "#2F70AF" }}>{user.username}</Text>
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.price, { fontFamily: 'Poppins_600SemiBold' }]}>{product.price}€</Text>
      <Text style={[styles.info]}>Talla: {product.size}</Text>
      <Text style={[styles.info]}>Marca: {product.brand}</Text>
      <Text style={[styles.info]}>Condición: {product.condition}</Text>
      <Text style={[styles.info]}>Categoría: {product.category}</Text>
      <Text style={[styles.description]}>{product.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleBuy}>
        <Text style={styles.buttonText}>Comprar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
  },
  carousel: {
    marginBottom: 20,
    maxHeight: 250,
  },
  image: {
    width: 300,
    height: undefined,
    aspectRatio: 1.2,
    borderRadius: 12,
    resizeMode: "contain",
  },
  modalContent: {
    height: '80%',
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  user: {
    fontSize: 15,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: '#333',
    textAlign: 'left',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2F70AF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
});
