"use client"
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Componente para ajustar la vista del mapa según las rutas
function RoutesController({ routes, activeRouteId }) {
  const map = useMap();

  useEffect(() => {
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
  }, [map, routes, activeRouteId]);

  return null;
}

// Crear íconos personalizados para origen y destino basados en el estado
const createServiceIcon = (color, type) => {
  // Definir color de relleno según el tipo (origen/destino)
  const fillColor = type === 'origin' ? color : '#ffffff';
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

// Función para simular coordenadas desde códigos de municipio
// En una aplicación real, usarías una base de datos o API para obtener coordenadas reales
const getCoordinatesByMunicipioCode = (code) => {
  const municipioCoordinates = {
    // Antioquia
    '05001': [6.2442, -75.5812], // Medellín
    '05002': [5.7866, -75.4239], // Abejorral
    '05004': [6.6355, -76.0510], // Abriaquí
    '05021': [6.3739, -75.1380], // Alejandría
    '05030': [6.0336, -75.7038], // Amagá
    // Coordenadas de respaldo para códigos no encontrados
    'default': [6.2442, -75.5812]
  };

  return municipioCoordinates[code] || municipioCoordinates.default;
};

// Función para convertir estado a colores
const getColorByState = (state) => {
  switch (state) {
    case 'PROGRAMADO':
      return '#f59e0b'; // Amber-500
    case 'EN_CURSO':
      return '#10b981'; // Emerald-500
    case 'COMPLETADO':
      return '#3b82f6'; // Blue-500 (primario)
    default:
      return '#6b7280'; // Gray-500
  }
};

// Función para obtener un gradiente SVG basado en el estado
const getGradientByState = (state) => {
  switch (state) {
    case 'PROGRAMADO':
      return 'linear-gradient(to bottom, #fbbf24, #f59e0b)'; // Amber-400 to Amber-500
    case 'EN_CURSO':
      return 'linear-gradient(to bottom, #34d399, #10b981)'; // Emerald-400 to Emerald-500
    case 'COMPLETADO':
      return 'linear-gradient(to bottom, #60a5fa, #3b82f6)'; // Blue-400 to Blue-500
    default:
      return 'linear-gradient(to bottom, #9ca3af, #6b7280)'; // Gray-400 to Gray-500
  }
};

// Función para obtener clase CSS basada en el estado
const getClassByState = (state) => {
  switch (state) {
    case 'PROGRAMADO':
      return 'bg-amber-50 border-amber-200 text-amber-800';
    case 'EN_CURSO':
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
    case 'PROGRAMADO':
      return 'Programado';
    case 'EN_CURSO':
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
  // Datos de ejemplo de servicios
  const serviciosData = [
    {
      "id": "srv-1rfhmi2wq",
      "origen_id": "05001",
      "destino_id": "05021",
      "origen_especifico": "MEDELLÍN, ANTIOQUIA - Terminal de transporte",
      "destino_especifico": "ALEJANDRÍA, ANTIOQUIA - Parque empresarial",
      "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
      "vehiculo_id": 3,
      "cliente_id": 11,
      "estado": "EN_CURSO",
      "tipo_servicio": "TRANSPORTE_PERSONAL",
      "fecha_inicio": "2025-01-23T07:08:46.532Z",
      "fecha_fin": "2025-01-23T11:08:46.532Z",
      "distancia_km": 47,
      "valor": 3171705,
      "observaciones": null,
      "createdAt": "2025-04-12T22:13:28.890Z",
      "updatedAt": "2025-04-12T22:13:28.890Z"
    }
  ];

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeServicio, setActiveServicio] = useState(null);
  const [routeGeometries, setRouteGeometries] = useState([]);

  // Cargar y preparar los datos de servicios
  useEffect(() => {
    const fetchRouteGeometries = async () => {
      setLoading(true);

      try {
        // Procesar cada servicio para obtener geometrías de ruta
        const serviciosWithRoutes = await Promise.all(serviciosData.map(async (servicio) => {
          const origenCoords = getCoordinatesByMunicipioCode(servicio.origen_id);
          const destinoCoords = getCoordinatesByMunicipioCode(servicio.destino_id);

          try {
            // Intentar obtener la geometría real de la ruta desde OSRM
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${origenCoords[1]},${origenCoords[0]};${destinoCoords[1]},${destinoCoords[0]}?overview=full&geometries=geojson`
            );

            if (!response.ok) {
              throw new Error('Error al obtener la ruta');
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
              throw new Error('No se encontró una ruta');
            }

            // Extraer la geometría de la ruta y convertirla al formato [lat, lng]
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            return {
              ...servicio,
              origenCoords,
              destinoCoords,
              geometry: coordinates,
              routeDistance: (route.distance / 1000).toFixed(1),
              routeDuration: Math.round(route.duration / 60)
            };

          } catch (error) {
            console.warn('Error al obtener ruta detallada:', error.message);
            // Si hay un error, usar línea recta entre origen y destino
            return {
              ...servicio,
              origenCoords,
              destinoCoords,
              geometry: [origenCoords, destinoCoords],
              routeDistance: servicio.distancia_km,
              routeDuration: null
            };
          }
        }));

        setServicios(serviciosWithRoutes);
      } catch (error) {
        console.error('Error al procesar servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteGeometries();
  }, []);

  // Manejar clic en un servicio para activarlo
  const handleServicioClick = (servicio) => {
    setActiveServicio(activeServicio && activeServicio.id === servicio.id ? null : servicio);
  };

  return (
    <div className="max-w-7xl mx-auto mt-5">
      <div className="rounded-lg shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2">Rutas de Servicios</h2>
        <p className="text-gray-600 mb-4">Visualización de servicios de transporte y mensajería</p>

        {/* Lista de servicios */}
        <div className="servicios-list space-y-3 mb-4">
          {loading ? (
            <div className="loading-message p-4 text-center text-gray-500">
              Cargando servicios y calculando rutas...
            </div>
          ) : (
            servicios.map(servicio => (
              <div
                key={servicio.id}
                className={`servicio-item p-3 border rounded-md cursor-pointer transition-all hover:shadow-md ${getClassByState(servicio.estado)
                  } ${activeServicio && activeServicio.id === servicio.id ? 'ring-2 ring-offset-2' : ''
                  }`}
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: getColorByState(servicio.estado)
                }}
                onClick={() => handleServicioClick(servicio)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{servicio.origen_especifico.split(' - ')[0]} → {servicio.destino_especifico.split(' - ')[0]}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-block mr-3">
                        <span className="font-medium">ID:</span> {servicio.id}
                      </span>
                      <span className="inline-block mr-3">
                        <span className="font-medium">Tipo:</span> {getServiceTypeText(servicio.tipo_servicio)}
                      </span>
                      <span className="inline-block">
                        <span className="font-medium">Distancia:</span> {servicio.distancia_km} km
                      </span>
                    </div>
                  </div>
                  <span
                    className={`estado-badge px-2 py-1 text-xs font-medium rounded-full ${servicio.estado === 'PROGRAMADO' ? 'bg-amber-100 text-amber-800' :
                        servicio.estado === 'EN_CURSO' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {getStatusText(servicio.estado)}
                  </span>
                </div>

                {activeServicio && activeServicio.id === servicio.id && (
                  <div className="servicio-details mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Origen</div>
                        <div className="text-sm">{servicio.origen_especifico}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Destino</div>
                        <div className="text-sm">{servicio.destino_especifico}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Inicia</div>
                        <div className="text-sm">{formatDate(servicio.fecha_inicio)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Finaliza</div>
                        <div className="text-sm">{formatDate(servicio.fecha_fin)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Valor</div>
                        <div className="text-sm font-medium">{formatCurrency(servicio.valor)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Tiempo estimado</div>
                        <div className="text-sm">
                          {servicio.routeDuration ? `${servicio.routeDuration} minutos` : 'No disponible'}
                        </div>
                      </div>
                    </div>
                    {servicio.observaciones && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-500 mb-1">Observaciones</div>
                        <div className="text-sm">{servicio.observaciones}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      <div
        className="map-container"
        style={{
          height: '600px',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
        `}</style>

        <MapContainer
          center={[6.2442, -75.5812]} // Centro aproximado de Antioquia
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Ajustar vista a las rutas */}
          <RoutesController
            routes={servicios}
            activeRouteId={activeServicio ? activeServicio.id : null}
          />

          {/* Renderizar rutas y marcadores para cada servicio */}
          {servicios.map(servicio => {
            const color = getColorByState(servicio.estado);
            const isActive = activeServicio && activeServicio.id === servicio.id;

            // Opciones para la polilínea
            const polylineOptions = {
              color: color,
              weight: isActive ? 5 : 3,
              opacity: isActive ? 0.9 : 0.7,
              dashArray: servicio.estado === 'PROGRAMADO' ? '5, 10' : null
            };

            return (
              <React.Fragment key={servicio.id}>
                {/* Polilínea de la ruta */}
                {servicio.geometry && (
                  <Polyline
                    positions={servicio.geometry}
                    pathOptions={polylineOptions}
                    eventHandlers={{
                      click: () => handleServicioClick(servicio)
                    }}
                  />
                )}

                {/* Marcador de origen */}
                <Marker
                  position={servicio.origenCoords}
                  icon={createServiceIcon(color, 'origin')}
                  eventHandlers={{
                    click: () => handleServicioClick(servicio)
                  }}
                >
                  <Popup className="service-marker-popup">
                    <div>
                      <div className={`popup-header popup-${servicio.estado.toLowerCase().replace('_', '-')}`}>
                        Origen - {getStatusText(servicio.estado)}
                      </div>
                      <div className="popup-content">
                        <div className="font-medium">{servicio.origen_especifico}</div>
                        <div className="text-sm text-gray-500 mt-1">ID: {servicio.id}</div>

                        <div className="popup-divider"></div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="font-medium">Tipo de servicio</div>
                            <div>{getServiceTypeText(servicio.tipo_servicio)}</div>
                          </div>
                          <div>
                            <div className="font-medium">Fecha inicio</div>
                            <div>{new Date(servicio.fecha_inicio).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Marcador de destino */}
                <Marker
                  position={servicio.destinoCoords}
                  icon={createServiceIcon(color, 'destination')}
                  eventHandlers={{
                    click: () => handleServicioClick(servicio)
                  }}
                >
                  <Popup className="service-marker-popup">
                    <div>
                      <div className={`popup-header popup-${servicio.estado.toLowerCase().replace('_', '-')}`}>
                        Destino - {getStatusText(servicio.estado)}
                      </div>
                      <div className="popup-content">
                        <div className="font-medium">{servicio.destino_especifico}</div>
                        <div className="text-sm text-gray-500 mt-1">ID: {servicio.id}</div>

                        <div className="popup-divider"></div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="font-medium">Distancia</div>
                            <div>{servicio.distancia_km} km</div>
                          </div>
                          <div>
                            <div className="font-medium">Valor</div>
                            <div>{formatCurrency(servicio.valor)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}