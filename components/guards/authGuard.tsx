"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/loadingPage";

type AuthGuardProps = {
  children: React.ReactNode;
  requiredPermissions?: string[];
  allowPublicAccess?: boolean; // Nueva prop
};

export function AuthGuard({
  children,
  requiredPermissions = [],
  allowPublicAccess = false,
}: AuthGuardProps) {
  const { user, loading, isAuthenticated, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Verificar si es acceso público válido
  const hasPublicToken = searchParams.has("token");
  const isPublicRoute = pathname.startsWith("/servicio/") && hasPublicToken;

  console.log(hasPublicToken, isPublicRoute);

  useEffect(() => {
    // Si es ruta pública con token, permitir acceso
    if (allowPublicAccess && isPublicRoute) {
      return;
    }

    // Resto de tu lógica de autenticación existente
    if (!loading && !isAuthenticated) {
      // router.push(
      //   process.env.NEXT_PUBLIC_AUTH_SYSTEM ||
      //     `http://auth.midominio.local:3001`,
      // );
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

  // Si es acceso público válido, mostrar contenido directamente
  if (allowPublicAccess && isPublicRoute) {
    return <>{children}</>;
  }

  // Resto de tu lógica normal
  if (loading) {
    return <LoadingPage>Verificando acceso</LoadingPage>;
  }

  if (!isAuthenticated) {
    return <LoadingPage>Redirigiendo al ingreso</LoadingPage>;
  }

  if (error) {
    return <LoadingPage>Error: {error}</LoadingPage>;
  }

  return <>{children}</>;
}
