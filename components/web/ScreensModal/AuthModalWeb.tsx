// components/web/AuthModalWeb.tsx
import { View, Modal, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router"; // Necesario para redirección
import RegisterScreen from "../ScreensModal/Register";
import { usePathname } from "expo-router";
import { useEffect } from "react";


export default function AuthModalWeb({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter(); // Importante

  // ✅ Maneja el éxito del registro
  const handleRegisterSuccess = (email: string) => {
    setShowRegister(false);
    onClose(); // Cierra el modal
    setTimeout(() => {
      router.push({
          pathname: "/email-verification/[email]",
          params: { email },
        });
            }, 100);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Botón de cierre */}
          <Pressable
            onPress={() => {
              setShowRegister(false);
              onClose();
            }}
            style={styles.closeBtn}
          >
            <Text style={{ fontSize: 22 }}>✕</Text>
          </Pressable>

          {showRegister ? (
            <RegisterScreen
              onClose={() => setShowRegister(false)}
              onSuccess={handleRegisterSuccess} // ✅ Aquí se pasa la función
            />
          ) : (
            <>
              <Text style={styles.title}>
                Únete y vende la ropa que no te pones sin pagar comisión
              </Text>

              <Pressable style={styles.socialBtn}>
                <AntDesign name="google" size={18} color="#DB4437" />
                <Text style={styles.socialText}>Continuar con Google</Text>
              </Pressable>

              <Pressable style={styles.socialBtn}>
                <FontAwesome name="facebook" size={18} color="#1877F2" />
                <Text style={[styles.socialText, { color: "#1877F2" }]}>
                  Continuar con Facebook
                </Text>
              </Pressable>

              <Text style={styles.separator}>O usa tu correo</Text>

              <View style={styles.linkGroup}>
                <Text style={styles.linkText}>
                  ¿No tienes cuenta?{" "}
                  <Text
                    style={styles.link}
                    onPress={() => setShowRegister(true)}
                  >
                    Regístrate
                  </Text>
                </Text>
                <Text style={styles.linkText}>
                  ¿Ya tienes una cuenta?{" "}
                  <Text style={styles.link}>Inicia sesión</Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}


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
