import { View, Text, StyleSheet } from "react-native";

export default function HeroSectionApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hero móvil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
