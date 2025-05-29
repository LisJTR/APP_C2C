import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

export const registerUser = async (username, email, password, location, bio, country_id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
      location,
      bio,
      country_id
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error en el registro" };
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error al obtener el perfil" };
  }
};

export const updateUser = async (token, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/update`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    return error.response?.data || { message: "Error al actualizar perfil" };
  }
};

export const deleteUser = async (token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error al eliminar usuario" };
  }
};

export const getCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/countries`);
    return await response.json();
  } catch (err) {
    console.error("Error al obtener países:", err);
    return [];
  }
};
