"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Servicio, VehicleTracking } from '@/context/serviceContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface OptimizedMapComponentProps {
  servicioId: string;
  servicioWithRoutes: Servicio;
  vehicleTracking: VehicleTracking;
  trackingError: string;
  handleServicioClick: (servicio: Servicio) => void;
  getStatusText: (status: string) => string;
  getServiceTypeText: (text: string) => string;
  mapboxToken: string;
}

const OptimizedMapComponent = ({
  servicioId,
  servicioWithRoutes,
  vehicleTracking,
  trackingError,
  handleServicioClick,
  getStatusText,
  getServiceTypeText,
  mapboxToken
}: OptimizedMapComponentProps) => {
  // Referencias para el div del mapa y la instancia del mapa
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{
    origen?: mapboxgl.Marker;
    destino?: mapboxgl.Marker;
    vehicle?: mapboxgl.Marker;
  }>({});

  // Estado para seguimiento de carga del mapa
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>('');

  // Caché para servicios consultados
  const serviceCache = useRef(new Map());

  // Color para la polilínea basado en el estado
  const color = useMemo(() => {
    if (!servicioWithRoutes) return '#3388ff';

    switch (servicioWithRoutes.estado) {
      case 'completado': return '#4CAF50';
      case 'en curso': return '#2BA662';
      case 'planificado': return '#FF9800';
      case 'cancelado': return '#F44336';
      default: return '#3388ff';
    }
  }, [servicioWithRoutes]);

  // Guardar el servicio en caché
  useEffect(() => {
    if (servicioWithRoutes) {
      console.log(servicioWithRoutes)
      if (!serviceCache.current.has(servicioWithRoutes.id)) {
        serviceCache.current.set(servicioWithRoutes.id, servicioWithRoutes);
      }
    }
  }, [servicioWithRoutes]);

  // Limitar el tamaño de la caché (opcional)
  useEffect(() => {
    const MAX_CACHE_SIZE = 1; // Número máximo de servicios en caché
    if (serviceCache.current.size > MAX_CACHE_SIZE) {
      // Eliminamos el elemento más antiguo
      const firstKey = serviceCache.current.keys().next().value;
      serviceCache.current.delete(firstKey);
    }
  }, [servicioWithRoutes]);

  // Configurar token de Mapbox
  useEffect(() => {
    if (!mapboxToken) {
      setMapError("Token de Mapbox no configurado");
      return;
    }

    mapboxgl.accessToken = mapboxToken;
  }, [mapboxToken]);

  // Determinar el centro inicial del mapa
  const getInitialCenter = useCallback(() => {
    // Si hay coordenadas de origen, centrar en el origen
    if (servicioWithRoutes?.origenCoords) {
      return [servicioWithRoutes.origenCoords[1], servicioWithRoutes.origenCoords[0]]; // [lng, lat]
    }
    
    // Por defecto, centro aproximado de Antioquia
    return [-75.5812, 6.2442];
  }, [vehicleTracking, servicioWithRoutes]);

  // Inicializar el mapa
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    try {
      const initialCenter = getInitialCenter();
      
      // Crear nueva instancia del mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Cambia esto por otro estilo
        center: initialCenter, // Centro basado en vehículo u origen
        zoom: 12 // Un poco más de zoom para ver mejor el vehículo/origen
      });

      // Añadir controles al mapa
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Marcar como cargado cuando el mapa esté listo
      map.current.on('load', () => {
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


  // Función para crear popups para los marcadores
  const createPopupHTML = (type: 'origen' | 'destino') => {
    if (!servicioWithRoutes) return '';

    const isOrigin = type === 'origen';

    return `
      <div class="marker-popup">
        <div class="popup-header popup-${servicioWithRoutes.estado.toLowerCase().replace(" ", "-")}">
          ${isOrigin ? 'Origen' : 'Destino'} - ${getStatusText(servicioWithRoutes.estado || '')}
        </div>
        <div class="popup-content">
          <div class="font-medium">
            ${isOrigin ? servicioWithRoutes.origen_especifico || '' : servicioWithRoutes.destino_especifico || ''}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            ID: ${servicioWithRoutes.id}
          </div>

          <div class="popup-divider"></div>

          ${isOrigin ?
        `<div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div class="font-medium">Tipo de servicio</div>
                <div>${getServiceTypeText(servicioWithRoutes.tipo_servicio || '')}</div>
              </div>
              <div>
                <div class="font-medium">Fecha inicio</div>
                <div>${new Date(servicioWithRoutes.fecha_inicio).toLocaleDateString()}</div>
              </div>
            </div>`
        :
        `<div class="text-sm">
              <div>
                <div class="font-medium">Distancia</div>
                <div>${servicioWithRoutes.routeDistance} km</div>
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
    type: 'origen' | 'destino',
    popupContent: string
  ) => {
    if (!map.current) return null;

    // Crear elemento para el marcador personalizado
    const el = document.createElement('div');
    el.className = `custom-marker marker-${type}`;
    el.style.backgroundColor = color;
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = 'white';
    el.style.fontWeight = 'bold';
    el.innerText = type === 'origen' ? 'A' : 'B';

    // Crear popup para el marcador
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

    // Crear marcador y añadirlo al mapa
    const marker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);

    // Añadir evento de click
    el.addEventListener('click', () => {
      handleServicioClick(servicioWithRoutes);
    });

    return marker;
  };

  // Función para crear marcador de vehículo
  const createVehicleMarker = (lngLat: [number, number]) => {
    if (!map.current || !vehicleTracking) return null;

    // Crear elemento para el marcador de vehículo
    const el = document.createElement('div');
    el.className = 'vehicle-marker';
    el.style.width = '38px';
    el.style.height = '38px';
    el.style.backgroundImage = "url('/assets/marker.png')";
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid #ffffff';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    // Crear contenido del popup
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

    // Crear popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

    // Crear marcador y añadirlo al mapa
    return new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);
  };

  // Actualizar mapa cuando cambien los datos
  useEffect(() => {
    if (!isMapLoaded || !map.current || !servicioWithRoutes) return;

    // Limpiar marcadores existentes
    if (markersRef.current.origen) {
      markersRef.current.origen.remove();
      markersRef.current.origen = undefined;
    }

    if (markersRef.current.destino) {
      markersRef.current.destino.remove();
      markersRef.current.destino = undefined;
    }

    // Limpiar capa de ruta existente si existe
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    
    // Determinar si debemos mostrar ruta completa o solo desde vehículo al destino
    const isVehicleActive = servicioWithRoutes.estado === 'en curso' && vehicleTracking && vehicleTracking.position;
    

    if (servicioWithRoutes.geometry && servicioWithRoutes.geometry.length > 0) {
      let coordinates;
      
      if (isVehicleActive) {
        // Si el servicio está en curso y hay vehículo, mostrar ruta desde vehículo hasta destino
        const vehiclePosition = [vehicleTracking.position.x, vehicleTracking.position.y]; // [lng, lat]
        const destinoPosition = [servicioWithRoutes.destinoCoords[1], servicioWithRoutes.destinoCoords[0]]; // [lng, lat]
        
        // Usamos la API de Directions de Mapbox para obtener la ruta desde el vehículo hasta el destino
        // Esto se podría optimizar con un hook useEffect separado que reaccione a cambios en la posición
        // del vehículo, pero por simplicidad lo dejamos integrado aquí
        fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${vehiclePosition[0]},${vehiclePosition[1]};${destinoPosition[0]},${destinoPosition[1]}?geometries=geojson&access_token=${mapboxToken}`)
          .then(response => response.json())
          .then(data => {
            if (data.routes && data.routes.length > 0) {
              // Si la solicitud tiene éxito, usamos la ruta devuelta
              coordinates = data.routes[0].geometry.coordinates;
              
              // Añadir la ruta al mapa
              addRouteToMap(coordinates);
              
              // Ajustar el mapa a los límites de la ruta
              const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
              }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
              
              map.current.fitBounds(bounds, {
                padding: 50,
                maxZoom: 15
              });
            }
          })
          .catch(error => {
            console.error("Error al obtener ruta desde vehículo:", error);
            // En caso de error, usamos una línea recta desde el vehículo hasta el destino
            coordinates = [vehiclePosition, destinoPosition];
            addRouteToMap(coordinates);
          });
      } else {
        // Si no hay vehículo activo o el servicio no está en curso, mostrar ruta completa original
        coordinates = servicioWithRoutes.geometry.map(coord => [coord[1], coord[0]]); // Convertir a [lng, lat]
        addRouteToMap(coordinates);
        
        // Ajustar el mapa a los límites de la ruta
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
      
      // Crear marcadores para origen y destino
      if (servicioWithRoutes.origenCoords) {
        const lngLat: [number, number] = [servicioWithRoutes.origenCoords[1], servicioWithRoutes.origenCoords[0]];
        markersRef.current.origen = createMarker(lngLat, 'origen', createPopupHTML('origen'));
      }

      if (servicioWithRoutes.destinoCoords) {
        const lngLat: [number, number] = [servicioWithRoutes.destinoCoords[1], servicioWithRoutes.destinoCoords[0]];
        markersRef.current.destino = createMarker(lngLat, 'destino', createPopupHTML('destino'));
      }
    }
  }, [servicioWithRoutes, isMapLoaded, color, handleServicioClick, getStatusText, getServiceTypeText, vehicleTracking, mapboxToken]);


   // Función auxiliar para añadir una ruta al mapa
   const addRouteToMap = (coordinates) => {
    if (!map.current) return;
    
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': 5,
        'line-opacity': 0.7
      }
    });

    // Añadir evento click a la ruta
    map.current.on('click', 'route', () => {
      handleServicioClick(servicioWithRoutes);
    });
  };

  // Actualizar marcador del vehículo y centrar el mapa si es necesario
  useEffect(() => {
    if (!isMapLoaded || !map.current ||
      servicioWithRoutes?.estado !== 'en curso' ||
      !vehicleTracking || !vehicleTracking.position) {
      return;
    }

    // Limpiar marcador de vehículo existente
    if (markersRef.current.vehicle) {
      markersRef.current.vehicle.remove();
      markersRef.current.vehicle = undefined;
    }

    // Crear nuevo marcador de vehículo
    const lngLat: [number, number] = [vehicleTracking.position.x, vehicleTracking.position.y];
    markersRef.current.vehicle = createVehicleMarker(lngLat);
  
  }, [vehicleTracking, servicioWithRoutes, isMapLoaded]);

  if (!servicioWithRoutes) {
    return <div className="h-full w-full flex items-center justify-center">No hay datos del servicio</div>;
  }

  return (
    <div className="h-full w-full relative">
      {mapError && (
        <div className="absolute top-2 left-2 right-2 z-[1000] bg-red-100 text-red-800 text-sm p-2 rounded-md shadow">
          <span className="font-medium">Error:</span> {mapError}
        </div>
      )}

      <div
        ref={mapContainer}
        className="h-full w-full"
      >
        {!isMapLoaded && (
          <div className="h-full w-full flex items-center justify-center">
            Cargando mapa...
          </div>
        )}
      </div>

      {/* Mensaje de error de tracking (solo si está en curso y hay error) */}
      {servicioWithRoutes?.estado === 'en curso' && trackingError && !vehicleTracking && (
        <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
          <span className="font-medium">Información:</span> {trackingError}
        </div>
      )}

      {/* Estilos adicionales para los popups */}
      <style jsx global>{`
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
        
        .popup-completado { background-color: #4CAF50; }
        .popup-en-curso { background-color: #2BA662; }
        .popup-planificado { background-color: #FF9800; }
        .popup-cancelado { background-color: #F44336; }
        
        .vehicle-popup {
          padding: 8px;
        }

        .mapboxgl-popup-content {
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default OptimizedMapComponent;