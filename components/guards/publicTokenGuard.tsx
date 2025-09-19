// components/guards/PublicTokenGuard.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import { usePublicTokenValidation } from "@/hooks/usePublicTokenValidation";
import LoadingPage from "@/components/loadingPage";

interface PublicTokenGuardProps {
  children: React.ReactNode;
  servicioId: string;
}

export function PublicTokenGuard({
  children,
  servicioId,
}: PublicTokenGuardProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { isValid, isLoading, error } = usePublicTokenValidation(
    token,
    servicioId,
  );

  if (isLoading) {
    return <LoadingPage>Verificando enlace...</LoadingPage>;
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <TriangleAlert className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Enlace no válido
          </h3>
          <p className="text-sm text-gray-500">
            {error || "Este enlace ha expirado o no es válido"}
          </p>
        </div>
      </div>
    );
  }

  // El hook ya obtuvo los datos del servicio, puedes pasarlos a los children si los necesitas
  return <>{children}</>;
}
