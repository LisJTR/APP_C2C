// components/web/products/ProductCard.tsx
import React from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
  size: string;
  condition: string;
  image_url?: string | null;
};

export default function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const fallbackImage = "https://i.imgur.com/OZCOCYs.jpeg";
  const imageSrc =
    product.image_url && product.image_url.trim() !== ""
      ? product.image_url
      : fallbackImage;

  return (
    <div style={styles.card} onClick={onClick}>
      <img
        src={imageSrc}
        alt={product.title}
        style={styles.image}
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />
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
    objectFit: "cover",
    backgroundColor: "#f0f0f0",
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
    textOverflow: "ellipsis",
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
    color: "#007AFF",
    fontFamily: "Inter, sans-serif",
  },
};
