import { View, Text, StyleSheet } from "react-native";

export default function ProductGridApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos (móvil)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
  },
});
