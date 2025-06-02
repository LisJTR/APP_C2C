import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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


      // Iniciar sesión
      login: async (token, user) => {
        try {
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(user));
          set({ token, user, invitado: false });
        } catch (error) {
          console.error("Error guardando sesión:", error);
        }
      },

      // Cerrar sesión
      logout: async () => {
        try {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          set({ token: null, user: null, invitado: false });
        } catch (error) {
          console.error("Error cerrando sesión:", error);
        }
      },

      // Cargar sesión
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

      //  Actualizar usuario
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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user
      }),
    }
  )

);

setTimeout(() => {
  useAuthStore.setState({ invitado: false });
}, 0);
