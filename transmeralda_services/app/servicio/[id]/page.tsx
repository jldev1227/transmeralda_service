"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useService } from '@/context/serviceContext';
import { useParams } from 'next/navigation';
import axios from 'axios';

// Fix para el icono de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Interfaces para Wialon
interface WialonVehicle {
  id: number;
  nm: string;
  pos?: {
    x: number; // longitud
    y: number; // latitud
    s: number; // velocidad
    c: number; // rumbo
    t: number; // timestamp
  };
  mileage?: number;
}

interface VehicleTracking {
  id: number;
  name: string;
  position: {
    x: number;
    y: number;
    s: number;
    c: number;
    t: number;
  };
  lastUpdate: Date;
}


// Componente para ajustar la vista del mapa según las rutas
function RoutesController({ routes, activeRouteId, vehiclePosition = null }) {
  const map = useMap();

  useEffect(() => {
    // Si tenemos posición del vehículo y rutas, incluimos ambos en los bounds
    if (vehiclePosition && routes.length > 0) {
      const points = routes.flatMap(route => route.geometry || []);
      points.push([vehiclePosition.y, vehiclePosition.x]);

      if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      return;
    }

    // Si hay una ruta activa específica, hacer zoom a esa ruta
    if (activeRouteId && routes.length > 0) {
      const route = routes.find(r => r.id === activeRouteId);
      if (route && route.geometry && route.geometry.length > 0) {
        const bounds = L.latLngBounds(route.geometry);
        map.fitBounds(bounds, { padding: [50, 50] });
        return;
      }
    }

    // Si no hay ruta activa, mostrar todas las rutas
    if (routes.length > 0) {
      // Crear un límite que incluya todas las geometrías de rutas
      const allPoints = routes.flatMap(route => route.geometry || []);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, routes, activeRouteId, vehiclePosition]);

  return null;
}

// Crear íconos personalizados para origen y destino basados en el estado
const createServiceIcon = (color, type) => {
  // Definir símbolo central según el tipo
  const innerSymbol = type === 'origin'
    ? `<circle fill="${color}" cx="12" cy="12" r="4"/>`
    : `<path fill="${color}" d="M16.4 8.4L13.6 12l2.8 3.6-1.2 1.2L12 13.6l-3.6 3.2-1.2-1.2L10.4 12 7.6 8.4l1.2-1.2L12 10.4l3.6-3.2z"/>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
      <path fill="${color}" d="M12 0C5.4 0 0 5.4 0 12c0 6.6 12 24 12 24s12-17.4 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="#ffffff" cx="12" cy="12" r="6"/>
      ${innerSymbol}
    </svg>
  `;

  return L.divIcon({
    className: '',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
    html: svg
  });
};

const createVehicleIcon = () => {
  // Colores personalizados en tono emerald
  const primaryColor = '#10b981'; // emerald-500
  const secondaryColor = '#059669'; // emerald-600
  
  // Usa un div icon para mayor flexibilidad
  return L.divIcon({
    className: 'custom-vehicle-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${primaryColor};
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      ">
        <img src="/assets/vehicle-marker.png" style="
          width: 26px;
          height: 26px;
          filter: brightness(0) invert(1);
        " alt="Vehículo" />
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: white;
          animation: pulse 1.5s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      </style>
    `
  });
};

// Función para convertir estado a colores
const getColorByState = (state) => {
  switch (state) {
    case 'planificado':
      return '#f59e0b'; // Amber-500
    case 'en curso':
      return '#10b981'; // Emerald-500
    case ' completado':
      return '#3b82f6'; // Blue-500 (primario)
    default:
      return '#6b7280'; // Gray-500
  }
};

// Función para obtener clase CSS basada en el estado
const getClassByState = (state) => {
  switch (state) {
    case 'planificado':
      return 'bg-amber-50 border-amber-200 text-amber-800';
    case 'en curso':
      return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    case 'COMPLETADO':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

// Función para obtener texto de estado en español
const getStatusText = (state) => {
  switch (state) {
    case 'planificado':
      return 'Programado';
    case 'en curso':
      return 'En curso';
    case 'COMPLETADO':
      return 'Completado';
    default:
      return state;
  }
};

// Función para obtener texto de tipo de servicio en formato legible
const getServiceTypeText = (type) => {
  switch (type) {
    case 'MENSAJERÍA':
      return 'Mensajería';
    case 'TRANSPORTE_PERSONAL':
      return 'Transporte de personal';
    default:
      return type;
  }
};

// Función para formatear fecha
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};

// Función para formatear valor en pesos colombianos
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export default function ServiceRouteMap() {

  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || '';

  // Estados
  const params = useParams();
  const { id } = params;
  const { servicio, obtenerServicio } = useService();
  const [loading, setLoading] = useState(true);
  const [activeServicio, setActiveServicio] = useState(null);
  const [servicioWithRoutes, setServicioWithRoutes] = useState(null);

  // Estados para Wialon
  const [token] = useState(WIALON_API_TOKEN);
  const [sessionId, setSessionId] = useState("");
  const [wialonVehicles, setWialonVehicles] = useState<WialonVehicle[]>([]);
  const [vehicleTracking, setVehicleTracking] = useState<VehicleTracking | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [isLoadingWialon, setIsLoadingWialon] = useState(false);

  // Validación inicial
  if (!id) return null;
  const serviceId = Array.isArray(id) ? id[0] : id;

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

  // Cargar datos del servicio y calcular ruta
  useEffect(() => {
    if (!servicio) {
      obtenerServicio(serviceId);
    }

    const fetchRouteGeometry = async () => {
      setLoading(true);
      try {
        if (!servicio) {
          setLoading(false);
          return;
        }
        const origenCoords = [servicio.origen.latitud, servicio.origen.longitud]
        const destinoCoords = [servicio.destino.latitud, servicio.destino.longitud]

        try {
          // Intentar obtener la geometría real de la ruta desde OSRM
          // Usando la IP local del servidor OSRM
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origenCoords[1]},${origenCoords[0]};${destinoCoords[1]},${destinoCoords[0]}?overview=full&geometries=geojson`
          );

          if (!response.ok) {
            throw new Error("Error al obtener la ruta");
          }

          const data = await response.json();

          if (
            data.code !== "Ok" ||
            !data.routes ||
            data.routes.length === 0
          ) {
            throw new Error("No se encontró una ruta");
          }

          // Extraer la geometría de la ruta y convertirla al formato [lat, lng]
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);

          setServicioWithRoutes({
            ...servicio,
            origenCoords,
            destinoCoords,
            geometry: coordinates,
            routeDistance: (route.distance / 1000).toFixed(1),
            routeDuration: Math.round(route.duration / 60),
          });
        } catch (error) {
          console.warn("Error al obtener ruta detallada:", error.message);

          // Si hay un error, usar línea recta entre origen y destino
          setServicioWithRoutes({
            ...servicio,
            origenCoords,
            destinoCoords,
            geometry: [origenCoords, destinoCoords],
            routeDistance: servicio.distancia_km,
            routeDuration: null,
          });
        }
      } catch (error) {
        console.error("Error al procesar el servicio:", error);
      } finally {
        setLoading(false);
      }
    };

    if (servicio) {
      fetchRouteGeometry();
    }
  }, [serviceId, servicio]);

  // Inicializar y obtener datos de Wialon
  useEffect(() => {
    let isMounted = true;
    setIsLoadingWialon(true);

    const initWialon = async () => {
      if (!token || !servicioWithRoutes || servicioWithRoutes.estado !== 'en curso') {
        setIsLoadingWialon(false);
        return;
      }

      try {
        // 1. Login a Wialon
        const loginData = await callWialonApi(token, "token/login", {});
        if (!loginData?.eid) {
          throw new Error("Login fallido: No se obtuvo Session ID");
        }

        if (!isMounted) return;
        const sid = loginData.eid;
        setSessionId(sid);

        // 2. Obtener lista de vehículos
        const vehiclesData = await callWialonApi(
          sid,
          "core/search_items",
          {
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
          },
        );

        if (!isMounted) return;

        if (!vehiclesData?.items || !Array.isArray(vehiclesData.items)) {
          throw new Error("No se pudieron obtener los vehículos");
        }

        const vehicles: WialonVehicle[] = vehiclesData.items;
        setWialonVehicles(vehicles);

        // 3. Buscar vehículo por placa
        if (servicioWithRoutes.vehiculo_id && servicioWithRoutes.vehiculo.placa) {
          const placa = servicioWithRoutes.vehiculo.placa;
          const foundVehicle = vehicles.find(v =>
            v.nm.includes(placa) ||
            v.nm.toLowerCase() === placa.toLowerCase()
          );

          if (foundVehicle) {
            // 4. Obtener posición del vehículo
            const vehicleData = await callWialonApi(
              sid,
              "core/search_item",
              {
                id: foundVehicle.id,
                flags: 1025
              }
            );

            if (!isMounted) return;

            if (vehicleData?.item?.pos) {
              const { pos } = vehicleData.item;
              setVehicleTracking({
                id: foundVehicle.id,
                name: foundVehicle.nm,
                position: pos,
                lastUpdate: new Date(pos.t * 1000)
              });
            } else {
              setTrackingError("El vehículo no está transmitiendo su posición");
            }
          } else {
            setTrackingError(`Vehículo con placa ${placa} no encontrado en la flota de wialon`);
          }
        } else {
          setTrackingError("No hay información de placa del vehículo");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error en la integración con Wialon:", error);
          setTrackingError(error instanceof Error ? error.message : "Error desconocido");
        }
      } finally {
        if (isMounted) {
          setIsLoadingWialon(false);
        }
      }
    };

    if (servicioWithRoutes && servicioWithRoutes.estado === 'en curso') {
      initWialon();
    } else {
      setIsLoadingWialon(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token, callWialonApi, servicioWithRoutes]);

  // Actualización periódica de la posición del vehículo
  useEffect(() => {
    if (!sessionId || !vehicleTracking || servicioWithRoutes?.estado !== 'en curso') {
      return;
    }

    const updateVehiclePosition = async () => {
      try {
        const vehicleData = await callWialonApi(
          sessionId,
          "core/search_item",
          {
            id: vehicleTracking.id,
            flags: 1025
          }
        );

        if (vehicleData?.item?.pos) {
          const { pos } = vehicleData.item;
          setVehicleTracking(prev => ({
            ...prev!,
            position: pos,
            lastUpdate: new Date(pos.t * 1000)
          }));
          setTrackingError("");
        }
      } catch (error) {
        console.error("Error al actualizar posición:", error);
      }
    };

    // Actualizar posición cada 15 segundos
    const interval = setInterval(updateVehiclePosition, 15000);
    return () => clearInterval(interval);
  }, [sessionId, vehicleTracking, servicioWithRoutes, callWialonApi]);

  // Manejar clic en un servicio
  const handleServicioClick = (servicioClickeado) => {
    if (!servicioClickeado && servicioWithRoutes) {
      servicioClickeado = servicioWithRoutes;
    }

    if (!servicioClickeado) return;

    setActiveServicio(
      activeServicio && activeServicio.id === servicioClickeado.id
        ? null
        : servicioClickeado
    );
  };

  // Si no hay servicio con rutas, mostrar pantalla de carga
  if (!servicioWithRoutes && !loading) {
    return (
      <div className="max-w-7xl mx-auto mt-5 max-xl:px-6">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">No se encontró información para este servicio</p>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-5 max-xl:px-6">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">Cargando información del servicio...</p>
        </div>
      </div>
    );
  }

  // Obtener color y opciones para la polilínea
  const color = getColorByState(servicioWithRoutes.estado);
  const isActive = activeServicio && activeServicio.id === servicioWithRoutes.id;

  // Opciones para la polilínea
  const polylineOptions = {
    color: color,
    weight: isActive ? 5 : 3,
    opacity: isActive ? 0.9 : 0.7,
    dashArray: servicioWithRoutes.estado === 'planificado' ? '5, 10' : null
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 max-xl:px-6">
      <div className="rounded-lg shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2">Rutas de Servicios</h2>
        <p className="text-gray-600 mb-4">
          Visualización de servicios de transporte y mensajería
        </p>

        {/* Lista de servicios */}
        <div className="servicios-list space-y-3 mb-4">
          <div
            key={servicioWithRoutes.id}
            className={`servicio-item p-3 border rounded-md cursor-pointer transition-all hover:shadow-md ${getClassByState(
              servicioWithRoutes.estado
            )} ${activeServicio && activeServicio.id === servicioWithRoutes.id
              ? "ring-2 ring-offset-2"
              : ""
              }`}
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: getColorByState(servicioWithRoutes.estado),
            }}
            onClick={() => handleServicioClick(servicioWithRoutes)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {servicioWithRoutes.origen.nombre_municipio.split(" - ")[0]} →{" "}
                  {servicioWithRoutes.destino.nombre_municipio.split(" - ")[0]}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="inline-block mr-3">
                    <span className="font-medium">ID:</span> {servicioWithRoutes.id}
                  </span>
                  <span className="inline-block mr-3">
                    <span className="font-medium">Tipo:</span>{" "}
                    {getServiceTypeText(servicioWithRoutes.tipo_servicio)}
                  </span>
                  <span className="inline-block">
                    <span className="font-medium">Distancia:</span>{" "}
                    {servicioWithRoutes.routeDistance} km
                  </span>
                </div>
              </div>
              <span
                className={`estado-badge px-2 py-1 text-xs font-medium rounded-full ${servicioWithRoutes.estado === "planificado"
                  ? "bg-amber-100 text-amber-800"
                  : servicioWithRoutes.estado === "en curso"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                  }`}
              >
                {getStatusText(servicioWithRoutes.estado)}
                {servicioWithRoutes.estado === "en curso" && vehicleTracking && (
                  <span className="ml-1">• En vivo</span>
                )}
              </span>
            </div>

            {/* Si el servicio está en curso y hay tracking, mostramos información adicional */}
            {servicioWithRoutes.estado === "en curso" && (
              <div className="mt-2 text-xs">
                {isLoadingWialon ? (
                  <span className="text-gray-500">Conectando con sistema de rastreo...</span>
                ) : vehicleTracking ? (
                  <div className="bg-emerald-50 px-2 py-1 rounded text-emerald-700 flex items-center">
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                    <span>Rastreo en vivo: {vehicleTracking.name} • Última actualización: {vehicleTracking.lastUpdate.toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 px-2 py-1 rounded text-amber-700">
                    {trackingError || "No se pudo establecer tracking en vivo"}
                  </div>
                )}
              </div>
            )}

            {activeServicio && activeServicio.id === servicioWithRoutes.id && (
              <div className="servicio-details mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Origen especifico
                    </div>
                    <div className="text-sm">
                      {servicioWithRoutes.origen_especifico}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Destino especifico
                    </div>
                    <div className="text-sm">
                      {servicioWithRoutes.destino_especifico}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Inicia
                    </div>
                    <div className="text-sm">
                      {formatDate(servicioWithRoutes.fecha_inicio)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Finaliza
                    </div>
                    <div className="text-sm">
                      {formatDate(servicioWithRoutes.fecha_fin)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Valor
                    </div>
                    <div className="text-sm font-medium">
                      {formatCurrency(servicioWithRoutes.valor)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Tiempo estimado
                    </div>
                    <div className="text-sm">
                      {servicioWithRoutes.routeDuration
                        ? `${servicioWithRoutes.routeDuration} minutos`
                        : "No disponible"}
                    </div>
                  </div>
                </div>
                {servicioWithRoutes.observaciones && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Observaciones
                    </div>
                    <div className="text-sm">{servicioWithRoutes.observaciones}</div>
                  </div>
                )}

                {/* Información del vehículo si está en tracking */}
                {vehicleTracking && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Datos del rastreo en vivo
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Vehículo: </span>
                        {vehicleTracking.name}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Velocidad: </span>
                        {vehicleTracking.position.s} km/h
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Dirección: </span>
                        {vehicleTracking.position.c}°
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Actualizado: </span>
                        {vehicleTracking.lastUpdate.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="map-container"
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <style jsx global>{`
          .service-marker-popup .leaflet-popup-content-wrapper {
            border-radius: 8px;
            padding: 0;
            overflow: hidden;
          }

          .service-marker-popup .leaflet-popup-content {
            margin: 0;
            width: 250px !important;
          }

          .service-marker-popup .leaflet-popup-tip {
            background: white;
          }

          .popup-header {
            padding: 10px;
            color: white;
            font-weight: bold;
          }

          .popup-programado {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
          }

          .popup-en-curso {
            background: linear-gradient(135deg, #34d399, #10b981);
          }

          .popup-completado {
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
          }

          .popup-content {
            padding: 10px;
          }

          .popup-divider {
            height: 1px;
            margin: 8px 0;
            background-color: #e5e7eb;
          }
          
          .vehicle-marker-popup .leaflet-popup-content-wrapper {
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }
  
  .vehicle-marker-popup .leaflet-popup-content {
    margin: 10px;
    color: white;
  }
  
  .vehicle-marker-popup .leaflet-popup-tip {
    background: #059669;
  }

  .vehicle-marker-popup .leaflet-popup-close-button {
    color: white;
  }
        `}</style>

        <MapContainer
          center={[6.2442, -75.5812]} // Centro aproximado de Antioquia
          style={{ height: "100%", width: "100%" }}
          zoom={8}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Ajustar vista a la ruta */}
          <RoutesController
            activeRouteId={servicioWithRoutes.id}
            routes={[servicioWithRoutes]}
          />

          <React.Fragment key={servicioWithRoutes.id}>
            {/* Polilínea de la ruta */}
            {servicioWithRoutes.geometry && (
              <Polyline
                eventHandlers={{
                  click: () => handleServicioClick(servicioWithRoutes),
                }}
                pathOptions={polylineOptions}
                positions={servicioWithRoutes.geometry}
              />
            )}

            {/* Marcador de origen */}
            <Marker
              eventHandlers={{
                click: () => handleServicioClick(servicioWithRoutes),
              }}
              icon={createServiceIcon(color, "origin")}
              position={servicioWithRoutes.origenCoords}
            >
              <Popup className="service-marker-popup">
                <div>
                  <div
                    className={`popup-header popup-${servicioWithRoutes.estado.toLowerCase().replace("_", "-")}`}
                  >
                    Origen - {getStatusText(servicioWithRoutes.estado)}
                  </div>
                  <div className="popup-content">
                    <div className="font-medium">
                      {servicioWithRoutes.origen_especifico}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ID: {servicioWithRoutes.id}
                    </div>

                    <div className="popup-divider" />

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="font-medium">Tipo de servicio</div>
                        <div>
                          {getServiceTypeText(servicioWithRoutes.tipo_servicio)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Fecha inicio</div>
                        <div>
                          {new Date(
                            servicioWithRoutes.fecha_inicio,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Marcador de destino */}
            <Marker
              eventHandlers={{
                click: () => handleServicioClick(servicioWithRoutes),
              }}
              icon={createServiceIcon(color, "destination")}
              position={servicioWithRoutes.destinoCoords}
            >
              <Popup className="service-marker-popup">
                <div>
                  <div
                    className={`popup-header popup-${servicioWithRoutes.estado.toLowerCase().replace("_", "-")}`}
                  >
                    Destino - {getStatusText(servicioWithRoutes.estado)}
                  </div>
                  <div className="popup-content">
                    <div className="font-medium">
                      {servicioWithRoutes.destino_especifico}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ID: {servicioWithRoutes.id}
                    </div>

                    <div className="popup-divider" />

                    <div className="text-sm">
                      <div>
                        <div className="font-medium">Distancia</div>
                        <div>{servicioWithRoutes.routeDistance} km</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Marcador del vehículo en tracking (solo si está en curso y hay datos de tracking) */}
            {servicioWithRoutes.estado === 'en curso' && vehicleTracking && vehicleTracking.position && (
              <Marker
                key={`vehicle-${vehicleTracking.id}`}
                position={[vehicleTracking.position.y, vehicleTracking.position.x]}
                icon={createVehicleIcon()}
                zIndexOffset={1000} // Para que el vehículo aparezca por encima de los otros marcadores
              >
                <Popup className="vehicle-marker-popup">
                  <div>
                    <h3 className="font-bold">{vehicleTracking.name}</h3>
                    <div className="mt-1">
                      <div>Velocidad: {vehicleTracking.position.s} km/h</div>
                      <div>Dirección: {vehicleTracking.position.c}°</div>
                      <div className="text-xs mt-1">
                        Actualizado: {vehicleTracking.lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

          </React.Fragment>

          {/* Mensaje de error de tracking (solo si está en curso y hay error) */}
          {servicioWithRoutes.estado === 'en curso' && trackingError && !vehicleTracking && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
              <span className="font-medium">Información:</span> {trackingError}
            </div>
          )}
        </MapContainer>
      </div>
    </div>
  );
}