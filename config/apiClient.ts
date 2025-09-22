"use client";

import axios from "axios";

// Crear una instancia de axios sin usar hooks
const createApiClient = () => {
  const instance = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/nomina",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Esto enviará las cookies automáticamente
  });

  // Interceptor para incluir el token en cada petición
  instance.interceptors.request.use(
    (config) => {
      // Obtener token de cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      // Si hay token, incluirlo en el header
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Interceptor para manejar errores de autenticación
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
};

// Crear una instancia para exportar
export const apiClient = createApiClient();

// Exportar también la función creadora por si se necesita una instancia fresca
export default createApiClient;
