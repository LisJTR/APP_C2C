// components/web/ScreensModal/Register.tsx
import React, { useState } from "react";
import { X, Eye } from "lucide-react";
import { animated, useSpring } from "react-spring";
import { useRouter } from "expo-router";
import { registerUser } from "@/api/api";
import { FaSpinner } from "react-icons/fa";


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
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const eyeAnim = useSpring({
    transform: showPassword ? "scale(1.3)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  });

  const router = useRouter();

  const validateUsername = (value: string) => {
    setUsername(value);
    if (value.length < 4) {
      setUsernameError("Debe tener al menos 4 caracteres");
    } else if (/\s/.test(value)) {
      setUsernameError("No puede contener espacios");
    } else {
      setUsernameError("");
    }
  };

  const validateEmail = (value: string) => {
    setEmail(value);
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Correo electrónico inválido");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    if (value.length < 6) {
      setPasswordError("Debe tener al menos 6 caracteres");
    } else if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
      setPasswordError("Debe contener letras y números");
    } else {
      setPasswordError("");
    }
  };

  const isValid =
    terms &&
    username &&
    email &&
    password &&
    !usernameError &&
    !emailError &&
    !passwordError;

  const handleRegister = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      const result = await registerUser(username, email, password);
      if (result.user) {
        onClose();
        setTimeout(() => onSuccess(email), 100);
      } else {
        alert(result.message || "Error al registrar el usuario");
      }
    } catch (err) {
      alert("Error de red o servidor");
    } finally {
      setLoading(false);
    }
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
          onChange={(e) => validateUsername(e.target.value)}
        />
        {usernameError && <small style={styles.error}>{usernameError}</small>}

        <input
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => validateEmail(e.target.value)}
        />
        {emailError && <small style={styles.error}>{emailError}</small>}

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
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
        {passwordError && <small style={styles.error}>{passwordError}</small>}

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
            Acepto los{" "}
            <a href="#" style={styles.link}>
              términos y condiciones
            </a>{" "}
            y la{" "}
            <a href="#" style={styles.link}>
              política de privacidad
            </a>
            .
          </span>
        </div>

        <button
          onClick={handleRegister}
          style={{
            ...styles.submitButton,
            backgroundColor: isValid ? "#007AFF" : "#aaa",
            cursor: isValid ? "pointer" : "not-allowed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
          disabled={!isValid || loading}
        >
          {loading ? <FaSpinner className="spinner" style={{ animation: "spin 1s linear infinite" }} /> : "Registrarse"}
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
    padding: "12px 3px",
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 10,
    fontSize: 14,
    outline: "none",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    display: "block",
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: 10,
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
    color: "#007AFF",
    textDecoration: "underline",
  },
  submitButton: {
    background: "#007AFF",
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
    color: "#007AFF",
    fontSize: 14,
    cursor: "pointer",
    fontWeight: "500",
  },
};

// Agrega este CSS global en tu app para animación de spinner (si no lo tienes ya)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

