"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";

import { useService } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

interface ModalMapProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function ModalMap({ isOpen, onClose }: ModalMapProps) {
  const { servicioWithRoutes } = useService();

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{
    origen?: mapboxgl.Marker;
    destino?: mapboxgl.Marker;
    vehicle?: mapboxgl.Marker;
  }>({});

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>("");
  const [vehicleTracking, setVehicleTracking] = useState<any>(null);
  const [trackingError, setTrackingError] = useState<string>("");
  const [wialonSessionId, setWialonSessionId] = useState<string | null>(null);
  const [distancia, setDistancia] = useState<number>(0);
  const [duracion, setDuracion] = useState<number>(0);

  // Tokens desde variables de entorno
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";

  // Función para hacer llamadas a la API de Wialon
  const callWialonApi = async (
    sessionIdOrToken: string,
    service: string,
    params: any,
  ) => {
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
      const response = await fetch("/api/wialon-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data && data.error) {
        throw new Error(
          `Error Wialon API (${data.error}): ${data.reason || service}`,
        );
      }

      return data;
    } catch (err) {
      console.error(`Error llamando a ${service}:`, err);
      throw err;
    }
  };

  // Función para obtener la ruta desde Mapbox API
  const fetchMapboxRoute = async (
    origin: [number, number],
    destination: [number, number],
  ): Promise<number[][]> => {
    if (!MAPBOX_ACCESS_TOKEN) return [origin, destination];

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error("Error en Mapbox API");

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No se encontró ruta");
      }

      setDistancia(Number((data.routes[0].distance / 1000).toFixed(2)));
      setDuracion(data.routes[0].duration);

      return data.routes[0].geometry.coordinates;
    } catch (error) {
      console.error("Error obteniendo ruta:", error);

      return [origin, destination];
    }
  };

  // Función para crear popups
  const createPopupHTML = (type: "origen" | "destino") => {
    if (!servicioWithRoutes) return "";

    const isOrigin = type === "origen";

    return `
            <div class="marker-popup">
                <div class="popup-header" style="background-color: #059669; color: white; padding: 8px; font-weight: bold; border-radius: 4px 4px 0 0;">
                    ${isOrigin ? "Punto de Origen" : "Punto de Destino"}
                </div>
                <div class="popup-content" style="padding: 8px;">
                    <div class="font-medium" style="font-weight: 600; margin-bottom: 4px;">
                        ${
                          isOrigin
                            ? servicioWithRoutes.origen_especifico ||
                              servicioWithRoutes.origen?.nombre_municipio ||
                              "Origen"
                            : servicioWithRoutes.destino_especifico ||
                              servicioWithRoutes.destino?.nombre_municipio ||
                              "Destino"
                        }
                    </div>
                    <div class="popup-divider" style="height: 1px; background-color: #e5e7eb; margin: 8px 0;"></div>
                    <div class="text-sm" style="font-size: 0.875rem;">
                        ${
                          isOrigin
                            ? `
                            <div>
                                <div class="font-medium" style="font-weight: 500;">Tipo de servicio:</div>
                                <div style="color: #6b7280;">${servicioWithRoutes.proposito_servicio || "No especificado"}</div>
                            </div>
                        `
                            : `
                            <div>
                                <div class="font-medium" style="font-weight: 500;">Distancia estimada</div>
                                <div style="color: #6b7280;">${distancia || "Calculando..."} km</div>
                            </div>
                        `
                        }
                    </div>
                </div>
            </div>
        `;
  };

  // Función para crear marcador de vehículo
  const createVehicleMarker = (lngLat: [number, number], vehicleData: any) => {
    if (!map.current) return null;

    const el = document.createElement("div");

    el.className = "vehicle-marker";
    el.style.width = "38px";
    el.style.height = "38px";
    el.style.backgroundColor = "#0077b6"; // Color naranja
    el.style.backgroundImage = "url('/assets/marker.png')";
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid #ffffff";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

    const popupContent = `
            <div class="vehicle-popup" style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 8px;">${vehicleData.name || "Vehículo"}</h3>
                <div style="font-size: 0.875rem;">
                    <div style="margin-bottom: 4px;">
                        <strong>Velocidad:</strong> ${vehicleData.position?.s || 0} km/h
                    </div>
                    <div style="margin-bottom: 4px;">
                        <strong>Dirección:</strong> ${vehicleData.position?.c || 0}°
                    </div>
                    <div style="margin-bottom: 4px;">
                        <strong>Coordenadas:</strong><br>
                        ${vehicleData.position?.x?.toFixed(6)}, ${vehicleData.position?.y?.toFixed(6)}
                    </div>
                    <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px;">
                        Actualizado: ${vehicleData.lastUpdate ? new Date(vehicleData.lastUpdate).toLocaleTimeString() : "N/A"}
                    </div>
                </div>
            </div>
        `;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
      closeButton: true,
    }).setHTML(popupContent);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      marker.togglePopup();
    });

    return marker;
  };

  // Función para crear marcadores
  const createMarker = (
    lngLat: [number, number],
    type: "origen" | "destino",
    popupContent: string,
  ) => {
    if (!map.current) return null;

    const el = document.createElement("div");

    el.className = `custom-marker marker-${type}`;
    el.style.backgroundColor = "#059669";
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.borderRadius = "50%";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.color = "white";
    el.style.fontWeight = "bold";
    el.style.border = "2px solid white";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
    el.innerText = type === "origen" ? "A" : "B";

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
      closeButton: true,
    }).setHTML(popupContent);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      marker.togglePopup();
    });

    return marker;
  };

  // Función para obtener información del vehículo desde Wialon
  const fetchVehicleTracking = async (vehiclePlaca: string) => {
    if (!WIALON_API_TOKEN || !wialonSessionId) return;

    try {
      setTrackingError("");

      // Buscar vehículos en Wialon
      const vehiclesData = await callWialonApi(
        wialonSessionId,
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

      if (!vehiclesData?.items) {
        setTrackingError("No se pudieron obtener los vehículos");

        return;
      }

      // Buscar el vehículo específico por placa
      const vehicleData = vehiclesData.items.find(
        (v: any) =>
          v.nm.includes(vehiclePlaca) ||
          v.nm.toLowerCase() === vehiclePlaca.toLowerCase(),
      );

      if (!vehicleData?.pos) {
        setTrackingError(
          `No se encontró posición para el vehículo ${vehiclePlaca}`,
        );

        return;
      }

      // Crear objeto de tracking
      const trackingData = {
        id: vehicleData.id,
        name: vehicleData.nm,
        position: vehicleData.pos,
        lastUpdate: new Date(),
        item: vehicleData,
      };

      setVehicleTracking(trackingData);

      return trackingData;
    } catch (error) {
      console.error("Error obteniendo tracking del vehículo:", error);
      setTrackingError("Error al obtener información del vehículo");
    }
  };

  // Función para limpiar marcadores y rutas
  const clearMapObjects = () => {
    if (!map.current) return;

    // Limpiar marcadores
    if (markersRef.current.origen) {
      markersRef.current.origen.remove();
      markersRef.current.origen = undefined;
    }
    if (markersRef.current.destino) {
      markersRef.current.destino.remove();
      markersRef.current.destino = undefined;
    }
    if (markersRef.current.vehicle) {
      markersRef.current.vehicle.remove();
      markersRef.current.vehicle = undefined;
    }

    // Limpiar ruta
    try {
      if (map.current.getLayer("route")) {
        map.current.removeLayer("route");
      }
      if (map.current.getSource("route")) {
        map.current.removeSource("route");
      }
    } catch (err) {
      console.error("Error limpiando ruta:", err);
    }

    // Cerrar popups
    try {
      document.querySelectorAll(".mapboxgl-popup").forEach((popup) => {
        popup.remove();
      });
    } catch (err) {
      console.error("Error removiendo popups:", err);
    }
  };

  useEffect(() => {
    // Verificar token de Mapbox
    if (!MAPBOX_ACCESS_TOKEN) {
      setMapError("Token de Mapbox no configurado");

      return;
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  }, [MAPBOX_ACCESS_TOKEN]);

  // Efecto para inicializar sesión de Wialon
  useEffect(() => {
    const initWialon = async () => {
      if (!WIALON_API_TOKEN) return;

      try {
        const loginData = await callWialonApi(
          WIALON_API_TOKEN,
          "token/login",
          {},
        );

        if (loginData?.eid) {
          setWialonSessionId(loginData.eid);
        }
      } catch (error) {
        console.error("Error al iniciar sesión en Wialon:", error);
        setTrackingError("Error al conectar con Wialon");
      }
    };

    initWialon();
  }, [WIALON_API_TOKEN]);

  // Efecto para crear/actualizar ruta cuando cambie servicioWithRoutes
  useEffect(() => {
    if (!isMapLoaded || !map.current || !servicioWithRoutes) return;

    // Limpiar objetos existentes
    clearMapObjects();

    // Verificar que tengamos coordenadas válidas
    const origenLat =
      servicioWithRoutes.origen_latitud || servicioWithRoutes.origen?.latitud;
    const origenLng =
      servicioWithRoutes.origen_longitud || servicioWithRoutes.origen?.longitud;
    const destinoLat =
      servicioWithRoutes.destino_latitud || servicioWithRoutes.destino?.latitud;
    const destinoLng =
      servicioWithRoutes.destino_longitud ||
      servicioWithRoutes.destino?.longitud;

    // Si no hay coordenadas pero hay origenCoords y destinoCoords
    const finalOrigenLat =
      origenLat ||
      (servicioWithRoutes.origenCoords
        ? servicioWithRoutes.origenCoords[0]
        : null);
    const finalOrigenLng =
      origenLng ||
      (servicioWithRoutes.origenCoords
        ? servicioWithRoutes.origenCoords[1]
        : null);
    const finalDestinoLat =
      destinoLat ||
      (servicioWithRoutes.destinoCoords
        ? servicioWithRoutes.destinoCoords[0]
        : null);
    const finalDestinoLng =
      destinoLng ||
      (servicioWithRoutes.destinoCoords
        ? servicioWithRoutes.destinoCoords[1]
        : null);

    if (
      !finalOrigenLat ||
      !finalOrigenLng ||
      !finalDestinoLat ||
      !finalDestinoLng
    ) {
      console.warn(
        "Coordenadas incompletas para el servicio:",
        servicioWithRoutes,
      );

      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    // Crear marcador de origen (punto A)
    const origenCoords: [number, number] = [finalOrigenLng, finalOrigenLat];
    const markerOrigen = createMarker(
      origenCoords,
      "origen",
      createPopupHTML("origen"),
    );

    if (markerOrigen) {
      markersRef.current.origen = markerOrigen;
      bounds.extend(origenCoords);
    }

    // Crear marcador de destino (punto B)
    const destinoCoords: [number, number] = [finalDestinoLng, finalDestinoLat];
    const markerDestino = createMarker(
      destinoCoords,
      "destino",
      createPopupHTML("destino"),
    );

    if (markerDestino) {
      markersRef.current.destino = markerDestino;
      bounds.extend(destinoCoords);
    }

    // Función para crear la ruta (espera el tracking primero)
    const createRouteWithTracking = async () => {
      if (!map.current) return;

      let startCoords = origenCoords;
      let endCoords = destinoCoords;
      let routeColor = "#059669";

      // Si el servicio está en curso, PRIMERO obtener tracking del vehículo
      if (
        servicioWithRoutes.estado === "en_curso" &&
        servicioWithRoutes.vehiculo?.placa &&
        wialonSessionId
      ) {
        try {
          const trackingData = await fetchVehicleTracking(
            servicioWithRoutes.vehiculo.placa,
          );

          if (trackingData?.position) {
            // Si tenemos tracking exitoso, usar posición del vehículo
            const vehiclePosition: [number, number] = [
              trackingData.position.x,
              trackingData.position.y,
            ];

            // Crear marcador del vehículo
            const vehicleMarker = createVehicleMarker(
              vehiclePosition,
              trackingData,
            );

            if (vehicleMarker) {
              markersRef.current.vehicle = vehicleMarker;
              bounds.extend(vehiclePosition);
            }

            // Cambiar la ruta: desde la posición del vehículo al destino
            startCoords = vehiclePosition;
            routeColor = "#0077b6"; // Color naranja para ruta activa
          } else {
            console.warn(
              "No se pudo obtener tracking - usando ruta normal A->B",
            );
          }
        } catch (error) {
          console.error("Error en tracking - usando ruta normal A->B:", error);
        }
      }

      // Ahora crear la ruta con la información correcta
      try {
        // Agregar fuente con línea recta temporal
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [startCoords, endCoords],
            },
          },
        });

        // Agregar capa visual de la ruta
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": routeColor,
            "line-width": 5,
            "line-opacity": 0.8,
          },
        });

        // Obtener y actualizar con la ruta real
        const routeCoordinates = await fetchMapboxRoute(startCoords, endCoords);

        if (map.current && map.current.getSource("route")) {
          (map.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          });

          // Ajustar vista para incluir toda la ruta
          const routeBounds = new mapboxgl.LngLatBounds();

          routeCoordinates.forEach((coord) => {
            routeBounds.extend([coord[0], coord[1]]);
          });

          if (!routeBounds.isEmpty()) {
            map.current.fitBounds(routeBounds, {
              padding: 50,
              maxZoom: 14,
            });
          }
        }
      } catch (error) {
        console.error("Error creando ruta:", error);
      }
    };

    // Ejecutar creación de ruta con tracking
    createRouteWithTracking();

    // Ajustar vista inicial si no hay ruta
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });
    }
  }, [
    isMapLoaded,
    servicioWithRoutes?.id,
    servicioWithRoutes?.estado,
    wialonSessionId,
  ]);

  useEffect(() => {
    // Solo inicializar el mapa cuando el modal esté abierto
    if (
      !isOpen ||
      !MAPBOX_ACCESS_TOKEN ||
      !mapContainer.current ||
      map.current
    ) {
      return;
    }

    try {
      // Inicializar el mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-72.395, 5.3377], // Coordenadas de Yopal, Casanare
        zoom: 12,
      });

      // Agregar controles de navegación
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Manejar cuando el mapa termine de cargar
      map.current.on("load", () => {
        setIsMapLoaded(true);
      });

      // Manejar errores del mapa
      map.current.on("error", (e) => {
        console.error("Error en el mapa:", e);
        setMapError("Error al cargar el mapa");
      });
    } catch (error) {
      console.error("Error al inicializar Mapbox:", error);
      setMapError("Error al inicializar el mapa");
    }

    // Cleanup cuando el componente se desmonte o el modal se cierre
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [isOpen, MAPBOX_ACCESS_TOKEN]);

  // Limpiar el mapa cuando se cierre el modal
  useEffect(() => {
    if (!isOpen && map.current) {
      clearMapObjects();
      map.current.remove();
      map.current = null;
      setIsMapLoaded(false);
      setMapError("");
    }
  }, [isOpen]);

  const handleClose = () => {
    // Limpiar el mapa antes de cerrar
    if (map.current) {
      clearMapObjects();
      map.current.remove();
      map.current = null;
      setIsMapLoaded(false);
    }
    if (onClose) {
      onClose();
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  };

  return (
    <>
      <Modal
        hideCloseButton
        backdrop="blur"
        classNames={{
          wrapper: "max-w-[96rem] w-[calc(100%-3rem)] mx-auto", // 96rem es mayor que 5xl (64rem) pero no es "full"
          backdrop:
            "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
        }}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="5xl"
        onClose={handleClose}
      >
        <ModalContent className="w-full max-w-full">
          {() => (
            <>
              <ModalBody className="p-0 grid grid-cols-5">
                {/* Error del mapa */}
                {mapError && (
                  <div className="m-4 p-3 bg-red-100 text-red-800 text-sm rounded-md border border-red-200">
                    <span className="font-medium">Error:</span> {mapError}
                  </div>
                )}

                {/* Contenedor del mapa */}
                <div className="col-span-3 relative">
                  <div ref={mapContainer} className="h-full rounded-lg" />

                  {/* Indicador de carga */}
                  {!isMapLoaded && !mapError && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">
                          Cargando mapa...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Leyenda de marcadores */}
                  {isMapLoaded && servicioWithRoutes && (
                    <div className="absolute top-2 left-2 bg-white/90 p-2 rounded-lg text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          A
                        </div>
                        <span>Origen</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          B
                        </div>
                        <span>Destino</span>
                      </div>
                      {vehicleTracking && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#0077b6] rounded-full flex items-center justify-center text-white text-xs">
                            <img alt="" src="/assets/marker.png" />
                          </div>
                          <span>Vehículo</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Información del servicio mejorada */}
                {servicioWithRoutes && (
                  <div className="col-span-2 m-4 space-y-4 h-[70vh] overflow-y-scroll">
                    {/* Header con estado y fechas */}
                    <div className="p-2 ounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg">
                            Detalles del servicio
                          </h4>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              servicioWithRoutes.estado === "en_curso"
                                ? "bg-green-100 text-green-800"
                                : servicioWithRoutes.estado === "planificado"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : servicioWithRoutes.estado === "realizado"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {servicioWithRoutes.estado?.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fechas importantes */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h5 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7v13a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v11a2 2 0 002 2h2m8-14h2a2 2 0 012 2v11a2 2 0 01-2 2h-2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        Cronograma
                      </h5>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <span>Fecha solicitud:&nbsp;</span>
                          <span className="font-medium text-black">
                            {formatearFecha(servicioWithRoutes.fecha_solicitud)}
                          </span>
                        </div>
                        {servicioWithRoutes.fecha_realizacion && (
                          <div className="text-sm text-gray-600">
                            <span>Fecha realización:&nbsp;</span>
                            <span className="font-medium text-black">
                              {formatearFecha(
                                servicioWithRoutes.fecha_realizacion,
                              )}
                            </span>
                          </div>
                        )}
                        {servicioWithRoutes.fecha_finalizacion && (
                          <div className="text-sm text-gray-600">
                            <span>Fecha finalización:&nbsp;</span>
                            <span className="font-medium text-black">
                              {formatearFecha(
                                servicioWithRoutes.fecha_finalizacion,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ruta e información del servicio */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        Ruta y Servicio
                      </h5>
                      <div className="space-y-1">
                        {/* Ruta principal */}
                        <div className="flex flex-col gap-1">
                          {servicioWithRoutes.origen?.nombre_municipio &&
                            servicioWithRoutes.destino?.nombre_municipio && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-black">
                                  {servicioWithRoutes.origen.nombre_municipio}
                                </span>
                                <span>&nbsp;→&nbsp;</span>
                                <span className="font-medium text-black">
                                  {servicioWithRoutes.destino.nombre_municipio}
                                </span>
                              </p>
                            )}
                          {servicioWithRoutes.origen_especifico &&
                            servicioWithRoutes.destino_especifico && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-black">
                                  {servicioWithRoutes.origen_especifico}
                                </span>
                                <span>&nbsp;→&nbsp;</span>
                                <span className="font-medium text-black">
                                  {servicioWithRoutes.destino_especifico}
                                </span>
                              </p>
                            )}
                        </div>

                        {/* Información del servicio */}
                        {servicioWithRoutes.proposito_servicio && (
                          <div className="text-sm text-gray-600">
                            <span>Propósito:&nbsp;</span>
                            <span className="font-medium text-black">
                              {servicioWithRoutes.proposito_servicio}
                            </span>
                          </div>
                        )}

                        <div className="text-sm text-gray-600">
                          <span>Distancia:&nbsp;</span>
                          <span className="font-medium text-black">
                            {distancia} km
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Duración:&nbsp;</span>
                          <span className="font-medium text-black">
                            {formatDuration(duracion)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recursos asignados */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h5 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        Recursos Asignados
                      </h5>
                      <div className="space-y-1">
                        {/* Conductor */}
                        {servicioWithRoutes.conductor && (
                          <div className="text-sm text-gray-600">
                            <span>Conductor:&nbsp;</span>
                            <span className="font-medium text-black">
                              {servicioWithRoutes.conductor.nombre}{" "}
                              {servicioWithRoutes.conductor.apellido}
                            </span>
                            {servicioWithRoutes.conductor.telefono && (
                              <span className="text-gray-500">
                                {" "}
                                - {servicioWithRoutes.conductor.telefono}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Vehículo */}
                        {servicioWithRoutes.vehiculo && (
                          <div className="text-sm text-gray-600">
                            <span>Vehículo:&nbsp;</span>
                            <span className="font-medium text-black">
                              {servicioWithRoutes.vehiculo.placa}
                            </span>
                            {servicioWithRoutes.vehiculo.marca &&
                              servicioWithRoutes.vehiculo.modelo && (
                                <span className="text-gray-500">
                                  {" "}
                                  - {servicioWithRoutes.vehiculo.marca}{" "}
                                  {servicioWithRoutes.vehiculo.modelo}
                                </span>
                              )}
                          </div>
                        )}

                        {/* Cliente */}
                        {servicioWithRoutes.cliente && (
                          <div className="text-sm text-gray-600">
                            <span>Cliente:&nbsp;</span>
                            <span className="font-medium text-black">
                              {servicioWithRoutes.cliente.nombre}
                            </span>
                            {servicioWithRoutes.cliente.nit && (
                              <span className="text-gray-500">
                                {" "}
                                ({servicioWithRoutes.cliente.nit})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coordenadas técnicas */}
                    {(servicioWithRoutes.origen_latitud ||
                      servicioWithRoutes.destino_latitud) && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                            <path
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          Coordenadas
                        </h5>
                        <div className="space-y-1">
                          {servicioWithRoutes.origen_latitud &&
                            servicioWithRoutes.origen_longitud && (
                              <div className="text-sm text-gray-600">
                                <span>Origen:&nbsp;</span>
                                <span className="font-medium text-black">
                                  {servicioWithRoutes.origen_latitud.toFixed(6)}
                                  ,{" "}
                                  {servicioWithRoutes.origen_longitud.toFixed(
                                    6,
                                  )}
                                </span>
                              </div>
                            )}
                          {servicioWithRoutes.destino_latitud &&
                            servicioWithRoutes.destino_longitud && (
                              <div className="text-sm text-gray-600">
                                <span>Destino:&nbsp;</span>
                                <span className="font-medium text-black">
                                  {servicioWithRoutes.destino_latitud.toFixed(
                                    6,
                                  )}
                                  ,{" "}
                                  {servicioWithRoutes.destino_longitud.toFixed(
                                    6,
                                  )}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Observaciones */}
                    {servicioWithRoutes.observaciones && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          Observaciones
                        </h5>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {servicioWithRoutes.observaciones}
                        </p>
                      </div>
                    )}

                    {/* Tracking del vehículo (solo si está en curso) */}
                    {servicioWithRoutes.estado === "en_curso" && (
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                        <h5 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          Tracking en Tiempo Real
                        </h5>
                        {vehicleTracking ? (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              <span>Estado:&nbsp;</span>
                              <span className="font-medium text-black">
                                {vehicleTracking.name}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>Velocidad:&nbsp;</span>
                              <span className="font-medium text-black">
                                {vehicleTracking.position?.s || 0} km/h
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>Posición actual:&nbsp;</span>
                              <span className="font-medium text-black">
                                {vehicleTracking.position?.x?.toFixed(6)},{" "}
                                {vehicleTracking.position?.y?.toFixed(6)}
                              </span>
                            </div>
                            <div className="text-xs text-orange-700 mt-2 pt-2 border-t border-orange-200">
                              Última actualización:{" "}
                              {new Date(
                                vehicleTracking.lastUpdate,
                              ).toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-yellow-800">
                            {trackingError ||
                              "Obteniendo posición del vehículo..."}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Información de auditoría */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        Auditoría
                      </h5>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <span>Creado:&nbsp;</span>
                          <span className="font-medium text-black">
                            {new Date(
                              servicioWithRoutes.created_at ||
                                servicioWithRoutes.createdAt,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Última actualización:&nbsp;</span>
                          <span className="font-medium text-black">
                            {new Date(
                              servicioWithRoutes.updated_at ||
                                servicioWithRoutes.updatedAt,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
