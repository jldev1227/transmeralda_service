"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// export default function ServiceRouteMap() {

//   const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || '';

//   // Estados
//   const params = useParams();
//   const id = params.id as string; // aseveración de tipo

//   const { servicio, obtenerServicio } = useService();
//   const [loading, setLoading] = useState(true);
//   const [activeServicio, setActiveServicio] = useState<ServicioConRutas | null>(null);
//   const [servicioWithRoutes, setServicioWithRoutes] = useState<ServicioConRutas | null>(null);

//   // Estados para Wialon
//   const [token] = useState(WIALON_API_TOKEN);
//   const [sessionId, setSessionId] = useState("");
//   const [wialonVehicles, setWialonVehicles] = useState<WialonVehicle[]>([]);
//   const [vehicleTracking, setVehicleTracking] = useState<VehicleTracking | null>(null);
//   const [trackingError, setTrackingError] = useState("");
//   const [isLoadingWialon, setIsLoadingWialon] = useState(false);

//   // Función para llamar a la API de Wialon
//   const callWialonApi = useCallback(
//     async (sessionIdOrToken: string, service: string, params: any) => {
//       const isLoginCall = service === "token/login";
//       const payload = {
//         token: isLoginCall ? null : sessionIdOrToken,
//         service,
//         params,
//       };

//       if (isLoginCall) {
//         payload.params = { ...params, token: sessionIdOrToken };
//       }

//       try {
//         const response = await axios.post("/api/wialon-api", payload);
//         if (response.data && response.data.error) {
//           throw new Error(
//             `Error Wialon API (${response.data.error}): ${response.data.reason || service}`,
//           );
//         }
//         return response.data;
//       } catch (err) {
//         console.error(`Error llamando a ${service} via /api/wialon-api:`, err);
//         throw err;
//       }
//     },
//     [],
//   );

//   // Cargar el servicio cuando cambie el ID
//   useEffect(() => {
//       if (params.id) {
//       obtenerServicio(id);
//     }
//   }, [params.id, obtenerServicio]);

//   // Cargar datos del servicio y calcular ruta
//   useEffect(() => {
//     const fetchRouteGeometry = async () => {
//       setLoading(true);
//       if (!servicio) {
//         setLoading(false);
//         return;
//       }
//       const origenCoords: number[] = [Number(servicio.origen.latitud), Number(servicio.origen.longitud)];
//       const destinoCoords: number[] = [Number(servicio.destino.latitud), Number(servicio.destino.longitud)];

//       try {
//         // Intentar obtener la geometría real de la ruta desde OSRM
//         // Usando la IP local del servidor OSRM
//         const response = await fetch(
//           `https://router.project-osrm.org/route/v1/driving/${origenCoords[1]},${origenCoords[0]};${destinoCoords[1]},${destinoCoords[0]}?overview=full&geometries=geojson`
//         );

//         if (!response.ok) {
//           throw new Error("Error al obtener la ruta");
//         }

//         const data = await response.json();

//         if (
//           data.code !== "Ok" ||
//           !data.routes ||
//           data.routes.length === 0
//         ) {
//           throw new Error("No se encontró una ruta");
//         }

//         // Extraer la geometría de la ruta y convertirla al formato [lat, lng]
//         const route = data.routes[0];
//         const coordinates = route.geometry.coordinates.map((coord: LatLngCoord) => [
//           coord[1],
//           coord[0],
//         ]);

//         setServicioWithRoutes({
//           ...servicio,
//           origenCoords: [Number(servicio.origen.latitud), Number(servicio.origen.longitud)] as [number, number],
//           destinoCoords: [Number(servicio.destino.latitud), Number(servicio.destino.longitud)] as [number, number],
//           geometry: coordinates,
//           routeDistance: Math.round(route.distance / 100) / 10,
//           routeDuration: Math.round(route.duration / 60),
//         } as ServicioConRutas);
//       } catch (error) {
//         // Para errores generales de la función exterior
//         const generalError = error as Error;
//         console.error("Error al procesar el servicio:", generalError.message || 'Error desconocido');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (servicio) {
//       fetchRouteGeometry();
//     }
//   }, [id, servicio]);

//   // Inicializar y obtener datos de Wialon
//   useEffect(() => {
//     let isMounted = true;
//     setIsLoadingWialon(true);

//     const initWialon = async () => {
//       if (!token || !servicioWithRoutes || servicioWithRoutes?.estado !== 'en curso') {
//         setIsLoadingWialon(false);
//         return;
//       }

//       try {
//         // 1. Login a Wialon
//         const loginData = await callWialonApi(token, "token/login", {});
//         if (!loginData?.eid) {
//           throw new Error("Login fallido: No se obtuvo Session ID");
//         }

//         if (!isMounted) return;
//         const sid = loginData.eid;
//         setSessionId(sid);

//         // 2. Obtener lista de vehículos
//         const vehiclesData = await callWialonApi(
//           sid,
//           "core/search_items",
//           {
//             spec: {
//               itemsType: "avl_unit",
//               propName: "sys_name",
//               propValueMask: "*",
//               sortType: "sys_name",
//             },
//             force: 1,
//             flags: 1,
//             from: 0,
//             to: 1000,
//           },
//         );

//         if (!isMounted) return;

//         if (!vehiclesData?.items || !Array.isArray(vehiclesData.items)) {
//           throw new Error("No se pudieron obtener los vehículos");
//         }

//         const vehicles: WialonVehicle[] = vehiclesData.items;
//         setWialonVehicles(vehicles);

//         // 3. Buscar vehículo por placa
//         if (servicioWithRoutes?.vehiculo_id && servicioWithRoutes?.vehiculo?.placa) {
//           const placa = servicioWithRoutes?.vehiculo.placa;
//           const foundVehicle = vehicles.find(v =>
//             v.nm.includes(placa) ||
//             v.nm.toLowerCase() === placa.toLowerCase()
//           );

//           if (foundVehicle) {
//             // 4. Obtener posición del vehículo
//             const vehicleData = await callWialonApi(
//               sid,
//               "core/search_item",
//               {
//                 id: foundVehicle.id,
//                 flags: 1025
//               }
//             );

//             if (!isMounted) return;

//             if (vehicleData?.item?.pos) {
//               const { pos } = vehicleData.item;
//               setVehicleTracking({
//                 id: foundVehicle.id,
//                 name: foundVehicle.nm,
//                 position: pos,
//                 lastUpdate: new Date(pos.t * 1000)
//               });
//             } else {
//               setTrackingError("El vehículo no está transmitiendo su posición");
//             }
//           } else {
//             setTrackingError(`Vehículo con placa ${placa} no encontrado en la flota de wialon`);
//           }
//         } else {
//           setTrackingError("No hay información de placa del vehículo");
//         }
//       } catch (error) {
//         if (isMounted) {
//           console.error("Error en la integración con Wialon:", error);
//           setTrackingError(error instanceof Error ? error.message : "Error desconocido");
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoadingWialon(false);
//         }
//       }
//     };

//     if (servicioWithRoutes && servicioWithRoutes?.estado === 'en curso') {
//       initWialon();
//     } else {
//       setIsLoadingWialon(false);
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [token, callWialonApi, servicioWithRoutes]);

//   // Manejar clic en un servicio
//   const handleServicioClick = (servicioClickeado: ServicioConRutas | null) => {
//     if (!servicioClickeado && servicioWithRoutes) {
//       servicioClickeado = servicioWithRoutes;
//     }

//     if (!servicioClickeado) return;

//     setActiveServicio(
//       activeServicio && activeServicio.id === servicioClickeado.id
//         ? null
//         : servicioClickeado
//     );
//   };

//   // Si no hay servicio con rutas, mostrar pantalla de carga
//   if (!servicioWithRoutes && !loading) {
//     return (
//       <LoadingPage>
//         No se encontró información para este servicio
//       </LoadingPage>
//     );
//   }

//   // Mostrar pantalla de carga
//   if (loading) {
//     return (
//       <LoadingPage>
//         {params.id ? "Obteniendo servicio" : "Cargando servicio"}
//       </LoadingPage>
//     );
//   }

//   // Dentro de tu componente ServiceRouteMap, antes del return
//   let polylineOptions = {};

//   const color = getColorByState(servicioWithRoutes?.estado ?? '');
//   const isActive = activeServicio && activeServicio.id === servicioWithRoutes?.id;

//     polylineOptions = {
//       color: color,
//       weight: isActive ? 5 : 3,
//       opacity: isActive ? 0.9 : 0.7,
//       dashArray: servicioWithRoutes?.estado === 'planificado' ? '5, 10' : undefined
//     };

//   return (
//     <div className="max-w-7xl mx-auto mt-5 max-xl:px-6">
//       <div className="rounded-lg shadow-sm mb-4">
//         <h2 className="text-xl font-bold mb-2">Rutas de Servicios {servicio?.id}</h2>
//         <p className="text-gray-600 mb-4">
//           Visualización de servicios de transporte y mensajería
//         </p>

//         {/* Lista de servicios */}
//         <div className="servicios-list space-y-3 mb-4">
//           <div
//             key={servicioWithRoutes?.id}
//             className={`servicio-item p-3 border rounded-md cursor-pointer transition-all hover:shadow-md ${getClassByState(
//               servicioWithRoutes?.estado ?? ''
//             )} ${activeServicio && activeServicio.id === servicioWithRoutes?.id
//               ? "ring-2 ring-offset-2"
//               : ""
//               }`}
//             style={{
//               borderLeftWidth: "4px",
//               borderLeftColor: getColorByState(servicioWithRoutes?.estado ?? ''),
//             }}
//             onClick={() => handleServicioClick(servicioWithRoutes)}
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="font-medium">
//                   {servicioWithRoutes?.origen.nombre_municipio.split(" - ")[0]} →{" "}
//                   {servicioWithRoutes?.destino.nombre_municipio.split(" - ")[0]}
//                 </div>
//                 <div className="text-sm text-gray-600 mt-1">
//                   <span className="inline-block mr-3">
//                     <span className="font-medium">ID:</span> {servicioWithRoutes?.id}
//                   </span>
//                   <span className="inline-block mr-3">
//                     <span className="font-medium">Tipo:</span>{" "}
//                     {getServiceTypeText(servicioWithRoutes?.tipo_servicio ?? '')}
//                   </span>
//                   <span className="inline-block">
//                     <span className="font-medium">Distancia:</span>{" "}
//                     {servicioWithRoutes?.routeDistance} km
//                   </span>
//                 </div>
//               </div>
//               <span
//                 className={`estado-badge px-2 py-1 text-xs font-medium rounded-full ${servicioWithRoutes?.estado === "planificado"
//                   ? "bg-amber-100 text-amber-800"
//                   : servicioWithRoutes?.estado === "en curso"
//                     ? "bg-emerald-100 text-emerald-800"
//                     : "bg-blue-100 text-blue-800"
//                   }`}
//               >
//                 {getStatusText(servicioWithRoutes?.estado ?? '')}
//                 {servicioWithRoutes?.estado === "en curso" && vehicleTracking && (
//                   <span className="ml-1">• En vivo</span>
//                 )}
//               </span>
//             </div>

//             {/* Si el servicio está en curso y hay tracking, mostramos información adicional */}
//             {servicioWithRoutes?.estado === "en curso" && (
//               <div className="mt-2 text-xs">
//                 {isLoadingWialon ? (
//                   <span className="text-gray-500">Conectando con sistema de rastreo...</span>
//                 ) : vehicleTracking ? (
//                   <div className="bg-emerald-50 px-2 py-1 rounded text-emerald-700 flex items-center">
//                     <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
//                     <span>Rastreo en vivo: {vehicleTracking.name} • Última actualización: {vehicleTracking.lastUpdate.toLocaleTimeString()}</span>
//                   </div>
//                 ) : (
//                   <div className="bg-amber-50 px-2 py-1 rounded text-amber-700">
//                     {trackingError || "No se pudo establecer tracking en vivo"}
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeServicio && activeServicio.id === servicioWithRoutes?.id && (
//               <div className="servicio-details mt-3 pt-3 border-t border-gray-200">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Origen especifico
//                     </div>
//                     <div className="text-sm">
//                       {servicioWithRoutes?.origen_especifico}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Destino especifico
//                     </div>
//                     <div className="text-sm">
//                       {servicioWithRoutes?.destino_especifico}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Inicia
//                     </div>
//                     <div className="text-sm">
//                       {formatDate(servicioWithRoutes?.fecha_inicio)}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Finaliza
//                     </div>
//                     <div className="text-sm">
//                       {formatDate(servicioWithRoutes?.fecha_fin)}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Valor
//                     </div>
//                     <div className="text-sm font-medium">
//                       {formatCurrency(servicioWithRoutes?.valor)}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Tiempo estimado
//                     </div>
//                     <div className="text-sm">
//                       {servicioWithRoutes?.routeDuration
//                         ? `${servicioWithRoutes?.routeDuration} minutos`
//                         : "No disponible"}
//                     </div>
//                   </div>
//                 </div>
//                 {servicioWithRoutes?.observaciones && (
//                   <div className="mt-2">
//                     <div className="text-xs font-medium text-gray-500 mb-1">
//                       Observaciones
//                     </div>
//                     <div className="text-sm">{servicioWithRoutes?.observaciones}</div>
//                   </div>
//                 )}

//                 {/* Información del vehículo si está en tracking */}
//                 {vehicleTracking && (
//                   <div className="mt-3 pt-3 border-t border-gray-200">
//                     <div className="text-sm font-medium text-gray-700 mb-2">
//                       Datos del rastreo en vivo
//                     </div>
//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Vehículo: </span>
//                         {vehicleTracking.name}
//                       </div>
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Velocidad: </span>
//                         {vehicleTracking.position.s} km/h
//                       </div>
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Dirección: </span>
//                         {vehicleTracking.position.c}°
//                       </div>
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Actualizado: </span>
//                         {vehicleTracking.lastUpdate.toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div
//         className="map-container"
//         style={{
//           height: "600px",
//           width: "100%",
//           borderRadius: "8px",
//           overflow: "hidden",
//           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <style jsx global>{`
//           .service-marker-popup .leaflet-popup-content-wrapper {
//             border-radius: 8px;
//             padding: 0;
//             overflow: hidden;
//           }

//           .service-marker-popup .leaflet-popup-content {
//             margin: 0;
//             width: 250px !important;
//           }

//           .service-marker-popup .leaflet-popup-tip {
//             background: white;
//           }

//           .popup-header {
//             padding: 10px;
//             color: white;
//             font-weight: bold;
//           }

//           .popup-programado {
//             background: linear-gradient(135deg, #fbbf24, #f59e0b);
//           }

//           .popup-en-curso {
//             background: linear-gradient(135deg, #34d399, #10b981);
//           }

//           .popup-completado {
//             background: linear-gradient(135deg, #60a5fa, #3b82f6);
//           }

//           .popup-content {
//             padding: 10px;
//           }

//           .popup-divider {
//             height: 1px;
//             margin: 8px 0;
//             background-color: #e5e7eb;
//           }
          
//           .vehicle-marker-popup .leaflet-popup-content-wrapper {
//     border-radius: 8px;
//     padding: 0;
//     overflow: hidden;
//     background: linear-gradient(135deg, #10b981, #059669);
//     color: white;
//   }
  
//   .vehicle-marker-popup .leaflet-popup-content {
//     margin: 10px;
//     color: white;
//   }
  
//   .vehicle-marker-popup .leaflet-popup-tip {
//     background: #059669;
//   }

//   .vehicle-marker-popup .leaflet-popup-close-button {
//     color: white;
//   }
//         `}</style>

//         <MapContainer
//           center={[6.2442, -75.5812]} // Centro aproximado de Antioquia
//           style={{ height: "100%", width: "100%" }}
//           zoom={8}
//           zoomControl={true}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
//             url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
//           />

//           {/* Ajustar vista a la ruta */}
//           <RoutesController
//             activeRouteId={servicioWithRoutes?.id}
//             routes={servicioWithRoutes ? [servicioWithRoutes] : []}
//           />

//           <React.Fragment key={servicioWithRoutes?.id}>
//             {/* Polilínea de la ruta */}
//             {servicioWithRoutes?.geometry && (
//               <Polyline
//                 eventHandlers={{
//                   click: () => handleServicioClick(servicioWithRoutes),
//                 }}
//                 pathOptions={polylineOptions}
//                 positions={servicioWithRoutes?.geometry}
//               />
//             )}

//             {/* Marcador de origen */}
//             {servicioWithRoutes?.origenCoords && (
//               <Marker
//                 eventHandlers={{
//                   click: () => handleServicioClick(servicioWithRoutes),
//                 }}
//                 icon={createServiceIcon(color, "origin")}
//                 position={servicioWithRoutes?.origenCoords}
//               >
//                 <Popup className="service-marker-popup">
//                   <div>
//                     <div
//                       className={`popup-header popup-${servicioWithRoutes?.estado.toLowerCase().replace("_", "-")}`}
//                     >
//                       Origen - {getStatusText(servicioWithRoutes?.estado ?? '')}
//                     </div>
//                     <div className="popup-content">
//                       <div className="font-medium">
//                         {servicioWithRoutes?.origen_especifico}
//                       </div>
//                       <div className="text-sm text-gray-500 mt-1">
//                         ID: {servicioWithRoutes?.id}
//                       </div>

//                       <div className="popup-divider" />

//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         <div>
//                           <div className="font-medium">Tipo de servicio</div>
//                           <div>
//                             {getServiceTypeText(servicioWithRoutes?.tipo_servicio ?? '')}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="font-medium">Fecha inicio</div>
//                           <div>
//                             {new Date(
//                               servicioWithRoutes?.fecha_inicio,
//                             ).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//             )}

//             {/* Marcador de destino */}
//             {servicioWithRoutes?.destinoCoords && (
//               <Marker
//                 eventHandlers={{
//                   click: () => handleServicioClick(servicioWithRoutes),
//                 }}
//                 icon={createServiceIcon(color, "destination")}
//                 position={servicioWithRoutes?.destinoCoords}
//               >
//                 <Popup className="service-marker-popup">
//                   <div>
//                     <div
//                       className={`popup-header popup-${servicioWithRoutes?.estado.toLowerCase().replace("_", "-")}`}
//                     >
//                       Destino - {getStatusText(servicioWithRoutes?.estado ?? '')}
//                     </div>
//                     <div className="popup-content">
//                       <div className="font-medium">
//                         {servicioWithRoutes?.destino_especifico}
//                       </div>
//                       <div className="text-sm text-gray-500 mt-1">
//                         ID: {servicioWithRoutes?.id}
//                       </div>

//                       <div className="popup-divider" />

//                       <div className="text-sm">
//                         <div>
//                           <div className="font-medium">Distancia</div>
//                           <div>{servicioWithRoutes?.routeDistance} km</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//             )}


//             {/* Marcador del vehículo en tracking (solo si está en curso y hay datos de tracking) */}
//             {servicioWithRoutes?.estado === 'en curso' && vehicleTracking && vehicleTracking.position && (
//               <Marker
//                 key={`vehicle-${vehicleTracking.id}`}
//                 position={[vehicleTracking.position.y, vehicleTracking.position.x]}
//                 icon={createVehicleIcon()}
//                 zIndexOffset={1000} // Para que el vehículo aparezca por encima de los otros marcadores
//               >
//                 <Popup className="vehicle-marker-popup">
//                   <div>
//                     <h3 className="font-bold">{vehicleTracking.name}</h3>
//                     <div className="mt-1">
//                       <div>Velocidad: {vehicleTracking.position.s} km/h</div>
//                       <div>Dirección: {vehicleTracking.position.c}°</div>
//                       <div className="text-xs mt-1">
//                         Actualizado: {vehicleTracking.lastUpdate.toLocaleTimeString()}
//                       </div>
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//             )}

//           </React.Fragment>

//           {/* Mensaje de error de tracking (solo si está en curso y hay error) */}
//           {servicioWithRoutes?.estado === 'en curso' && trackingError && !vehicleTracking && (
//             <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
//               <span className="font-medium">Información:</span> {trackingError}
//             </div>
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// Componente de controlador de rutas
function RoutesController({ activeRouteId, routes }) {
    const map = useMap();
    
    useEffect(() => {
      if (routes.length > 0 && activeRouteId) {
        const activeRoute = routes.find(route => route.id === activeRouteId);
        if (activeRoute?.geometry && activeRoute.geometry.length > 0) {
          // Crear bounds a partir de la geometría
          const bounds = L.latLngBounds(activeRoute.geometry);
          
          // Añadir coordenadas de origen y destino si existen
          if (activeRoute.origenCoords) {
            bounds.extend(activeRoute.origenCoords);
          }
          if (activeRoute.destinoCoords) {
            bounds.extend(activeRoute.destinoCoords);
          }
          
          // Ajustar el mapa a los límites con un padding
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, [map, routes, activeRouteId]);
    
    return null;
  }
  

// Componente principal
const OptimizedMapComponent = ({ 
    servicioId, 
    servicioWithRoutes, 
    vehicleTracking, 
    trackingError,
    handleServicioClick,
    getStatusText,
    getServiceTypeText,
    createServiceIcon,
    createVehicleIcon 
  }) => {
    // Caché para servicios consultados
    const serviceCache = useRef(new Map());
    
    // Estado para controlar la visualización del mapa
    const [mapKey, setMapKey] = useState(`map-${servicioId}`);
    
    // Color para la polilínea basado en el estado
    const color = useMemo(() => {
      if (!servicioWithRoutes) return '#3388ff';
      
      switch(servicioWithRoutes.estado) {
        case 'completado': return '#4CAF50';
        case 'en_curso': case 'en curso': return '#2196F3';
        case 'pendiente': return '#FF9800';
        case 'cancelado': return '#F44336';
        default: return '#3388ff';
      }
    }, [servicioWithRoutes]);
    
    // Opciones de la polilínea
    const polylineOptions = useMemo(() => ({
      color,
      weight: 5,
      opacity: 0.7
    }), [color]);
    
    // Guardar el servicio en caché o forzar un nuevo renderizado
    useEffect(() => {
      if (servicioWithRoutes) {
        if (serviceCache.current.has(servicioWithRoutes.id)) {
          // Si ya existe en caché, no hacemos nada (usamos la referencia en caché)
        } else {
          // Si es nuevo, lo guardamos en caché
          serviceCache.current.set(servicioWithRoutes.id, servicioWithRoutes);
          // Forzamos un nuevo renderizado del mapa
          setMapKey(`map-${servicioWithRoutes.id}-${Date.now()}`);
        }
      }
    }, [servicioWithRoutes]);
    
    // Limitar el tamaño de la caché (opcional)
    useEffect(() => {
      const MAX_CACHE_SIZE = 5; // Número máximo de servicios en caché
      if (serviceCache.current.size > MAX_CACHE_SIZE) {
        // Eliminamos el elemento más antiguo
        const firstKey = serviceCache.current.keys().next().value;
        serviceCache.current.delete(firstKey);
      }
    }, [servicioWithRoutes]);
  
    if (!servicioWithRoutes) return null;
    
    return (
      <MapContainer
        key={mapKey}
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
          activeRouteId={servicioWithRoutes?.id}
          routes={servicioWithRoutes ? [servicioWithRoutes] : []}
        />
  
        <React.Fragment key={servicioWithRoutes?.id}>
          {/* Polilínea de la ruta */}
          {servicioWithRoutes?.geometry && (
            <Polyline
              eventHandlers={{
                click: () => handleServicioClick(servicioWithRoutes),
              }}
              pathOptions={polylineOptions}
              positions={servicioWithRoutes?.geometry}
            />
          )}
  
          {/* Marcador de origen */}
          {servicioWithRoutes?.origenCoords && (
            <Marker
              eventHandlers={{
                click: () => handleServicioClick(servicioWithRoutes),
              }}
              icon={createServiceIcon(color, "origin")}
              position={servicioWithRoutes?.origenCoords}
            >
              <Popup className="service-marker-popup">
                <div>
                  <div
                    className={`popup-header popup-${servicioWithRoutes?.estado.toLowerCase().replace("_", "-")}`}
                  >
                    Origen - {getStatusText(servicioWithRoutes?.estado ?? '')}
                  </div>
                  <div className="popup-content">
                    <div className="font-medium">
                      {servicioWithRoutes?.origen_especifico}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ID: {servicioWithRoutes?.id}
                    </div>
  
                    <div className="popup-divider" />
  
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="font-medium">Tipo de servicio</div>
                        <div>
                          {getServiceTypeText(servicioWithRoutes?.tipo_servicio ?? '')}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Fecha inicio</div>
                        <div>
                          {new Date(
                            servicioWithRoutes?.fecha_inicio,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
  
          {/* Marcador de destino */}
          {servicioWithRoutes?.destinoCoords && (
            <Marker
              eventHandlers={{
                click: () => handleServicioClick(servicioWithRoutes),
              }}
              icon={createServiceIcon(color, "destination")}
              position={servicioWithRoutes?.destinoCoords}
            >
              <Popup className="service-marker-popup">
                <div>
                  <div
                    className={`popup-header popup-${servicioWithRoutes?.estado.toLowerCase().replace("_", "-")}`}
                  >
                    Destino - {getStatusText(servicioWithRoutes?.estado ?? '')}
                  </div>
                  <div className="popup-content">
                    <div className="font-medium">
                      {servicioWithRoutes?.destino_especifico}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ID: {servicioWithRoutes?.id}
                    </div>
  
                    <div className="popup-divider" />
  
                    <div className="text-sm">
                      <div>
                        <div className="font-medium">Distancia</div>
                        <div>{servicioWithRoutes?.routeDistance} km</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
  
          {/* Marcador del vehículo en tracking (solo si está en curso y hay datos de tracking) */}
          {servicioWithRoutes?.estado === 'en curso' && vehicleTracking && vehicleTracking.position && (
            <Marker
              key={`vehicle-${vehicleTracking.id}-${Date.now()}`} // Añadimos timestamp para forzar actualización
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
        {servicioWithRoutes?.estado === 'en curso' && trackingError && !vehicleTracking && (
          <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
            <span className="font-medium">Información:</span> {trackingError}
          </div>
        )}
      </MapContainer>
    );
  };
  
  export default OptimizedMapComponent;