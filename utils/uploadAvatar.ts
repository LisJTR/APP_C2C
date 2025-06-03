import axios from "axios";
import { API_BASE_URL, STATIC_HOST } from "./config";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Sube una imagen de avatar al backend y devuelve la URL pública.
 * Solo se usa en versión web.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  try {
    const token = useAuthStore.getState().token;
    if (!token || !userId) {
      console.warn("⚠️ No hay usuario autenticado");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file, `avatar-${Date.now()}.jpg`);

    // ✅ POST al backend para subir la imagen
    const uploadResponse = await axios.post(
      `${API_BASE_URL}/upload`, // ✅ ya no duplica /api
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ URL relativa como "/uploads/archivo.jpg"
    const relativeUrl = uploadResponse.data.imageUrl;

    // ✅ Convertir a URL completa usando STATIC_HOST
    const fullUrl = `${STATIC_HOST}${relativeUrl}`;
    return fullUrl;
  } catch (error) {
    console.error("❌ Error al subir avatar desde web:", error);
    return null;
  }
}
