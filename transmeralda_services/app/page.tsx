"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Servicio, useService, VehicleTracking, ServicioConRelaciones } from "@/context/serviceContext";
import axios from "axios";
import { LatLngTuple } from "leaflet";
import EnhancedMapComponent from "@/components/enhancedMapComponent";

// Definición de la interfaz WialonVehicle
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

// Funciones auxiliares
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

const formatDate = (date: Date | string) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const formatTime = (date: Date | string) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  });
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
    case "solicitado":
      return "Solicitado";
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

// Componente principal del Dashboard
const AdvancedDashboard = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{
    origen?: mapboxgl.Marker;
    destino?: mapboxgl.Marker;
    vehicle?: mapboxgl.Marker;
  }>({});
  
  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const [token] = useState(WIALON_API_TOKEN);

  // Estados
  const { servicios } = useService();
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [servicioWithRoutes, setServicioWithRoutes] = useState<ServicioConRelaciones | null>(null);
  const [vehicleTracking, setVehicleTracking] = useState<VehicleTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingWialon, setIsLoadingWialon] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [trackingError, setTrackingError] = useState<string>("");
  const [wialonVehicles, setWialonVehicles] = useState<WialonVehicle[]>([]);
  
  // Filtros
  const [filters, setFilters] = useState({
    estado: "",
    origen: "",
    destino: "",
    fechaInicio: "",
    fechaFin: "",
    tipoServicio: ""
  });

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-72.395, 5.3377], // Yopal, Casanare
      zoom: 12
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [MAPBOX_ACCESS_TOKEN]);

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

  // Función para obtener la geometría de la ruta usando Mapbox API
  const fetchRouteGeometry = useCallback(async (servicio: Servicio) => {
    
    console.log(servicio, mapLoaded, MAPBOX_ACCESS_TOKEN)

    if (!servicio || mapLoaded || !MAPBOX_ACCESS_TOKEN) {
      return;
    }

    console.log("pasamos")

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

      console.log("pasamos 2")

      const origenCoords: LatLngTuple = [servicio.origen_latitud, servicio.origen_longitud];
      const destinoCoords: LatLngTuple = [
        servicio.destino_latitud,
        servicio.destino_longitud,
      ];

      // Construir la URL para la API de Directions de Mapbox
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
      
      console.log(data, "data")

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No se encontró una ruta válida");
      }

      // Extraer la geometría de la ruta
      const route = data.routes[0];

      // Convertir las coordenadas de [lng, lat] a [lat, lng]
      const coordinates = route.geometry.coordinates.map((coord: number[]) => [
        coord[1], // latitud
        coord[0], // longitud
      ]);

      const servicioWithRoutesData = {
        ...servicio,
        origenCoords,
        destinoCoords,
        geometry: coordinates,
        routeDistance: (route.distance / 1000).toFixed(1),
        routeDuration: Math.round(route.duration / 60),
      };

      setServicioWithRoutes(servicioWithRoutesData);
      return servicioWithRoutesData;
    } catch (error: any) {
      console.error("Error:", error.message);

      // Manejar el caso de error utilizando una línea recta
      if (servicio?.origen_latitud && servicio?.destino_latitud) {
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
          routeDistance: servicio.distancia_km || "0",
          routeDuration: null,
        };

        setServicioWithRoutes(servicioWithRoutesData);
        return servicioWithRoutesData;
      }
    }
  }, [mapLoaded, MAPBOX_ACCESS_TOKEN]);

  // Función para obtener el tracking de Wialon
  const fetchWialonTracking = useCallback(async (servicioData: ServicioConRelaciones) => {
    if (!token || !servicioData || servicioData.estado !== "en curso") {
      return;
    }

    setIsLoadingWialon(true);
    setTrackingError("");

    try {
      // 1. Login a Wialon
      const loginData = await callWialonApi(token, "token/login", {});

      if (!loginData?.eid) {
        throw new Error("Login fallido: No se obtuvo Session ID");
      }

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

      if (!vehiclesData?.items || !Array.isArray(vehiclesData.items)) {
        throw new Error("No se pudieron obtener los vehículos");
      }

      const vehicles: WialonVehicle[] = vehiclesData.items;
      setWialonVehicles(vehicles);

      // 3. Buscar vehículo por placa
      if (servicioData.vehiculo_id && servicioData.vehiculo?.placa) {
        const placa = servicioData.vehiculo.placa;
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
      console.error("Error en la integración con Wialon:", error);
      setTrackingError(
        error instanceof Error ? error.message : "Error desconocido",
      );
    } finally {
      setIsLoadingWialon(false);
    }
  }, [token, callWialonApi]);

  // Función para seleccionar un servicio
  const handleSelectServicio = async (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setVehicleTracking(null);
    setTrackingError("");

    // Obtener la ruta y geometría
    const servicioWithRoutesData = await fetchRouteGeometry(servicio);
    
    console.log(servicioWithRoutes)

    if (map.current && servicioWithRoutesData) {
      // Limpiar marcadores existentes
      Object.values(markersRef.current).forEach(marker => marker?.remove());
      markersRef.current = {};

      // Limpiar la ruta existente si existe
      if (map.current.getSource("route")) {
        map.current.removeLayer("route");
        map.current.removeSource("route");
      }

      // Añadir marcadores
      if (servicioWithRoutesData.origen_latitud && servicioWithRoutesData.origen_longitud) {
        markersRef.current.origen = new mapboxgl.Marker({ color: "#00bc7d" })
          .setLngLat([servicioWithRoutesData.origen_longitud, servicioWithRoutesData.origen_latitud])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-bold">Origen</h3>
              <p>${servicioWithRoutesData.origen_especifico}</p>
            </div>
          `))
          .addTo(map.current);
      }

      if (servicioWithRoutesData.destino_latitud && servicioWithRoutesData.destino_longitud) {
        markersRef.current.destino = new mapboxgl.Marker({ color: "#155dfc" })
          .setLngLat([servicioWithRoutesData.destino_longitud, servicioWithRoutesData.destino_latitud])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-bold">Destino</h3>
              <p>${servicioWithRoutesData.destino_especifico}</p>
            </div>
          `))
          .addTo(map.current);
      }

      // Añadir la ruta si existe geometría
      if (servicioWithRoutesData.geometry && servicioWithRoutesData.geometry.length > 0) {
        const coordinates = servicioWithRoutesData.geometry.map(coord => [coord[1], coord[0]]); // Convertir a [lng, lat]

        console.log(coordinates, "coord")
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
            "line-color": getStatusColor(servicioWithRoutesData.estado),
            "line-width": 5,
            "line-opacity": 0.7,
          },
        });
      }

      // Ajustar vista para mostrar todos los elementos
      const bounds = new mapboxgl.LngLatBounds();
      
      if (servicioWithRoutesData.origen_latitud && servicioWithRoutesData.origen_longitud) {
        bounds.extend([servicioWithRoutesData.origen_longitud, servicioWithRoutesData.origen_latitud]);
      }
      
      if (servicioWithRoutesData.destino_latitud && servicioWithRoutesData.destino_longitud) {
        bounds.extend([servicioWithRoutesData.destino_longitud, servicioWithRoutesData.destino_latitud]);
      }

      map.current.fitBounds(bounds, {
        padding: 100
      });

      // Si el servicio está en curso, obtener tracking del vehículo
      if (servicioWithRoutesData.estado === "en curso") {
        await fetchWialonTracking(servicioWithRoutesData);
      }
    }
  };

  // Actualizar marcador del vehículo
  useEffect(() => {
    if (!map.current || !vehicleTracking || !vehicleTracking.position) {
      return;
    }

    // Limpiar marcador de vehículo existente
    if (markersRef.current.vehicle) {
      markersRef.current.vehicle.remove();
    }

    // Crear nuevo marcador de vehículo
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

    markersRef.current.vehicle = new mapboxgl.Marker(el)
      .setLngLat([vehicleTracking.position.x, vehicleTracking.position.y])
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${vehicleTracking.name}</h3>
          <div class="mt-1">
            <div>Velocidad: ${vehicleTracking.position.s || 0} km/h</div>
            <div>Última actualización: ${vehicleTracking.lastUpdate.toLocaleTimeString()}</div>
          </div>
        </div>
      `))
      .addTo(map.current);
  }, [vehicleTracking]);

  // Filtrar servicios
  const filteredServicios = servicios.filter(servicio => {
    if (filters.estado && servicio.estado !== filters.estado) return false;
    if (filters.origen && !servicio.origen_especifico.toLowerCase().includes(filters.origen.toLowerCase())) return false;
    if (filters.destino && !servicio.destino_especifico.toLowerCase().includes(filters.destino.toLowerCase())) return false;
    if (filters.tipoServicio && servicio.tipo_servicio !== filters.tipoServicio) return false;
    return true;
  });

  console.log(servicioWithRoutes)

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-1/4' : 'w-16'} bg-white border-r transition-all duration-300 flex flex-col`}>
        {/* Header del sidebar */}
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Servicios</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Filtros */}
        {sidebarOpen && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Filtros</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters({...filters, estado: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="solicitado">Solicitado</option>
                  <option value="planificado">Planificado</option>
                  <option value="en curso">En curso</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Origen</label>
                <input
                  type="text"
                  value={filters.origen}
                  onChange={(e) => setFilters({...filters, origen: e.target.value})}
                  placeholder="Buscar origen..."
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Destino</label>
                <input
                  type="text"
                  value={filters.destino}
                  onChange={(e) => setFilters({...filters, destino: e.target.value})}
                  placeholder="Buscar destino..."
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Servicio</label>
                <select
                  value={filters.tipoServicio}
                  onChange={(e) => setFilters({...filters, tipoServicio: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="personal">Personal</option>
                  <option value="herramienta">Herramienta</option>
                  <option value="posicionar">Posicionar vehículo</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Lista de servicios */}
        <div className="flex-1 overflow-auto">
          {sidebarOpen && (
            <div className="p-4">
              {loading ? (
                <div className="text-center py-8">Cargando...</div>
              ) : filteredServicios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron servicios
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredServicios.map((servicio) => (
                    <div
                      key={servicio.id}
                      onClick={() => handleSelectServicio(servicio)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedServicio?.id === servicio.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{servicio.origen_especifico}</div>
                          <div className="text-sm text-gray-600">→ {servicio.destino_especifico}</div>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{
                            backgroundColor: `${getStatusColor(servicio.estado)}20`,
                            color: getStatusColor(servicio.estado)
                          }}
                        >
                          {getStatusText(servicio.estado)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>{formatDate(servicio.fecha_inicio)} · {servicio.hora_salida}</div>
                        <div>{servicio.tipo_servicio} · {servicio.distancia_km} km</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

       <EnhancedMapComponent
       servicios={servicios}
       selectedServicio={selectedServicio}
       vehicleTracking={vehicleTracking}
       trackingError={trackingError}
       handleServicioClick={handleSelectServicio}
       getStatusText={getStatusText}
       getServiceTypeText={getServiceTypeText}
       mapboxToken={MAPBOX_ACCESS_TOKEN}
       wialonToken={WIALON_API_TOKEN}
       onWialonRequest={callWialonApi}
       setSelectedServicio={setSelectedServicio}
     />
      
      {/* Estilos adicionales */}
      <style global jsx>{`
        .vehicle-marker {
          transition: transform 0.2s ease-in-out;
        }
        .vehicle-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default AdvancedDashboard;