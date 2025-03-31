import React, { useState } from "react";

export default function EmailVerification({ email }: { email: string }) {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    alert("Código ingresado: " + code);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Verificación del e-mail</h2>
        <p style={styles.text}>
          Introduce el código de verificación de 6 dígitos que hemos enviado a:
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          maxLength={6}
          placeholder="Introduce el código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
        />

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

        <p style={styles.link}>¿No has recibido el código?</p>
        <p style={styles.link}>¿Tienes alguna pregunta?</p>

        <div style={styles.footer}>
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Nuestra plataforma</a>
        </div>
      </div>
    </div>
  );
}

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
    backgroundColor: "#71c2bd",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    border: "none",
    borderRadius: 8,
    marginBottom: 20,
  },
  link: {
    fontSize: 13,
    color: "#007c91",
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
