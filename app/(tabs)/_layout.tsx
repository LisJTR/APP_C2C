import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../i18n";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // ajústalo si la ruta cambia



export default function TabLayout() {

  const loadUser = useAuthStore((state) => state.loadUser); // 

  useEffect(() => {
    loadUser();
  }, []);

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: Platform.OS === "web" ? { display: "none" } : {}, // Ocultar en web
      
        
        
      }}
    >
       {/* 🏠 Home */}
  <Tabs.Screen
    name="home"
    options={{
      title: "Home",
      headerShown: false,
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    }}
  />

  {/* 💬 Mensajes */}
  <Tabs.Screen
    name="messages"
    options={{
      title: "Mensajes",
      headerShown: false,
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />,
    }}
  />

  {/* 🛒 Vende */}
  <Tabs.Screen
    name="sell"
    options={{
      title: "Vende",
      headerShown: false,
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.app.fill" color={color} />,
    }}
  />

  {/* 🔍 Buscar */}
  <Tabs.Screen
    name="explore"
    options={{
      title: "Buscar",
      headerShown: false, // Oculta el título en la parte superior
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
    }}
  />

  {/* 👤 Perfil */}
  <Tabs.Screen
    name="profile"
    options={{
      title: "Perfil",
      headerShown: false,
      tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
    }}
  />
  </Tabs>
  );
}
