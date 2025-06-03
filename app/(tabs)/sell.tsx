import React, { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";

export default function SellScreen() {
   // Estados para cada uno de los campos del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");

   // Estados de control de UI
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { user, invitado } = useAuthStore();
  const router = useRouter();
  const [showAccessModal, setShowAccessModal] = useState(false);

  // Control de acceso de invitado
  useEffect(() => {
    let isMounted = true;
    if (!user && invitado) {
      setTimeout(() => {
        if (isMounted) setShowAccessModal(true);
      }, 0);
    }
    return () => {
      isMounted = false;
    };
  }, []);

   // Elegir imagen desde galería
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

  // Tomar foto desde cámara
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

  // Al pulsar "Subir producto"
  const handleSubmit = async () => {
    if (!title || !description || !price || !category || !size || !condition || !brand || images.length === 0) {
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

      // Subir cada imagen al backend
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

      // Crear el producto con los datos introducidos
      await axios.post(`${API_BASE_URL}/products`, {
        user_id: user.id,
        title,
        description,
        price,
        category,
        size,
        condition,
        brand,
        images: imageUrls,
      });

      // Limpiar formulario tras envío correcto
      Alert.alert("Éxito", "Producto subido correctamente.");
      // Limpiar formulario
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setSize("");
      setCondition("");
      setBrand("");
      setImages([]);
    } catch (error: any) {
      console.error("🟥 Error al subir producto:", error?.response?.data || error.message || error);
      Alert.alert("Error", "No se pudo subir el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

        {/* Campos de texto */}
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

        <Text style={styles.label}>Talla</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: M, L, 42, etc."
          value={size}
          onChangeText={setSize}
        />

        <Text style={styles.label}>Marca</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Zara, Adidas, etc."
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowConditionDropdown(!showConditionDropdown)}
        >
          <Text>{condition ? condition : "Seleccionar estado"}</Text>
        </TouchableOpacity>
        {showConditionDropdown && (
          <View style={styles.dropdown}>
            {["Nuevo", "Nuevo con etiqueta", "Muy bueno", "Usado", "Defectuoso"].map((estado) => (
              <TouchableOpacity
                key={estado}
                style={styles.dropdownItem}
                onPress={() => {
                  setCondition(estado);
                  setShowConditionDropdown(false);
                }}
              >
                <Text>{estado}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Precio (€)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej: 20.00"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Subir</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </ScrollView>

      {/* Modal de acceso restringido */}
      {showAccessModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Acceso restringido</Text>
            <Text style={styles.modalText}>
              Debes registrarte o iniciar sesión para continuar.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowAccessModal(false);
                useAuthStore.getState().setInvitado(false);
                router.push("/screens/WelcomeScreenMobile");
              }}
            >
              <Text style={styles.modalLink}>Regístrate ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// Styles (igual que antes)
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  modalLink: {
    color: "#2F70AF",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
