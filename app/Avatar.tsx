import { Image, View } from "react-native";

interface AvatarProps {
  uri: string | null | undefined;
  size?: number;
}

export default function Avatar({ uri, size = 32 }: AvatarProps) {
  const style = {
    height: size,
    width: size,
    borderRadius: size / 2,
    backgroundColor: "rgba(0,0,0,0.1)", // o un color base
  };

  return (
    <View style={style}>
      {uri && (
        <Image
          source={{ uri }}
          style={{ height: size, width: size, borderRadius: size / 2 }}
        />
      )}
    </View>
  );
}
