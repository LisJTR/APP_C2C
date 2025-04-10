// components/web/HeroSection.tsx
import React from "react";

type HeroSectionProps = {
  onLoginPress: () => void;
};

export default function HeroSection({ onLoginPress }: HeroSectionProps) {
  return (
    <>
      <div style={styles.heroContainer}>
        <img
          src="https://i.imgur.com/TDcy7vp.jpeg"
          alt="Fondo"
          style={styles.heroImage}
        />
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Compra y vende con confianza</h1>

             {/* 🔹 Este botón abre el modal */}
            <button style={styles.heroButton} onClick={onLoginPress}>
              Explorar artículos
              </button>

            <div style={styles.heroLink} onClick={onLoginPress}>¿Cómo funciona?</div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    position: "relative",
    marginTop: 20,
    width: "100%",
    height: "85vh",
    overflow: "visible",
    backgroundColor: "#f3f4f6",
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
    fontSize: 20,
    color: "#007AFF",
    textDecoration: "none",
    cursor: "pointer",
  },
};
