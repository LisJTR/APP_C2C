import { View, Text, StyleSheet } from "react-native";

export default function HeaderApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Header móvil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007AFF",
    padding: 16,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});