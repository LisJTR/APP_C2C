import { openBrowserAsync } from "expo-web-browser";
import { Platform, Text, TouchableOpacity } from "react-native";
import { type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

export function ExternalLink({ href, children }: Props) {
  const handlePress = async () => {
    await openBrowserAsync(href);
  };

  return Platform.OS === "web" ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <TouchableOpacity onPress={handlePress}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );

}
