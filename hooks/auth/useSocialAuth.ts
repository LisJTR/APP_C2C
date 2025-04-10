import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({ useProxy: true } as any);

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "287312552282-gku647h2cp11500ca7aiu4shlvp8p5bt.apps.googleusercontent.com",
    iosClientId: "287312552282-7o5t5vsoti51v5g55ffkgsl5636ahnsu.apps.googleusercontent.com",
    androidClientId: "287312552282-atn8f9bss7jsi1n998g2c9jvslefcjrc.apps.googleusercontent.com",
    redirectUri, // 🔥 IMPORTANTE
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
