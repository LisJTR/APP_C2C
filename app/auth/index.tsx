import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { loginUser, registerUser } from "../../api/api";

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  // 🔹 Manejo de inicio de sesión
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);

    if (result.token && result.user) {
      login(result.token, result.user);
      Alert.alert("Inicio de sesión exitoso");
      router.replace("/(tabs)"); // Redirige al usuario a la app
    } else {
      Alert.alert("Error", result.message || "Credenciales incorrectas.");
    }
  };

  // 🔹 Manejo de registro
  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    const result = await registerUser(username, email, password);
    setIsLoading(false);

    if (result.user) {
      Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
      setIsLoginView(true);
      setError(null);
    } else {
      Alert.alert("Error", result.message || "No se pudo registrar.");
    }
  };

  // 🔹 Permitir que el usuario entre sin cuenta
  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLoginView ? "Iniciar Sesión" : "Registro"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLoginView && (
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Pressable style={styles.button} onPress={isLoginView ? handleLogin : handleRegister}>
          <Text style={styles.buttonText}>{isLoginView ? "Iniciar Sesión" : "Registrarse"}</Text>
        </Pressable>
      )}

      <Pressable onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Saltar</Text>
      </Pressable>

      <Pressable onPress={() => setIsLoginView(!isLoginView)}>
        <Text style={styles.switchText}>
          {isLoginView ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </Text>
      </Pressable>
    </View>
  );
}

// 📌 **ESTILOS**
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F5F5F5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, backgroundColor: "#fff", marginBottom: 10 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, width: "100%", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  skipButton: { marginTop: 10, padding: 10 },
  skipButtonText: { color: "#007AFF", fontWeight: "bold", fontSize: 16 },
  switchText: { marginTop: 15, color: "#007AFF", fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 10, fontSize: 14, fontWeight: "bold" }, // 🔹 Añadido
});
