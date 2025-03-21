import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: Platform.OS === "web" ? { display: "none" } : {}, // ✅ Ocultar en web
      }}
    >
      {/* 🏠 Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false, // ✅ Oculta el título en la parte superior
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* 🔍 Explorar */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          headerShown: false, // ✅ Oculta el título en la parte superior
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />

      {/* 👤 Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerShown: false, // ✅ Oculta el título en la parte superior
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
