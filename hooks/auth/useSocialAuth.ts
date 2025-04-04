// hooks/auth/useSocialAuth.ts
import * as SecureStore from "expo-secure-store";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";

// ✅ Siempre usar el proxy en desarrollo web
const redirectUri = makeRedirectUri({} as any); // y forzar el proxy abajo

console.log("🔗 Redirect URI FINAL:", redirectUri);

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "287312552282-as6cu0fgb5rvh8vnbfjm65ds5pjd9pi3.apps.googleusercontent.com",
    iosClientId: "287312552282-7o5t5vsoti51v5g55ffkgsl5636ahnsu.apps.googleusercontent.com",
    androidClientId: "287312552282-atn8f9bss7jsi1n998g2c9jvslefcjrc.apps.googleusercontent.com",
    redirectUri,
    responseType: "token", // ✅ importantísimo para web
  });

  return { request, response, promptAsync };
}

export function useFacebookAuth() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1160826288573482",
    redirectUri,
    responseType: "token", // ✅ importantísimo para web
  });

  return { request, response, promptAsync };
}
