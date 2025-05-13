import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Bridges/HeadersWeb/Header"; 

export default function WebLayout() {
  return (
    <View style={styles.container}>
      <Header
        onLoginPress={() => {
          // Aquí puedes abrir el modal de login si lo usas en web
          console.log("Login pulsado");
        }}
        onSearch={(query: string) => {
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
