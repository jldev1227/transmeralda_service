"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AxiosError, isAxiosError } from "axios";

import { apiClient } from "@/config/apiClient";
import LoadingPage from "@/components/loadingPage";

// Definir la interfaz para el usuario
export interface User {
  id: string;
  nombre: string;
  correo: string;
  role: "admin" | "gestor_flota" | "gestor_nomina" | "gestor_servicio" | "gestor_planillas" | "liquidador" | "usuario";
  telefono: string;
  permisos: {
    flota: boolean;
    nomina: boolean;
    admin: boolean;
    liquidador?: boolean;
    aprobador?: boolean;
    facturador?: boolean;
    gestor_servicio?: boolean;
    gestor_planillas?: boolean;
    [key: string]: boolean | undefined;
  };
  ultimo_acceso: string;
}

// Definir la interfaz para el contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Valor predeterminado para el contexto
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  refreshProfile: async () => {},
  isAuthenticated: false,
};

// Crear el contexto con el valor predeterminado
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Función para obtener el perfil del usuario
  const fetchUserProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      // Hacer la petición al endpoint de perfil
      const response = await apiClient.get("/api/usuarios/perfil");

      if (response.data && response.data.success) {
        console.log(response.data)
        setUser(response.data.data);
        setError(null);
      } else {
        throw new Error("Respuesta no exitosa del servidor");
      }
    } catch (err) {
      // Manejar diferentes tipos de errores
      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiResponse<any>>;

        if (axiosError.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const statusCode = axiosError.response.status;
          const errorMessage = axiosError.response.data?.message;

          if (statusCode === 401) {
            setError("Sesión expirada o usuario no autenticado");
            // Aquí podrías redirigir al login si es necesario
          } else if (statusCode === 403) {
            setError("No tienes permisos para acceder a esta información");
          } else if (statusCode === 404) {
            setError("Información de usuario no encontrada");
          } else {
            setError(errorMessage || `Error en la petición (${statusCode})`);
          }
        } else if (axiosError.request) {
          // La petición fue hecha pero no se recibió respuesta
          setError(
            "No se pudo conectar con el servidor. Verifica tu conexión a internet",
          );
        } else {
          // Error al configurar la petición
          setError(`Error al configurar la petición: ${axiosError.message}`);
        }
      } else {
        // Error que no es de Axios
        setError(
          `No se pudo obtener la información del usuario: ${(err as Error).message}`,
        );
      }

      setUser(null);
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  // Cargar perfil al inicializar
  useEffect(() => {
    fetchUserProfile();

    // Establecer un tiempo máximo para la inicialización
    const timeoutId = setTimeout(() => {
      if (initializing) {
        setInitializing(false);
      }
    }, 5000); // 5 segundos máximo de espera

    return () => clearTimeout(timeoutId);
  }, []);

  // Determinar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Contexto que será proporcionado
  const authContext: AuthContextType = {
    user,
    loading,
    error,
    refreshProfile: fetchUserProfile,
    isAuthenticated,
  };

  // Mostrar pantalla de carga durante la inicialización
  if (initializing) {
    return <LoadingPage>Verificando acceso</LoadingPage>;
  }

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
