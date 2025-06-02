// Importamos componentes de interfaz nativos de React Native
import { View, Modal, Text, Pressable, StyleSheet } from "react-native";

// Importamos íconos de bibliotecas externas
import { FontAwesome, AntDesign } from "@expo/vector-icons";

// Hooks y módulos de navegación y almacenamiento seguro
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Importamos los componentes de inicio de sesión y registro
import RegisterScreen from "../ScreensModal/Register";
import LoginScreen from "../ScreensModal/Login";

// Hooks personalizados para autenticación con redes sociales
import { useGoogleAuth, useFacebookAuth } from "@/hooks/auth/useSocialAuth";

// Hook global para almacenar y recuperar el estado del usuario autenticado
import { useAuthStore } from "@/store/useAuthStore";

// Función API para login con Google (en backend)
//import { loginWithGoogle } from "@/api/api";

// Componente principal: Modal de autenticación para la versión web
export default function AuthModalWeb({
  visible,        // Si el modal debe mostrarse
  onClose,        // Función que se llama al cerrar el modal
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Hooks para Google y Facebook Auth
  const {
    promptAsync: googlePrompt,
    response: googleResponse,
  } = useGoogleAuth();
  const {
    promptAsync: facebookPrompt,
    response: facebookResponse,
  } = useFacebookAuth();

  // Cuando el registro es exitoso, se redirige a verificación por email
  const handleRegisterSuccess = (email: string) => {
    setShowRegister(false);
    onClose();
    setTimeout(() => {
      router.push({
        pathname: "/email-verification/[email]",
        params: { email },
      });
    }, 100);
  };

  // Cierra el modal y reinicia los estados internos
  const handleClose = () => {
    setShowRegister(false);
    setShowLogin(false);
    onClose();
  };

  // Maneja el login con Google una vez se recibe respuesta
  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (googleResponse?.type === "success" && googleResponse.authentication?.accessToken) {
        try {
          const result = await loginWithGoogle(googleResponse.authentication.accessToken);
          console.log("🟢 Resultado backend Google:", result);

          if (result.token) {
            await SecureStore.setItemAsync("token", result.token);
            login(result.token, {
              id: result.user.id,
              username: result.user.username,
              email: result.user.email,
            });
            handleClose();
            router.replace("/(webfrontend)");
          } else {
            alert(result.message || "No se pudo iniciar sesión con Google");
          }
        } catch (error) {
          console.error("❌ Error autenticando con Google:", error);
          alert("Hubo un problema con Google Sign-In");
        }
      }
    };
    handleGoogleLogin();
  }, [googleResponse]);

  // Maneja el login con Facebook
  useEffect(() => {
    const handleFacebookLogin = async () => {
      if (facebookResponse?.type === "success" && facebookResponse.authentication?.accessToken) {
        await SecureStore.setItemAsync("token", facebookResponse.authentication.accessToken);
        login(facebookResponse.authentication.accessToken, {
          username: "FacebookUser",
          email: "facebookuser@demo.com",
        });
        handleClose();
        router.replace("/(webfrontend)");
      }
    };
    handleFacebookLogin();
  }, [facebookResponse]);

  // Renderizado del modal con sus variantes
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </Pressable>

          {showRegister ? (
            <RegisterScreen
              onClose={() => setShowRegister(false)}
              onSuccess={handleRegisterSuccess}
            />
          ) : showLogin ? (
            <LoginScreen onClose={() => setShowLogin(false)} />
          ) : (
            <>
              <Text style={styles.title}>
                Únete y vende los productos que no uses sin pagar comisión
              </Text>

              {/* Botones sociales */}
              <Pressable style={styles.socialBtn} onPress={() => googlePrompt()}>
                <AntDesign name="google" size={18} color="#DB4437" />
                <Text style={styles.socialText}>Continuar con Google</Text>
              </Pressable>

              <Pressable style={styles.socialBtn} onPress={() => facebookPrompt()}>
                <FontAwesome name="facebook" size={18} color="#1877F2" />
                <Text style={[styles.socialText, { color: "#1877F2" }]}>
                  Continuar con Facebook
                </Text>
              </Pressable>

              <Text style={styles.separator}>O usa tu correo</Text>

              {/* Enlaces para login o registro */}
              <View style={styles.linkGroup}>
                <Text style={styles.linkText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.link} onPress={() => setShowRegister(true)}>
                    Regístrate
                  </Text>
                </Text>
                <Text style={styles.linkText}>
                  ¿Ya tienes una cuenta?{" "}
                  <Text style={styles.link} onPress={() => setShowLogin(true)}>
                    Inicia sesión
                  </Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Estilos del modal
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 5,
    right: 10,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    cursor: "pointer",
  },
  title: {
    top: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  socialBtn: {
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  socialText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  separator: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginVertical: 12,
  },
  linkGroup: {
    marginBottom: 10,
  },
  linkText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 6,
  },
  link: {
    color: "#007AFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
