// components/web/HeroSection.tsx
import React from "react";
import "./HeroSection.css"; // Asegúrate de crear este archivo junto al componente

export default function Hero() {
  return (
    <section className="hero-container">
      <img
        src="/assets/welcome/9.jpg"
        alt="Vinted Hero"
        className="hero-image"
      />

      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-title">¿Quieres hacer limpieza de armario?</h2>

          <button className="hero-button">Vender ya</button>

          <p className="hero-link">¿Cómo funciona?</p>
        </div>
      </div>
    </section>
  );
}
