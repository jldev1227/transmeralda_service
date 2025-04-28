"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { LatLngTuple } from "leaflet";

import OptimizedMapComponent from "@/components/optimizedMapComponent";
import {
  ServicioConRelaciones,
  useService,
  VehicleTracking,
} from "@/context/serviceContext";
import ServiceDetailPanel from "@/components/ui/servicioDetailPanel";
import LoadingPage from "@/components/loadingPage";

// Definición de la interfaz WialonVehicle para TypeScript
interface WialonVehicle {
  id: number;
  nm: string;
  pos?: {
    x: number;
    y: number;
    t: number;
    s?: number;
    c?: number;
  };
}

// Componente padre que gestiona la obtención de datos del servicio
const ServicioDetailView = ({ servicioId }: { servicioId: string }) => {
  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const params = useParams<{ id: string }>();
  const { servicio, obtenerServicio } = useService();

  console.log(servicio);
  const [token] = useState(WIALON_API_TOKEN);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isLoadingWialon, setIsLoadingWialon] = useState(false);
  const [servicioWithRoutes, setServicioWithRoutes] =
    useState<ServicioConRelaciones | null>(null);
  const [vehicleTracking, setVehicleTracking] =
    useState<VehicleTracking | null>(null);
  const [trackingError, setTrackingError] = useState<string>("");
  const [wialonVehicles, setWialonVehicles] = useState<WialonVehicle[]>([]);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  // Calcular estado de carga general
  const loading = isLoadingService || isLoadingRoute || isLoadingWialon;

  // Función para llamar a la API de Wialon
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

  // Función para obtener datos del servicio
  const fetchServicioData = useCallback(
    async (id: string) => {
      setIsLoadingService(true);
      try {
        await obtenerServicio(id);
      } catch (error) {
        console.error("Error fetching servicio:", error);
      } finally {
        setIsLoadingService(false);
      }
    },
    [obtenerServicio],
  );

  // Función para obtener la geometría de la ruta usando Mapbox API
  const fetchRouteGeometry = useCallback(async () => {
    if (!servicio || !mapboxLoaded || !MAPBOX_ACCESS_TOKEN) {
      return;
    }

    setIsLoadingRoute(true);

    try {
      // Asegurarse de que las coordenadas existan y sean válidas
      if (
        !servicio.origen_latitud ||
        !servicio.origen_longitud ||
        !servicio.destino_latitud ||
        !servicio.destino_longitud
      ) {
        throw new Error("Coordenadas de origen o destino no válidas");
      }

      const origenCoords: LatLngTuple = [
        servicio.origen_latitud,
        servicio.origen_longitud,
      ];
      const destinoCoords: LatLngTuple = [
        servicio.destino_latitud,
        servicio.destino_longitud,
      ];

      console.log("Origen:", origenCoords, "Destino:", destinoCoords);

      // Construir la URL para la API de Directions de Mapbox
      // Nota: Mapbox usa formato [longitud, latitud] a diferencia de [latitud, longitud]
      const originCoords = `${origenCoords[1]},${origenCoords[0]}`; // [lng, lat] format
      const destCoords = `${destinoCoords[1]},${destinoCoords[0]}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords};${destCoords}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`;

      // Hacer la petición a la API
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

      // Extraer la geometría de la ruta
      const route = data.routes[0];

      // Convertir las coordenadas de [lng, lat] a [lat, lng] para mantener compatibilidad con el resto del código
      const coordinates = route.geometry.coordinates.map((coord) => [
        coord[1], // latitud
        coord[0], // longitud
      ]);

      setServicioWithRoutes({
        ...servicio,
        origenCoords,
        destinoCoords,
        geometry: coordinates,
        routeDistance: (route.distance / 1000).toFixed(1),
        routeDuration: Math.round(route.duration / 60),
      });
    } catch (error: any) {
      console.error("Error:", error.message);

      // Manejar el caso de error utilizando una línea recta
      if (servicio?.origen?.latitud && servicio?.destino?.latitud) {
        const origenCoords: LatLngTuple = [
          servicio.origen.latitud,
          servicio.origen.longitud,
        ];
        const destinoCoords: LatLngTuple = [
          servicio.destino.latitud,
          servicio.destino.longitud,
        ];

        setServicioWithRoutes({
          ...servicio,
          origenCoords,
          destinoCoords,
          geometry: [origenCoords, destinoCoords],
          routeDistance: servicio.distancia_km || "0",
          routeDuration: null,
        });

        console.warn("Usando ruta en línea recta como alternativa");
      }
    } finally {
      setIsLoadingRoute(false);
    }
  }, [servicio, mapboxLoaded, MAPBOX_ACCESS_TOKEN]);

  // Manejar la carga de los scripts de Mapbox
  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error("Error: No se ha configurado MAPBOX_ACCESS_TOKEN");

      return;
    }

    // Comprobar si ya existe el script o CSS de Mapbox en el documento
    const existingScript = document.querySelector(
      'script[src*="mapbox-gl-js"]',
    );
    const existingCSS = document.querySelector('link[href*="mapbox-gl-js"]');

    if (existingScript && existingCSS) {
      setMapboxLoaded(true);

      return;
    }

    // Cargar CSS de Mapbox
    const mapboxCSS = document.createElement("link");

    mapboxCSS.rel = "stylesheet";
    mapboxCSS.href =
      "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css";
    document.head.appendChild(mapboxCSS);

    // Cargar script de Mapbox
    const mapboxScript = document.createElement("script");

    mapboxScript.src =
      "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js";
    mapboxScript.async = true;

    mapboxScript.onload = () => {
      setMapboxLoaded(true);
    };

    document.head.appendChild(mapboxScript);

    return () => {
      // Limpieza al desmontar
      if (document.head.contains(mapboxScript)) {
        document.head.removeChild(mapboxScript);
      }
      if (document.head.contains(mapboxCSS)) {
        document.head.removeChild(mapboxCSS);
      }
    };
  }, [MAPBOX_ACCESS_TOKEN]);

  // Efectos para cargar datos cuando cambia el ID
  useEffect(() => {
    if (params.id) {
      fetchServicioData(params.id);
    }
  }, [params.id, fetchServicioData]);

  // Efecto para cargar la geometría de la ruta cuando el servicio cambia y Mapbox está cargado
  useEffect(() => {
    if (servicio && mapboxLoaded) {
      fetchRouteGeometry();
    }
  }, [servicio, fetchRouteGeometry, mapboxLoaded]);

  // Inicializar y obtener datos de Wialon
  useEffect(() => {
    let isMounted = true;

    // Solo iniciar si tenemos todos los datos necesarios
    if (
      !token ||
      !servicioWithRoutes ||
      servicioWithRoutes.estado !== "en curso"
    ) {
      return;
    }

    setIsLoadingWialon(true);

    const initWialon = async () => {
      try {
        // 1. Login a Wialon
        const loginData = await callWialonApi(token, "token/login", {});

        if (!loginData?.eid) {
          throw new Error("Login fallido: No se obtuvo Session ID");
        }

        if (!isMounted) return;
        const sid = loginData.eid;

        // 2. Obtener lista de vehículos
        const vehiclesData = await callWialonApi(sid, "core/search_items", {
          spec: {
            itemsType: "avl_unit",
            propName: "sys_name",
            propValueMask: "*",
            sortType: "sys_name",
          },
          force: 1,
          flags: 1,
          from: 0,
          to: 1000,
        });

        if (!isMounted) return;

        if (!vehiclesData?.items || !Array.isArray(vehiclesData.items)) {
          throw new Error("No se pudieron obtener los vehículos");
        }

        const vehicles: WialonVehicle[] = vehiclesData.items;

        setWialonVehicles(vehicles);

        // 3. Buscar vehículo por placa
        if (
          servicioWithRoutes.vehiculo_id &&
          servicioWithRoutes.vehiculo?.placa
        ) {
          const placa = servicioWithRoutes.vehiculo.placa;
          const foundVehicle = vehicles.find(
            (v) =>
              v.nm.includes(placa) ||
              v.nm.toLowerCase() === placa.toLowerCase(),
          );

          if (foundVehicle) {
            // 4. Obtener posición del vehículo
            const vehicleData = await callWialonApi(sid, "core/search_item", {
              id: foundVehicle.id,
              flags: 1025,
            });

            if (!isMounted) return;

            if (vehicleData?.item?.pos) {
              const { pos } = vehicleData.item;

              setVehicleTracking({
                id: foundVehicle.id,
                name: foundVehicle.nm,
                position: pos,
                lastUpdate: new Date(pos.t * 1000),
              });
            } else {
              setTrackingError("El vehículo no está transmitiendo su posición");
            }
          } else {
            setTrackingError(
              `Vehículo con placa ${placa} no encontrado en la flota de wialon`,
            );
          }
        } else {
          setTrackingError("No hay información de placa del vehículo");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error en la integración con Wialon:", error);
          setTrackingError(
            error instanceof Error ? error.message : "Error desconocido",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingWialon(false);
        }
      }
    };

    initWialon();

    return () => {
      isMounted = false;
    };
  }, [token, callWialonApi, servicioWithRoutes]);

  // Funciones auxiliares que necesita el mapa
  const handleServicioClick = (servicio: ServicioConRelaciones) => {
    // Acción al hacer click en el servicio
    console.log("Servicio clicked:", servicio);
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "realizado":
        return "Realizado";
      case "en curso":
        return "En curso";
      case "planificado":
        return "Pendiente";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const getServiceTypeText = (tipo: string) => {
    switch (tipo) {
      case "carga":
        return "Carga";
      case "pasajeros":
        return "Pasajeros";
      default:
        return tipo;
    }
  };

  if (loading) return <LoadingPage>Cargando servicio</LoadingPage>;

  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-4 relative">
      {/* Botón flotante para mostrar el panel (solo en móvil) */}
      <button
        className={`md:hidden fixed top-32 left-4 z-20 bg-white shadow-lg p-3 rounded-full transition-opacity duration-300 ${
          isPanelVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setIsPanelVisible(true)}
      >
        {/* Ícono de flecha hacia abajo */}
        <svg
          className="h-6 w-6 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {/* Panel lateral izquierdo */}
      <div
        className={`max-sm:absolute z-10 md:col-span-1 overflow-hidden 
      max-sm:inset-x-0 max-sm:top-0 max-sm:transition-transform max-sm:duration-500 max-sm:ease-in-out
      ${isPanelVisible ? "max-sm:translate-y-0" : "max-sm:-translate-y-full"}`}
      >
        {servicioWithRoutes && (
          <ServiceDetailPanel
            isLoadingRoute={isLoadingRoute}
            servicioWithRoutes={servicioWithRoutes}
            vehicleTracking={vehicleTracking}
            onClose={() => setIsPanelVisible(false)} // Pasa la función para cerrar
          />
        )}
      </div>

      {/* Mapa */}
      <div className="md:col-span-3">
        {mapboxLoaded && servicioWithRoutes ? (
          <OptimizedMapComponent
            getServiceTypeText={getServiceTypeText}
            getStatusText={getStatusText}
            handleServicioClick={handleServicioClick}
            mapboxToken={MAPBOX_ACCESS_TOKEN}
            servicioId={servicioId}
            servicioWithRoutes={servicioWithRoutes}
            trackingError={trackingError}
            vehicleTracking={vehicleTracking}
          />
        ) : (
          <LoadingPage>Cargando mapa</LoadingPage>
        )}
      </div>
    </div>
  );
};

export default ServicioDetailView;
