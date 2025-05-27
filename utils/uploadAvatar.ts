import { supabase } from "./supabaseClient";

export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  try {
    const session = await supabase.auth.getSession();
    const currentUser = session.data.session?.user;

    if (!currentUser) {
      console.warn("⚠️ No hay sesión activa en Supabase.");
      return null;
    }

    if (currentUser.id !== userId) {
      console.warn("⚠️ El ID del usuario no coincide con la sesión.");
      return null;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${userId}.${fileExt}`;
    const filePath = `public/${fileName}`;
    const contentType = file.type || "image/jpeg";

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Error al subir avatar:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err) {
    console.error("❌ Error inesperado al subir avatar:", err);
    return null;
  }
}
