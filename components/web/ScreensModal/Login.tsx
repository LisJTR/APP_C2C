// components/web/ScreensModal/LoginScreen.tsx
import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { loginUser } from "@/api/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";

export default function LoginScreen({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
    const [isLogin, setIsLogin] = useState(true);
  
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const validateEmail = (value: string) => {
      setEmail(value);
      setEmailError(
        !value.includes("@") || !value.includes(".") ? "Correo inválido." : ""
      );
    };

    const validatePassword = (value: string) => {
      setPassword(value);
      setPasswordError(value.length < 6 ? "Mínimo 6 caracteres." : "");
    };
  
    const validateUsername = (value: string) => {
      setUsername(value);
      setUsernameError(value.trim().length === 0 ? "Nombre de usuario obligatorio." : "");
    };
  
    const handleSubmit = async () => {
      setGeneralError("");
      if (
        !email || !password ||
        emailError || passwordError ||
        (!isLogin && (usernameError || !username))
      ) {
        setGeneralError("Por favor, completa todos los campos correctamente.");
        return;
      }
  
      setLoading(true);
      if (isLogin) {
        const result = await loginUser(email, password);
        setLoading(false);
  
        if (result.token && result.user) {
          login(result.token, result.user);
          onClose();
          router.replace("/(tabs)/home");
        } else {
          setGeneralError(result.message || "Error al iniciar sesión.");
        }
      }
    };


  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={22} />
        </button>

        <h2 style={styles.title}>Iniciar sesión</h2>

        <input
          style={styles.input}
          placeholder="E-mail o nombre de usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
  onClick={handleSubmit}
  style={{
    ...styles.button,
    backgroundColor: "#007AFF",
    opacity: email && password ? 1 : 0.5,
    cursor: email && password ? "pointer" : "not-allowed",
  }}
  disabled={!email || !password}
>
  {loading ? "Cargando..." : "Continuar"}
</button>

{generalError && (
  <p style={{ color: "red", fontSize: 13, textAlign: "center", marginTop: 8 }}>
    {generalError}
  </p>
)}


        <p style={styles.link}>¿Olvidaste tu contraseña?</p>
        <p style={styles.link}>¿Necesitas ayuda?</p>
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
    marginBottom: 14,
    fontSize: 14,
    outline: "none",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 8,
    border: "none",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
    cursor: "pointer",
    fontWeight: "500",
  },
};
