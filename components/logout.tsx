"use client";

import React, { ReactNode } from "react";
import { Button } from "@heroui/button";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/config/apiClient";

export const useLogout = () => {
  const { refreshProfile } = useAuth();

  const logout = async () => {
    try {
      // 1. Llamar al endpoint de logout en el backend (si existe)
      await apiClient.post("/api/usuarios/logout");
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
      // Continuar con el logout local incluso si falla el servidor
    } finally {
      // 2. Limpiar cookies
      clearAuthCookies();

      // 3. Actualizar el estado de autenticación
      await refreshProfile();

      // 4. Redirigir al sistema de autenticación
      redirectToAuthSystem();
    }
  };

  const clearAuthCookies = () => {
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

    // Limpiar cualquier almacenamiento local que pueda contener información de sesión
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
  };

  const redirectToAuthSystem = () => {
    const authSystem =
      process.env.NEXT_PUBLIC_AUTH_SYSTEM || "https://auth.midominio.com/login";

    window.location.href = authSystem;
  };

  return { logout };
};

// Componente para el botón de logout
export const LogoutButton = ({ children }: { children?: ReactNode }) => {
  const { logout } = useLogout();

  return (
    <Button
      isIconOnly
      color="danger"
      radius="sm"
      variant="flat"
      onPress={logout}
    >
      <svg
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Button>
  );
};

export default useLogout;
