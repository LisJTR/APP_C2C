// app/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import HeaderLoggedIn from "./components/HeaderLoggedIn";
import { isLoggedIn } from "@/utils/auth";
import BoddyLoggin from "../(webfrontend)/components/BoddyLoggin";
import ProductGrid from "../../components/web/products/ProductGrid";
import Footer from "../../components/web/Footer";
import { ScrollView, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";

export default function Index() {
  const { loadUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    loadUser(); // <-- Llamas al cargar
  }, []);
  
  useEffect(() => {
    const checkSession = async () => {
      const loggedIn = await isLoggedIn();
      setLogged(loggedIn);
      setLoading(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!loading && !logged) {
      router.replace("/welcome");
    }
  }, [loading, logged]);

  if (loading) return null;

  return (
    <>
      {logged && (
        <>
           <HeaderLoggedIn onSearch={(query) => console.log("Buscando:", query)} />
          <ScrollView
            style={{ flex: 1, backgroundColor: "#fff" }}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            <View style={{ backgroundColor: "#fff" }}>
              <BoddyLoggin onLoginPress={() => {}} />
              <View style={{ paddingHorizontal: 32, marginTop: -40 }}>
                <ProductGrid onProductClick={() => {}} />
              </View>
              <Footer />
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}