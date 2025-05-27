const localIp = "192.168.1.36"; // Cámbialo a la IP real de tu PC (como ya hiciste)

export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://${localIp}:5000/api`
    : "https://TU_DOMINIO_PRODUCCION.com/api"; // <- cámbiarlo luego para producción

    export const STATIC_HOST =
  process.env.NODE_ENV === "development"
    ? `http://${localIp}:5000`
    : "https://TU_DOMINIO_PRODUCCION.com";
