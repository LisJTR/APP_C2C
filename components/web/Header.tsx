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
import DropdownPortal from "./DropdownPortal";

const MENU_OPTIONS = [
  { id: "articles", label: "Artículos" },
  { id: "members", label: "Miembros" },
  { id: "support", label: "Centro de asistencia" },
];

type HeaderProps = {
  onLoginPress: () => void;
};

export default function Header({ onLoginPress }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("members");
  const dropdownButtonRef = useRef<any>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const toggleMenu = () => {
    if (dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom);
      setDropdownLeft(rect.left);
    }
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <View style={styles.topBar}>
        {/* Logo */}
        <Text style={styles.logo}>KCL Trading</Text>

        {/* Categoría + Buscador */}
        <View style={styles.searchSection}>
          {Platform.OS === "web" ? (
            <div
              ref={dropdownButtonRef}
              style={{ position: "relative", display: "inline-block" }}
            >
              <button className="lang-button" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
                  {MENU_OPTIONS.find((o) => o.id === selectedMenu)?.label || "Seleccionar"}
                </span>
                <ChevronDown size={16} color="#333" />
              </button>
            </div>
          ) : (
            <View style={{ position: "relative" }}>
              <Pressable style={styles.categoryButton} onPress={toggleMenu}>
                <Text style={styles.categoryText}>Miembros</Text>
                <ChevronDown size={16} color="#333" />
              </Pressable>
            </View>
          )}

          <View style={styles.searchContainer}>
            <Search size={18} color="#888" style={{ marginLeft: 8 }} />
            <TextInput
              placeholder={`Busca ${MENU_OPTIONS.find((o) => o.id === selectedMenu)?.label.toLowerCase()}`}
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

      {menuOpen && (
        <DropdownPortal style={{ top: `${dropdownTop}px`, left: `${dropdownLeft}px` }}>
          <div className="lang-dropdown">
            {MENU_OPTIONS.map((option) => (
              <div
                key={option.id}
                className={`lang-option ${selectedMenu === option.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedMenu(option.id);
                  setMenuOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </DropdownPortal>
      )}

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
          "Sobre Vinted",
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
    color: "#0f766e",
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
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
    width: 180,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
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
    borderColor: "#0f766e",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  linkText: {
    fontSize: 14,
    color: "#0f766e",
    fontWeight: "500",
  },
  sellButton: {
    backgroundColor: "#0f766e",
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