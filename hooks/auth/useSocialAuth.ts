import * as SecureStore from "expo-secure-store";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";

const redirectUri = makeRedirectUri({ useProxy: true } as any);

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "287312552282-5pb8qfe3n055jje5h4ukjefuq4neld77.apps.googleusercontent.com",
    iosClientId: "287312552282-7o5t5vsoti51v5g55ffkgsl5636ahnsu.apps.googleusercontent.com",
    androidClientId: "287312552282-atn8f9bss7jsi1n998g2c9jvslefcjrc.apps.googleusercontent.com",
    redirectUri,
  });

  return { request, response, promptAsync };
}

export function useFacebookAuth() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1160826288573482",
    redirectUri,
  });

  return { request, response, promptAsync };
}
