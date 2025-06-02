// components/web/LanguageSelector.tsx

// Importaciones de React y hooks
import React, { useState, useRef, useEffect } from "react";

// Icono de flecha hacia abajo (usado en el botón de idioma)
import { ChevronDown } from "lucide-react";

// Importación de estilos CSS específicos del selector
import "./LanguageSelector.css";

// Lista de idiomas disponibles en el selector
const languages = [
  { code: "es", label: "Español (Spanish)" },
  { code: "en", label: "English (English)" },
  { code: "pt", label: "Português (Portuguese)" },
];

// Componente funcional que representa el selector de idioma
export default function LanguageSelector() {
  // Estado para controlar si el menú desplegable está abierto
  const [open, setOpen] = useState(false);

  // Estado para saber qué idioma está actualmente seleccionado
  const [selected, setSelected] = useState("es");

  // Referencia al contenedor del selector para detectar clics fuera
  const selectorRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el menú si el usuario hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Maneja la selección de un idioma
  const handleSelect = (code: string) => {
    setSelected(code);  // Actualiza el idioma seleccionado
    setOpen(false);     // Cierra el desplegable
  };

  // Renderizado del selector
  return (
    <div className="lang-selector" ref={selectorRef}>
      {/* Botón principal que muestra el idioma actual y alterna el menú */}
      <button className="lang-button" onClick={() => setOpen(!open)}>
        {selected.toUpperCase()} {/* Ej: ES, EN, PT */}
        <ChevronDown size={16} strokeWidth={2} className="arrow" />
      </button>

      {/* Menú desplegable si `open` es true */}
      {open && (
        <div className="lang-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`lang-option ${selected === lang.code ? "active" : ""}`}
              onClick={() => handleSelect(lang.code)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
