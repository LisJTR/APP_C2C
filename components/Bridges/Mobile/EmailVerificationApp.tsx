// components/Bridges/Mobile/EmailVerificationApp.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/utils/config";

export default function EmailVerificationApp({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [resendEmail, setResendEmail] = useState(email);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-code`,  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        await useAuthStore.getState().login(data.token, data.user);
        router.replace("/home");
      } else {
        Alert.alert("Error", data.message || "Código incorrecto");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error al verificar el código");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Código reenviado correctamente");
      } else {
        Alert.alert("Error", data.message || "No se pudo reenviar el código");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error de red");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificación de email</Text>
      <Text style={styles.text}>Introduce el código enviado a: {email}</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Código de verificación"
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, code.length !== 6 && styles.disabledButton]}
        onPress={handleVerify}
        disabled={code.length !== 6}
      >
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>

      <Text style={styles.resendLabel}>¿No has recibido el código?</Text>

      <TextInput
        style={styles.input}
        value={resendEmail}
        onChangeText={setResendEmail}
        placeholder="Tu correo electrónico"
        keyboardType="email-address"
      />

      {successMessage !== "" && <Text style={{ color: "green" }}>{successMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleResend}>
        <Text style={styles.buttonText}>Reenviar código</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  text: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  resendLabel: { marginTop: 20, marginBottom: 8, textAlign: "center" },
});
