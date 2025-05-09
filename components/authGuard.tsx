"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/loadingPage";

type AuthGuardProps = {
  children: React.ReactNode;
  requiredPermissions?: string[];
};

export function AuthGuard({
  children,
  requiredPermissions = [],
}: AuthGuardProps) {
  const { user, loading, isAuthenticated, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir al login
    if (!loading && !isAuthenticated) {
      router.push(`http://auth.midominio.local:3001`);

      return;
    }

    // Si está autenticado y hay permisos requeridos, verificar permisos
    if (isAuthenticated && user && requiredPermissions.length > 0) {
      // Comprobar si el usuario tiene alguno de los permisos requeridos
      const hasPermission =
        user.role === "admin" ||
        requiredPermissions.some(
          (permission) =>
            // Si el rol del usuario coincide con el permiso requerido
            user.role === permission ||
            // Si tiene el permiso específico en el objeto permisos
            (user.permisos && user.permisos[permission] === true),
        );

      console.log("En AuthGuard - Usuario:", user.role);
      console.log("En AuthGuard - Permisos requeridos:", requiredPermissions);
      console.log(
        "En AuthGuard - Tiene permisos:",
        hasPermission,
        user.permisos,
      );

      // Si no tiene los permisos necesarios, lanzar un error que será
      // capturado por el error boundary más cercano
      if (!hasPermission) {
        const error = new Error(
          "No tienes los permisos necesarios para acceder a esta página",
        );

        error.name = "PermissionError";
        throw error;
      }
    }
  }, [loading, isAuthenticated, user, router, pathname, requiredPermissions]);

  // Mostrar pantalla de carga mientras verificamos
  if (loading) {
    return <LoadingPage>Verificando acceso</LoadingPage>;
  }

  // Si no está autenticado, mostrar mensaje de redirección
  if (!isAuthenticated) {
    return <LoadingPage>Redirigiendo al ingreso</LoadingPage>;
  }

  // Si hay un error, mostrar el error
  if (error) {
    return <LoadingPage>Error: {error}</LoadingPage>;
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}
