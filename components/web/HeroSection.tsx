import React, { useRef } from "react";

type HeroSectionProps = {
  onLoginPress: () => void;
};

export default function HeroSection({ onLoginPress }: HeroSectionProps) {
  const handleScroll = () => {
    const grid = document.getElementById("products-section");
    if (grid) grid.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.heroContainer}>
      <img
        src="https://i.imgur.com/TDcy7vp.jpeg"
        alt="Fondo"
        style={styles.heroImage}
      />
      <div style={styles.heroOverlay}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Compra y vende con confianza</h1>
  
          <button style={styles.heroButton} onClick={onLoginPress}>
            Explorar artículos
          </button>
  
          <div style={styles.heroLink} onClick={handleScroll}>
            ¿Cómo funciona?
          </div>
        </div>
      </div>
  
      {/* 🔽 AÑADE ESTE BLOQUE AQUÍ DEBAJO */}
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
    width: "100%",
    height: "75%",
    objectFit: "cover",
    zIndex: 0,
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
    zIndex: 1,
  },
  heroContent: {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "24px 28px",
    maxWidth: 300,
    width: "100%",
    boxShadow: "0 50px 20px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: 50,
  },
  heroButton: {
    backgroundColor: "#007AFF",
    color: "#fff",
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
    paddingTop: 75,
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
