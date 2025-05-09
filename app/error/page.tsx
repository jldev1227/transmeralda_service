"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftIcon,
  HomeIcon,
  RefreshCw,
} from "lucide-react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage =
    searchParams.get("message") ||
    "No tienes los permisos necesarios para acceder a esta página";
  const statusCode = searchParams.get("statusCode") || "403";

  // Registrar el error en la consola
  useEffect(() => {
    console.error(`[ErrorPage] Mostrando error ${statusCode}: ${errorMessage}`);
  }, [statusCode, errorMessage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-red-500 text-5xl mb-4 flex justify-center">
          <AlertTriangle size={64} />
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-md font-medium text-red-700">
                Error {statusCode}
              </p>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error de Acceso
        </h2>
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para acceder a esta página. Por
          favor, contacta al administrador si crees que deberías tener acceso.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            className="flex items-center justify-center w-full py-2 px-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors"
            href="/"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Ir al Inicio
          </Link>
          <button
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar Nuevamente
          </button>
          <button
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 font-medium rounded hover:bg-gray-200 transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}
