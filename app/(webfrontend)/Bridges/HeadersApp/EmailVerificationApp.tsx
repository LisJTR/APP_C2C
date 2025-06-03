import { View, Text, StyleSheet } from "react-native";

export default function EmailVerificationApp({ email }: { email: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de verificación para: {email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});

// Clases puente entre React Native y React para que no de error entre web y app