// Importamos React y useState para gestionar estados locales
import React, { useState } from "react";

// Importamos el router para navegación
import { useRouter } from "expo-router";

// Importamos el hook global de Zustand para gestionar la sesión
import { useAuthStore } from "@/store/useAuthStore";

// Componente para verificación del código enviado por e-mail
export default function EmailVerification({ email }: { email: string }) {
  // Estado del código ingresado
  const [code, setCode] = useState("");

  // Controla si se muestra la información para reenviar el código
  const [showResendInfo, setShowResendInfo] = useState(false);

  // Dirección de e-mail para reenviar el código
  const [resendEmail, setResendEmail] = useState(email);

  // Mensaje de éxito tras reenviar
  const [successMessage, setSuccessMessage] = useState("");

  // Hook para redireccionar
  const router = useRouter();

  // Verifica el código ingresado
  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🧠 Guardar token en sessionStorage (solo si hay ventana disponible)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("token", data.token);
        }

        // ✅ Actualizar estado global con el login
        const login = useAuthStore.getState().login;
        login(data.token, {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        });

        // ✅ Redirige a la pantalla principal
        router.replace("/");
      } else {
        alert(data.message || "Código incorrecto");
      }
    } catch (err) {
      alert("Error al verificar el código");
      console.error(err);
    }
  };

  // Reenvía el código de verificación
  const handleResend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Código reenviado correctamente");
      } else {
        alert(data.message || "Error al reenviar el código");
      }
    } catch (err) {
      alert("Error de red al intentar reenviar el código");
    }
  };

  // Renderizado de la interfaz
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Verificación del e-mail</h2>

        {!showResendInfo ? (
          <>
            {/* Instrucciones */}
            <p style={styles.text}>
              Introduce el código de verificación de 6 dígitos que hemos enviado a:
              <br />
              <strong>{email}</strong>
            </p>

            {/* Campo para ingresar código */}
            <input
              type="text"
              maxLength={6}
              placeholder="Introduce el código de verificación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={styles.input}
            />

            {/* Botón para verificar */}
            <button
              onClick={handleVerify}
              style={{
                ...styles.button,
                opacity: code.length === 6 ? 1 : 0.6,
                cursor: code.length === 6 ? "pointer" : "not-allowed",
              }}
              disabled={code.length !== 6}
            >
              Verificar
            </button>

            {/* Enlaces de ayuda */}
            <p style={styles.link} onClick={() => setShowResendInfo(true)}>
              ¿No has recibido el código?
            </p>

            <p style={styles.link}>¿Tienes alguna pregunta?</p>
          </>
        ) : (
          <>
            {/* Sección para reenviar el código */}
            <h3 style={{ marginBottom: 12 }}>No he recibido el e-mail</h3>
            <ul style={styles.list}>
              <li>Asegúrate de que has introducido tu dirección de e-mail correctamente.</li>
              <li>Comprueba la carpeta de correo no deseado.</li>
              <li>Haz clic abajo para reenviar el código.</li>
              <li>
                Si el problema persiste, puedes{" "}
                <a href="#" style={styles.link}>
                  encontrar más soluciones
                </a>
                .
              </li>
            </ul>

            {/* Campo para corregir el e-mail */}
            <input
              style={styles.input}
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Tu dirección de e-mail"
            />
            <small>Comprueba que tu dirección de e-mail sea la correcta</small>

            {/* Mensaje tras reenviar */}
            {successMessage && (
              <p style={{ color: "green", marginTop: 10 }}>{successMessage}</p>
            )}

            {/* Botón de reenvío */}
            <button onClick={handleResend} style={styles.button}>
              Reenviar el código de verificación
            </button>

            {/* Botón para volver */}
            <button onClick={() => setShowResendInfo(false)} style={styles.secondaryButton}>
              ← Volver
            </button>
          </>
        )}

        {/* Pie de página con enlaces */}
        <div style={styles.footer}>
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Nuestra plataforma</a>
        </div>
      </div>
    </div>
  );
}

// Estilos CSS en objeto JS
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  container: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 460,
    borderRadius: 12,
    padding: 32,
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 25,
  },
  list: {
    textAlign: "left",
    marginBottom: 20,
    paddingLeft: 20,
    fontSize: 14,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#007AFF",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    border: "none",
    borderRadius: 8,
    marginBottom: 20,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "transparent",
    border: "2px solid #007AFF",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
  },
  link: {
    fontSize: 13,
    color: "#007AFF",
    textDecoration: "underline",
    cursor: "pointer",
    marginBottom: 5,
  },
  footer: {
    fontSize: 11,
    color: "#888",
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
};
