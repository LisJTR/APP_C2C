// components/web/Header.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import "./LanguageSelector.css";
import { usePathname, useRouter } from "expo-router";

// Opciones de menú desplegable para filtrar la búsqueda
const MENU_OPTIONS = [
  { id: "articles", label: "Artículos" },
  { id: "members", label: "Miembros" },
  { id: "support", label: "Centro de asistencia" },
];

type HeaderProps = {
  onLoginPress: () => void;       // Acción al presionar "Login"
  onSearch: (query: string) => void; // Función de búsqueda global
};

/**
 * Header: barra superior del sitio web
 * - Incluye logo, selector de categoría, barra de búsqueda, login y navegación.
 * - Adaptado tanto para web como para móvil mediante `Platform.OS`.
 */
export default function Header({ onLoginPress, onSearch }: HeaderProps) {
  const pathname = usePathname();  // Ruta actual
  const router = useRouter();      // Navegación

  const [open, setOpen] = useState(false);             // Control de menú desplegable
  const [selected, setSelected] = useState("articles"); // Categoría seleccionada
  const [searchTerm, setSearchTerm] = useState("");     // Texto de búsqueda
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]); // Autocompletado
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 }); // Posición del menú

  const ref = useRef<HTMLDivElement>(null); // Referencia para el menú desplegable

  // Cambia la categoría en función de la ruta
  useEffect(() => {
    if (pathname.startsWith("/members")) setSelected("members");
    else if (pathname.startsWith("/search")) setSelected("articles");
  }, [pathname]);

  // Obtiene sugerencias dinámicas según el texto y la categoría
  const fetchSuggestions = async (text: string) => {
    if (!text.trim()) return setSearchSuggestions([]);

    const endpoint =
      selected === "members"
        ? `http://localhost:5000/api/users/suggestions?query=${encodeURIComponent(text)}`
        : `http://localhost:5000/api/products/suggestions?query=${encodeURIComponent(text)}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setSearchSuggestions(data);
    } catch (err) {
      console.error("Error obteniendo sugerencias", err);
    }
  };

  // Acción al hacer clic en una sugerencia
  const handleSuggestionClick = (value: string) => {
    setSearchTerm(value);
    setSearchSuggestions([]);
    onSearch(value);
    router.push({
      pathname: selected === "members" ? "/members/[query]" : "/search/[query]",
      params: { query: value },
    });
  };

  // Acción al enviar el formulario
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
    router.push({
      pathname: selected === "members" ? "/members/[query]" : "/search/[query]",
      params: { query: searchTerm },
    });
  };

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Alterna el menú y guarda coordenadas
  const toggleMenu = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownCoords({ top: rect.bottom, left: rect.left });
    }
    setOpen(!open);
  };

  // Cambia la categoría seleccionada
  const handleSelect = (id: string) => {
    setSelected(id);
    setOpen(false);
  };

  return (
    <>
      {/* Barra superior */}
      <View style={styles.topBar}>
        {/* Logo redirige a /welcome */}
        {Platform.OS === "web" ? (
          <a href="/welcome" style={styles.logoLink}>
            <img src="https://i.imgur.com/6k1EXFk.png" alt="KCL Trading Logo" style={styles.logoImage} />
          </a>
        ) : (
          <TouchableOpacity onPress={() => router.push("/welcome")}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>KCL Trading</Text>
          </TouchableOpacity>
        )}

        {/* Sección de búsqueda + categoría */}
        <View style={styles.searchSection}>
          {Platform.OS === "web" ? (
            <div className="lang-selector" ref={ref}>
              <button className="lang-button" onClick={toggleMenu}>
                {MENU_OPTIONS.find((opt) => opt.id === selected)?.label || "Seleccionar"}{" "}
                <ChevronDown size={16} strokeWidth={3} className="arrow" />
              </button>

              {open && (
                <div
                  className="lang-dropdown"
                  style={{
                    position: "absolute",
                    top: `${dropdownCoords.top}px`,
                    left: `${dropdownCoords.left - 530}px`,
                    zIndex: 9999,
                  }}
                >
                  {MENU_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className={`lang-option ${selected === option.id ? "active" : ""}`}
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

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSearch} style={styles.searchContainer}>
            <Search size={18} color="#888" style={{ marginLeft: 8 }} />
            <TextInput
              className="search-input"
              placeholder={`Busca ${MENU_OPTIONS.find((opt) => opt.id === selected)?.label.toLowerCase()}`}
              style={styles.searchInput}
              placeholderTextColor="#888"
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                fetchSuggestions(text);
              }}
            />
          </form>

          {/* Sugerencias desplegables */}
          {searchSuggestions.length > 0 && (
            <div className="suggestions-box">
              {searchSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </View>

        {/* Botones de acción a la derecha */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.linkButton} onPress={onLoginPress}>
            <Text style={styles.linkText}>Regístrate | Inicia sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellButton} onPress={onLoginPress}>
            <Text style={styles.sellText}>Vender ahora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpIcon}>
            <HelpCircle size={20} color="#444" />
          </TouchableOpacity>
          <LanguageSelector />
        </View>
      </View>

      {/* Barra de navegación inferior */}
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
    paddingRight: 100,
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
  logoLink: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logoImage: {
    width: 200,
    height: 60,
    marginLeft: 150,
    objectFit: "contain",
  },
  suggestions: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 9999,
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    maxHeight: 300,
  },
  
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 17,
    width: "100%",
    color: "#111",
    borderBottomWidth: 1,
    borderColor: "#eee",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  
});

// Hover para sugerencias
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerHTML += `
    .suggestions-box {
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      background-color: #fff;
      z-index: 9999;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      max-height: 300px;
    }

    .suggestion-item {
      padding: 16px 24px;
      font-size: 17px;
      color: #111;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      font-family: Inter, sans-serif;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-item:hover {
      background-color: #f3f4f6;
    }

     input:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(styleSheet);
}