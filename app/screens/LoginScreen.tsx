import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../../api/api";
import { useAuthStore } from "../../store/useAuthStore";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { useTranslation } from "react-i18next";



export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const iconScale = useSharedValue(1);
  const { t } = useTranslation();

const animatedIconStyle = useAnimatedStyle(() => ({
  transform: [{ scale: iconScale.value }],
  opacity: iconScale.value,
}));

  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateFields = () => {
    let valid = true;
    if (!emailOrUser.trim()) {
      setEmailError(t("loginScreen.emptyField"));
      valid = false;
    } else if (emailOrUser.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUser)) {
      setEmailError(t("loginScreen.invalidEmail"));
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError(t("loginScreen.emptyField"));
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    const result = await loginUser(emailOrUser.trim().toLowerCase(), password);
    setIsLoading(false);

    if (result.token && result.user) {
      login(result.token, result.user);
      router.replace("/(tabs)/home");
    } else {
      alert(result.message || t("loginScreen.loginError"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* 🔙 Flecha de retroceso */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>{t("loginScreen.userTitle")}</Text>

      <TextInput
        placeholder= {t("loginScreen.placeholderUser")}
        placeholderTextColor="#555"
        style={styles.input}
        value={emailOrUser}
        onChangeText={setEmailOrUser}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder= {t("loginScreen.placeholderPassword")}
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
       <TouchableOpacity
  onPress={() => {
    iconScale.value = withSpring(1.25, { damping: 10 }, () => {
      iconScale.value = withSpring(1);
    });
    setShowPassword(!showPassword);
  }}
>
  <Animated.View style={animatedIconStyle}>
    <Ionicons
      name={showPassword ? "eye-outline" : "eye-off-outline"}
      size={22}
      color="#555"
      style={{ marginLeft: 10 }}
    />
  </Animated.View>
</TouchableOpacity>

      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#00786F" style={{ marginTop: 15 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t("loginScreen.loginBtn")}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity>
        <Text style={styles.link}>{t("loginScreen.forgotPassword")}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.helpText}>{t("loginScreen.needHelp")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 100,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    marginBottom: 5,
    color: "#000", // 👈 importante
    backgroundColor: "#fff", // 👈 si usas fondo claro
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 2,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#000", // 👈 importante
  backgroundColor: "#fff", // 👈 importante
  borderWidth: 0,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  helpText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 25,
    fontWeight: "500",
  },
});
