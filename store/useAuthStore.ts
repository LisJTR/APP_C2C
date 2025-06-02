import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { User } from "../types/types";

// 📌 Estado de autenticación
interface AuthState {
  token: string | null;
  user: User | null;
  invitado: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setInvitado: (valor: boolean) => void;
  setInvitadoTrue: () => void;
  updateUser: (newUser: User) => Promise<void>;
  setUser: (user: User) => void;
}

// 📌 Zustand con persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      invitado: false,

      setUser: (user) => set({ user }),
      setInvitado: (valor) => set({ invitado: valor }),
      setInvitadoTrue: () => set({ invitado: true }),

      login: async (token, user) => {
        try {
          if (Platform.OS === "web") {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user));
          } else {
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));
          }
          set({ token, user, invitado: false });
        } catch (error) {
          console.error("Error guardando sesión:", error);
        }
      },

      logout: async () => {
        try {
          if (Platform.OS === "web") {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
          } else {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
          }
          set({ token: null, user: null, invitado: false });
        } catch (error) {
          console.error("Error cerrando sesión:", error);
        }
      },

      loadUser: async () => {
        try {
          let token: string | null = null;
          let userData: string | null = null;

          if (Platform.OS === "web") {
            token = sessionStorage.getItem("token");
            userData = sessionStorage.getItem("user");
          } else {
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

      updateUser: async (newUser) => {
        try {
          const token = get().token;
          if (token) {
            if (Platform.OS === "web") {
              sessionStorage.setItem("user", JSON.stringify(newUser));
            } else {
              await AsyncStorage.setItem("user", JSON.stringify(newUser));
            }
            set({ user: newUser });
          }
        } catch (error) {
          console.error("Error actualizando usuario:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        Platform.OS === "web"
          ? {
              getItem: (key) => Promise.resolve(sessionStorage.getItem(key)),
              setItem: (key, value) => Promise.resolve(sessionStorage.setItem(key, value)),
              removeItem: (key) => Promise.resolve(sessionStorage.removeItem(key)),
            }
          : AsyncStorage
      ),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

