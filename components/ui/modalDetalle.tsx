import React, { useCallback, useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalBody,
} from "@heroui/modal";

import {
    ServicioConRelaciones,
    VehicleTracking,
} from "@/context/serviceContext";
import EnhancedMapComponent from "../enhancedMapComponent";
import { getStatusColor, getStatusText } from "@/utils/indext";
import Image from "next/image";
import { LatLngExpression, LatLngTuple } from "leaflet";
import axios from "axios";

interface ModalDetalleConductorProps {
    isOpen: boolean;
    onClose: () => void;
    servicio: ServicioConRelaciones | null;
    onEdit?: () => void;
}

interface MapboxRoute {
    distance: number;
    duration: number;
    geometry: {
        coordinates: number[][];
    };
}

const ModalDetalleServicio: React.FC<ModalDetalleConductorProps> = ({
    isOpen,
    onClose,
    servicio,
    onEdit,
}) => {
    if (!servicio) return null;

    const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";
    const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";


    const [servicioWithRoutes, setServicioWithRoutes] =
        useState<ServicioConRelaciones | null>(null);
    const [vehicleTracking, setVehicleTracking] =
        useState<VehicleTracking | null>(null);
    const [isLoadingWialon, setIsLoadingWialon] = useState(false);
    const [trackingError, setTrackingError] = useState<string>("");


    // Wialon API call function
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

    // Fetch route geometry using Mapbox API
    const fetchRouteGeometry = useCallback(
        async (servicio: ServicioConRelaciones) => {
            if (!servicio || !MAPBOX_ACCESS_TOKEN) {
                return null;
            }

            try {
                // For 'en_curso' services, try to get the vehicle position from Wialon first
                let origenLat = servicio.origen_latitud;
                let origenLng = servicio.origen_longitud;
                let useVehiclePosition = false;

                if (
                    servicio.estado === "en_curso" &&
                    servicio.vehiculo?.placa &&
                    WIALON_API_TOKEN
                ) {
                    try {
                        setTrackingError("");
                        setIsLoadingWialon(true);

                        // Login to Wialon to get session ID
                        const loginData = await callWialonApi(WIALON_API_TOKEN, "token/login", {});

                        if (loginData?.eid) {
                            const sessionId = loginData.eid;

                            // Search for the vehicle by plate number
                            const vehiclesData = await callWialonApi(
                                sessionId,
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

                            if (vehiclesData?.items) {
                                // Find the vehicle with matching plate number
                                const vehicleData = vehiclesData.items.find(
                                    (v: any) =>
                                        v.nm.includes(servicio.vehiculo.placa) ||
                                        v.nm.toLowerCase() ===
                                        servicio.vehiculo.placa.toLowerCase(),
                                );

                                // If vehicle found and has position data
                                if (vehicleData?.pos) {
                                    // Update origin coordinates to vehicle's current position
                                    origenLat = vehicleData.pos.y;
                                    origenLng = vehicleData.pos.x;
                                    useVehiclePosition = true;

                                    // Create vehicle tracking object for the map component
                                    const trackingData: VehicleTracking = {
                                        id: vehicleData.id,
                                        name: vehicleData.nm,
                                        flags: vehicleData.flags || 0,
                                        position: vehicleData.pos,
                                        lastUpdate: new Date(),
                                        item: vehicleData,
                                    };

                                    console.log(trackingData)

                                    setVehicleTracking(trackingData);
                                } else {
                                    setTrackingError(
                                        "No se encontró la posición actual del vehículo",
                                    );
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error al obtener posición del vehículo:", error);
                        setTrackingError("Error al obtener información del vehículo");
                    } finally {
                        setIsLoadingWialon(false);
                    }
                }

                // Ensure coordinates exist and are valid
                if (
                    !origenLat ||
                    !origenLng ||
                    !servicio.destino_latitud ||
                    !servicio.destino_longitud
                ) {
                    throw new Error("Coordenadas de origen o destino no válidas");
                }

                const origenCoords: LatLngTuple = [origenLat, origenLng];
                const destinoCoords: LatLngTuple = [
                    servicio.destino_latitud,
                    servicio.destino_longitud,
                ];

                // Build URL for Mapbox Directions API
                const originCoords = `${origenCoords[1]},${origenCoords[0]}`; // [lng, lat] format
                const destCoords = `${destinoCoords[1]},${destinoCoords[0]}`;
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords};${destCoords}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`;

                // Make request to API
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `Error en la respuesta de Mapbox API: ${response.status}`,
                    );
                }

                const data = await response.json();

                console.log(data, "Data")

                if (!data.routes || data.routes.length === 0) {
                    throw new Error("No se encontró una ruta válida");
                }

                // Extract route geometry
                const route: MapboxRoute = data.routes[0];


                const servicioWithRoutesData = {
                    ...servicio,
                    origenCoords: useVehiclePosition
                        ? ([origenLat, origenLng] as LatLngTuple)
                        : origenCoords,
                    destinoCoords,
                    geometry: [origenCoords, destinoCoords] as LatLngExpression[],
                    routeDistance: (route.distance / 1000).toFixed(1),
                    routeDuration: Math.round(route.duration / 60),
                };

                console.log(servicioWithRoutesData, "Data")

                setServicioWithRoutes(servicioWithRoutesData);

                return servicioWithRoutesData;
            } catch (error: any) {
                console.error("Error:", error.message);

                // Handle error case using a straight line
                if (
                    servicio.origen_latitud &&
                    servicio.origen_longitud &&
                    servicio.destino_latitud &&
                    servicio.destino_longitud
                ) {
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
                        routeDistance: servicio.distancia_km.toString() || "0",
                        routeDuration: null,
                    };

                    setServicioWithRoutes(servicioWithRoutesData);

                    return servicioWithRoutesData;
                }

                return null;
            }
        },
        [MAPBOX_ACCESS_TOKEN, callWialonApi],
    );

    useEffect(() => {
        if (servicio) {
            fetchRouteGeometry(servicio);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [servicio]);

    // Función para formatear fecha YYYY-MM-DD a formato legible
    const formatearFecha = (fecha?: string) => {
        if (!fecha) return "No especificada";

        return new Date(fecha).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Función para formatear valores monetarios
    const formatearDinero = (valor?: number) => {
        if (!valor && valor !== 0) return "No especificado";

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor);
    };

    const serviceTypeTextMap: Record<string, string> = {
        herramienta: "Cargado con herramienta",
        personal: "Deplazamineto de personal",
        vehiculo: "Posicionar vehiculo",
    };

    const getServiceTypeText = (tipo: string): string => {
        return serviceTypeTextMap[tipo] || tipo;
    };

    const formatTime = (date: Date | string) => {
        if (!date) return "-";
        const d = new Date(date);

        return d.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    console.log(servicioWithRoutes, "servicio with Routes")

    return (
        <Modal
            backdrop="opaque"
            classNames={{
                backdrop:
                    "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
                base: "max-w-[90vw]", // Esto establece el ancho al 75% del viewport width

            }}
            isOpen={isOpen}
            scrollBehavior="inside"
            size="5xl"
            onClose={onClose}
        >
            <ModalContent className="w-full h-full !p-0 gap-0">
                {() => (
                    <>
                        <ModalBody className="!p-0 rounded-xl">
                            <div className="flex-1 grid grid-cols-3">
                                <div className="animate-fade-up bg-white p-5 rounded-lg shadow-sm">
                                    {/* Encabezado con estado */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Detalles del Servicio</h3>
                                        <div
                                            className="px-3 py-1.5 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: `${getStatusColor(servicio.estado)}20`,
                                                color: getStatusColor(servicio.estado),
                                            }}
                                        >
                                            {getStatusText(servicio.estado)}
                                        </div>
                                    </div>

                                    {/* Conductor - Row completa con foto e información */}
                                    <div className="mb-6 pb-6 border-b border-gray-200">
                                        <h3 className="font-semibold text-emerald-600 text-lg mb-4 flex items-center">
                                            <span className="w-1 h-5 bg-emerald-600 inline-block mr-3"></span>
                                            Conductor
                                        </h3>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Foto del conductor */}
                                            <div className="w-full md:w-1/5 lg:w-1/6">
                                                <div className="border border-gray-200 shadow-sm rounded-lg aspect-square relative overflow-hidden">
                                                    <Image
                                                        alt="Conductor asignado"
                                                        fill
                                                        className="object-cover"
                                                        src={servicio.conductor.foto_url ?? "/assets/not_user.avif"}
                                                    />
                                                </div>
                                            </div>

                                            {/* Información del conductor */}
                                            <div className="w-full md:w-4/5 lg:w-5/6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Nombre</p>
                                                        <p className="text-gray-900 font-medium">
                                                            {servicio.conductor?.nombre} {servicio.conductor?.apellido}
                                                        </p>
                                                        <div>
                                                            <p className="text-gray-500 text-sm">Identificación</p>
                                                            <p className="text-gray-900">
                                                                CC: {servicio.conductor?.numero_identificacion || "No disponible"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p className="text-gray-500 text-sm">Teléfono</p>
                                                            <p className="text-gray-900 flex items-center">
                                                                <svg className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                                </svg>
                                                                {servicio.conductor?.telefono || 'No disponible'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehículo - Row completa solo con información */}
                                    <div className="mb-8 pb-6 border-b border-gray-200">
                                        <h3 className="font-semibold text-emerald-600 text-lg mb-4 flex items-center">
                                            <span className="w-1 h-5 bg-emerald-600 inline-block mr-3"></span>
                                            Vehículo
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-gray-500 text-sm">Placa</p>
                                                <p className="text-gray-900 font-medium">
                                                    {servicio.vehiculo?.placa}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500 text-sm">Marca</p>
                                                <p className="text-gray-900">
                                                    {servicio.vehiculo?.marca || "No especificado"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500 text-sm">Línea</p>
                                                <p className="text-gray-900">
                                                    {servicio.vehiculo?.linea || "No especificado"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500 text-sm">Modelo</p>
                                                <p className="text-gray-900">
                                                    {servicio.vehiculo?.modelo || "No especificado"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información del servicio - Grid con 3 columnas en desktop */}
                                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                                        {/* Origen y Destino - Primera columna */}
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Origen</span>
                                                <div className="font-medium text-gray-800">{servicio.origen_especifico}</div>
                                            </div>

                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Destino</span>
                                                <div className="font-medium text-gray-800">{servicio.destino_especifico}</div>
                                            </div>

                                            {servicio.cliente && (
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <span className="text-sm text-gray-500">Cliente</span>
                                                    <div className="font-medium text-gray-800">{servicio.cliente.nombre}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Fechas - Segunda columna */}
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Fecha y Hora de Solicitud</span>
                                                <div className="font-medium text-gray-800">{formatearFecha(servicio.fecha_solicitud)}</div>
                                            </div>

                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Fecha y Hora de Realización</span>
                                                <div className="font-medium text-gray-800">{formatearFecha(servicio.fecha_realizacion)}</div>
                                            </div>

                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Fecha y Hora de Finalización</span>
                                                <div className="font-medium text-gray-800">{formatearFecha(servicio.fecha_finalizacion)}</div>
                                            </div>
                                        </div>

                                        {/* Otros detalles - Tercera columna */}
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Distancia</span>
                                                <div className="font-medium text-gray-800">{servicioWithRoutes?.routeDistance || 0} km</div>
                                            </div>

                                            <div className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-500">Observaciones</span>
                                                <div className="font-medium text-gray-800 max-h-20 overflow-y-auto">
                                                    {servicio.observaciones || "No hay observaciones"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tracking del Vehículo (si está en curso) */}
                                    {servicio.estado === "en_curso" && (
                                        <div className="mt-5 pt-4 border-t border-gray-200">
                                            <h4 className="font-bold text-lg mb-3 text-gray-800">Tracking del Vehículo</h4>
                                            {vehicleTracking ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    <div className="bg-indigo-50 p-2 rounded">
                                                        <span className="text-sm text-gray-500">Vehículo:</span>{" "}
                                                        <div className="font-medium text-gray-800">{vehicleTracking.name}</div>
                                                    </div>
                                                    <div className="bg-indigo-50 p-2 rounded">
                                                        <span className="text-sm text-gray-500">Velocidad:</span>{" "}
                                                        <div className="font-medium text-gray-800">{vehicleTracking.position.s || 0} km/h</div>
                                                    </div>
                                                    <div className="bg-indigo-50 p-2 rounded">
                                                        <span className="text-sm text-gray-500">Dirección:</span>{" "}
                                                        <div className="font-medium text-gray-800">{vehicleTracking.position.c || 0}°</div>
                                                    </div>
                                                    <div className="bg-indigo-50 p-2 rounded">
                                                        <span className="text-sm text-gray-500">Ubicación:</span>{" "}
                                                        <div className="font-medium text-gray-800">
                                                            {vehicleTracking.position.x.toFixed(6)}, {vehicleTracking.position.y.toFixed(6)}
                                                        </div>
                                                    </div>
                                                    <div className="bg-indigo-50 p-2 rounded md:col-span-2">
                                                        <span className="text-sm text-gray-500">Última actualización:</span>{" "}
                                                        <div className="font-medium text-gray-800">{formatTime(vehicleTracking.lastUpdate)}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-amber-600 text-sm p-3 bg-amber-50 rounded-lg">
                                                    Buscando información del vehículo...
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2 w-full h-full">
                                    <EnhancedMapComponent
                                        selectedServicio={servicioWithRoutes}
                                        vehicleTracking={vehicleTracking}
                                        mapboxToken={MAPBOX_ACCESS_TOKEN}
                                        wialonToken={WIALON_API_TOKEN}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalDetalleServicio;
