// LoginScreen.tsx

// ===================== IMPORTACIONES NECESARIAS =====================
import React, { useState } from "react"; // Importación de React y hook useState
import { Eye, EyeOff, X } from "lucide-react"; // Iconos de Lucide usados para la UI
import { loginUser } from "@/api/api"; // Función que realiza la llamada a la API de login
import { useAuthStore } from "@/store/useAuthStore"; // Hook de Zustand para manejar el estado global de autenticación
import { useRouter } from "expo-router"; // Hook de navegación proporcionado por Expo Router

// ===================== COMPONENTE LOGINSCREEN =====================
/**
 * Componente de formulario de login mostrado como modal.
 * Recibe una función `onClose` para cerrar el modal desde el componente padre.
 */
export default function LoginScreen({ onClose }: { onClose: () => void }) {
  // -------------------- ESTADOS LOCALES --------------------
  const [email, setEmail] = useState(""); // Campo de correo electrónico
  const [password, setPassword] = useState(""); // Campo de contraseña
  const [showPassword, setShowPassword] = useState(false); // Alternar visibilidad de la contraseña
  const [username, setUsername] = useState(""); // Campo de nombre de usuario (no usado en este formulario)
  const [isLogin, setIsLogin] = useState(true); // Determina si estamos en modo login o registro

  // -------------------- ESTADOS DE ERROR --------------------
  const [emailError, setEmailError] = useState(""); // Error de validación del email
  const [passwordError, setPasswordError] = useState(""); // Error de validación de contraseña
  const [usernameError, setUsernameError] = useState(""); // Error del nombre de usuario (no usado aquí)
  const [generalError, setGeneralError] = useState(""); // Mensaje de error general
  const [loading, setLoading] = useState(false); // Estado de carga para el botón

  // -------------------- FUNCIONES EXTERNAS --------------------
  const login = useAuthStore((state) => state.login); // Función para actualizar el estado global de sesión
  const router = useRouter(); // Navegador para redirección

  // -------------------- FUNCIONES DE VALIDACIÓN --------------------
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

  // -------------------- ENVÍO DEL FORMULARIO --------------------
  const handleSubmit = async () => {
    setGeneralError("");

    // Validación de campos obligatorios
    if (
      !email || !password ||
      emailError || passwordError ||
      (!isLogin && (usernameError || !username))
    ) {
      setGeneralError("Por favor, completa todos los campos correctamente.");
      return;
    }

    setLoading(true); // Inicia animación de carga

    // Sólo login (registro no implementado)
    if (isLogin) {
      const result = await loginUser(email, password); // Llamada a la API
      setLoading(false);

      if (result.token && result.user) {
        // Guardar token en el navegador (opcional)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("token", result.token);
        }

        // Guardar sesión global
        login(result.token, result.user);

        // Cerrar modal y redirigir
        onClose();
        router.replace("/"); // Redirige a la pantalla principal
      } else {
        setGeneralError(result.message || "Error al iniciar sesión.");
      }
    }
  };

  // ===================== RENDERIZADO =====================
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Botón para cerrar el modal */}
        <button style={styles.closeButton} onClick={onClose}>
          <X size={22} />
        </button>

        <h2 style={styles.title}>Iniciar sesión</h2>

        {/* Campo de e-mail */}
        <input
          style={styles.input}
          placeholder="E-mail o nombre de usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo de contraseña con botón para mostrar/ocultar */}
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

        {/* Botón de envío */}
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

        {/* Error general del formulario */}
        {generalError && (
          <p style={{ color: "red", fontSize: 13, textAlign: "center", marginTop: 8 }}>
            {generalError}
          </p>
        )}

        {/* Enlaces adicionales */}
        <p style={styles.link}>¿Olvidaste tu contraseña?</p>
        <p style={styles.link}>¿Necesitas ayuda?</p>
      </div>
    </div>
  );
}

// ===================== ESTILOS =====================
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    position: "relative",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "none",
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  link: {
    textAlign: "center",
    color: "#007AFF",
    marginTop: 12,
    fontSize: 14,
    cursor: "pointer",
  },
};
