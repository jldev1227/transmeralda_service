"use client";

import React, { useState, useCallback } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Alert } from "@heroui/alert";

import EnhancedMapComponent from "@/components/enhancedMapComponent";
import {
  useService,
  VehicleTracking,
  ServicioConRelaciones,
} from "@/context/serviceContext";
import ModalFormServicio from "@/components/ui/modalFormServicio";
import { formatearFecha } from "@/helpers";
import ServiciosListCards from "@/components/ui/serviciosListCards";
import ModalTicket from "@/components/ui/modalTicket";
import ModalPlanilla from "@/components/ui/modalPlanilla";

interface MapboxRoute {
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
  };
}

interface Filters {
  estado: string;
  origen: string;
  destino: string;
  fechaSolicitud: string;
  fechaRealizacion: string;
  propositoServicio: string;
}

const serviceTypeTextMap: Record<string, string> = {
  herramienta: "Cargado con herramienta",
  personal: "Deplazamineto de personal",
  vehiculo: "Posicionar vehiculo",
};

const getServiceTypeText = (tipo: string): string => {
  return serviceTypeTextMap[tipo] || tipo;
};

// Main Dashboard Component
const AdvancedDashboard = () => {
  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const [token] = useState(WIALON_API_TOKEN);

  // State
  const { servicios, socketConnected, selectedServicio, setSelectedServicio } =
    useService();
  const [servicioWithRoutes, setServicioWithRoutes] =
    useState<ServicioConRelaciones | null>(null);
  const [vehicleTracking, setVehicleTracking] =
    useState<VehicleTracking | null>(null);
  const [isLoadingWialon, setIsLoadingWialon] = useState(false);
  const [trackingError, setTrackingError] = useState<string>("");

  // Filters
  const [filters, setFilters] = useState<Filters>({
    estado: "",
    origen: "",
    destino: "",
    fechaSolicitud: "",
    fechaRealizacion: "",
    propositoServicio: "",
  });

  // Wialon API call function
  const callWialonApi = useCallback(
    async (sessionIdOrToken: string, service: string, params: any) => {
      const isLoginCall = service === "token/login";
      const payload = {
        token: isLoginCall ? null : sessionIdOrToken,
        service,
        params,
      };

      if (isLoginCall) {
        payload.params = { ...params, token: sessionIdOrToken };
      }

      try {
        const response = await axios.post("/api/wialon-api", payload);

        if (response.data && response.data.error) {
          throw new Error(
            `Error Wialon API (${response.data.error}): ${response.data.reason || service}`,
          );
        }

        return response.data;
      } catch (err) {
        console.error(`Error llamando a ${service} via /api/wialon-api:`, err);
        throw err;
      }
    },
    [],
  );

  // Fetch route geometry using Mapbox API
  const fetchRouteGeometry = useCallback(
    async (servicio: ServicioConRelaciones) => {
      if (!servicio || !MAPBOX_ACCESS_TOKEN) {
        return null;
      }

      try {
        // For 'en_curso' services, try to get the vehicle position from Wialon first
        let origenLat = servicio.origen_latitud;
        let origenLng = servicio.origen_longitud;
        let useVehiclePosition = false;

        if (
          servicio.estado === "en_curso" &&
          servicio.vehiculo?.placa &&
          token
        ) {
          try {
            setTrackingError("");
            setIsLoadingWialon(true);

            // Login to Wialon to get session ID
            const loginData = await callWialonApi(token, "token/login", {});

            if (loginData?.eid) {
              const sessionId = loginData.eid;

              // Search for the vehicle by plate number
              const vehiclesData = await callWialonApi(
                sessionId,
                "core/search_items",
                {
                  spec: {
                    itemsType: "avl_unit",
                    propName: "sys_name",
                    propValueMask: "*",
                    sortType: "sys_name",
                  },
                  force: 1,
                  flags: 1025, // Include position data
                  from: 0,
                  to: 1000,
                },
              );

              if (vehiclesData?.items) {
                // Find the vehicle with matching plate number
                const vehicleData = vehiclesData.items.find(
                  (v: any) =>
                    v.nm.includes(servicio.vehiculo.placa) ||
                    v.nm.toLowerCase() ===
                      servicio.vehiculo.placa.toLowerCase(),
                );

                // If vehicle found and has position data
                if (vehicleData?.pos) {
                  // Update origin coordinates to vehicle's current position
                  origenLat = vehicleData.pos.y;
                  origenLng = vehicleData.pos.x;
                  useVehiclePosition = true;

                  // Create vehicle tracking object for the map component
                  const trackingData: VehicleTracking = {
                    id: vehicleData.id,
                    name: vehicleData.nm,
                    flags: vehicleData.flags || 0,
                    position: vehicleData.pos,
                    lastUpdate: new Date(),
                    item: vehicleData,
                  };

                  setVehicleTracking(trackingData);
                } else {
                  setTrackingError(
                    "No se encontró la posición actual del vehículo",
                  );
                }
              }
            }
          } catch (error) {
            console.error("Error al obtener posición del vehículo:", error);
            setTrackingError("Error al obtener información del vehículo");
          } finally {
            setIsLoadingWialon(false);
          }
        }

        // Ensure coordinates exist and are valid
        if (
          !origenLat ||
          !origenLng ||
          !servicio.destino_latitud ||
          !servicio.destino_longitud
        ) {
          throw new Error("Coordenadas de origen o destino no válidas");
        }

        const origenCoords: LatLngTuple = [origenLat, origenLng];
        const destinoCoords: LatLngTuple = [
          servicio.destino_latitud,
          servicio.destino_longitud,
        ];

        // Build URL for Mapbox Directions API
        const originCoords = `${origenCoords[1]},${origenCoords[0]}`; // [lng, lat] format
        const destCoords = `${destinoCoords[1]},${destinoCoords[0]}`;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords};${destCoords}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`;

        // Make request to API
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Error en la respuesta de Mapbox API: ${response.status}`,
          );
        }

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          throw new Error("No se encontró una ruta válida");
        }

        // Extract route geometry
        const route: MapboxRoute = data.routes[0];

        const servicioWithRoutesData = {
          ...servicio,
          origenCoords: useVehiclePosition
            ? ([origenLat, origenLng] as LatLngTuple)
            : origenCoords,
          destinoCoords,
          geometry: [origenCoords, destinoCoords] as LatLngExpression[],
          routeDistance: (route.distance / 1000).toFixed(1),
          routeDuration: Math.round(route.duration / 60),
        };

        setServicioWithRoutes(servicioWithRoutesData);

        return servicioWithRoutesData;
      } catch (error: any) {
        console.error("Error:", error.message);

        // Handle error case using a straight line
        if (
          servicio.origen_latitud &&
          servicio.origen_longitud &&
          servicio.destino_latitud &&
          servicio.destino_longitud
        ) {
          const origenCoords: LatLngTuple = [
            servicio.origen_latitud,
            servicio.origen_longitud,
          ];
          const destinoCoords: LatLngTuple = [
            servicio.destino_latitud,
            servicio.destino_longitud,
          ];

          const servicioWithRoutesData = {
            ...servicio,
            origenCoords,
            destinoCoords,
            geometry: [origenCoords, destinoCoords],
            routeDistance: servicio.distancia_km.toString() || "0",
            routeDuration: null,
          };

          setServicioWithRoutes(servicioWithRoutesData);

          return servicioWithRoutesData;
        }

        return null;
      }
    },
    [MAPBOX_ACCESS_TOKEN, token, callWialonApi],
  );

  // Select a service
  const handleSelectServicio = useCallback(
    async (servicio: ServicioConRelaciones) => {
      setSelectedServicio(servicio);
      await fetchRouteGeometry(servicio);
    },
    [fetchRouteGeometry],
  );

  // Filter services
  const filteredServicios = servicios.filter((servicio) => {
    if (filters.estado && servicio.estado !== filters.estado) return false;
    if (
      filters.origen &&
      !servicio.origen_especifico
        .toLowerCase()
        .includes(filters.origen.toLowerCase())
    )
      return false;
    if (
      filters.destino &&
      !servicio.destino_especifico
        .toLowerCase()
        .includes(filters.destino.toLowerCase())
    )
      return false;
    if (
      filters.propositoServicio &&
      servicio.proposito_servicio !== filters.propositoServicio
    )
      return false;

    return true;
  });

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Sidebar/floating panel */}
      <div>
        {/* Panel header with handle for mobile */}
        <div className="bg-white p-3 md:p-4 border-b flex items-center justify-between sticky top-0 z-10">
          <div className="w-full space-y-2">
            <h2 className="text-lg md:text-xl font-bold">Servicios</h2>
            {socketConnected ? (
              <Alert
                className="py-2"
                color="success"
                radius="sm"
                title="Obteniendo cambios en tiempo real"
                variant="faded"
              />
            ) : (
              <Alert
                className="py-2"
                color="danger"
                radius="sm"
                title="Desconectado de conexión en tiempo real"
                variant="faded"
              />
            )}
          </div>
        </div>

        {/* Panel content with scrolling */}
        <div className="bg-white h-[calc(100%-56px)] min-w-96 overflow-auto">
          {/* Filters */}
          <div className="p-3 md:p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-1">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="estado"
                >
                  Estado
                </label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  id="estado"
                  value={filters.estado}
                  onChange={(e) =>
                    setFilters({ ...filters, estado: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  <option value="solicitado">Solicitado</option>
                  <option value="planificado">Planificado</option>
                  <option value="en_curso">En curso</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="propositoServicio"
                >
                  Tipo de Servicio
                </label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  id="propositoServicio"
                  value={filters.propositoServicio}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      propositoServicio: e.target.value,
                    })
                  }
                >
                  <option value="">Todos</option>
                  <option value="personal">Personal</option>
                  <option value="herramienta">Herramienta</option>
                  <option value="vehiculo">Posicionar vehículo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="origen"
                >
                  Origen
                </label>
                <input
                  className="w-full p-2 border rounded-md text-sm"
                  id="origen"
                  placeholder="Buscar origen..."
                  type="text"
                  value={filters.origen}
                  onChange={(e) =>
                    setFilters({ ...filters, origen: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="destino"
                >
                  Destino
                </label>
                <input
                  className="w-full p-2 border rounded-md text-sm"
                  id="destino"
                  placeholder="Buscar destino..."
                  type="text"
                  value={filters.destino}
                  onChange={(e) =>
                    setFilters({ ...filters, destino: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Service list */}
          <div className="p-3 md:p-4">
            {filteredServicios.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No se encontraron servicios
              </div>
            ) : (
              <ServiciosListCards
                filteredServicios={filteredServicios}
                formatearFecha={formatearFecha}
                handleSelectServicio={handleSelectServicio}
                selectedServicio={selectedServicio}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main map panel - takes full width/height when sidebar is closed */}
      <div className="h-full w-full transition-all duration-300">
        <EnhancedMapComponent
          getServiceTypeText={getServiceTypeText}
          handleSelectServicio={handleSelectServicio}
          mapboxToken={MAPBOX_ACCESS_TOKEN}
          selectedServicio={servicioWithRoutes}
          servicios={servicios}
          setServicioWithRoutes={setServicioWithRoutes}
          trackingError={trackingError}
          vehicleTracking={vehicleTracking}
          wialonToken={WIALON_API_TOKEN}
          onWialonRequest={callWialonApi}
        />
        <ModalFormServicio />
        <ModalTicket />
        <ModalPlanilla />
      </div>

      {/* Additional styles */}
      <style global jsx>{`
        .vehicle-marker {
          transition: transform 0.2s ease-in-out;
        }
        .vehicle-marker:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          /* Mobile drag handle appearance */
          .panel-drag-handle {
            width: 40px;
            height: 5px;
            background-color: #cbd5e0;
            border-radius: 3px;
            margin: 10px auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedDashboard;
