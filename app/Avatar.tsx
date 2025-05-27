import { Image, TouchableOpacity, StyleSheet } from "react-native";
import {  STATIC_HOST  } from "../utils/config";



interface AvatarProps {
  uri: string | null | undefined;
  size?: number;
  onPress?: () => void;
}

export default function Avatar({ uri, size = 32, onPress }: AvatarProps) {
  const fullUri = uri?.startsWith("/uploads") ? `${ STATIC_HOST }${uri}` : uri; 

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {fullUri && (
        <Image
          source={{ uri: fullUri }}
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
