// app/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Header from "../../components/web/Header";
import HeaderLoggedIn from "./components/HeaderLoggedIn";
import { isLoggedIn } from "@/utils/auth";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setLogged(false);
        setLoading(false); // Mostrar Header normal
      } else {
        setLogged(true);
        setLoading(false); // Mostrar Header logueado
      }
    };
    checkSession();
  }, []);

  if (loading) return null; // Spinner si deseas

  return (
    <>
      {logged ? (
        <HeaderLoggedIn onSearch={(query) => console.log("Buscando:", query)} />
      ) : (
        <Header
          onLoginPress={() => router.push("/welcome")} // abre modal o redirige
          onSearch={(query) => console.log("Buscar:", query)} // reemplaza según tu lógica
        />
      )}
      <main style={{ padding: "20px" }}>
        <h2>Bienvenido a la página principal</h2>
      </main>
    </>
  );
}
