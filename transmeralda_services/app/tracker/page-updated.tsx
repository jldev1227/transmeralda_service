"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";

import { useService } from "@/context/serviceContext";
import EnhancedMapComponent from "@/components/enhancedMapComponent";

// Datos estáticos para testing (opcional)
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN;

// --- Utilidad para estados de servicios ---
const getStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case "solicitado":
      return "Solicitado";
    case "en curso":
      return "En Curso";
    case "planificado":
      return "Planificado";
    case "realizado":
      return "Realizado";
    case "cancelado":
      return "Cancelado";
    default:
      return status;
  }
};

const getServiceTypeText = (type: string): string => {
  switch (type.toLowerCase()) {
    case "pasajeros":
      return "Transporte de Pasajeros";
    case "carga":
      return "Transporte de Carga";
    case "especial":
      return "Servicio Especial";
    default:
      return type;
  }
};

const TrackerPage = () => {
  const {
    serviciosWithRoutes,
    selectedServicio,
    vehicleTracking,
    trackingError,
    selectServicio,
    setSelectedServicio,
  } = useService();

  // Estado de error de comunicación
  const [error, setError] = useState<string | null>(null);

  // Envía peticiones a la API de Wialon
  const onWialonRequest = useCallback(
    async (sessionIdOrToken: string, endpoint: string, params: any) => {
      const isLoginCall = endpoint === "token/login";
      const payload = {
        token: isLoginCall ? null : sessionIdOrToken,
        service: endpoint,
        params,
      };

      if (isLoginCall) {
        payload.params = { ...params, token: sessionIdOrToken };
      }

      try {
        const response = await axios.post("/api/wialon-api", payload);

        if (response.data && response.data.error) {
          throw new Error(
            `Error Wialon API (${response.data.error}): ${response.data.reason || endpoint}`,
          );
        }

        return response.data;
      } catch (err) {
        console.error(`Error llamando a ${endpoint} via /api/wialon-api:`, err);
        setError(
          `Error al comunicarse con Wialon: ${err instanceof Error ? err.message : "Desconocido"}`,
        );
        throw err;
      }
    },
    [],
  );

  // Función para manejar el clic en un servicio
  const handleServicioClick = useCallback(
    (servicio) => {
      if (selectServicio) {
        selectServicio(servicio);
      }
    },
    [selectServicio],
  );

  // Si no hay token de Mapbox, mostrar error
  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 p-4 rounded-md text-red-800 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Error de configuración</h2>
          <p>
            No se encontró el token de Mapbox. Por favor configure la variable
            de entorno NEXT_PUBLIC_MAPBOX_TOKEN.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] p-4 bg-gray-50">
      <div className="h-full flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Rastreador de Servicios
          </h1>
          {error && (
            <div className="bg-red-100 py-1 px-3 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex-grow">
          <EnhancedMapComponent
            getServiceTypeText={getServiceTypeText}
            getStatusText={getStatusText}
            handleServicioClick={handleServicioClick}
            mapboxToken={MAPBOX_TOKEN}
            selectedServicio={selectedServicio || null}
            servicios={serviciosWithRoutes || []}
            trackingError={trackingError || ""}
            vehicleTracking={vehicleTracking || null}
            wialonToken={WIALON_API_TOKEN || ""}
            onWialonRequest={onWialonRequest}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
