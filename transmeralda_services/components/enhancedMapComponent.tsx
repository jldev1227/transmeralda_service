"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import mapboxgl from "mapbox-gl";

import { Servicio, ServicioConRelaciones, VehicleTracking } from "@/context/serviceContext";
import "mapbox-gl/dist/mapbox-gl.css";

interface EnhancedMapComponentProps {
  servicios: Servicio[];
  selectedServicio: Servicio | null;
  vehicleTracking: VehicleTracking | null;
  trackingError: string;
  handleServicioClick: (servicio: ServicioConRelaciones) => void;
  getStatusText: (status: string) => string;
  getServiceTypeText: (text: string) => string;
  mapboxToken: string;
  onWialonRequest: (sessionId: string, endpoint: string, params: any) => Promise<any>;
  wialonToken: string;
  setSelectedServicio: Dispatch<SetStateAction<Servicio | null>>;
}

interface VehicleMarkerData {
  vehicle: any;
  service: Servicio;
  marker?: mapboxgl.Marker;
}

const EnhancedMapComponent = ({
  servicios,
  selectedServicio,
  vehicleTracking,
  trackingError,
  handleServicioClick,
  getStatusText,
  getServiceTypeText,
  mapboxToken,
  onWialonRequest,
  wialonToken,
  setSelectedServicio
}: EnhancedMapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{
    origen?: mapboxgl.Marker;
    destino?: mapboxgl.Marker;
    vehicle?: mapboxgl.Marker;
    activeVehicles: Map<string, mapboxgl.Marker>;
  }>({
    activeVehicles: new Map(),
  });

  // Estados
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>("");
  const [activeVehiclesData, setActiveVehiclesData] = useState<VehicleMarkerData[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [wialonSessionId, setWialonSessionId] = useState<string | null>(null);

  // Color para la polilínea basado en el estado
  const color = useMemo(() => {
    if (!selectedServicio) return "#3388ff";

    switch (selectedServicio.estado) {
      case "solicitado":
        return "#6a7282";
      case "realizado":
        return "#155dfc";
      case "en curso":
        return "#00bc7d";
      case "planificado":
        return "#FF9800";
      case "cancelado":
        return "#F44336";
      default:
        return "#3388ff";
    }
  }, [selectedServicio]);

  // Inicializar sesión de Wialon
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

  // Obtener vehículos activos cuando no hay servicio seleccionado
  useEffect(() => {
    if (selectedServicio || !wialonSessionId) return;

    const fetchActiveVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        // Obtener todos los vehículos de Wialon
        const vehiclesData = await onWialonRequest(wialonSessionId, "core/search_items", {
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
        });

        if (!vehiclesData?.items) return;

        // Filtrar servicios en curso
        const serviciosEnCurso = servicios.filter(s => s.estado === "en curso");
        
        const vehicleMarkers: VehicleMarkerData[] = [];

        // Para cada servicio en curso, buscar el vehículo correspondiente
        for (const servicio of serviciosEnCurso) {
          if (servicio.vehiculo?.placa) {
            const vehicleData = vehiclesData.items.find(v => 
              v.nm.includes(servicio.vehiculo.placa) || 
              v.nm.toLowerCase() === servicio.vehiculo.placa.toLowerCase()
            );

            if (vehicleData?.pos) {
              vehicleMarkers.push({
                vehicle: vehicleData,
                service: servicio
              });
            }
          }
        }

        setActiveVehiclesData(vehicleMarkers);
      } catch (error) {
        console.error("Error al obtener vehículos activos:", error);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    // Cargar inicialmente y luego cada 30 segundos
    fetchActiveVehicles();
    const interval = setInterval(fetchActiveVehicles, 30000);

    return () => clearInterval(interval);
  }, [selectedServicio, servicios, wialonSessionId, onWialonRequest]);

  // Configurar token de Mapbox
  useEffect(() => {
    if (!mapboxToken) {
      setMapError("Token de Mapbox no configurado");
      return;
    }

    mapboxgl.accessToken = mapboxToken;
  }, [mapboxToken]);

  // Inicializar el mapa
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

  // Crear marcador pulsante para vehículos activos
  const createPulsingVehicleMarker = (vehicleData: any, service: Servicio) => {
    if (!map.current) return null;

    const el = document.createElement("div");
    el.className = "pulsing-vehicle-marker";
    
    // Crear el punto central
    const center = document.createElement("div");
    center.className = "marker-center";
    el.appendChild(center);

    // Crear las ondas pulsantes
    const pulse1 = document.createElement("div");
    pulse1.className = "pulse pulse-1";
    el.appendChild(pulse1);

    const pulse2 = document.createElement("div");
    pulse2.className = "pulse pulse-2";
    el.appendChild(pulse2);

    // Crear popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
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

    // Click para seleccionar el servicio
    el.addEventListener("click", () => {
      handleServicioClick(service);
    });

    return marker;
  };

  // Actualizar marcadores de vehículos activos
  useEffect(() => {
    if (!isMapLoaded || !map.current || selectedServicio) return;

    // Limpiar marcadores existentes
    markersRef.current.activeVehicles.forEach(marker => marker.remove());
    markersRef.current.activeVehicles.clear();

    // Crear nuevos marcadores
    activeVehiclesData.forEach(data => {
      const marker = createPulsingVehicleMarker(data.vehicle, data.service);
      if (marker) {
        markersRef.current.activeVehicles.set(data.vehicle.id.toString(), marker);
      }
    });

    // Ajustar vista para mostrar todos los vehículos si hay alguno
    if (activeVehiclesData.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      activeVehiclesData.forEach(data => {
        bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 14
      });
    }
  }, [activeVehiclesData, isMapLoaded, selectedServicio, handleServicioClick]);

  // Función para crear popups para los marcadores
  const createPopupHTML = (type: "origen" | "destino") => {
    if (!selectedServicio) return "";

    const isOrigin = type === "origen";

    return `
      <div class="marker-popup">
        <div class="popup-header popup-${selectedServicio.estado.toLowerCase().replace(" ", "-")}">
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

          ${
            isOrigin
              ? `<div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div class="font-medium">Tipo de servicio</div>
                <div>${getServiceTypeText(selectedServicio.tipo_servicio || "")}</div>
              </div>
              <div>
                <div class="font-medium">Fecha inicio</div>
                <div>${new Date(selectedServicio.fecha_inicio).toLocaleDateString()}</div>
              </div>
            </div>`
              : `<div class="text-sm">
              <div>
                <div class="font-medium">Distancia</div>
                <div>${selectedServicio.distancia_km} km</div>
              </div>
            </div>`
          }
        </div>
      </div>
    `;
  };

  // Función para crear un marcador con popup
  const createMarker = (
    lngLat: [number, number],
    type: "origen" | "destino",
    popupContent: string,
  ) => {
    if (!map.current) return null;

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

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
    const marker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);

    el.addEventListener("click", () => {
      handleServicioClick(selectedServicio);
    });

    return marker;
  };

  // Función para crear marcador de vehículo
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

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
    return new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);
  };

  // Actualizar mapa cuando hay un servicio seleccionado
  useEffect(() => {
    if (!isMapLoaded || !map.current || !selectedServicio) return;

    // Limpiar todos los marcadores
    Object.values(markersRef.current).forEach(marker => {
      if (marker && marker.remove) marker.remove();
    });
    markersRef.current.activeVehicles.forEach(marker => marker.remove());
    markersRef.current.activeVehicles.clear();
    markersRef.current.origen = undefined;
    markersRef.current.destino = undefined;
    markersRef.current.vehicle = undefined;

    // Limpiar capa de ruta existente si existe
    if (map.current.getSource("route")) {
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }

    if (selectedServicio.geometry && selectedServicio.geometry.length > 0) {
      // Mostrar ruta completa
      const coordinates = selectedServicio.geometry.map((coord) => [
        coord[1], // longitud
        coord[0], // latitud
      ]);

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": 5,
          "line-opacity": 0.7,
        },
      });

      // Ajustar el mapa a los límites de la ruta
      const bounds = coordinates.reduce(
        (bounds, coord) => {
          return bounds.extend(coord);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
      );

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }

    // Crear marcadores para origen y destino
    if (selectedServicio.origen_latitud && selectedServicio.origen_longitud) {
      const lngLat: [number, number] = [
        selectedServicio.origen_longitud,
        selectedServicio.origen_latitud,
      ];

      markersRef.current.origen = createMarker(
        lngLat,
        "origen",
        createPopupHTML("origen"),
      );
    }

    if (selectedServicio.destino_latitud && selectedServicio.destino_longitud) {
      const lngLat: [number, number] = [
        selectedServicio.destino_longitud,
        selectedServicio.destino_latitud,
      ];

      markersRef.current.destino = createMarker(
        lngLat,
        "destino",
        createPopupHTML("destino"),
      );
    }
  }, [selectedServicio, isMapLoaded, color, handleServicioClick, getStatusText, getServiceTypeText]);

  // Actualizar marcador del vehículo para servicio seleccionado
  useEffect(() => {
    if (
      !isMapLoaded ||
      !map.current ||
      selectedServicio?.estado !== "en curso" ||
      !vehicleTracking ||
      !vehicleTracking.position
    ) {
      return;
    }

    if (markersRef.current.vehicle) {
      markersRef.current.vehicle.remove();
      markersRef.current.vehicle = undefined;
    }

    const lngLat: [number, number] = [
      vehicleTracking.position.x,
      vehicleTracking.position.y,
    ];

    markersRef.current.vehicle = createVehicleMarker(lngLat);
  }, [vehicleTracking, selectedServicio, isMapLoaded]);


  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "solicitado":
        return "#6a7282";
      case "realizado":
        return "#155dfc";
      case "en curso":
        return "#00bc7d";
      case "planificado":
        return "#FF9800";
      case "cancelado":
        return "#F44336";
      default:
        return "#3388ff";
    }
  };

  return (
    <div className="h-full w-full relative">
      {mapError && (
        <div className="absolute top-2 left-2 right-2 z-[1000] bg-red-100 text-red-800 text-sm p-2 rounded-md shadow">
          <span className="font-medium">Error:</span> {mapError}
        </div>
      )}

      <div ref={mapContainer} className="h-full w-full">
        {!isMapLoaded && (
          <div className="h-full w-full flex items-center justify-center">
            Cargando mapa...
          </div>
        )}
      </div>

      {selectedServicio && (
          <div className="animate-fade-up absolute top-2.5 right-14 bg-white p-4 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
              <button
                onClick={() => setSelectedServicio(null)}
                className="text-gray-500 hover:text-gray-700"
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
                    color: getStatusColor(selectedServicio.estado)
                  }}
                >
                  {getStatusText(selectedServicio.estado)}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Origen</span>
                <div className="font-medium">{selectedServicio.origen_especifico}</div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Destino</span>
                <div className="font-medium">{selectedServicio.destino_especifico}</div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Fecha y Hora</span>
                <div className="font-medium">
                  {formatDate(selectedServicio.fecha_inicio)} · {selectedServicio.hora_salida}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Distancia</span>
                <div className="font-medium">{selectedServicio.distancia_km} km</div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Valor</span>
                <div className="font-medium">
                  ${selectedServicio.valor.toLocaleString('es-CO')}
                </div>
              </div>
              
              {selectedServicio.estado === "en curso" && vehicleTracking && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">Tracking del Vehículo</h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-sm text-gray-500">Vehículo:</span> {vehicleTracking.name}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Velocidad:</span> {vehicleTracking.position.s} km/h
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Última actualización:</span> {formatTime(vehicleTracking.lastUpdate)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Mensaje para vista general */}
      {!selectedServicio && isMapLoaded && (
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded-md shadow">
          <span className="text-sm font-medium">
            Vehículos con servicios en curso: {activeVehiclesData.length}
          </span>
        </div>
      )}

      {/* Mensaje de error de tracking */}
      {selectedServicio?.estado === "en curso" &&
        trackingError &&
        !vehicleTracking && (
          <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
            <span className="font-medium">Información:</span> {trackingError}
          </div>
        )}

      {/* Estilos */}
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

        /* Estilos para marcadores pulsantes */
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