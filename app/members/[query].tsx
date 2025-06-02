// app/members/[query].tsx
import { useRouter } from "expo-router";
import { TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Header from "@/components/Bridges/HeadersWeb/Header";
import HeaderLoggedIn from "../(webfrontend)/components/HeaderLoggedIn";
import Footer from "@/components/Bridges/HeadersWeb/Footer";
import AuthModal from "@/components/Bridges/ModalsWeb/AuthModal";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { isLoggedIn } from "@/utils/auth";
import { API_BASE_URL } from "@/utils/config"; // 👈 Asegúrate de tener esto

export default function MembersPage() {
  const { query } = useLocalSearchParams();
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [logged, setLogged] = useState(false);
  const router = useRouter();

  const fetchMembers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/search?query=${query}`);
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Error al buscar miembros:", err);
    }
  };

  useEffect(() => {
    if (query) fetchMembers();
  }, [query]);

  useEffect(() => {
    const checkSession = async () => {
      const loggedIn = await isLoggedIn();
      setLogged(loggedIn);
    };
    checkSession();
  }, []);

  if (Platform.OS !== "web") return null;

  return (
    <ScrollView style={styles.page}>
      {logged ? (
        <HeaderLoggedIn onSearch={() => {}} />
      ) : (
        <Header onLoginPress={() => setShowModal(true)} onSearch={() => {}} />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Buscar miembros</Text>

        {members.length === 0 ? (
          <Text style={styles.noResults}>No hay resultados.</Text>
        ) : (
          <View style={styles.grid}>
            {members.map((member: any) => {
              console.log("Avatar URL:", member.avatar_url);

              return (
                <TouchableOpacity
                  key={member.id}
                  style={styles.card}
                  onPress={() => router.push(`/user/${member.id}`)}
                >
                  {member.avatar_url ? (
                    <Image
                      source={{ uri: `${API_BASE_URL.replace("/api", "")}${member.avatar_url}` }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarLetter}>
                        {member.username?.charAt(0).toUpperCase() || "?"}
                      </Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.username}>{member.username}</Text>
                    <Text style={styles.subtitle}>Aún no hay valoraciones</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <Footer />
      <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noResults: {
    fontStyle: "italic",
    color: "#555",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    width: "48%",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarLetter: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    resizeMode: "cover",
  },
  username: {
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
});
