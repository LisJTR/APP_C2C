import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";



const images = [
  require("../../assets/welcome/1.jpg"),
  require("../../assets/welcome/2.jpg"),
  require("../../assets/welcome/3.jpg"),
  require("../../assets/welcome/4.jpg"),
  require("../../assets/welcome/5.jpg"),
  require("../../assets/welcome/6.jpg"),
  require("../../assets/welcome/7.jpg"),
  require("../../assets/welcome/8.jpg"),
  require("../../assets/welcome/9.jpg"),
];

export default function WelcomeScreenMobile() {
  const router = useRouter();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);


  const languages = [
    { code: "es", label: "Español", sub: "Spanish" },
    { code: "en", label: "English", sub: "English" },
    { code: "pt", label: "Português", sub: "Portuguese" },
  ];

  const { response: googleResponse, promptAsync: googleLogin } = useGoogleAuth();

useEffect(() => {
  if (googleResponse?.type === "success") {
    const { authentication } = googleResponse;
    if (authentication?.accessToken) {
      loginWithGoogleToken(authentication.accessToken);
    }
  }
}, [googleResponse]);

const loginWithGoogleToken = async (token: string) => {
  try {
    const res = await axios.post("http://192.168.1.227:5000/api/auth/google", {
      access_token: token,
    });

    const { token: jwt, user } = res.data;
    useAuthStore.getState().login(jwt, user);
    router.replace("/(tabs)");
  } catch (error) {
    console.error("❌ Error en login con Google:", error);
    alert("Error al iniciar sesión con Google.");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Idioma y Saltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setLanguageModalVisible(true)}>
          <Text style={styles.language}>
            🌐 {languages.find((l) => l.code === selectedLanguage)?.label}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.skip}>Saltar</Text>
        </TouchableOpacity>
      </View>

    {/* Modal de Crear cuenta */}
    <Modal
  visible={showRegisterOptions}
  animationType="slide"
  transparent
  onRequestClose={() => setShowRegisterOptions(false)}
>
  <View style={styles.bottomModalOverlay}>
    <View style={styles.registerModal}>
    <View style={styles.closeRow}>
  <TouchableOpacity onPress={() => setShowRegisterOptions(false)}>
    <Text style={styles.closeIcon}>✕</Text>
  </TouchableOpacity>
</View>

      <Text style={styles.modalTitle}>Regístrate en KCL</Text>
      <Text style={styles.modalSubtitle}>Usa tu cuenta para comenzar.</Text>

      <TouchableOpacity style={styles.socialButton} onPress={() => googleLogin()}>
  <View style={styles.socialContent}>
    <FontAwesome name="google" size={20} color="#DB4437" style={styles.icon} />
    <Text style={styles.socialText}>Continuar con Google</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.socialButton}>
  <View style={styles.socialContent}>
    <FontAwesome name="facebook" size={20} color="#1877F2" style={styles.icon} />
    <Text style={styles.socialText}>Continuar con Facebook</Text>
  </View>
</TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setShowRegisterOptions(false);
        router.push("/screens/RegisterScreen");
      }}>
        <Text style={styles.emailLink}>Continuar con e-mail</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/*Modal Iniciar Sesión*/}
<Modal
  visible={showLoginOptions}
  animationType="slide"
  transparent
  onRequestClose={() => setShowLoginOptions(false)}>

  <View style={styles.bottomModalOverlay}>
    <View style={styles.registerModal}>
    <View style={styles.closeRow}>
  <TouchableOpacity onPress={() => setShowLoginOptions(false)}>
    <Text style={styles.closeIcon}>✕</Text>
  </TouchableOpacity>
</View>




      <Text style={styles.modalTitle}>Inicia sesión en KCL</Text>

      <TouchableOpacity style={styles.socialButton} onPress={() => googleLogin()}>
  <View style={styles.socialContent}>
    <FontAwesome name="google" size={20} color="#DB4437" style={styles.icon} />
    <Text style={styles.socialText}>Continuar con Google</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.socialButton}>
  <View style={styles.socialContent}>
    <FontAwesome name="facebook" size={20} color="#1877F2" style={styles.icon} />
    <Text style={styles.socialText}>Continuar con Facebook</Text>
  </View>
</TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setShowLoginOptions(false);
        router.push("/screens/LoginScreen");
      }}>
        <Text style={styles.emailLink}>Continuar con e-mail</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



      {/* Collage de imágenes */}
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
      />

      {/* Mensaje central */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Únete y vende los artículos que ya no usas
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setShowRegisterOptions(true)}
        >
          <Text style={styles.primaryText}>Crea tu perfil en Vinted</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowLoginOptions(true)}
        >
          <Text style={styles.secondaryText}>Ya tengo una cuenta</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Sobre KCL Trading:{" "}
          <Text
            style={{ color: "#007AFF", textDecorationLine: "underline" }}
          >
            Nuestra plataforma
          </Text>
        </Text>
      </View>

      {/* Modal de idioma */}
      <Modal visible={languageModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>
            <Text style={styles.modalTitle}>Cambiar idioma</Text>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.languageOption}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <Text style={styles.languageLabel}>
                  {lang.label}{" "}
                  <Text style={{ color: "#888" }}>({lang.sub})</Text>
                </Text>
                <View style={styles.radioCircle}>
                  {selectedLanguage === lang.code && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.primaryText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.modalCancel}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  language: {
    fontSize: 16,
  },
  skip: {
    color: "#000",
    fontWeight: "bold",
  },
  image: {
    width: "33.33%",
    aspectRatio: 1,
    margin: 1,
  },
  textContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#2F70AF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    marginTop: 30,
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#00786F",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  secondaryText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#2F70AF",
  },
  footer: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  languageModal: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "85%",
    maxWidth: 400,
  },
  
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  languageLabel: {
    fontSize: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00786F",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#00786F",
  },
  bottomModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  registerModal: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 60,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  socialText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  emailLink: {
    fontSize: 16,
    color: "#2F70AF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  modalCancel: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeIcon: {
    fontSize: 22,
    color: "#000",
  },
  socialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  
  
});
