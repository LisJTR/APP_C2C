// components/web/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import "./LanguageSelector.css"; // reutilizamos el mismo estilo

const MENU_OPTIONS = [
  { id: "articles", label: "Artículos" },
  { id: "members", label: "Miembros" },
  { id: "support", label: "Centro de asistencia" },
];

type HeaderProps = {
  onLoginPress: () => void;
};

export default function Header({ onLoginPress }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("articles");
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownCoords({ top: rect.bottom, left: rect.left });
    }
    setOpen(!open);
  };

  const handleSelect = (id: string) => {
    setSelected(id);
    setOpen(false);
  };

  return (
    <>
      <View style={styles.topBar}>
        {/* Logo */}
        <Text style={styles.logo}>KCL Trading</Text>

        {/* Categoría + Buscador */}
        <View style={styles.searchSection}>
          {Platform.OS === "web" ? (
            <div className="lang-selector" ref={ref}>
              <button className="lang-button" onClick={toggleMenu}>
                {
                  MENU_OPTIONS.find((opt) => opt.id === selected)?.label ||
                  "Seleccionar"
                }{" "}
                <ChevronDown size={16} strokeWidth={2} className="arrow" />
              </button>

              {open && (
                <div
                  className="lang-dropdown"
                  style={{
                    position: "absolute",
                    top: `${dropdownCoords.top}px`,
                    left: `${dropdownCoords.left -530}px`,
                    zIndex: 9999,
                  }}
                >
                  {MENU_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className={`lang-option ${
                        selected === option.id ? "active" : ""
                      }`}
                      onClick={() => handleSelect(option.id)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <View style={styles.categoryButton}>
              <Text style={styles.categoryText}>Miembros</Text>
              <ChevronDown size={16} color="#333" />
            </View>
          )}

          <View style={styles.searchContainer}>
            <Search size={18} color="#888" style={{ marginLeft: 8 }} />
            <TextInput
              placeholder={`Busca ${
                MENU_OPTIONS.find((opt) => opt.id === selected)?.label.toLowerCase()
              }`}
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.linkButton} onPress={onLoginPress}>
            <Text style={styles.linkText}>Regístrate | Inicia sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellButton}>
            <Text style={styles.sellText}>Vender ahora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpIcon}>
            <HelpCircle size={20} color="#444" />
          </TouchableOpacity>
          <LanguageSelector />
        </View>
      </View>

      {/* 🔹 Barra inferior de navegación */}
      <View style={styles.navBar}>
        {[
          "Mujer",
          "Hombre",
          "Moda de diseño",
          "Niños",
          "Hogar",
          "Electrónica",
          "Entretenimiento",
          "Mascotas",
          "Sobre KCL Trading",
          "Nuestra plataforma",
        ].map((item) => (
          <Text key={item} style={styles.navItem}>
            {item}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007AFF",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
    minWidth: 200,
    maxWidth: 600,
    position: "relative",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#111",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  linkText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  sellButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sellText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  helpIcon: {
    padding: 6,
  },
  navBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    zIndex: -1,
    position: "relative",
  },
  navItem: {
    fontSize: 14,
    color: "#374151",
  },
});
