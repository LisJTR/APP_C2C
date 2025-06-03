import { View, Text, StyleSheet } from "react-native";

export default function FooterApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2025 KCL Trading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    alignItems: "center",
  },
  text: {
    color: "#555",
    fontSize: 14,
  },
});
