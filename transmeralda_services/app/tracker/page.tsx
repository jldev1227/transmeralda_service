"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Import useMemo
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- INICIO: CÓDIGO SOLUCIÓN ICONOS (ASEGÚRATE DE TENER ESTO) ---
// (El código para arreglar los iconos por defecto se mantiene igual,
// aunque ahora usaremos uno personalizado, es bueno tenerlo por si acaso
// o para otros posibles marcadores)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});
// --- FIN: CÓDIGO SOLUCIÓN ICONOS ---


// --- Constantes FUERA del componente ---
const INITIAL_MAP_CENTER: L.LatLngTuple = [5.3377, -72.395]; // Yopal, Casanare
const INITIAL_MAP_ZOOM: number = 12;
const FOCUSED_MAP_ZOOM: number = 16; // Zoom al hacer clic en una tarjeta

// ¡REEMPLAZA ESTE TOKEN POR UNO VÁLIDO!
const WIALON_API_TOKEN = "00d90c3f86ef574df0f12b5f400c7a3338AD2C1B4EEC8F5BE68CD08DA79F27A88ED3B73F";

// --- Definición del Ícono Personalizado Pulsante (FUERA del componente) ---
const pulsingGreenIcon = L.divIcon({
    className: 'pulsing-green-marker', // Clase CSS para aplicar estilos y animación
    iconSize: [16, 16],       // Tamaño del área clickeable/central del icono
    iconAnchor: [8, 8],         // Punto del icono que corresponde a la coordenada (centro)
    popupAnchor: [0, -10]       // Dónde se ancla el popup relativo al iconAnchor
    // html: '<div></div>' // Opcional: puedes añadir HTML interno si lo necesitas
});


// --- Interface ---
interface WialonVehicle { // (Interfaz se mantiene igual)
    id: number;
    nm: string;
    cls?: number;
    pos?: {
        x: number; y: number; z?: number; s?: number; c?: number; t?: number;
    };
    lmsg?: any;
    detailsLoaded?: boolean;
    errorLoadingDetails?: string;
    simulatedState?: 'MOVING' | 'STOPPED';
}

// --- Componente Principal ---
const WialonVehicles = () => {
    const [token] = useState(WIALON_API_TOKEN);
    const [vehicles, setVehicles] = useState<WialonVehicle[]>([]);
    const [loading, setLoading] = useState({ initial: false, details: false });
    const [error, setError] = useState<string | null>(null);
    // Estado para guardar las coordenadas a las que volar
    const [flyToTarget, setFlyToTarget] = useState<{ coords: L.LatLngTuple, zoom: number } | null>(null);
    // Estado para resaltar la card activa
    const [activeVehicleId, setActiveVehicleId] = useState<number | null>(null);

    // --- Función API (Memoizada) ---
    const callWialonApi = useCallback(async (sessionIdOrToken: string, service: string, params: any) => {
        // ... (sin cambios)
        const isLoginCall = service === 'token/login';
        const payload = {
            token: isLoginCall ? null : sessionIdOrToken,
            service,
            params
        };
        if (isLoginCall) {
            payload.params = { ...params, token: sessionIdOrToken };
        }
        try {
            const response = await axios.post('/api/wialon-api', payload);
            if (response.data && response.data.error) {
                throw new Error(`Error Wialon API (${response.data.error}): ${response.data.reason || service}`);
            }
            return response.data;
        } catch (err) {
            console.error(`Error llamando a ${service} via /api/wialon-api:`, err);
            throw err;
        }
    }, []);

    // --- Efecto Principal ---
    useEffect(() => {
        // ... (lógica de fetch sin cambios internos, sigue usando flag 1025) ...
        let isMounted = true;
        const fetchInitialAndDetails = async () => {
            if (!isMounted) return;
            setLoading({ initial: true, details: false });
            setError(null);
            setVehicles([]);
            let sessionId: string | null = null;

            try {
                // 1. Login
                const loginData = await callWialonApi(token, 'token/login', {});
                if (!loginData?.eid) throw new Error('Login fallido: No se obtuvo Session ID (eid)');
                sessionId = loginData.eid;

                // 2. Lista Inicial
                const initialVehicleData = await callWialonApi(sessionId, 'core/search_items', {
                    spec: { itemsType: 'avl_unit', propName: 'sys_name', propValueMask: '*', sortType: 'sys_name' },
                    force: 1, flags: 1, from: 0, to: 1000
                });
                if (!initialVehicleData?.items || !Array.isArray(initialVehicleData.items) || initialVehicleData.items.length === 0) {
                    if (isMounted) setLoading({ initial: false, details: false }); return;
                }
                const initialVehicles: WialonVehicle[] = initialVehicleData.items.map((item: any) => ({
                    id: item.id, nm: item.nm, cls: item.cls, detailsLoaded: false,
                }));
                if (!isMounted) return;
                setVehicles(initialVehicles);
                setLoading({ initial: false, details: true });

                // 3. Detalles individuales
                const detailPromises = initialVehicles.map(vehicle =>
                    callWialonApi(sessionId!, 'core/search_item', { id: vehicle.id, flags: 1025 }) // Usando flag 1025
                        .then(itemData => ({ id: vehicle.id, status: 'fulfilled', data: itemData?.item }))
                        .catch(error => ({ id: vehicle.id, status: 'rejected', reason: error instanceof Error ? error.message : 'Error desconocido' }))
                );
                const detailResults = await Promise.all(detailPromises);
                if (!isMounted) return;

                // 4. Actualizar estado final
                setVehicles(prevVehicles => {
                    const updatedVehicles = prevVehicles.map(vehicle => {
                        const result = detailResults.find(r => r.id === vehicle.id);
                        if (result?.status === 'fulfilled' && result.data) {
                            const speed = result.data.pos?.s ?? -1;
                            const simulatedState = speed > 5 ? 'MOVING' : 'STOPPED';
                            return {
                                id: vehicle.id, nm: result.data.nm ?? vehicle.nm,
                                cls: result.data.cls ?? vehicle.cls, pos: result.data.pos,
                                lmsg: result.data.lmsg, detailsLoaded: true,
                                errorLoadingDetails: undefined, simulatedState
                            };
                        } else if (result?.status === 'rejected') {
                            return { ...vehicle, detailsLoaded: false, errorLoadingDetails: result.reason };
                        }
                        return vehicle;
                    });
                    return updatedVehicles;
                });

            } catch (err: any) {
                if (isMounted) setError(err.message ?? 'Error desconocido');
            } finally {
                if (isMounted) setLoading({ initial: false, details: false });
            }
        };
        if (token) { fetchInitialAndDetails(); } else { setError("Token de Wialon no configurado."); }
        return () => { isMounted = false; };
    }, [token, callWialonApi]);

    // --- Componente Controlador de Vista ---
    function MapViewController({ vehicles, flyToTarget }: {
        vehicles: WialonVehicle[];
        flyToTarget: { coords: L.LatLngTuple, zoom: number } | null;
    }) {
        const map = useMap();

        // Efecto para ajustar límites generales
        useEffect(() => {
            // Solo ajustar límites si NO hay un flyTo activo
            if (!flyToTarget) {
                const vehiclesWithPos = vehicles.filter(v => v.pos?.y && v.pos?.x);
                if (vehiclesWithPos.length > 0) {
                    const bounds = L.latLngBounds(vehiclesWithPos.map(v => [v.pos!.y, v.pos!.x]));
                    if (bounds.isValid()) {
                        console.log("Ajustando límites generales:", bounds);
                        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true }); // Animar fitBounds también
                    } else {
                        map.setView(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM, { animate: true });
                    }
                } else if (!loading.initial && !loading.details) {
                    map.setView(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM, { animate: true });
                }
            }
         // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [map, vehicles, flyToTarget]); // Depende de flyToTarget para NO ejecutarse si estamos volando

        // Efecto para manejar el "flyTo"
        useEffect(() => {
            if (flyToTarget) {
                console.log("Volando a:", flyToTarget.coords, "Zoom:", flyToTarget.zoom);
                map.flyTo(flyToTarget.coords, flyToTarget.zoom, {
                    duration: 1.5 // Duración de la animación en segundos
                });
                // Opcional: resetear flyToTarget después de la animación para permitir re-ajuste de bounds
                // const timer = setTimeout(() => setFlyToTarget(null), 1600); // un poco más que la duración
                // return () => clearTimeout(timer);
            }
        }, [map, flyToTarget]); // Depende solo de flyToTarget

        return null;
    }


      // --- Funciones de ayuda para el Popup y Tarjetas ---
      const getStatusColor = (state?: 'MOVING' | 'STOPPED'): string => {
        return state === 'MOVING' ? '#10B981' : '#3B82F6'; // Verde / Azul
    };

    // --- Funciones de ayuda para el Popup ---
    const getPopupHeaderClass = (state?: 'MOVING' | 'STOPPED'): string => {
        // ... (sin cambios) ...
        return state === 'MOVING' ? 'popup-en-curso' : 'popup-completado';
    };
    const getSimulatedStatusText = (state?: 'MOVING' | 'STOPPED'): string => {
        // ... (sin cambios) ...
        return state === 'MOVING' ? 'En Movimiento' : 'Detenido';
    };

    // --- Manejador de Clic en Tarjeta ---
    const handleVehicleCardClick = (vehicle: WialonVehicle) => {
        if (vehicle.pos?.y && vehicle.pos?.x) {
            // Establecer las coordenadas y el zoom para flyTo
            setFlyToTarget({ coords: [vehicle.pos.y, vehicle.pos.x], zoom: FOCUSED_MAP_ZOOM });
            // Resaltar la card activa
            setActiveVehicleId(vehicle.id);
            // Opcional: Abrir el popup del marcador correspondiente
             const marker = document.querySelector(`.leaflet-marker-icon[data-vehicle-id="${vehicle.id}"]`);
             if (marker instanceof HTMLElement && (marker as any)._leaflet_pos) { // Verificar si es un marcador leaflet
                // Esta es una forma un poco hacky de encontrar y abrir el popup
                // Una mejor forma sería mantener una referencia a los marcadores si es necesario
                // o usar un estado global si la complejidad aumenta.
                 // mapRef.current?.openPopup([vehicle.pos.y, vehicle.pos.x]); // Necesitaría ref al mapa
             }

        } else {
            console.warn(`Vehículo ${vehicle.nm} no tiene posición para redirigir.`);
            // Quizás mostrar un mensaje al usuario
            setActiveVehicleId(vehicle.id); // Resaltar aunque no tenga posición
            setFlyToTarget(null); // Asegurarse de no volar a ningún sitio
        }
    };

    // --- Renderizado ---
    const isLoading = loading.initial || loading.details;
    const vehiclesWithPosition = vehicles.filter(v => v.pos?.y && v.pos?.x && v.detailsLoaded);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', padding: '15px', gap: '15px', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center', margin: 0, color: '#374151' }}>Mapa de Vehículos Wialon (Yopal)</h1>
            {isLoading && "Cargando..."}
            {error && <div style={{ color: 'red' }} className="error-message p-2 border rounded bg-red-50 border-red-200 text-center">⚠️ Error: {error}</div>}


            <div style={{
                display: 'flex',
                overflowX: 'auto', // Permitir scroll horizontal
                gap: '10px',        // Espacio entre tarjetas
                padding: '5px 0'    // Padding vertical ligero
            }}>
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        onClick={() => handleVehicleCardClick(vehicle)}
                        style={{
                            flex: '0 0 auto', // Evitar que las tarjetas se encojan
                            width: '200px',   // Ancho fijo para las tarjetas
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '10px',
                            cursor: vehicle.pos ? 'pointer' : 'default', // Cursor solo si tiene posición
                            backgroundColor: activeVehicleId === vehicle.id ? '#eff6ff' : 'white', // Resaltar si está activa
                            borderLeft: `4px solid ${vehicle.pos ? getStatusColor(vehicle.simulatedState) : '#d1d5db'}`, // Color según estado o gris si no hay pos
                            transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            opacity: vehicle.pos ? 1 : 0.6, // Atenuar si no tiene posición
                            boxShadow: activeVehicleId === vehicle.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        }}
                        className="vehicle-card hover:shadow-md" // Clase para posible estilo hover global
                    >
                        <div style={{ fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                            {vehicle.nm || 'Nombre no disponible'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4b5563' }}>
                            {vehicle.pos ? (
                                <>
                                    <div>Estado: {getSimulatedStatusText(vehicle.simulatedState)}</div>
                                    <div>Vel: {typeof vehicle.pos.s === 'number' ? `${vehicle.pos.s} km/h` : 'N/D'}</div>
                                    {/* <div>Act: {vehicle.pos.t ? new Date(vehicle.pos.t * 1000).toLocaleTimeString('es-CO') : 'N/D'}</div> */}
                                </>
                            ) : (
                                <div style={{ fontStyle: 'italic' }}>Sin posición</div>
                            )}
                            {vehicle.errorLoadingDetails && <div style={{ color: 'orange', marginTop: '4px' }}>Error detalles</div>}
                        </div>
                    </div>
                ))}
            </div>


            <div
                className="map-container"
                style={{ /* ... (estilos del contenedor sin cambios) ... */
                    flexGrow: 1, width: '100%', borderRadius: '8px',
                    overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb', position: 'relative'
                }}
            >
                {/* Estilos globales: Añadir estilos para el marcador pulsante */}
                <style jsx global>{`
                    /* ... (estilos del popup se mantienen igual) ... */
                     .vehicle-marker-popup .leaflet-popup-content-wrapper { border-radius: 8px; padding: 0; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                     .vehicle-marker-popup .leaflet-popup-content { margin: 0; width: 260px !important; font-size: 13px; }
                     .vehicle-marker-popup .leaflet-popup-tip { background: white; }
                     .popup-header { padding: 10px 12px; color: white; font-weight: 600; font-size: 14px; border-bottom: 1px solid rgba(0, 0, 0, 0.1); }
                     .popup-en-curso { background: linear-gradient(135deg, #34d399, #10b981); }
                     .popup-completado { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
                     .popup-content { padding: 12px; line-height: 1.5; }
                     .popup-divider { height: 1px; margin: 8px 0; background-color: #e5e7eb; }
                     .popup-label { font-size: 11px; color: #6b7280; margin-bottom: 2px; text-transform: uppercase; }

                    /* --- Estilos para el Marcador Pulsante Verde --- */
                    @keyframes pulse-animation {
                        0% {
                            transform: scale(0.8);
                            opacity: 0.6;
                        }
                        70% {
                            transform: scale(2.5); /* Expande más */
                            opacity: 0;
                        }
                        100% {
                            transform: scale(2.5);
                            opacity: 0;
                        }
                    }

                    .pulsing-green-marker {
                        background-color: #10B981; /* Verde esmeralda (puedes ajustarlo) */
                        width: 16px;           /* Tamaño del círculo central */
                        height: 16px;
                        border-radius: 50%;
                        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4); /* Pequeño borde difuminado */
                        position: relative;     /* Necesario para posicionar pseudo-elementos */
                        cursor: pointer;
                    }

                    /* Pseudo-elementos para las ondas expansivas */
                    .pulsing-green-marker::before,
                    .pulsing-green-marker::after {
                        content: '';
                        position: absolute;
                        left: 0%;
                        top: 0%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background-color: transparent;
                        /* Borde que se expande */
                        border: 2px solid rgba(16, 185, 129, 0.7); /* Verde con transparencia */
                        /* Animación */
                        animation: pulse-animation 1.2s infinite ease-out; /* Duración ajustada */
                        box-sizing: border-box;
                    }

                    /* Retraso para la segunda onda */
                    .pulsing-green-marker::after {
                        animation-delay: 0.6s; /* La mitad de la duración para efecto continuo */
                    }

                `}</style>

                <MapContainer
                    center={INITIAL_MAP_CENTER}
                    zoom={INITIAL_MAP_ZOOM}
                    style={{ height: '100%', width: '100%', background: '#f9fafb' }}
                    scrollWheelZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
 
                    <MapViewController vehicles={vehicles} flyToTarget={flyToTarget} />

                    {vehiclesWithPosition.map((vehicle) => (
                        <Marker
                            key={vehicle.id}
                            position={[vehicle.pos!.y, vehicle.pos!.x]}
                            // *** Usar el ícono personalizado aquí ***
                            icon={pulsingGreenIcon}
                        >
                            <Popup className="vehicle-marker-popup">
                                {/* ... (Contenido del Popup igual que antes) ... */}
                                <div>
                                    <div className={`popup-header ${getPopupHeaderClass(vehicle.simulatedState)}`}>
                                        {vehicle.nm || 'N/D'}
                                    </div>
                                    <div className="popup-content">
                                        <div className="popup-label">Última Ubicación</div>
                                        <div>Lat: {vehicle.pos!.y.toFixed(5)}, Lng: {vehicle.pos!.x.toFixed(5)}</div>
                                        <div className="popup-divider"></div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <div><div className="popup-label">Velocidad</div><div>{typeof vehicle.pos!.s === 'number' ? `${vehicle.pos.s} km/h` : 'N/D'}</div></div>
                                            <div><div className="popup-label">Estado</div><div>{getSimulatedStatusText(vehicle.simulatedState)}</div></div>
                                        </div>
                                        {vehicle.pos!.t && (<> <div className="popup-divider"></div> <div className="popup-label">Última Actualización</div> <div>{new Date(vehicle.pos!.t * 1000).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' })}</div> </>)}
                                        {vehicle.errorLoadingDetails && (<> <div className="popup-divider"></div> <div style={{ color: 'orange', fontSize: '12px' }}>(Error: {vehicle.errorLoadingDetails})</div> </>)}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            <div style={{ fontSize: '0.8em', marginTop: '5px', color: '#6b7280', textAlign: 'center' }}>
                Mostrando {vehiclesWithPosition.length} de {vehicles.length} vehículos con posición. {isLoading && " Actualizando..."}
            </div>
        </div >
    );
};

export default WialonVehicles;