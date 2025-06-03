// utils/auth.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return sessionStorage.getItem("token"); // ✅ aquí es el cambio clave
  } else {
    return await SecureStore.getItemAsync("token");
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error("Error comprobando sesión:", error);
    return false;
  }
};
