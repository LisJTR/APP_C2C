// components/web/LanguageSelector.tsx
import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
import DropdownPortal from "./DropdownPortal";
import "./LanguageSelector.css";

const LANGUAGES = [
  { code: "fr", label: "Français (French)" },
  { code: "en", label: "English (English)" },
  { code: "nl", label: "Nederlands (Dutch)" },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("es");
  const buttonRef = useRef<any>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left });
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return Platform.OS === "web" ? (
    <div className="lang-selector">
      <div ref={buttonRef}>
        <button className="lang-button" onClick={toggleDropdown}>
          {selected.toUpperCase()} <span className="arrow">▼</span>
        </button>
      </div>

      {open && (
        <DropdownPortal style={{ top: `${coords.top}px`, left: `${coords.left}px` }}>
          <div className="lang-dropdown">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`lang-option ${selected === lang.code ? "active" : ""}`}
                onClick={() => {
                  setSelected(lang.code);
                  setOpen(false);
                }}
              >
                {lang.label}
              </div>
            ))}
          </div>
        </DropdownPortal>
      )}
    </div>
  ) : null;
}
