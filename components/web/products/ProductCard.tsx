// Importa React para usar componentes funcionales
import React from "react";

// Define el tipo Product que describe la estructura esperada de un producto
type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
  size: string;
  condition: string;
  image_url?: string | null; // puede ser null o estar ausente
};

// Componente ProductCard que recibe un producto y una función onClick como props
export default function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  // Imagen por defecto en caso de que no haya imagen válida
  const fallbackImage = "https://i.imgur.com/rNFxAm9.png";

  // URL base para imágenes locales (debería cambiarse en producción)
  const BASE_URL = "http://localhost:5000";

  // Determina la URL de la imagen: si es válida y empieza por http, se usa tal cual;
  // si no, se concatena con la URL base; si está vacía o nula, se usa la imagen por defecto
  const imageSrc =
    product.image_url && product.image_url.trim() !== ""
      ? product.image_url.startsWith("http")
        ? product.image_url
        : `${BASE_URL}${product.image_url}`
      : fallbackImage;

  // Renderiza el componente de tarjeta del producto
  return (
    <div style={styles.card} onClick={onClick}>
      {/* Imagen del producto */}
      <img
        src={imageSrc}
        alt={product.title}
        style={styles.image}
        onError={(e) => {
          // Si ocurre un error al cargar la imagen, se reemplaza con una por defecto
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />

      {/* Información del producto */}
      <div style={styles.info}>
        <p style={styles.title}>{product.brand}</p>
        <p style={styles.details}>
          {product.size} · {product.condition}
        </p>
        <p style={styles.price}>{Number(product.price).toFixed(2)} €</p>
      </div>
    </div>
  );
}

// Estilos en línea para los distintos elementos de la tarjeta
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: 230,
    objectFit: "cover", // Asegura que la imagen cubra el área sin distorsionarse
    backgroundColor: "#f0f0f0", // Color de fondo en caso de carga lenta o fallida
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111",
    marginBottom: 4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis", // Corta el texto si es muy largo y añade "..."
    fontFamily: "Inter, sans-serif",
  },
  details: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
    fontFamily: "Inter, sans-serif",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF", // Azul característico de enlaces o botones destacados
    fontFamily: "Inter, sans-serif",
  },
};
