const localIp = "192.168.1.x"; // Cámbialo a la IP real de tu PC (como ya hiciste)

export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://${localIp}:5000/api`
    : "https://TU_DOMINIO_PRODUCCION.com/api"; // <- cámbiarlo luego para producción
