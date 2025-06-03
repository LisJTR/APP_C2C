import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../i18n";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // ajústalo si la ruta cambia



export default function TabLayout() {

  const loadUser = useAuthStore((state) => state.loadUser); // Cargamos el usuario almacenado al iniciar

  useEffect(() => {
    loadUser();  // Ejecutamos la carga de usuario solo al montar el componente
  }, []);

  const colorScheme = useColorScheme(); // Detectamos si el usuario está en modo claro u oscuro
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: Platform.OS === "web" ? { display: "none" } : {}, // Ocultamos la barra de tabs si estamos en web
      
        
        
      }}
    >
       {/* Home */}
  <Tabs.Screen
    name="home"
    options={{
      title: "Home",
      headerShown: false,
      tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
    }}
  />

  {/* Mensajes 
  <Tabs.Screen
    name="messages"
    options={{
      title: "Mensajes",
      headerShown: false,
      tabBarIcon: ({ color }) => <Ionicons size={28} name="chatbubbles" color={color} />,
    }}
  />*/}

  {/* Vende */}
  <Tabs.Screen
    name="sell"
    options={{
      title: "Vende",
      headerShown: false,
      tabBarIcon: ({ color }) => <Ionicons size={28} name="add-circle" color={color} />,
    }}
  />

  {/* Buscar */}
  <Tabs.Screen
    name="explore"
    options={{
      title: "Buscar",
      headerShown: false, // Oculta el título en la parte superior
      tabBarIcon: ({ color }) => <Ionicons size={28} name="search" color={color} />,
    }}
  />

  {/*  Perfil */}
  <Tabs.Screen
    name="profile"
    options={{
      title: "Perfil",
      headerShown: false,
      tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
    }}
  />
  </Tabs>
  );
}
