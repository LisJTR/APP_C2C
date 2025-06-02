// Importación de React y referencia para scroll (aunque no se usa aquí)
import React, { useRef } from "react";

// Tipado de las props que recibe el componente
type HeroSectionProps = {
  onLoginPress: () => void; // Función que se ejecuta al pulsar "Explorar artículos"
};

// Componente principal de la sección hero de la página
export default function HeroSection({ onLoginPress }: HeroSectionProps) {
  // Función que permite hacer scroll suave hasta el elemento con ID "products-section"
  const handleScroll = () => {
    const grid = document.getElementById("products-section");
    if (grid) grid.scrollIntoView({ behavior: "smooth" });
  };

  // Estructura del hero con imagen de fondo, contenido y enlaces
  return (
    <div style={styles.heroContainer}>
      {/* Imagen de fondo del hero */}
      <img
        src="https://i.imgur.com/TDcy7vp.jpeg"
        alt="Fondo"
        style={styles.heroImage}
      />

      {/* Capa superpuesta que contiene el contenido */}
      <div style={styles.heroOverlay}>
        <div style={styles.heroContent}>
          {/* Título del hero */}
          <h1 style={styles.heroTitle}>Compra y vende con confianza</h1>

          {/* Botón que ejecuta onLoginPress al hacer clic */}
          <button style={styles.heroButton} onClick={onLoginPress}>
            Explorar artículos
          </button>

          {/* Enlace que al hacer clic hace scroll a la sección de productos */}
          <div style={styles.heroLink} onClick={handleScroll}>
            ¿Cómo funciona?
          </div>
        </div>
      </div>

      {/* Sección informativa fija justo debajo del hero */}
      <div style={styles.sectionBelow}>
        <h2 style={styles.sectionTitle}>Novedades</h2>
      </div>
    </div>
  );
}

// Estilos CSS en línea definidos como objeto
const styles: { [key: string]: React.CSSProperties } = {
  // Contenedor principal del hero
  heroContainer: {
    position: "relative",
    marginTop: 20,
    width: "100%",
    height: "85vh",
    overflow: "visible",
  },

  // Imagen de fondo posicionada de forma absoluta
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "75%",
    objectFit: "cover",
    zIndex: 0,
  },

  // Capa que va encima de la imagen de fondo
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

  // Caja con el contenido del hero (título, botón, enlace)
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

  // Título dentro del hero
  heroTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: 50,
  },

  // Botón principal del hero
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

  // Enlace que activa el scroll
  heroLink: {
    fontSize: 16,
    color: "#007AFF",
    textDecoration: "underline",
    cursor: "pointer",
  },

  // Contenedor de la sección inferior debajo del hero
  sectionBelow: {
    width: "100%",
    textAlign: "center",
    paddingTop: 75,
    marginLeft: -550,
    marginTop: -400,
    backgroundColor: "#fff",
  },

  // Título de la sección inferior
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#111",
    fontFamily: "Inter, sans-serif",
    marginBottom: 10,
  },
};
