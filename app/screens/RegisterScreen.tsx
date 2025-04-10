import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Pressable, ScrollView, ActivityIndicator
} from "react-native";
import { registerUser } from "../../api/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { useTranslation } from "react-i18next";


export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [offersChecked, setOffersChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const iconScale = useSharedValue(1);
  const { t } = useTranslation();

const animatedIconStyle = useAnimatedStyle(() => ({
  transform: [{ scale: iconScale.value }],
  opacity: iconScale.value,
}));


  const validateUsername = (value: string) => {
    setUsername(value);
    if (!value.trim()) {
      setUsernameError(t("registerScreen.errorUsernameEmpty"));
    } else if (value.length < 3 || value.length > 20) {
      setUsernameError(t("registerScreen.errorUsernameLength"));
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setUsernameError(t("registerScreen.errorUsernameInvalid"));
    } else {
      setUsernameError("");
    }
  };

  const validateEmail = (value: string) => {
    setEmail(value);
    if (!value.trim()) {
      setEmailError(t("registerScreen.errorEmailEmpty"));
    } else if (!value.includes("@") || !value.includes(".")) {
      setEmailError(t("registerScreen.errorEmailInvalid"));
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    if (!value.trim()) {
      setPasswordError(t("registerScreen.errorPasswordEmpty"));
    } else if (value.length < 6) {
      setPasswordError(t("registerScreen.errorPasswordShort"));
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async () => {
    validateUsername(username);
    validateEmail(email);
    validatePassword(password);

    if (usernameError || emailError || passwordError || !termsChecked) return;

    setIsLoading(true);
    const result = await registerUser(username, email, password);
    setIsLoading(false);

    if (result.user) {
      router.replace("./screens/LoginScreen");
    } else {
      alert(result.message || t("registerScreen.registerError"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* 🔙 Flecha de retroceso */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={22} color="#555" />
      </TouchableOpacity>

      <Text style={styles.title}>{t("registerScreen.title")}</Text>

      <TextInput
        placeholder={t("registerScreen.usernamePlaceholder")}
         placeholderTextColor="#555"
        style={styles.input}
        value={username}
        onChangeText={validateUsername}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      <TextInput
        placeholder= {t("registerScreen.emailPlaceholder")}
        placeholderTextColor="#555"
        style={styles.input}
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.passwordContainer}>
  <TextInput
    placeholder= {t("registerScreen.passwordPlaceholder")}
    placeholderTextColor="#555"
    style={styles.passwordInput}
    value={password}
    onChangeText={validatePassword}
    secureTextEntry={!showPassword}
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

      <Pressable style={styles.checkboxRow} onPress={() => setOffersChecked(!offersChecked)}>
        <View style={styles.checkbox}>
          {offersChecked && <View style={styles.checkboxChecked} />}
        </View>
        <Text style={styles.checkboxText}>
          {t("registerScreen.offers")}
        </Text>
      </Pressable>

      <Pressable style={styles.checkboxRow} onPress={() => setTermsChecked(!termsChecked)}>
        <View style={styles.checkbox}>
          {termsChecked && <View style={styles.checkboxChecked} />}
        </View>
        <Text style={styles.checkboxText}>
          {t("registerScreen.terms")}
        </Text>
      </Pressable>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00786F" style={{ marginTop: 10 }} />
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            (!termsChecked || usernameError || emailError || passwordError || !username || !email || !password) &&
              styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={
            !termsChecked || !!usernameError || !!emailError || !!passwordError || !username || !email || !password
          }
        >
          <Text style={styles.buttonText}>{t("registerSceen.registerBtn")}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity>
        <Text style={styles.helpText}>{t("registerScreen.needHelp")}</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 100,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    marginTop: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#007AFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: "#2F70AF",
    borderRadius: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  helpText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 25,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
    alignSelf: "flex-start",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    color: "#",
  },  
});
