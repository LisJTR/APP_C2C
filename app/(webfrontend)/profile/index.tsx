import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import HeaderLoggedIn from "../components/HeaderLoggedIn";
import Footer from "@/components/Bridges/HeadersWeb/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserProfile } from "@/api/api";
import { CheckCircle, MapPin, Clock, Users, Mail, ShieldCheck, Globe } from "lucide-react";
import { useRouter } from "expo-router";

type Product = {
  id: number;
  title: string;
  price: number;
  image_url: string;
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  const handleUploadPress = () => {
    router.push("/(webfrontend)/uploadProduct/UploadProducts");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const response = await getUserProfile(token);
        if (response?.user) {
          setUser(response.user);
        }
      }
    };
    fetchUser();
  }, [token, setUser]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/${user.id}/products`);
          const data = await res.json();
          setMyProducts(data);
        } catch (error) {
          console.error("Error al obtener productos del usuario:", error);
        }
      }
    };
    fetchUserProducts();
  }, [user]);

  return (
    <ScrollView style={styles.page}>
      <HeaderLoggedIn onSearch={() => {}} />

      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            source={{ uri: user?.avatar_url || "https://i.imgur.com/KoJ8KNe.png" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{user?.username || ""}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/(webfrontend)/profile/EditProfile")}
          >
            <Text style={styles.editText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {user?.bio ? (
          <View style={styles.bioSection}>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        ) : null}

        <View style={styles.infoSection}>
          <View style={styles.column}>
            <Text><MapPin size={14} /> {user?.location || ""}</Text>
            <Text><Globe size={14} /> {user?.country_name || ""}</Text>
            <Text><Clock size={14} /> Última conexión: hace 1 minuto</Text>
            <Text><Users size={14} /> 0 Seguidores, 0 siguiendo</Text>
          </View>
          <View style={styles.column}>
            {user?.is_verified ? (
              <Text><CheckCircle size={14} /> Verificado</Text>
            ) : (
              <Text><ShieldCheck size={14} /> No verificado</Text>
            )}
            <Text><Mail size={14} /> {user?.email}</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <Text style={[styles.tabItem, styles.activeTab]}>Anuncios</Text>
        </View>

        <View style={styles.adsSection}>
          <Text style={styles.badge}>Empieza una nueva racha de anuncios</Text>
          <Text style={styles.tip}>Sube 5 artículos en 30 días para ganar la insignia de vendedor frecuente</Text>

          {myProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sube artículos para empezar a vender</Text>
              <Text style={styles.emptyText}>Vende lo que ya no usas. ¡Es fácil y seguro!</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
                <Text style={{ color: "#fff" }}>Subir ahora</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 24, flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {myProducts.map((product) => (
                <View
                  key={product.id}
                  style={{
                    width: 150,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Image
                    source={{
                      uri: product.image_url.startsWith("http")
                        ? product.image_url
                        : `http://localhost:5000${product.image_url}`,
                    }}
                    style={{ width: "100%", height: 150 }}
                  />
                  <View style={{ padding: 8 }}>
                    <Text style={{ fontWeight: "600" }}>{product.title}</Text>
                    <Text style={{ color: "#007AFF", marginTop: 4 }}>
                      {Number(product.price).toFixed(2)} €
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24 },
  topSection: { flexDirection: "row", alignItems: "center", gap: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginRight: 12 },
  username: { fontSize: 20, fontWeight: "bold" },
  editButton: {
    marginLeft: "auto",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
  },
  editText: { fontWeight: "500" },
  bioSection: { marginTop: 16 },
  bioText: { fontSize: 15, color: "#333" },
  infoSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: { flex: 1, gap: 6 },
  tabs: {
    marginTop: 30,
    flexDirection: "row",
    gap: 20,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingBottom: 10,
  },
  tabItem: { fontSize: 16, color: "#555" },
  activeTab: {
    fontWeight: "bold",
    color: "#111",
    borderBottomWidth: 2,
    borderColor: "#007AFF",
  },
  adsSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  badge: { fontWeight: "600", fontSize: 14, marginBottom: 8 },
  tip: { fontSize: 13, color: "#666", marginBottom: 20 },
  emptyState: { alignItems: "center", marginTop: 30, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "bold" },
  emptyText: { fontSize: 13, color: "#555" },
  uploadButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 12,
  },
});
