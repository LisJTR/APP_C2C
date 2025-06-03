// Importación de React y del hook de navegación de Expo Router
import React from "react";
import { useRouter } from "expo-router";

// Tipado de las props del componente HeroSection
type HeroSectionProps = {
  onLoginPress: () => void; // Función que podría usarse para abrir un modal de login (no se usa directamente en este componente)
};

// Componente principal que muestra la sección principal destacada en la landing
export default function HeroSection({ onLoginPress }: HeroSectionProps) {
  const router = useRouter(); // Hook para navegación en la app

  // Función que redirige a la pantalla de subida de productos
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

// Objeto de estilos en formato CSS-in-JS para los elementos del componente
const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    position: "relative",         // Permite posicionar elementos hijos con posición absoluta
    marginTop: 20,
    width: "100%",
    height: "85vh",               // Altura relativa a la ventana del navegador
    overflow: "visible",
  },
  heroImage: {
    position: "absolute",
    inset: 0,                     // top: 0, right: 0, bottom: 0, left: 0
    width: "80%",
    height: "55%",
    borderRadius: 20,
    marginLeft: 150,
    objectFit: "cover",           // Asegura que la imagen cubra el área sin deformarse
  },
  heroOverlay: {
    position: "relative",         // Permite posicionar el contenido encima de la imagen
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    paddingLeft: "6%",
    paddingRight: "6%",
    marginTop: 115,
    marginBottom: 60,
  },
  heroContent: {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "rgba(255, 255, 255, 0)", // Fondo transparente
    borderRadius: 12,
    padding: "10px 10px",
    maxWidth: 300,
    marginLeft: 60,
    width: "100%",
    boxShadow: "0 50px 20px rgba(0, 0, 0, 0.15)", // Sombra ligera
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#ffffff",
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
    marginLeft: -550,            // ⚠️ Este valor puede causar desplazamiento incorrecto
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
