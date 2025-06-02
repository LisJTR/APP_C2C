import { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import HeaderLoggedIn from "../components/HeaderLoggedIn";
import Footer from "@/components/Bridges/HeadersWeb/Footer";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function UploadProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = () => {
      const file = input.files?.[0];
      if (file && images.length < 5) {
        setImages([...images, file]);
      }
    };

    input.click();
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

const handleSubmit = async () => {
  if (!title || !description || !category || !price || images.length === 0) {
    alert("Por favor, rellena todos los campos y sube al menos una imagen.");
    return;
  }

  if (!user?.id) {
    alert("Error: usuario no identificado.");
    return;
  }

  try {
    const imageUrls: string[] = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.imageUrl;
      imageUrls.push(imageUrl);
    }

    await axios.post("http://localhost:5000/api/products", {
      user_id: user.id,
      title,
      description,
      price,
      category,
      images: imageUrls,
    });

    alert("✅ Producto subido correctamente.");
    router.replace("/profile");
  } catch (err) {
    console.error("❌ Error al subir producto:", err);
    alert("Ocurrió un error al subir el producto.");
  }
};


  return (
    <ScrollView style={{ backgroundColor: "#f3f4f6", minHeight: Dimensions.get("window").height }}>
      <HeaderLoggedIn onSearch={() => {}} />
      <View
        style={{
          maxWidth: 700,
          width: "100%",
          alignSelf: "center",
          padding: 32,
          backgroundColor: "#fff",
          marginTop: 40,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 24 }}>
          Subir artículo
        </Text>

        {/* Imagenes */}
        <View
          style={{
            borderWidth: 2,
            borderColor: "#d1d5db",
            borderStyle: "dashed",
            borderRadius: 8,
            padding: 16,
            minHeight: 140,
            justifyContent: images.length === 0 ? "center" : "flex-start",
            alignItems: images.length === 0 ? "center" : "flex-start",
            flexWrap: "wrap",
            flexDirection: "row",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {images.length === 0 ? (
            <TouchableOpacity onPress={handleImageUpload}>
              <Text style={{ color: "#007AFF", fontWeight: "500" }}>
                + Subir fotos
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {images.map((img, idx) => (
                <View
                  key={idx}
                  style={{
                    width: 110,
                    height: 130,
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <Image
                    source={{ uri: URL.createObjectURL(img) }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 2,
                      zIndex: 1,
                    }}
                    onPress={() => handleRemove(idx)}
                  >
                    <Text style={{ fontSize: 12 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity
                  onPress={handleImageUpload}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 24, color: "#007AFF" }}>＋</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Formulario */}
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Camisa de cuadros de Zara"
          placeholderTextColor="#afafaf"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Describe tu artículo</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Ejemplo: Usado una vez, da poca talla, etc."
          placeholderTextColor="#afafaf"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Categoría</Text>
        {Platform.OS === "web" ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              fontSize: 14,
              color: "#111827",
            }}
          >
            <option value="">Elige una categoría</option>
            <option value="ropa">Ropa</option>
            <option value="zapatos">Zapatos</option>
            <option value="accesorios">Accesorios</option>
          </select>
        ) : (
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Categoría"
            placeholderTextColor="#afafaf"
          />
        )}

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00 €"
          placeholderTextColor="#afafaf"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 24,
          }}
        >
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
  <Text style={{ color: "white", fontWeight: "600" }}>Subir</Text>
</TouchableOpacity>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = {
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    width: "100%" as const,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
};
