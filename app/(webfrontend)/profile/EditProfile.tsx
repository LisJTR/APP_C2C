import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { updateUser } from "@/api/api";
import HeaderLoggedIn from "../components/HeaderLoggedIn";
import Footer from "@/components/Bridges/HeadersWeb/Footer";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "@/utils/uploadAvatar";

export default function EditProfile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    location: "",
    bio: "",
    avatar_url: "",
    country_id: "",
  });

  const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        avatar_url: user.avatar_url || "",
        country_id: user.country_id?.toString() || "",
      });
    }

    const fetchCountries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/countries");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Error al obtener países:", err);
      }
    };

    fetchCountries();
  }, [user]);

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (file && user?.id) {
          const uploadedUrl = await uploadAvatar(file, user.id.toString());
          if (uploadedUrl) {
            setForm((prev) => ({ ...prev, avatar_url: uploadedUrl }));
          } else {
            console.warn("⚠️ Falló la subida del avatar, no se actualizará");
          }
        }
      };

      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setForm((prev) => ({ ...prev, avatar_url: uri }));
      }
    }
  };

  const handleUpdate = async () => {
    if (!token || !user || !user.id) return;

    const res = await updateUser(token, {
      username: form.username,
      email: form.email,
      location: form.location,
      bio: form.bio,
      avatar_url: form.avatar_url,
      country_id: form.country_id,
    });

    if (res?.user) {
      setUser(res.user);
      router.push("/(webfrontend)/profile");
    }
  };

  return (
    <ScrollView style={styles.page}>
      <HeaderLoggedIn onSearch={() => {}} />
      <View style={styles.content}>
        <Text style={styles.title}>Ajustes</Text>

        <View style={styles.card}>
          <View style={styles.photoSection}>
            <Text style={styles.label}>Tu foto</Text>
            <Image source={{ uri: form.avatar_url }} style={styles.avatar} />
            <TouchableOpacity onPress={pickImage}>
              <Text style={{ color: "#007AFF", marginTop: 8 }}>Elegir foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Sobre mí</Text>
            <TextInput
              style={styles.input}
              value={form.bio}
              onChangeText={(text) => setForm((prev) => ({ ...prev, bio: text }))}
              placeholder="Cuéntanos más sobre ti"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>País</Text>
            {Platform.OS === "web" ? (
              <select
                value={form.country_id}
                onChange={(e) => setForm((prev) => ({ ...prev, country_id: e.target.value }))}
                style={styles.input as any}
              >
                <option value="">Selecciona un país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <TextInput
                style={styles.input}
                value={countries.find((c) => c.id.toString() === form.country_id)?.name || ""}
                editable={false}
                placeholder="Solo editable en web"
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={styles.input}
              value={form.location}
              onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
              placeholder="Ciudad"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
              placeholder="Correo"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Actualizar perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
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
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
