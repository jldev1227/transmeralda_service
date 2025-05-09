"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCwIcon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; error?: string; statusCode?: number };
  reset: () => void;
}) {
  const router = useRouter();

  // Intentar extraer el mensaje de error del objeto de error
  // Primero intenta obtenerlo desde error.error (del middleware),
  // luego de message, o usa un mensaje predeterminado
  const errorMessage = error.error || error.message || "Error de Acceso";

  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error("Error capturado por error boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">
          <svg
            className="h-16 w-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error de Acceso
        </h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="flex flex-col space-y-3">
          <Link
            className="inline-block w-full py-2 px-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors"
            href="/"
          >
            Ir al Inicio
          </Link>
          <button
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
            onClick={() => reset()}
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Intentar Nuevamente
          </button>
          <button
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 font-medium rounded hover:bg-gray-200 transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}
