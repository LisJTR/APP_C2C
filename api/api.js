// api/api.js

import axios from "axios";

const API_URL = "http://192.168.1.34:5000/api"; // Cambia esto si usas un móvil físico

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // tiempo de espera de 10 segundos
 
});

export const registerUser = async (username, email, password, location, bio, country_id) => {
  try {
    console.log("📌 Enviando datos al backend:", { username, email, password });

    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
      location,
      bio,
      country_id
    });
    console.log("📌 Respuesta del backend:", response.data);

    return response.data;
  } catch (error) {
    console.error("📌 Error al registrar usuario:", error.response?.data || error);
    return error.response?.data || { message: "Error en el registro" };
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      identifier,
      password,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error en el inicio de sesión" };
  }
};


export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error al obtener el perfil" };
  }
};

export const updateUser = async (token, username, email, location, bio, avatar_url) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/update`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    return error.response?.data || { message: "Error al actualizar perfil" };
  }
};



export const deleteUser = async (token) => {
  try {
    const response = await axios.delete(`${API_URL}/users/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error al eliminar usuario" };
  }
};

export async function loginWithGoogle(accessToken) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión con Google");
    }

    return data; // { token, user, message }
  } catch (err) {
    console.error("❌ Error al hacer login con Google:", err);
    throw err;
  }
};

export const getCountries = async () => {
  try {
    const response = await fetch("http://192.168.1.227:5000/api/users/countries");
    return await response.json();
  } catch (err) {
    console.error("Error al obtener países:", err);
    return [];
  }
};


