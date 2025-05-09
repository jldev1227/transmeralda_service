"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { ClipboardList, PlusIcon, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

import LoadingComponent from "./ui/LoadingComponent";

import {
  ServicioConRelaciones,
  useService,
  VehicleTracking,
} from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";
import { getStatusText } from "@/utils/indext";

interface EnhancedMapComponentProps {
  servicios: ServicioConRelaciones[];
  selectedServicio: ServicioConRelaciones | null;
  vehicleTracking: VehicleTracking | null;
  trackingError: string;
  isPanelOpen: boolean;
  handleClosePanel: () => void;
  handleSelectServicio: (servicio: ServicioConRelaciones) => void;
  getServiceTypeText: (text: string) => string;
  mapboxToken: string;
  onWialonRequest: (
    sessionId: string,
    endpoint: string,
    params: any,
  ) => Promise<any>;
  wialonToken: string;
  setServicioWithRoutes: Dispatch<SetStateAction<ServicioConRelaciones | null>>;
}

interface VehicleMarkerData {
  vehicle: Vehicle;
  service: ServicioConRelaciones;
  marker?: mapboxgl.Marker;
}

interface MarkersRef {
  origen?: mapboxgl.Marker;
  destino?: mapboxgl.Marker;
  vehicle?: mapboxgl.Marker;
  activeVehicles: Map<string, mapboxgl.Marker>;
}

// Interfaces para el objeto vehicle
interface Position {
  t: number;
  f: number;
  lc: number;
  y: number;
  x: number;
  // Puede tener más propiedades
}

interface LastMessage {
  t: number;
  f: number;
  tp: string;
  pos: Position;
  i: number;
  // Puede tener más propiedades
}

interface Vehicle {
  cls: number;
  id: number;
  lmsg: LastMessage;
  mu: number;
  nm: string;
  pos: Position;
  uacl: number;
}

const EnhancedMapComponent = ({
  servicios,
  selectedServicio,
  vehicleTracking,
  trackingError,
  isPanelOpen,
  handleClosePanel,
  handleSelectServicio,
  getServiceTypeText,
  mapboxToken,
  onWialonRequest,
  wialonToken,
  setServicioWithRoutes,
}: EnhancedMapComponentProps) => {
  const { handleModalForm } = useService();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersRef>({
    activeVehicles: new Map(),
  });

  const router = useRouter();

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>("");
  const [activeVehiclesData, setActiveVehiclesData] = useState<
    VehicleMarkerData[]
  >([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [detallesVisible, setDetallesVisible] = useState(false);
  const [wialonSessionId, setWialonSessionId] = useState<string | null>(null);

  const statusColors = {
    solicitado: "#6a7282",
    realizado: "#155dfc",
    en_curso: "#00bc7d",
    planilla_asignada: "#ad46ff",
    planificado: "#FF9800",
    cancelado: "#F44336",
    default: "#3388ff",
  };

  const color = useMemo(() => {
    if (!selectedServicio) return statusColors.default;
    console.log(selectedServicio);

    return (
      statusColors[selectedServicio.estado as keyof typeof statusColors] ||
      statusColors.default
    );
  }, [selectedServicio]);

  useEffect(() => {
    const initWialon = async () => {
      if (!wialonToken) return;

      try {
        const loginData = await onWialonRequest(wialonToken, "token/login", {});

        if (loginData?.eid) {
          setWialonSessionId(loginData.eid);
        }
      } catch (error) {
        console.error("Error al iniciar sesión en Wialon:", error);
      }
    };

    initWialon();
  }, [wialonToken, onWialonRequest]);

  useEffect(() => {
    if (selectedServicio || !wialonSessionId) return;

    const fetchActiveVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        const vehiclesData = await onWialonRequest(
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
            flags: 1025,
            from: 0,
            to: 1000,
          },
        );

        if (!vehiclesData?.items) return;

        const serviciosEnCurso = servicios.filter(
          (s) => s.estado === "en_curso",
        );
        const vehicleMarkers: VehicleMarkerData[] = [];

        for (const servicio of serviciosEnCurso) {
          // Skip services without vehicle information
          if (!servicio.vehiculo || !servicio.vehiculo.placa) continue;

          const vehicleData = vehiclesData.items.find(
            (v: { nm: string }) =>
              v.nm.includes(servicio.vehiculo.placa) ||
              v.nm.toLowerCase() === servicio.vehiculo.placa.toLowerCase(),
          );

          if (vehicleData?.pos) {
            vehicleMarkers.push({
              vehicle: vehicleData,
              service: servicio,
            });
          }
        }

        setActiveVehiclesData(vehicleMarkers);
      } catch (error) {
        console.error("Error al obtener vehículos activos:", error);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchActiveVehicles();
    const interval = setInterval(fetchActiveVehicles, 30000);

    return () => clearInterval(interval);
  }, [selectedServicio, servicios, wialonSessionId, onWialonRequest]);

  useEffect(() => {
    if (!mapboxToken) {
      setMapError("Token de Mapbox no configurado");

      return;
    }

    mapboxgl.accessToken = mapboxToken;
  }, [mapboxToken]);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-72.395, 5.3377], // Yopal
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setIsMapLoaded(true);
      });
    } catch (error) {
      console.error("Error al inicializar Mapbox:", error);
      setMapError("Error al inicializar el mapa");
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  const createPulsingVehicleMarker = (
    vehicleData: any,
    service: ServicioConRelaciones,
  ) => {
    if (!map.current) return null;

    const el = document.createElement("div");

    el.className = "pulsing-vehicle-marker";

    const center = document.createElement("div");

    center.className = "marker-center";
    el.appendChild(center);

    const pulse1 = document.createElement("div");

    pulse1.className = "pulse pulse-1";
    el.appendChild(pulse1);

    const pulse2 = document.createElement("div");

    pulse2.className = "pulse pulse-2";
    el.appendChild(pulse2);

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
      closeButton: true,
    }).setHTML(`
      <div class="vehicle-popup">
        <h3 class="font-bold">${vehicleData.nm}</h3>
        <div class="text-sm mt-1">
          <div>Servicio: ${service.id?.substring(0, 8)}...</div>
          <div>Origen: ${service.origen_especifico}</div>
          <div>Destino: ${service.destino_especifico}</div>
          <div>Velocidad: ${vehicleData.pos.s || 0} km/h</div>
        </div>
      </div>
    `);

    const marker = new mapboxgl.Marker(el)
      .setLngLat([vehicleData.pos.x, vehicleData.pos.y])
      .setPopup(popup)
      .addTo(map.current);

    // Split click behavior: toggle popup on marker click, select service on double click
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      marker.togglePopup();
    });

    el.addEventListener("dblclick", () => {
      handleSelectServicio(service);
    });

    return marker;
  };

  // Track previous selectedServicio state to detect when it changes from non-null to null
  const prevSelectedServicioRef = useRef<ServicioConRelaciones | null>(null);

  // Track the number of times we've created markers to avoid duplicates
  const markersCreatedRef = useRef<boolean>(false);

  // Dedicated effect to create vehicle markers when data is ready
  useEffect(() => {
    if (
      !isMapLoaded ||
      !map.current ||
      selectedServicio ||
      activeVehiclesData.length === 0
    )
      return;

    // Always clear markers before creating new ones
    markersRef.current.activeVehicles.forEach((marker) => marker.remove());
    markersRef.current.activeVehicles.clear();

    // Create markers for all active vehicles
    activeVehiclesData.forEach((data: VehicleMarkerData) => {
      const marker = createPulsingVehicleMarker(data.vehicle, data.service);

      if (marker) {
        markersRef.current.activeVehicles.set(
          data.vehicle.id.toString(),
          marker,
        );
      }
    });

    markersCreatedRef.current = true;

    // Fit map to show all active vehicles
    if (map.current) {
      const bounds = new mapboxgl.LngLatBounds();

      activeVehiclesData.forEach((data) => {
        bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
      });

      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 14,
        });
      }
    }
  }, [
    isMapLoaded,
    activeVehiclesData,
    selectedServicio,
    createPulsingVehicleMarker,
  ]);

  const createPopupHTML = (type: "origen" | "destino") => {
    if (!selectedServicio) return "";

    const isOrigin = type === "origen";
    const statusClass = selectedServicio.estado.toLowerCase().replace(" ", "-");

    return `
      <div class="marker-popup">
        <div class="popup-header popup-${statusClass}">
          ${isOrigin ? "Origen" : "Destino"} - ${getStatusText(selectedServicio.estado || "")}
        </div>
        <div class="popup-content">
          <div class="font-medium">
            ${isOrigin ? selectedServicio.origen_especifico || "" : selectedServicio.destino_especifico || ""}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            ID: ${selectedServicio.id}
          </div>

          <div class="popup-divider"></div>

          ${isOrigin
        ? `<div class="text-sm">
              <div>
                <div class="font-medium">Tipo de servicio:</div>
                <div class="text-sm text-gray-500 mt-1">${getServiceTypeText(selectedServicio.proposito_servicio || "")}</div>
              </div>
            </div>`
        : `<div class="text-sm">
              <div>
                <div class="font-medium">Distancia</div>
                <div>${selectedServicio.routeDistance} km</div>
              </div>
            </div>`
      }
        </div>
      </div>
    `;
  };

  const createMarker = (
    lngLat: [number, number],
    type: "origen" | "destino",
    popupContent: string,
  ) => {
    if (!map.current || !selectedServicio) return null;

    const el = document.createElement("div");

    el.className = `custom-marker marker-${type}`;
    el.style.backgroundColor = color;
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.borderRadius = "50%";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.color = "white";
    el.style.fontWeight = "bold";
    el.innerText = type === "origen" ? "A" : "B";

    // Create popup with closeOnClick: false to prevent it from closing automatically
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
      closeButton: true,
    }).setHTML(popupContent);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);

    // Add click event to show popup and prevent it from disappearing immediately
    el.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event from bubbling
      marker.togglePopup(); // Show/hide the popup instead of triggering the service click
    });

    return marker;
  };

  const createVehicleMarker = (lngLat: [number, number]) => {
    if (!map.current || !vehicleTracking) return null;

    const el = document.createElement("div");

    el.className = "vehicle-marker";
    el.style.width = "38px";
    el.style.height = "38px";
    el.style.backgroundImage = "url('/assets/marker.png')";
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid #ffffff";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

    const popupContent = `
      <div class="vehicle-popup">
        <h3 class="font-bold">${vehicleTracking.name}</h3>
        <div class="mt-1">
          <div>Velocidad: ${vehicleTracking.position.s || 0} km/h</div>
          <div>Dirección: ${vehicleTracking.position.c || 0}°</div>
          <div class="text-xs mt-1">
            Actualizado: ${vehicleTracking.lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
      closeButton: true,
    }).setHTML(popupContent);

    // Crear marcador y añadirlo al mapa
    return new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);
  };

  const clearMapObjects = () => {
    if (!map.current) return;

    // Asegurarnos de limpiar todos los marcadores completamente
    try {
      // Limpiar marcador de origen si existe
      if (markersRef.current.origen) {
        markersRef.current.origen.remove();
        markersRef.current.origen = undefined;
      }

      // Limpiar marcador de destino si existe
      if (markersRef.current.destino) {
        markersRef.current.destino.remove();
        markersRef.current.destino = undefined;
      }

      // Específicamente, SIEMPRE limpiar el marcador de vehículo principal si existe
      if (markersRef.current.vehicle) {
        try {
          markersRef.current.vehicle.remove();
        } catch (err) {
          console.log("Error al remover marcador de vehículo:", err);
        }
        markersRef.current.vehicle = undefined;
      }

      // Limpiar marcadores de vehículos activos
      markersRef.current.activeVehicles.forEach((marker) => {
        try {
          marker.remove();
        } catch (err) {
          console.error("Error removing active vehicle marker:", err);
        }
      });
      markersRef.current.activeVehicles.clear();
    } catch (err) {
      console.error("Error clearing markers:", err);
    }

    // Limpiar fuentes y capas del mapa de manera segura
    const sourcesToRemove = ["route", "active-route", "original-route"];

    sourcesToRemove.forEach((source) => {
      try {
        if (map.current?.getLayer(source)) {
          map.current.removeLayer(source);
        }
        if (map.current?.getSource(source)) {
          map.current.removeSource(source);
        }
      } catch (err) {
        console.error(`Error removing ${source}:`, err);
      }
    });

    // Cerrar cualquier popup abierto
    try {
      document.querySelectorAll(".mapboxgl-popup").forEach((popup) => {
        popup.remove();
      });
    } catch (err) {
      console.error("Error removing popups:", err);
    }
  };

  // Function to fetch route from Mapbox API
  const fetchMapboxRoute = async (
    origin: [number, number],
    destination: [number, number],
  ): Promise<number[][]> => {
    if (!mapboxToken) return [origin, destination]; // Fallback to straight line

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${mapboxToken}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error("Mapbox API error");

      const data = await response.json();

      if (!data.routes || data.routes.length === 0)
        throw new Error("No route found");

      return data.routes[0].geometry.coordinates;
    } catch (error) {
      console.error("Error fetching route:", error);

      return [origin, destination]; // Fallback to straight line
    }
  };

  // Verificar cambios en el servicio seleccionado para forzar re-renderizado
  useEffect(() => {
    // Validación inicial
    if (!isMapLoaded || !map.current || !selectedServicio) return;

    // Siempre limpiar completamente todos los objetos del mapa
    clearMapObjects();

    // Crear bounds para ajustar la vista del mapa
    const bounds = new mapboxgl.LngLatBounds();

    // Función para añadir coordenadas a los bounds de manera segura
    const extendBounds = (lng: number, lat: number) => {
      if (isFinite(lng) && isFinite(lat)) {
        bounds.extend([lng, lat]);
      }
    };

    // Función para crear y mostrar una ruta en el mapa
    const createRoute = async (
      sourceId: string,
      originCoords: [number, number],
      destCoords: [number, number],
      routeColor: string = color,
    ) => {
      if (!map.current) return;

      try {
        // Agregar source con línea recta temporal
        map.current.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [originCoords, destCoords],
            },
          },
        });

        // Agregar capa para visualizar la ruta
        map.current.addLayer({
          id: sourceId,
          type: "line",
          source: sourceId,
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

        // Obtener la ruta real desde Mapbox y actualizar
        const routeCoordinates = await fetchMapboxRoute(
          originCoords,
          destCoords,
        );

        // Actualizar la fuente con las coordenadas reales de la ruta
        if (map.current.getSource(sourceId)) {
          (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          });

          // Actualizar bounds con todos los puntos de la ruta
          routeCoordinates.forEach((coord) => extendBounds(coord[0], coord[1]));

          // Ajustar la vista del mapa
          fitMapToBounds();
        }
      } catch (error) {
        console.error(`Error al crear/actualizar ruta ${sourceId}:`, error);
      }
    };

    // Función para ajustar la vista del mapa a los límites actuales
    const fitMapToBounds = () => {
      if (!map.current || bounds.isEmpty()) return;

      map.current.fitBounds(bounds, {
        padding: 70,
        maxZoom: 14,
      });
    };

    // 1. Crear marcador de origen (punto A)
    if (selectedServicio.origen_latitud && selectedServicio.origen_longitud) {
      const lngLat: [number, number] = [
        selectedServicio.origen_longitud,
        selectedServicio.origen_latitud,
      ];

      if (!markersRef) return;

      const marker = createMarker(lngLat, "origen", createPopupHTML("origen"));

      // Verificar si el marcador no es null antes de asignarlo
      if (marker !== null) {
        markersRef.current.origen = marker;
      }

      extendBounds(lngLat[0], lngLat[1]);
    }

    // 2. Crear marcador de destino (punto B)
    if (selectedServicio.destino_latitud && selectedServicio.destino_longitud) {
      const lngLat: [number, number] = [
        selectedServicio.destino_longitud,
        selectedServicio.destino_latitud,
      ];

      if (!markersRef) return;

      const marker = createMarker(
        lngLat,
        "destino",
        createPopupHTML("destino"),
      );

      // Verificar si el marcador no es null antes de asignarlo
      if (marker !== null) {
        markersRef.current.destino = marker;
      }

      extendBounds(lngLat[0], lngLat[1]);
    }

    // 3. Mostrar ruta según el estado del servicio
    if (selectedServicio.estado === "en_curso" && vehicleTracking?.position) {
      // Para servicios 'en_curso' con vehículo activo, mostrar ruta desde vehículo al destino
      if (
        selectedServicio.destino_latitud &&
        selectedServicio.destino_longitud
      ) {
        const vehiclePosition: [number, number] = [
          vehicleTracking.position.x,
          vehicleTracking.position.y,
        ];
        const destinationPosition: [number, number] = [
          selectedServicio.destino_longitud,
          selectedServicio.destino_latitud,
        ];

        // Añadir posición del vehículo a los límites
        extendBounds(vehiclePosition[0], vehiclePosition[1]);

        // Crear ruta desde vehículo hasta destino
        createRoute(
          "active-route",
          vehiclePosition,
          destinationPosition,
          "#00bc7d",
        );
      }
    } else if (
      selectedServicio.origen_latitud &&
      selectedServicio.origen_longitud &&
      selectedServicio.destino_latitud &&
      selectedServicio.destino_longitud
    ) {
      // Para otros estados, mostrar la ruta planeada completa
      const originPosition: [number, number] = [
        selectedServicio.origen_longitud,
        selectedServicio.origen_latitud,
      ];
      const destinationPosition: [number, number] = [
        selectedServicio.destino_longitud,
        selectedServicio.destino_latitud,
      ];

      // Crear ruta desde origen hasta destino
      createRoute("route", originPosition, destinationPosition);
    }

    // 4. Ajustar mapa inicialmente (se volverá a ajustar cuando las rutas se actualicen)
    fitMapToBounds();

    // 5. Mostrar panel de detalles
    setDetallesVisible(true);
    // Se eliminó selectedServicioKey y se pasa el objeto completo para detectar cualquier cambio
  }, [selectedServicio, isMapLoaded, color, vehicleTracking, mapboxToken]);
  // Efecto para actualizar la posición del vehículo
  useEffect(() => {
    if (
      !isMapLoaded ||
      !map.current ||
      selectedServicio?.estado !== "en_curso" ||
      !vehicleTracking ||
      !vehicleTracking.position
    ) {
      return;
    }

    // Limpiar marcador de vehículo existente
    if (markersRef.current.vehicle) {
      markersRef.current.vehicle.remove();
      markersRef.current.vehicle = undefined;
    }

    // Crear nuevo marcador de vehículo con la posición actual
    const vehiclePosition: [number, number] = [
      vehicleTracking.position.x,
      vehicleTracking.position.y,
    ];

    if (!markersRef) return;

    const marker = createVehicleMarker(vehiclePosition);

    if (marker !== null) {
      markersRef.current.vehicle = marker;
    }

    // Actualizar la ruta activa si existe
    if (
      map.current.getSource("active-route") &&
      selectedServicio.destino_latitud &&
      selectedServicio.destino_longitud
    ) {
      const destinationPosition: [number, number] = [
        selectedServicio.destino_longitud,
        selectedServicio.destino_latitud,
      ];

      // Actualizar con una línea recta (retroalimentación visual inmediata)
      try {
        (
          map.current.getSource("active-route") as mapboxgl.GeoJSONSource
        ).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [vehiclePosition, destinationPosition],
          },
        });
      } catch (error) {
        console.error("Error updating straight line route:", error);
      }

      // Luego obtener y actualizar con la ruta real
      (async () => {
        if (!map.current) return;

        try {
          const routeCoordinates = await fetchMapboxRoute(
            vehiclePosition,
            destinationPosition,
          );

          // Verificar nuevamente si el mapa existe y la capa de ruta todavía está presente
          if (map.current && map.current.getSource("active-route")) {
            try {
              (
                map.current.getSource("active-route") as mapboxgl.GeoJSONSource
              ).setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates,
                },
              });
            } catch (error) {
              console.error("Error updating route coordinates:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      })();
    }
  }, [
    vehicleTracking,
    selectedServicio,
    isMapLoaded,
    createVehicleMarker,
    fetchMapboxRoute,
  ]);

  // Limpiar el mapa cuando modalForm cambia o cuando no hay servicio seleccionado
  const { modalForm } = useService();

  useEffect(() => {
    // Limpiar mapa cuando se abre el modal o cuando no hay servicio seleccionado
    if ((modalForm || !selectedServicio) && map.current) {
      // Limpiar completamente todos los elementos del mapa
      clearMapObjects();
      setDetallesVisible(false);

      // Si no hay modal abierto y no hay servicio seleccionado, mostrar solo los marcadores pulsantes de vehículos en_curso
      if (!modalForm && !selectedServicio && activeVehiclesData.length > 0) {
        // Recrear SOLO los marcadores de vehículos activos con servicios en estado "en_curso"
        activeVehiclesData.forEach((data: VehicleMarkerData) => {
          // Verificar que el servicio esté en_curso antes de crear el marcador
          if (data.service.estado === "en_curso") {
            const marker = createPulsingVehicleMarker(
              data.vehicle,
              data.service,
            );

            if (marker) {
              markersRef.current.activeVehicles.set(
                data.vehicle.id.toString(),
                marker,
              );
            }
          }
        });

        // Ajustar el mapa para mostrar todos los vehículos activos
        if (map.current && activeVehiclesData.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();

          activeVehiclesData.forEach((data) => {
            // Solo incluir en los bounds los vehículos con servicios en_curso
            if (data.service.estado === "en_curso") {
              bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
            }
          });

          if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, {
              padding: 100,
              maxZoom: 14,
            });
          }
        }
      }
    }
  }, [modalForm, selectedServicio, activeVehiclesData]);

  const formatTime = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);

    return d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (estado: string) => {
    return (
      statusColors[estado as keyof typeof statusColors] || statusColors.default
    );
  };

  const clearServicio = () => {
    // Clear selected servicio reference completely
    setServicioWithRoutes(null);
    prevSelectedServicioRef.current = null;

    setDetallesVisible(false);
    clearMapObjects();

    // Reset marker creation flag to allow fresh creation
    markersCreatedRef.current = false;

    // Force re-render of active vehicles after clearing service - show only pulsing markers for active services
    if (activeVehiclesData.length > 0 && map.current) {
      setTimeout(() => {
        if (!map.current) return;

        // First make sure all existing markers are removed (including vehicle marker)
        markersRef.current.activeVehicles.forEach((marker) => marker.remove());
        markersRef.current.activeVehicles.clear();

        // Also specifically clear vehicle marker if it exists
        if (markersRef.current.vehicle) {
          markersRef.current.vehicle.remove();
          markersRef.current.vehicle = undefined;
        }

        // Create markers ONLY for active vehicles with services "en_curso"
        activeVehiclesData.forEach((data: VehicleMarkerData) => {
          // Solo crear marcador si el servicio está en_curso
          if (data.service.estado === "en_curso") {
            const marker = createPulsingVehicleMarker(
              data.vehicle,
              data.service,
            );

            if (marker) {
              markersRef.current.activeVehicles.set(
                data.vehicle.id.toString(),
                marker,
              );
            }
          }
        });

        // Mark that we've created markers
        markersCreatedRef.current = true;

        // Fit map to show all active vehicles
        if (activeVehiclesData.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();

          activeVehiclesData.forEach((data) => {
            if (data.service.estado === "en_curso") {
              bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
            }
          });

          if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, {
              padding: 100,
              maxZoom: 14,
            });
          }
        }
      }, 100); // Short delay to ensure state is updated
    }
  };

  const handleButtonPressForm = () => {
    // Primero limpiar el mapa completamente
    clearMapObjects();
    setDetallesVisible(false);

    // Pequeño retraso para asegurar que la limpieza se complete antes de abrir el modal
    setTimeout(() => {
      // Abrir el modal de agregar servicio
      handleModalForm();
    }, 50);
  };

  const handleButtonPressLiquidar = () => {
    // Primero limpiar el mapa completamente
    clearMapObjects();
    setDetallesVisible(false);

    // Pequeño retraso para asegurar que la limpieza se complete antes de abrir el modal
    setTimeout(() => {
      // Abrir el modal de agregar servicio
      router.push("/liquidaciones");
    }, 50);
  };

  return (
    <div className="h-full w-full relative">
      {mapError && (
        <div className="absolute top-2 left-2 right-2 z-[1000] bg-red-100 text-red-800 text-sm p-2 rounded-md shadow">
          <span className="font-medium">Error:</span> {mapError}
        </div>
      )}

      <div ref={mapContainer} className="h-full w-full relative">
        {!isMapLoaded && <LoadingComponent>Cargando mapa</LoadingComponent>}
      </div>

      {selectedServicio && detallesVisible && (
        <div className="animate-fade-up absolute top-2.5 right-14 bg-white p-4 rounded-lg shadow-lg w-86">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={clearServicio}
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Estado</span>
              <div
                className="inline-block ml-2 px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${getStatusColor(selectedServicio.estado)}20`,
                  color: getStatusColor(selectedServicio.estado),
                }}
              >
                {getStatusText(selectedServicio.estado)}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Origen</span>
              <div className="font-medium">
                {selectedServicio.origen_especifico}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Destino</span>
              <div className="font-medium">
                {selectedServicio.destino_especifico}
              </div>
            </div>

            {selectedServicio.cliente && (
              <div>
                <span className="text-sm text-gray-500">Cliente</span>
                <div className="font-medium">
                  {selectedServicio.cliente.Nombre}
                </div>
              </div>
            )}

            {selectedServicio.vehiculo && (
              <div>
                <span className="text-sm text-gray-500">Vehiculo</span>
                <div className="font-medium">
                  {selectedServicio.vehiculo.placa}{" "}
                  {selectedServicio.vehiculo.linea}{" "}
                  {selectedServicio.vehiculo.modelo}
                </div>
              </div>
            )}

            {selectedServicio.conductor && (
              <>
                <div>
                  <span className="text-sm text-gray-500">Conductor</span>
                  <div className="font-medium">
                    {selectedServicio.conductor.nombre}{" "}
                    {selectedServicio.conductor.apellido}{" "}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Identificación</span>
                  <div className="font-medium">
                    {selectedServicio.conductor.tipo_identificacion}{" "}
                    {selectedServicio.conductor.numero_identificacion}
                  </div>
                </div>
              </>
            )}

            <div>
              <span className="text-sm text-gray-500">
                Fecha y Hora de Solicitud
              </span>
              <div className="font-medium">
                {formatearFecha(selectedServicio.fecha_solicitud)}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">
                Fecha y Hora de Realización
              </span>
              <div className="font-medium">
                {formatearFecha(selectedServicio.fecha_realizacion)}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Distancia</span>
              <div className="font-medium">
                {selectedServicio.routeDistance} km
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Observaciones</span>
              <div className="font-medium">
                {selectedServicio.observaciones || 'No hay observaciones'}
              </div>
            </div>

            {selectedServicio.estado === "en_curso" && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">Tracking del Vehículo</h4>
                {vehicleTracking ? (
                  <div className="space-y-1">
                    <div>
                      <span className="text-sm text-gray-500">Vehículo:</span>{" "}
                      {vehicleTracking.name}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Velocidad:</span>{" "}
                      {vehicleTracking.position.s || 0} km/h
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Dirección:</span>{" "}
                      {vehicleTracking.position.c || 0}°
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ubicación:</span>{" "}
                      {vehicleTracking.position.x.toFixed(6)},{" "}
                      {vehicleTracking.position.y.toFixed(6)}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Última actualización:
                      </span>{" "}
                      {formatTime(vehicleTracking.lastUpdate)}
                    </div>
                  </div>
                ) : (
                  <div className="text-amber-600 text-sm">
                    {trackingError || "Buscando información del vehículo..."}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute top-3.5 left-4 z-10 bg-white bg-opacity-90 p-2 rounded-md shadow">
        <span className="text-sm font-medium">
          Vehiculos con servicios en curso (Wialon): {activeVehiclesData.length}
        </span>
      </div>

      {!isPanelOpen && (
        <div className="absolute bottom-10 left-4 animate-fadeIn">
          <Tooltip content="Abrir panel de servicios" radius="sm">
            <Button
              isIconOnly
              className="text-sm font-medium bg-white h-12 w-12"
              radius="sm"
              onPress={handleClosePanel}
            >
              <Truck color="#00bc7d" />
            </Button>
          </Tooltip>
        </div>
      )}

      <div className="absolute bottom-10 right-5 space-y-2 flex flex-col">
        <Tooltip content="Liquidador de servicios" radius="sm">
          <Button
            isIconOnly
            className="text-sm font-medium bg-white h-12 w-12"
            radius="sm"
            onPress={handleButtonPressLiquidar}
          >
            <ClipboardList color="#00bc7d" />
          </Button>
        </Tooltip>
        <Tooltip content="Agregar servicio" radius="sm">
          <Button
            isIconOnly
            className="text-sm font-medium bg-white h-12 w-12"
            radius="sm"
            onPress={handleButtonPressForm}
          >
            <PlusIcon color="#00bc7d" />
          </Button>
        </Tooltip>
      </div>

      {selectedServicio?.estado === "en_curso" &&
        trackingError &&
        !vehicleTracking && (
          <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
            <span className="font-medium">Información:</span> {trackingError}
          </div>
        )}

      <style global jsx>{`
        .marker-popup .popup-header {
          padding: 8px;
          color: white;
          font-weight: bold;
          border-radius: 4px 4px 0 0;
        }

        .marker-popup .popup-content {
          padding: 8px;
        }

        .marker-popup .popup-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 8px 0;
        }

        .popup-realizado {
          background-color: #155dfc;
        }
        .popup-en-curso {
          background-color: #00d492;
        }
        .popup-planificado {
          background-color: #ff9800;
        }
        .popup-cancelado {
          background-color: #f44336;
        }

        .vehicle-popup {
          padding: 8px;
        }

        .mapboxgl-popup-content {
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .pulsing-vehicle-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }

        .marker-center {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #00bc7d;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        .pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #00bc7d;
          animation: pulse-animation 2s infinite ease-out;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pulse-1 {
          animation-delay: 0s;
        }

        .pulse-2 {
          animation-delay: 1s;
        }

        @keyframes pulse-animation {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedMapComponent;
