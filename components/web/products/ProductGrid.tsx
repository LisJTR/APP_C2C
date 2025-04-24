// components/web/products/ProductGrid.tsx
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
  size: string;
  condition: string;
  image_url: string;
};

export default function ProductGrid({ onProductClick }: { onProductClick: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos cargados:", data);
        setProducts(data);
      })
      .catch((err) => console.error("Error cargando productos", err));
  }, []);

  const handleVerMas = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div style={styles.gridContainer}>
      <div style={styles.grid}>
        {products.slice(0, visibleCount).map((p) => (
          <ProductCard key={p.id} product={p} onClick={onProductClick} />
        ))}
      </div>

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

const styles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    padding: "0px 20px",
    maxWidth: 1300,
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
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
