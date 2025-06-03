// Importaciones necesarias para el componente
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

// Tipo de producto que se espera mostrar
type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
  size: string;
  condition: string;
  image_url: string;
};

// Props que recibe el componente: callback al hacer clic y un posible filtro de búsqueda
type ProductGridProps = {
  onProductClick: () => void; // Se lanza si el usuario no está logueado
  searchQuery?: string; // Texto de búsqueda opcional
};

export default function ProductGrid({ onProductClick, searchQuery }: ProductGridProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(2); // Cantidad inicial de productos mostrados

  // Carga los productos desde el backend cuando el componente se monta
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos cargados:", data);
        setProducts(data); // Guarda los productos en el estado
      })
      .catch((err) => console.error("Error cargando productos", err));
  }, []);

  // Manejador para cargar más productos al hacer clic en "Ver más"
  const handleVerMas = () => {
    setVisibleCount((prev) => prev + 10); // Incrementa el número de productos visibles
  };

  // Filtra los productos si hay una búsqueda activa
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div style={styles.gridContainer}>
      <div style={styles.grid}>
        {filteredProducts.slice(0, visibleCount).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => {
              if (user) {
                router.push(`/product/${p.id}`); // Si hay sesión, lleva al detalle del producto
              } else {
                onProductClick(); // Si no hay sesión, lanza el modal de login
              }
            }}
          />
        ))}
      </div>

      {/* Botón "Ver más" si quedan productos por mostrar */}
      {visibleCount < products.length && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button style={styles.button} onClick={handleVerMas}>
            Ver más
          </button>
        </div>
      )}
    </div>
  );
}

// Estilos en línea para el grid y el botón
const styles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    padding: "0px 20px",
    maxWidth: 1300,
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 5 columnas en el grid
    gap: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 14,
    borderRadius: 6,
    cursor: "pointer",
  },
};
