"use client";
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useService } from "@/context/serviceContext";
import { useParams } from "next/navigation";

// Componente para ajustar la vista del mapa según las rutas
function RoutesController({ routes, activeRouteId }) {
  const map = useMap();

  useEffect(() => {
    // Si hay una ruta activa específica, hacer zoom a esa ruta
    if (activeRouteId && routes.length > 0) {
      const route = routes.find((r) => r.id === activeRouteId);

      if (route && route.geometry && route.geometry.length > 0) {
        const bounds = L.latLngBounds(route.geometry);
        map.fitBounds(bounds, { padding: [50, 50] });
        return;
      }
    }

    // Si no hay ruta activa, mostrar todas las rutas
    if (routes.length > 0) {
      // Crear un límite que incluya todas las geometrías de rutas
      const allPoints = routes.flatMap((route) => route.geometry || []);

      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, routes, activeRouteId]);

  return null;
}

// Crear íconos personalizados para origen y destino basados en el estado
const createServiceIcon = (color, type) => {
  // Definir símbolo central según el tipo
  const innerSymbol =
    type === "origin"
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
    className: "",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
    html: svg,
  });
};


// Función para convertir estado a colores
const getColorByState = (state) => {
  switch (state) {
    case "planificado":
      return "#f59e0b"; // Amber-500
    case "en curso":
      return "#10b981"; // Emerald-500
    case "completado":
      return "#3b82f6"; // Blue-500 (primario)
    default:
      return "#6b7280"; // Gray-500
  }
};

// Función para obtener clase CSS basada en el estado
const getClassByState = (state) => {
  switch (state) {
    case "planificado":
      return "bg-amber-50 border-amber-200 text-amber-800";
    case "en curso":
      return "bg-emerald-50 border-emerald-200 text-emerald-800";
    case "completado":
      return "bg-blue-50 border-blue-200 text-blue-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

// Función para obtener texto de estado en español
const getStatusText = (state) => {
  switch (state) {
    case "planificado":
      return "Planificado";
    case "en curso":
      return "En curso";
    case "completado":
      return "Completado";
    case "solicitado":
      return "Solicitado";
    default:
      return state;
  }
};

// Función para obtener texto de tipo de servicio en formato legible
const getServiceTypeText = (type) => {
  switch (type) {
    case "MENSAJERÍA":
      return "Mensajería";
    case "TRANSPORTE_PERSONAL":
      return "Transporte de personal";
    default:
      return type;
  }
};

// Función para formatear fecha
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleDateString("es-CO", options);
};

export default function ServiceRouteMap() {
  const params = useParams();
  const { id } = params;
  const { servicio, obtenerServicio } = useService();
  const [loading, setLoading] = useState(true);
  const [activeServicio, setActiveServicio] = useState(null);
  const [servicioWithRoutes, setServicioWithRoutes] = useState(null);

  // First check if id exists, then ensure it's a string before using it
  if (!id) return null;

  // Handle the case where id could be an array
  const serviceId = Array.isArray(id) ? id[0] : id;
  
  useEffect(()=>{
    obtenerServicio(serviceId);
  }, [serviceId])

  // Cargar y preparar los datos de servicios
  useEffect(() => {

    if(!servicio) return
    const fetchRouteGeometry = async () => {
      setLoading(true);

      try {
        // Asegurarse de que tenemos el servicio
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

          console.log(`https://router.project-osrm.org/route/v1/driving/${origenCoords[1]},${origenCoords[0]};${destinoCoords[1]},${destinoCoords[0]}?overview=full&geometries=geojson`)

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
  }, [servicio]); // Agregada dependencia de servicio y obtenerServicio

  // Manejar clic en un servicio para activarlo
  const handleServicioClick = (servicioClickeado) => {
    if (!servicioClickeado && servicioWithRoutes) {
      // Si no se proporciona un servicio, usar el actual
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
    dashArray: servicioWithRoutes.estado === "planificado" ? "5, 10" : null,
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 max-xl:px-6">
      <div className="rounded-lg shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2">Rutas de Servicios</h2>
        <p className="text-gray-600 mb-4">
          Visualización de servicio de transporte
        </p>

        <div className="servicios-list space-y-3 mb-4">
          <div
            key={servicioWithRoutes.id}
            className={`servicio-item p-3 border rounded-md cursor-pointer transition-all hover:shadow-md ${getClassByState(
              servicioWithRoutes.estado
            )} ${
              activeServicio && activeServicio.id === servicioWithRoutes.id
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
                  {servicioWithRoutes.origen_especifico.split(" - ")[0]} →{" "}
                  {servicioWithRoutes.destino_especifico.split(" - ")[0]}
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
                className={`estado-badge px-2 py-1 text-xs font-medium rounded-full ${
                  servicioWithRoutes.estado === "planificado"
                    ? "bg-amber-100 text-amber-800"
                    : servicioWithRoutes.estado === "en curso"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {getStatusText(servicioWithRoutes.estado)}
              </span>
            </div>

            {activeServicio && activeServicio.id === servicioWithRoutes.id && (
              <div className="servicio-details mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Origen
                    </div>
                    <div className="text-sm">
                      {servicioWithRoutes.origen_especifico}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Destino
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

          .popup-planificado {
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
          </React.Fragment>
        </MapContainer>
      </div>
    </div>
  );
}