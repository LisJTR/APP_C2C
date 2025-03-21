import axios from "axios";

const API_URL = "http://192.168.1.227:5000/api"; // Cambia esto si usas un móvil físico

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // tiempo de espera de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (username, email, password) => {
  try {
    console.log("📌 Enviando datos al backend:", { username, email, password });

    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
    });
    console.log("📌 Respuesta del backend:", response.data);

    return response.data;
  } catch (error) {
    console.error("📌 Error al registrar usuario:", error.response?.data || error);
    return error.response?.data || { message: "Error en el registro" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
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

export const updateUser = async (token, username, email) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/update`,
      { username, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error al actualizar usuario" };
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
