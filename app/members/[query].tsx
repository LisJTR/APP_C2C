// app/members/[query].tsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Header from "../../components/web/Header";
import Footer from "../../components/web/Footer";
import AuthModal from "../../components/web/ScreensModal/AuthModalWeb";
import { Platform } from "react-native";

export default function MembersPage() {
  const { query } = useLocalSearchParams();
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  if (Platform.OS !== "web") return null;

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Header onLoginPress={() => setShowModal(true)} onSearch={() => {}} />

      <div style={styles.container}>
        <h2 style={styles.title}>Buscar miembros</h2>

        {members.length === 0 ? (
          <p style={styles.noResults}>No hay resultados.</p>
        ) : (
          <div style={styles.grid}>
            {members.map((member: any) => (
              <div key={member.id} style={styles.card}>
                <div style={styles.avatar}>
                  {member.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <div style={styles.username}>{member.username}</div>
                  <div style={styles.subtitle}>Aún no hay valoraciones</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "0 20px",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 20,
  },
  noResults: {
    fontStyle: "italic",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: "50%",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
};
