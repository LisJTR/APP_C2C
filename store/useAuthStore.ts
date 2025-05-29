import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/types";

// 📌 Estado de autenticación
interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (newUser: User) => Promise<void>;
  setUser: (user: User) => void; // ✅ agregado para actualizar en el estado
}

// 📌 Zustand con persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setUser: (user) => set({ user }), // ✅ Añadido aquí

      // 📌 Iniciar sesión
      login: async (token, user) => {
        try {
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(user));
          set({ token, user });
        } catch (error) {
          console.error("Error guardando sesión:", error);
        }
      },

      // 📌 Cerrar sesión
      logout: async () => {
        try {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          set({ token: null, user: null });
        } catch (error) {
          console.error("Error cerrando sesión:", error);
        }
      },

      // 📌 Cargar sesión
      loadUser: async () => {
  try {
    let token: string | null = null;
    let userData: string | null = null;

    if (typeof window !== "undefined") {
      // Web
      token = sessionStorage.getItem("token");
      userData = sessionStorage.getItem("user");
    } else {
      // Mobile
      token = await AsyncStorage.getItem("token");
      userData = await AsyncStorage.getItem("user");
    }

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

      // 📌 Actualizar usuario
      updateUser: async (newUser) => {
        try {
          const token = get().token;
          if (token) {
            await AsyncStorage.setItem("user", JSON.stringify(newUser));
            set({ user: newUser });
          }
        } catch (error) {
          console.error("Error actualizando usuario:", error);
        }
      },
    }),
    {
      name: "auth-storage",
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