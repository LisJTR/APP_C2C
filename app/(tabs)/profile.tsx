import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import Avatar from "../Avatar";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { API_BASE_URL } from "../../utils/config";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";


export default function ProfileScreen() {

  const { t } = useTranslation();
  const { user, loadUser, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigation = useNavigation();
  const router = useRouter();


  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];

      try {
        setLoading(true);

        const base64 = await FileSystem.readAsStringAsync(image.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const arrayBuffer = decode(base64);
        const filePath = `avatars/${user.id}-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, arrayBuffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          console.error("🟥 Error al subir imagen:", uploadError);
          Alert.alert("Error", "No se pudo subir la imagen.");
          return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        const token = useAuthStore.getState().token;

        await axios.put(
          `${API_BASE_URL}/users/update`, // Dinámico
          { avatar_url: publicUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 30000,
          }
        );

        updateUser({ ...user, avatar_url: publicUrl });
        setAvatarUrl(publicUrl);
        Alert.alert("✅ Avatar actualizado");
      } catch (err) {
        console.error("🟥 Error general:", err);
        Alert.alert("Error", "No se pudo subir la imagen.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = useAuthStore.getState().token;

      console.log("🟣 TOKEN ACTUAL:", token); // <- AQUÍ

      await axios.put(
        `${API_BASE_URL}/users/update`,
        { username, location, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      updateUser({ ...user, username, location, bio });
      Alert.alert("✅ Perfil actualizado");
    } catch (error) {
      console.error("🟥 Error al actualizar perfil:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Barra superior con icono de ajustes */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
  style={styles.settingsIcon}
  onPress={() => {
    Alert.alert(
      "Ajustes",
      "¿Deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await useAuthStore.getState().logout();
            router.replace("../../screens/WelcomeScreenMobile");
          },
        },
      ],
      { cancelable: true }
    );
  }}
>
  <Ionicons name="settings-outline" size={24} color="#333" />
</TouchableOpacity>

      </View>
  
      {/* Avatar */}
      <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage}>
        <Avatar uri={avatarUrl} size={120} />
      </TouchableOpacity>
  
      {/* Campos editables */}
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ubicación" />
      <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Biografía" />
  
      {/* Info no editable */}
      <View style={styles.infoBlock}>
        <Ionicons name="mail-outline" size={18} />
        <Text style={styles.infoText}>{user.email}</Text>
      </View>
  
      <View style={styles.infoBlock}>
        <Ionicons name="time-outline" size={18} />
        <Text style={styles.infoText}>
          {t("profile.createdAt")}: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Fecha no disponible"}
        </Text>
      </View>
  
      <View style={styles.infoBlock}>
        <Ionicons name="wallet-outline" size={18} />
        <Text style={styles.infoText}>Saldo: {user.balance ?? 0} €</Text>
      </View>
  
      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
  
      {loading && <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 20 }} />}
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingHorizontal: 20,
    paddingBottom: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    position: "relative",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  avatarButton: {
    alignItems: "center",
    marginBottom: 16,
  },
  input: {

    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  infoText: {
    fontSize: 15,
    color: "#333",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  settingsIcon: {
    position: "absolute",
    top: -30, // Subido para que quede en el borde
    right: 10,
    zIndex: 1,
  },

  
});
