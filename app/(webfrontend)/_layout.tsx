import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import Header from "../../components/web/Header"; // ajusta la ruta si está en otro lado

export default function WebLayout() {
  return (
    <View style={styles.container}>
      <Header
        onLoginPress={() => {
          // Aquí puedes abrir el modal de login si lo usas en web
          console.log("Login pulsado");
        }}
        onSearch={(query) => {
          // Este callback se puede manejar desde cada página también si es necesario
          console.log("Buscando:", query);
        }}
      />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
