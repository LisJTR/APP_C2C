import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useAuthStore } from "../../store/useAuthStore";
import { ALL_CATEGORIES } from "../../constants/categories";

export default function SellScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const pickImageFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permiso requerido", "Permite acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setImages((prev) => [...prev, image.uri]);
    }
  };

  const takePhotoWithCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permiso requerido", "Permite acceso a la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setImages((prev) => [...prev, image.uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !category || images.length === 0) {
      Alert.alert("Campos requeridos", "Por favor, rellena todos los campos.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "No se encontró el usuario.");
      return;
    }

    try {
      setLoading(true);
      const imageUrls: string[] = [];

      for (const uri of images) {
        const formData = new FormData();
        formData.append("image", {
          uri,
          name: `product-${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any);

        const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imageUrl = res.data.imageUrl;
        imageUrls.push(imageUrl);
      }

      await axios.post(`${API_BASE_URL}/products`, {
        user_id: user.id,
        title,
        description,
        price,
        category,
        size: "",
        condition: "",
        brand: "",
        images: imageUrls,
      });

      Alert.alert("Éxito", "Producto subido correctamente.");
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImages([]);
    } catch (error) {
      console.error("Error al subir producto", error);
      Alert.alert("Error", "No se pudo subir el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Vender</Text>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImageFromGallery}>
          <Ionicons name="image-outline" size={24} color="#007AFF" />
          <Text style={styles.uploadText}>Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={takePhotoWithCamera}>
          <Ionicons name="camera-outline" size={24} color="#007AFF" />
          <Text style={styles.uploadText}>Cámara</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.previewContainer}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.previewImage} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Camisa de cuadros de Zara"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Usado una vez, da poca talla, etc."
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Categoría</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        <Text>{category ? category : "Seleccionar categoría"}</Text>
      </TouchableOpacity>
      {showCategoryDropdown && (
        <View style={styles.dropdown}>
          {ALL_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.dropdownItem}
              onPress={() => {
                setCategory(cat.key);
                setShowCategoryDropdown(false);
              }}
            >
              <Text>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Precio (€)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Subir</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 10,
  },
  uploadText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "500",
  },
  previewContainer: {
    marginBottom: 15,
    flexDirection: "row",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    padding: 5,
    backgroundColor: "#f9f9f9",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});