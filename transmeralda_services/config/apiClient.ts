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

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar cookies - eliminamos tanto token como userInfo
    // Eliminar token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Eliminar userInfo
    document.cookie =
      "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Asegurarse de eliminar en todos los dominios posibles
    const domainParts = window.location.hostname.split(".");

    if (domainParts.length > 1) {
      const rootDomain = domainParts.slice(-2).join(".");

      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain}`;
      document.cookie = `userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain}`;
    }

    // Redirigir al sistema de autenticación
    const authSystem =
      process.env.NEXT_PUBLIC_AUTH_SYSTEM || "https://auth.midominio.com/login";

    window.location.href = authSystem;
  };

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
      // Manejar errores de autenticación (401 - Unauthorized, 403 - Forbidden)
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Ejecutar logout si hay error de autenticación
        handleLogout();
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Crear una instancia para exportar
export const apiClient = createApiClient();

// Exportar también la función creadora por si se necesita una instancia fresca
export default createApiClient;