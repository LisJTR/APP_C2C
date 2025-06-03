import * as Facebook from "expo-auth-session/providers/facebook";
import { makeRedirectUri } from "expo-auth-session";

const redirectUri = makeRedirectUri({ useProxy: true } as any );

export function useFacebookAuth() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1160826288573482", // <- reemplaza por tu App ID real
    redirectUri,
  });

  return { request, response, promptAsync };
}
