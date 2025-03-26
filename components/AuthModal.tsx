import {
    Modal, View, Text, TextInput,
    Pressable, StyleSheet, ActivityIndicator
  } from "react-native";
  import { useState } from "react";
  import { loginUser, registerUser } from "@/api/api";
  import { useAuthStore } from "@/store/useAuthStore";
  import { useRouter } from "expo-router";
  
  export default function AuthModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
          router.replace("/(tabs)");
        } else {
          setGeneralError(result.message || "Error al iniciar sesión.");
        }
      } else {
        const result = await registerUser(username, email, password);
        setLoading(false);
  
        if (result.user) {
          setIsLogin(true);
          setGeneralError("Registro exitoso. Ahora puedes iniciar sesión.");
        } else {
          setGeneralError(result.message || "Error al registrarse.");
        }
      }
    };
  
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>{isLogin ? "Iniciar Sesión" : "Registrarse"}</Text>
  
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  onChangeText={validateUsername}
                  value={username}
                />
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
              </>
            )}
  
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              onChangeText={validateEmail}
              value={email}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
  
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={validatePassword}
              value={password}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
  
            {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
  
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 10 }} />
            ) : (
              <Pressable
                style={[
                  styles.button,
                  (!!emailError || !!passwordError || (!isLogin && (!!usernameError || !username)) || !email || !password) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={
                  !!emailError || !!passwordError ||
                  (!isLogin && (!!usernameError || !username)) ||
                  !email || !password
                }
              >
                <Text style={styles.buttonText}>{isLogin ? "Entrar" : "Registrarse"}</Text>
              </Pressable>
            )}
  
            <Pressable onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchText}>
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </Text>
            </Pressable>
  
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
  

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  switchText: {
    textAlign: "center",
    color: "#007AFF",
    marginBottom: 10,
    fontWeight: "bold",
  },
  closeText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "flex-start",
    marginLeft: 5,
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },  
});
