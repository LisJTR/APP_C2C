import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

const redirectUri = makeRedirectUri({ useProxy: true } as any);

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "287312552282-as6cu0fgb5rvh8vnbfjm65ds5pjd9pi3.apps.googleusercontent.com", // Si usas Expo Go
    iosClientId: "287312552282-7o5t5vsoti51v5g55ffkgsl5636ahnsu.apps.googleusercontent.com", // Para build nativo
    redirectUri,
  });

  return { request, response, promptAsync };
}
