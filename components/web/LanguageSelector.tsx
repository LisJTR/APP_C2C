// components/web/LanguageSelector.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // 👈 Importa el ícono
import "./LanguageSelector.css";

const languages = [
  { code: "es", label: "Español (Spanish)" },
  { code: "en", label: "English (English)" },
  { code: "pt", label: "Português (Portuguese)" },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("es");
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setSelected(code);
    setOpen(false);
  };

  return (
    <div className="lang-selector" ref={selectorRef}>
      <button className="lang-button" onClick={() => setOpen(!open)}>
        {selected.toUpperCase()} <ChevronDown size={16} strokeWidth={2} className="arrow" />
      </button>

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