import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router"; // ✅ Usa expo-router para navegación
import { loginUser } from "../../api/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ Estado para la carga
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // 🔹 Manejo de inicio de sesión
  const handleLogin = async () => {
    console.log("📌 Intentando iniciar sesión...");

    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true); // 🔹 Mostrar pantalla de carga
    const result = await loginUser(email, password);
    
    console.log("📌 Respuesta de la API:", result);
    setIsLoading(false); // 🔹 Ocultar carga después de recibir respuesta

    if (result.token && result.user) {
      login(result.token, result.user);
      Alert.alert("Inicio de sesión exitoso");
      router.replace("/(tabs)"); // ✅ Redirige a la pantalla principal
    } else {
      Alert.alert("Error", result.message || "Credenciales incorrectas.");
    }
  };

  // 🔹 Manejo del botón "Saltar"
  const handleSkip = () => {
    Alert.alert("Acceso sin cuenta", "Estás entrando sin iniciar sesión.");
    router.replace("/(tabs)"); // ✅ Redirige a la app sin autenticación
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Correo" 
        onChangeText={setEmail} 
        value={email} 
        keyboardType="email-address" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        onChangeText={setPassword} 
        value={password} 
        secureTextEntry 
      />

      {/* 🔹 Mostrar indicador de carga en lugar del botón */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push("/screens/RegisterScreen")}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      {/* 🔹 Botón "Saltar" para entrar sin iniciar sesión */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Saltar</Text>
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
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 15,
    color: "#007AFF",
    fontWeight: "bold",
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
  },
  skipButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
