// utils/storage.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Almacenar un valor
export const saveToken = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    sessionStorage.setItem(key, value); // ✅ solo en la sesión del navegador
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

// Obtener un valor
export const getToken = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return sessionStorage.getItem(key); // ✅ se borra al cerrar pestaña
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

// Eliminar un valor
export const deleteToken = async (key: string) => {
  if (Platform.OS === "web") {
    sessionStorage.removeItem(key); // ✅ compatible con el cambio
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};
