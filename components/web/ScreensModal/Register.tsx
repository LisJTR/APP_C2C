// components/web/ScreensModal/Register.tsx
import React, { useState } from "react";
import { X, Eye } from "lucide-react";
import { animated, useSpring } from "react-spring";
import { useRouter } from "expo-router";

export default function RegisterScreen({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (email: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [offers, setOffers] = useState(false);
  const [terms, setTerms] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const eyeAnim = useSpring({
    transform: showPassword ? "scale(1.3)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  });

  const isValid = terms && username && email && password;

  const router = useRouter();

  const handleRegister = () => {
    if (!isValid) return;
  
    // Cierra el modal primero
    onClose();
  
    // Espera un pequeño tiempo antes de redirigir
    setTimeout(() => {
        router.push({
            pathname: "/email-verification/[email]",
            params: { email }
          });
              }, 100);
  };
  

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={22} />
        </button>

        <h2 style={styles.title}>Regístrate</h2>

        <input
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, marginBottom: 0 }}
          />
          <animated.button
            style={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            <animated.div style={eyeAnim}>
              <Eye size={18} />
            </animated.div>
          </animated.button>
        </div>

        <div style={styles.checkboxRow} onClick={() => setOffers(!offers)}>
          <input type="checkbox" checked={offers} readOnly />
          <span style={styles.checkboxLabel}>
            Quiero recibir ofertas personalizadas por e-mail.
          </span>
        </div>

        <div
          style={{ ...styles.checkboxRow, alignItems: "flex-start" }}
          onClick={() => setTerms(!terms)}
        >
          <input type="checkbox" checked={terms} readOnly />
          <span style={styles.checkboxLabel}>
            Al registrarme, acepto los{" "}
            <a href="#" style={styles.link}>
              términos y condiciones
            </a>
            , he leído la{" "}
            <a href="#" style={styles.link}>
              política de privacidad
            </a>{" "}
            y tengo al menos 18 años.
          </span>
        </div>

        <button
          onClick={handleRegister}
          style={{
            ...styles.submitButton,
            backgroundColor: isValid ? "#0f766e" : "#aaa",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
          disabled={!isValid}
        >
          Registrarse
        </button>

        <p style={styles.helpLink}>¿Necesitas ayuda?</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    width: 400,
    borderRadius: 12,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    fontFamily: "sans-serif",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 14,
    fontSize: 14,
    outline: "none",
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  checkboxRow: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
    fontSize: 14,
    alignItems: "center",
    cursor: "pointer",
  },
  checkboxLabel: {
    flex: 1,
    color: "#333",
  },
  link: {
    color: "#0f766e",
    textDecoration: "underline",
  },
  submitButton: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 8,
    border: "none",
    transition: "background 0.2s ease",
  },
  helpLink: {
    marginTop: 16,
    textAlign: "center",
    color: "#0f766e",
    fontSize: 14,
    cursor: "pointer",
    fontWeight: "500",
  },
};
