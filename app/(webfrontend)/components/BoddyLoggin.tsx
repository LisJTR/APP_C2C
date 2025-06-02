import React from "react";
import { useRouter } from "expo-router";

type HeroSectionProps = {
  onLoginPress: () => void;
};

export default function HeroSection({ onLoginPress }: HeroSectionProps) {
  const router = useRouter();

  const handleUploadPress = () => {
    router.push("/(webfrontend)/uploadProduct/UploadProducts");
  };

  return (
    <div style={styles.heroContainer}>
      <img
        src="https://i.imgur.com/wiDg6rN.jpeg"
        alt="Fondo"
        style={styles.heroImage}
      />
      <div style={styles.heroOverlay}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Sube tus artículos con confianza</h1>

          <button style={styles.heroButton} onClick={handleUploadPress}>
            Vender ahora
          </button>
        </div>
      </div>

      {/* 🔽 Sección de novedades */}
      <div style={styles.sectionBelow}>
        <h2 style={styles.sectionTitle}>Novedades</h2>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    position: "relative",
    marginTop: 20,
    width: "100%",
    height: "85vh",
    overflow: "visible",
  },
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "70%",
    height: "55%",
    borderRadius: 20,
    marginLeft: 280,
    objectFit: "cover",
  },
  heroOverlay: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    paddingLeft: "6%",
    paddingRight: "6%",
    marginTop: 200,
  },
  heroContent: {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 12,
    padding: "10px 10px",
    maxWidth: 300,
    marginLeft: 190,
    width: "100%",
    boxShadow: "0 50px 20px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#ffff",
    marginBottom: 50,
  },
  heroButton: {
    backgroundColor: "#fff",
    color: "#202020",
    fontWeight: 600,
    fontSize: 14,
    padding: "12px",
    borderRadius: 8,
    border: "none",
    width: "100%",
    cursor: "pointer",
    marginBottom: 35,
  },
  heroLink: {
    fontSize: 16,
    color: "#007AFF",
    textDecoration: "underline",
    cursor: "pointer",
  },
  sectionBelow: {
    width: "100%",
    textAlign: "center",
    paddingTop: 15,
    marginLeft: -550,
    marginTop: -400,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#111",
    fontFamily: "Inter, sans-serif",
    marginBottom: 10,
  },
};
