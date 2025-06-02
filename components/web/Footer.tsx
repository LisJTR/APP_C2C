// components/web/Footer.tsx

import React from "react";

/**
 * Componente Footer
 *
 * Representa el pie de página del sitio web, dividido en:
 * - Secciones informativas con enlaces útiles
 * - Políticas legales
 * - Íconos sociales
 * - Botones para descarga de la app en tiendas móviles
 */
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Secciones principales del footer */}
        <div style={styles.columns}>
          {/* Columna 1: Empresa */}
          <div style={styles.column}>
            <h4 style={styles.title}>KCL Trading</h4>
            <a href="#" style={styles.link}>¿Quiénes somos?</a>
            <a href="#" style={styles.link}>Trabaja con nosotros</a>
            <a href="#" style={styles.link}>Sostenibilidad</a>
            <a href="#" style={styles.link}>Prensa</a>
            <a href="#" style={styles.link}>Publicidad</a>
          </div>

          {/* Columna 2: Descubre */}
          <div style={styles.column}>
            <h4 style={styles.title}>Descubre</h4>
            <a href="#" style={styles.link}>¿Cómo funciona?</a>
            <a href="#" style={styles.link}>Verificación del artículo</a>
            <a href="#" style={styles.link}>Descarga la app</a>
            <a href="#" style={styles.link}>Tablón informativo</a>
            <a href="#" style={styles.link}>KCL Trading Pro</a>
            <a href="#" style={styles.link}>Guía de KCL Trading Pro</a>
          </div>

          {/* Columna 3: Ayuda */}
          <div style={styles.column}>
            <h4 style={styles.title}>Ayuda</h4>
            <a href="#" style={styles.link}>Centro de Asistencia</a>
            <a href="#" style={styles.link}>Vender</a>
            <a href="#" style={styles.link}>Comprar</a>
            <a href="#" style={styles.link}>Confianza y seguridad</a>
          </div>
        </div>

        {/* Separador visual */}
        <hr style={{ margin: "30px 0", borderColor: "#ddd" }} />

        {/* Sección inferior: legales, redes, app stores */}
        <div style={styles.bottomRow}>
          {/* Enlaces legales */}
          <div style={styles.links}>
            <a href="#" style={styles.link}>Política de Privacidad</a>
            <a href="#" style={styles.link}>Política de cookies</a>
            <a href="#" style={styles.link}>Configuración de cookies</a>
            <a href="#" style={styles.link}>Términos y condiciones</a>
            <a href="#" style={styles.link}>Nuestra plataforma</a>
          </div>

          {/* Íconos sociales */}
          <div style={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://img.icons8.com/ios-filled/50/999999/facebook-new.png"
                alt="Facebook"
                style={styles.icon}
              />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://img.icons8.com/ios-filled/50/999999/linkedin.png"
                alt="LinkedIn"
                style={styles.icon}
              />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://img.icons8.com/ios-filled/50/999999/instagram-new.png"
                alt="Instagram"
                style={styles.icon}
              />
            </a>
          </div>

          {/* Botones de descarga de apps */}
          <div style={styles.storeButtons}>
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              style={{ height: 35 }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              style={{ height: 35 }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===================== ESTILOS =====================
const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: "#fff",
    fontFamily: "sans-serif",
    marginTop: 200,
    fontSize: 13,
    color: "#444",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
  },
  columns: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 32,
  },
  column: {
    flex: "1 1 220px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 8,
    color: "#222",
  },
  bottomRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 12,
  },
  link: {
    color: "#444",
    textDecoration: "none",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    display: "inline",
  },
  socials: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  icon: {
    width: 32,
    height: 32,
    backgroundColor: "#f3f3f3",
    padding: 6,
    borderRadius: 6,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    filter: "grayscale(100%)",
  },
  storeButtons: {
    display: "flex",
    gap: 12,
    marginTop: 4,
  },
};
