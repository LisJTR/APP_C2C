// components/common/DropdownPortal.tsx

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;           // Contenido que se va a renderizar en el portal
  style?: React.CSSProperties;         // Estilos personalizados para el contenedor
};

/**
 * Componente `DropdownPortal`
 * 
 * Este componente crea un "portal" para renderizar contenido (como un dropdown o tooltip)
 * directamente en el `document.body`, fuera del flujo del DOM principal.
 * Es útil para evitar problemas de z-index o recortes por `overflow: hidden`.
 */
export default function DropdownPortal({ children, style = {} }: Props) {
  // Estado local que mantiene una referencia al contenedor del portal
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Crear un nuevo div dinámicamente al montar el componente
    const el = document.createElement("div");

    // Establecer posición absoluta y z-index alto por defecto
    el.style.position = "absolute";
    el.style.zIndex = "9999";

    // Aplicar estilos personalizados sin sobrescribir los anteriores
    Object.assign(el.style, style);

    // Añadir el contenedor al final del body
    document.body.appendChild(el);
    setContainer(el);

    // Cleanup: eliminar el contenedor al desmontar
    return () => {
      document.body.removeChild(el);
    };
  }, [style]); // Se vuelve a ejecutar si cambian los estilos

  // Mientras no se haya montado el contenedor, no renderizar nada
  if (!container) return null;

  // Renderiza el contenido en el portal
  return createPortal(children, container);
}
