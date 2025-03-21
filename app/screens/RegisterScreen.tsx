import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { registerUser } from "../../api/api";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para mostrar errores
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  // Validación en tiempo real
  const validateUsername = (text: string) => {
    setUsername(text);
    setUsernameError(text.length === 0 ? "El usuario es obligatorio." : "");
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError(
      text.length === 0
        ? "El correo es obligatorio."
        : !text.includes("@") || !text.includes(".")
        ? "Ingresa un correo válido."
        : ""
    );
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(
      text.length === 0
        ? "La contraseña es obligatoria."
        : text.length < 6
        ? "Debe tener al menos 6 caracteres."
        : ""
    );
  };

  const handleRegister = async () => {
    console.log("📌 Intentando registrar...");

    if (!username || !email || !password || usernameError || emailError || passwordError) {
      return;
    }

    const result = await registerUser(username, email, password);
    console.log("📌 Respuesta de la API:", result);

    if (result.user) {
      alert("Registro exitoso, ahora puedes iniciar sesión.");
      router.replace("/screens/LoginScreen"); // ✅ Redirige a Login
    } else {
      alert(result.message || "No se pudo registrar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput style={styles.input} placeholder="Usuario" onChangeText={validateUsername} value={username} />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      <TextInput style={styles.input} placeholder="Correo" onChangeText={validateEmail} value={email} keyboardType="email-address" />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput style={styles.input} placeholder="Contraseña" onChangeText={validatePassword} value={password} secureTextEntry />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity
  style={[
    styles.button,
    !!(usernameError || emailError || passwordError || !username || !email || !password) && styles.disabledButton
  ]}
  onPress={handleRegister}
  disabled={!!(usernameError || emailError || passwordError || !username || !email || !password)}
>
  <Text style={styles.buttonText}>REGISTRAR</Text>
</TouchableOpacity>


      <TouchableOpacity onPress={() => router.push("/screens/LoginScreen")}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// 📌 Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 15,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
