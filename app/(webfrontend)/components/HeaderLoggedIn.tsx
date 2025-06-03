// components/HeaderLoggedIn.tsx

// Este componente muestra el header superior para usuarios autenticados en la versión web. Incluye buscador, iconos, menú de perfil y navegación.
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  MessageCircle,
  Heart,
  Bell,
  User,
  ChevronDown,
  Search,
  HelpCircle,
} from "lucide-react";
import LanguageSelector from "../../../components/web/LanguageSelector";
import { usePathname, useRouter } from "expo-router";
import { Platform as RNPlatform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/useAuthStore";

// Opciones del menú desplegable de búsqueda
const MENU_OPTIONS = [
  { id: "articles", label: "Artículos" },
  { id: "members", label: "Miembros" },
  { id: "support", label: "Centro de asistencia" },
];

// Componente principal
export default function HeaderLoggedIn({ onSearch }: { onSearch: (query: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();

  // Estado para desplegables, búsqueda y referencias
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("articles");
  const ref = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
   const handleUploadPress = () => {
    router.push("/(webfrontend)/uploadProduct/UploadProducts");
  };

  // Función para cerrar sesión
const logout = useAuthStore((state) => state.logout);

  // Cambiar opción seleccionada según la ruta
  useEffect(() => {
    if (pathname.startsWith("/members")) setSelected("members");
    else if (pathname.startsWith("/search")) setSelected("articles");
  }, [pathname]);

    // Cerrar sesión y redirigir
  const handleLogout = async () => {
  await logout();

  if (RNPlatform.OS === "web") {
    router.replace("/welcome"); // redirige a la pantalla de inicio web
  } else {
    router.replace("/home"); // o la ruta que uses en móvil
  }
};

  // Buscar sugerencias al escribir
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

  // Al seleccionar sugerencia
  const handleSuggestionClick = (value: string) => {
    setSearchTerm(value);
    setSearchSuggestions([]);
    onSearch(value);
    router.push({
      pathname: selected === "members" ? "/members/[query]" : "/search/[query]",
      params: { query: value },
    });
  };

    // Al enviar búsqueda
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
    router.push({
      pathname: selected === "members" ? "/members/[query]" : "/search/[query]",
      params: { query: searchTerm },
    });
  };

    // Cierra menús si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // Abre/cierra menú de categorías
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
        <a href="/(webfrontend)" style={styles.logoLink}>
          <img src="https://i.imgur.com/6k1EXFk.png" alt="KCL Trading Logo" style={styles.logoImage} />
        </a>

        <View style={styles.searchSection}>
          {Platform.OS === "web" && (
            <div className="lang-selector" ref={ref}>
              <button className="lang-button" onClick={toggleMenu}>
                {MENU_OPTIONS.find((opt) => opt.id === selected)?.label || "Seleccionar"}{" "}
                <ChevronDown size={16} strokeWidth={3} className="arrow" />
              </button>
              {open && (
                <div className="lang-dropdown" style={{ position: "absolute", top: `${dropdownCoords.top}px`, left: `${dropdownCoords.left - 530}px`, zIndex: 9999 }}>
                  {MENU_OPTIONS.map((option) => (
                    <div key={option.id} className={`lang-option ${selected === option.id ? "active" : ""}`} onClick={() => handleSelect(option.id)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          {searchSuggestions.length > 0 && (
            <div className="suggestions-box">
              {searchSuggestions.map((s, i) => (
                <div key={i} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <TouchableOpacity style={styles.iconButton}><MessageCircle size={22} color="#444" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Heart size={22} color="#444" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Bell size={22} color="#444" /></TouchableOpacity>

          {/* Perfil */}
          <div style={{ position: "relative" }} ref={profileRef}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setProfileOpen((prev) => !prev)}>
              <User size={22} color="#444" />
            </TouchableOpacity>
            {profileOpen && (
              <div style={styles.profileDropdown}>
                <div className="profile-item" onClick={() => { setProfileOpen(false);
                  router.push("/profile");
                    }}>Mi perfil</div>
                <div className="profile-item">Ajustes</div>
                <div className="profile-item">Personalización</div>
                <div className="profile-item">Mi saldo <span style={{ float: "right" }}>0,00 €</span></div>
                <div className="profile-item">Mis pedidos</div>
                <div className="profile-item">Donativos</div>
                <div className="profile-item" onClick={handleLogout} style={{ color: "#1f2937" }}>
                  Cerrar sesión
                </div>
              </div>
            )}
          </div>

<TouchableOpacity style={styles.sellButton} onPress={handleUploadPress}>
  <Text style={styles.sellText}>Vender ahora</Text>
</TouchableOpacity>
          <TouchableOpacity style={styles.helpIcon}><HelpCircle size={20} color="#444" /></TouchableOpacity>
          <LanguageSelector />
        </View>
      </View>

      <View style={styles.navBar}>
        {["Mujer", "Hombre", "Moda de diseño", "Niños", "Hogar", "Electrónica", "Entretenimiento", "Mascotas", "Sobre KCL Trading", "Nuestra plataforma"].map((item) => (
          <Text key={item} style={styles.navItem}>{item}</Text>
        ))}
      </View>
    </>
  );
}

  // Resto del componente y JSX (ver versión previa completa)
  // Incluye logo, búsqueda, sugerencias, iconos, menú de perfil y navegación inferior

  // Estilos se mantienen como en tu versión, ya definidos con StyleSheet
  // También los estilos dinámicos inyectados en el DOM para hover y menús


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
    position: "relative",
    zIndex: 9999,
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
    logoutButton: {
    backgroundColor: "#f87171",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: 8,
  },
  iconButton: {
  padding: 6,
  borderRadius: 6,
  backgroundColor: "#f3f4f6",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  marginRight: 20,
},
 profileDropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    paddingVertical: 10,
    width: 200,
    zIndex: 9999,
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
      .profile-item {
      padding: 10px 16px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      color: #1f2937; /* gris oscuro */
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.2px;
      transition: background-color 0.2s ease;
    }
    .profile-item:hover {
      background-color:rgb(230, 227, 227);
    }
  `;
  document.head.appendChild(styleSheet);
}
