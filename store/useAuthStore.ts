import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/types"; // Asegúrate de que `types.ts` tiene la interfaz `User`

// 📌 Estado de autenticación
interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// 📌 Zustand con persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      // 📌 Iniciar sesión y guardar usuario en AsyncStorage
      login: async (token, user) => {
        try {
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(user));
          set({ token, user });
        } catch (error) {
          console.error("Error guardando sesión:", error);
        }
      },

      // 📌 Cerrar sesión y eliminar datos almacenados
      logout: async () => {
        try {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          set({ token: null, user: null });
        } catch (error) {
          console.error("Error cerrando sesión:", error);
        }
      },

      // 📌 Cargar sesión al iniciar la app
      loadUser: async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const userData = await AsyncStorage.getItem("user");

          if (token && userData) {
            const parsedUser: User | null = JSON.parse(userData);
            if (parsedUser) {
              set({ token, user: parsedUser });
            }
          }
        } catch (error) {
          console.error("Error cargando usuario:", error);
        }
      },
    }),
    {
      name: "auth-storage", // Nombre del almacenamiento en AsyncStorage
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);
