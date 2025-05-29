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
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

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

  useEffect(() => {
    const fetchCities = async () => {
      if (!form.country_id) {
        setCities([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/users/cities/${form.country_id}`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Error al obtener ciudades:", err);
        setCities([]);
      }
    };

    fetchCities();
  }, [form.country_id]);

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
    if (!token || !user || !user.id) {
  console.warn("⛔ Token o user.id no definido");
  return;
}

    try {
       console.log("🛡️ TOKEN QUE SE ENVÍA:", token);
      const res = await updateUser(token, form);
      if (res?.user) {
        setUser(res.user);
        router.push("/(webfrontend)/profile");
      }
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err);
    }
  };

  return (
    <ScrollView style={styles.page}>
      <HeaderLoggedIn onSearch={() => {}} />
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Ajustes</Text>
          {[
            "Datos de perfil",
            "Ajustes de cuenta",
            "Envíos",
            "Pagos",
            "Descuento por lote",
            "Notificaciones",
            "Ajustes de privacidad",
            "Seguridad",
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>Ajustes</Text>
          <View style={styles.card}>
            <View style={styles.photoSection}>
              <Text style={styles.label}>Tu foto</Text>
              <Image
                source={{ uri: form.avatar_url?.startsWith("http") ? form.avatar_url : "https://i.imgur.com/KoJ8KNe.png" }}
                style={styles.avatar}
              />
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
                  <option value="">Selecciona un país</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
              {Platform.OS === "web" ? (
                <select
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
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
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              ) : (
                <TextInput
                  style={styles.input}
                  value={form.location}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
                  placeholder="Ciudad"
                />
              )}
            </View>

            <View style={{ alignItems: "flex-end", marginTop: 16 }}>
              <TouchableOpacity style={styles.buttonSmall} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Actualizar perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { flexDirection: "row", backgroundColor: "#fff", paddingHorizontal: 32, paddingTop: 32, paddingBottom: 60 },
  sidebar: { width: 240, paddingRight: 24, borderRightWidth: 1, borderColor: "#e5e7eb" },
  sidebarTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  sidebarItem: { paddingVertical: 10 },
  sidebarItemText: { fontSize: 15, color: "#374151" },
  mainContent: { flex: 1, paddingLeft: 32 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#111827" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  photoSection: { alignItems: "center", marginBottom: 28 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginTop: 10 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#f9fafb", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, fontSize: 14, color: "#111827", width: "100%" },
  buttonSmall: { backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
