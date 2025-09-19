// hooks/usePublicTokenValidation.ts
import { useState, useEffect } from "react";

export const usePublicTokenValidation = (
  token: string | null,
  servicioId: string,
) => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Token requerido");
        setIsValid(false);
        setIsLoading(false);

        return;
      }

      try {
        // Usar fetch directo SIN apiClient para evitar interceptores
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/servicios/publico/${servicioId}?token=${token}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // NO usar withCredentials para rutas públicas
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.success) {
          setIsValid(true);
          setData(responseData.data);
        } else {
          setIsValid(false);
          setError(responseData.message || "Token inválido");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error al validar el enlace");
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, servicioId]);

  return { isValid, isLoading, error, data };
};
