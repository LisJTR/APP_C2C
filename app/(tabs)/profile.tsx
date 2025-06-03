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

import Avatar from "../Avatar";

import { API_BASE_URL } from "../../utils/config";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";


export default function ProfileScreen() {

  const { t } = useTranslation();
  const { user, loadUser, updateUser, invitado } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigation = useNavigation();
  const router = useRouter();
  const [showAccessModal, setShowAccessModal] = useState(false);

  // Control de acceso para invitado (muestra modal)
  useEffect(() => {
  let isMounted = true;

  if (!user && invitado) {
    setTimeout(() => {
      if (isMounted) {
        setShowAccessModal(true);
      }
    }, 0);
  }

  return () => {
    isMounted = false;
  };
}, []);

    //Cargamos datos iniciales del usuario desde el store
    useEffect(() => {
      loadUser();
    }, []);

     // Sincronizamos el estado interno con los datos del usuario al cargar
    useEffect(() => {
      if (user) {
        setUsername(user.username || "");
        setLocation(user.location || "");
        setBio(user.bio || "");
        setAvatarUrl(user.avatar_url || "");
      }
    }, [user]);

    //Si no hay usuario, mostramos el modal de acceso restringido
    if (!user && invitado) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Acceso restringido</Text>
              <Text style={styles.modalText}>
                Debes registrarte o iniciar sesión para continuar.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  useAuthStore.getState().setInvitado(false);
                  router.push("/screens/WelcomeScreenMobile");
                }}
              >
                <Text style={styles.modalLink}>Registrate ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // Si el usuario está cargando mostramos el loader
    if (!user) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

     // Seleccionar nueva imagen de perfil
        const handlePickImage = async () => {
      console.log(" handlePickImage se ha ejecutado");
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log(" Permiso concedido:", granted);
      if (!granted) {
        Alert.alert("Permiso denegado", "Se necesita acceso a la galería");
        return;
      }



      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      console.log(" Resultado del picker:", result);


    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      const formData = new FormData();

      formData.append("image", {
      uri: image.uri,
      type: "image/jpeg",
      name: `avatar-${Date.now()}.jpg`,
    } as any);

      try {
        setLoading(true);
        console.log(" Imagen seleccionada:", image.uri);
        console.log(" Enviando a:", `${API_BASE_URL}/upload`);
        console.log(" FormData:", formData);
        const uploadResponse = await axios.post(
          `${API_BASE_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("✅ Respuesta del backend:", uploadResponse.data);
        const imageUrl = uploadResponse.data.imageUrl; // solo "/uploads/xxx.jpg"
        
        // Actualizar usuario con nueva imagen
        const token = useAuthStore.getState().token;

        await axios.put(
          `${API_BASE_URL}/users/update`,
          { avatar_url: imageUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        updateUser({ ...user, avatar_url: imageUrl });
        setAvatarUrl(imageUrl);
        Alert.alert("✅ Imagen actualizada correctamente");

      } catch (err) {
        console.error("🟥 Error al subir imagen:", err);
        Alert.alert("Error", "No se pudo subir la imagen");
      } finally {
        setLoading(false);
      }
    }
  };

      const handleSave = async () => {
      try {
        setLoading(true);
        const token = useAuthStore.getState().token;

        await axios.put(
          `${API_BASE_URL}/users/update`,
          { username, location, bio },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        updateUser({ ...user, username, location, bio });
        Alert.alert("✅ Perfil actualizado correctamente");
      } catch (error) {
        console.error("🟥 Error al actualizar perfil:", error);
        Alert.alert("Error", "No se pudo actualizar el perfil");
      } finally {
        setLoading(false);
      }
    };


  return (
     <View style={{ flex: 1 }}>
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
      <View style={styles.avatarButton}>
        <Avatar uri={avatarUrl} size={120} onPress={handlePickImage} />
      </View>
  
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
  
      </View>
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
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},
modalContainer: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
  width: "80%",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},
modalText: {
  fontSize: 16,
  textAlign: "center",
  marginBottom: 10,
},
modalLink: {
  color: "#2F70AF",
  fontWeight: "bold",
  textDecorationLine: "underline",
  fontSize: 16,
},

  
});
