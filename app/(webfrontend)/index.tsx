// app/index.tsx

// Importaciones necesarias para componentes, navegación, utilidades y estilos
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import HeaderLoggedIn from "./components/HeaderLoggedIn"; // Header mostrado si hay sesión
import { isLoggedIn } from "@/utils/auth"; // Función que verifica si hay sesión activa
import BoddyLoggin from "../(webfrontend)/components/BoddyLoggin"; // Componente con contenido principal
import ProductGrid from "../../components/web/products/ProductGrid"; // Componente que muestra los productos
import Footer from "../../components/web/Footer"; // Pie de página
import { ScrollView, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore"; // Estado global con Zustand

export default function Index() {
  const { loadUser } = useAuthStore(); // Función que recupera el usuario desde almacenamiento
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar si se está comprobando la sesión
  const [logged, setLogged] = useState(false); // Estado booleano de si el usuario está logueado

  // Al montar el componente, se carga el usuario desde Zustand
  useEffect(() => {
    loadUser(); // <-- Llamada a cargar datos de usuario si existiesen (por ejemplo, desde localStorage o SecureStore)
  }, []);
  
  // Se verifica si el usuario tiene sesión activa usando la función isLoggedIn()
  useEffect(() => {
    const checkSession = async () => {
      const loggedIn = await isLoggedIn();
      setLogged(loggedIn);
      setLoading(false); // Una vez verificada la sesión, quitamos el loading
    };
    checkSession();
  }, []);

  // Si ya no está cargando y no está logueado, se redirige al usuario a la pantalla de bienvenida
  useEffect(() => {
    if (!loading && !logged) {
      router.replace("/welcome");
    }
  }, [loading, logged]);

  // Mientras se comprueba la sesión, no se renderiza nada
  if (loading) return null;

  // Mientras se comprueba la sesión, no se renderiza nada
  if (loading) return null;

  return (
    <>
      {/* Si hay sesión iniciada, mostramos el contenido principal */}
      {logged && (
        <>
          <HeaderLoggedIn onSearch={(query) => console.log("Buscando:", query)} />

          <ScrollView
            style={{ flex: 1, backgroundColor: "#fff" }}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            <View style={{ backgroundColor: "#fff" }}>
              <BoddyLoggin onLoginPress={() => {}} /> {/* Contenido de bienvenida/logueado */}
              <View style={{ paddingHorizontal: 32, marginTop: -40 }}>
                <ProductGrid onProductClick={() => {}} /> {/* Grid de productos del usuario */}
              </View>
              <Footer /> {/* Pie de página */}
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}