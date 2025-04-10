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
import { useTranslation } from "react-i18next";



export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  // 🔹 Manejo de inicio de sesión
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", t("auth.requiredFields"));
      return;
    }

    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);

    if (result.token && result.user) {
      login(result.token, result.user);
      Alert.alert(t("auth.loginSuccess"));
      router.replace("./tabs"); // Redirige al usuario a la app
    } else {
      Alert.alert("Error", result.message || t("auth.loginError"));
    }
  };

  // 🔹 Manejo de registro
  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", t("auth.requiredFields"));
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error",  t("auth.shortPassword"));
      return;
    }

    setIsLoading(true);
    const result = await registerUser(username, email, password);
    setIsLoading(false);

    if (result.user) {
      Alert.alert( t("auth.registerSuccess"), t("auth.messageSuccess"));
      setIsLoginView(true);
      setError(null);
    } else {
      Alert.alert("Error", result.message || t("auth.registerError"));
    }
  };

  // 🔹 Permitir que el usuario entre sin cuenta
  const handleSkip = () => {
    router.replace("./(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLoginView ? t("auth.login") : t("auth.register")}</Text>

      <TextInput
        style={styles.input}
        placeholder= {t("auth.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder= {t("auth.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLoginView && (
        <TextInput
          style={styles.input}
          placeholder= {t("auth.username")}
          value={username}
          onChangeText={setUsername}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Pressable style={styles.button} onPress={isLoginView ? handleLogin : handleRegister}>
          <Text style={styles.buttonText}>{isLoginView ? t("auth.login") : t("auth.register") }</Text>
        </Pressable>
      )}

      <Pressable onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipButtonText}>{t("auth.skip")}</Text>
      </Pressable>

      <Pressable onPress={() => setIsLoginView(!isLoginView)}>
        <Text style={styles.switchText}>
          {isLoginView ? t("auth.noAccount") : t("auth.haveAccount")}
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
