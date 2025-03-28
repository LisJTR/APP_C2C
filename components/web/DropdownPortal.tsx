import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function DropdownPortal({ children, style = {} }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    
    // Posición absoluta y alto z-index por defecto
    el.style.position = "absolute";
    el.style.zIndex = "9999";

    // Asignar el resto del estilo sin sobreescribir lo anterior
    Object.assign(el.style, style);

    document.body.appendChild(el);
    setContainer(el);

    return () => {
      document.body.removeChild(el);
    };
  }, [style]);

  if (!container) return null;

  return createPortal(children, container);
}
