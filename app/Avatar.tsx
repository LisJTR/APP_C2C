import { Image, TouchableOpacity, StyleSheet } from "react-native";

interface AvatarProps {
  uri: string | null | undefined;
  size?: number;
  onPress?: () => void; // ✅ opcional: solo se pasa si quieres que sea interactivo
}

export default function Avatar({ uri, size = 32, onPress }: AvatarProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress} // ✅ si no se pasa `onPress`, no es interactivo
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {uri && (
        <Image
          source={{ uri }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: size / 2,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
