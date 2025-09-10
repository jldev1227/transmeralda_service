"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import Image from "next/image";

import "mapbox-gl/dist/mapbox-gl.css";

import {
    FileText,
    Truck,
    Clock,
    Route,
    MapPin,
    Calendar,
    Info,
    Building,
    User,
} from "lucide-react";
import { Button } from "@heroui/button";

import LoadingPage from "@/components/loadingPage";
import { useService } from "@/context/serviceContext";
import { useTicketShare } from "@/components/shareTicketImage";
import { getStatusColor, getStatusText } from "@/utils/indext";
import { apiClient } from "@/config/apiClient";
import { formatearFecha } from "@/helpers";

export default function ServicioViewCliente() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { servicio, loading, obtenerServicio } = useService();
    const { shareTicket } = useTicketShare();

    // Estados para la navegación
    const [isNavigating, setIsNavigating] = useState(false);

    // Estados para la foto del conductor
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Estados para el mapa
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<{
        origen?: mapboxgl.Marker;
        destino?: mapboxgl.Marker;
        vehicle?: mapboxgl.Marker;
    }>({});

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string>("");
    const [vehicleTracking, setVehicleTracking] = useState<any>(null);
    const [trackingError, setTrackingError] = useState<string>("");
    const [wialonSessionId, setWialonSessionId] = useState<string | null>(null);
    const [distancia, setDistancia] = useState<number>(0);
    const [duracion, setDuracion] = useState<number>(0);

    // Tokens desde variables de entorno
    const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";

    // Función para manejar la navegación hacia atrás con loading
    const handleGoBack = async () => {
        setIsNavigating(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        router.back();
        setTimeout(() => setIsNavigating(false), 3000);
    };

    // Función para manejar el compartir
    const handleShare = async () => {
        if (servicio) {
            await shareTicket(servicio);
        }
    };

    // Función para obtener URL firmada de S3
    const getPresignedUrl = useCallback(async (s3Key: string) => {
        try {
            const response = await apiClient.get(`/api/documentos/url-firma`, {
                params: { key: s3Key },
            });

            return response.data.url;
        } catch (error) {
            console.error("Error al obtener URL firmada:", error);

            return null;
        }
    }, []);

    // Componente mejorado para la foto del conductor
    const ConductorPhoto = () => {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [imageError, setImageError] = useState(false);

        const handleImageLoad = () => {
            setImageLoaded(true);
        };

        const handleLocalImageError = () => {
            setImageError(true);
            setImageLoaded(true);
            handleImageError();
        };

        // Mostrar skeleton mientras carga la URL o la imagen
        if (isLoadingPhoto) {
            return (
                <div className="w-full rounded-lg relative overflow-hidden">
                    {/* Skeleton con animación mejorada */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            style={{
                                animation: "shimmer 1.5s ease-in-out infinite",
                                transform: "translateX(-100%)",
                            }}
                        />
                    </div>

                    {/* Indicador visual de carga */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 shadow-lg">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </div>

                    {/* Texto de carga */}
                    <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/20 backdrop-blur-sm rounded px-2 py-1">
                            <div className="text-xs text-white text-center font-medium">
                                Cargando foto...
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full md:h-96 rounded-lg relative overflow-hidden bg-gray-50 group">
                {/* Placeholder mientras carga la imagen */}
                {!imageLoaded && fotoUrl && !imageError && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Imagen principal con transición suave */}
                <div
                    className={`relative w-full h-full transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                >
                    <Image
                        fill
                        alt="Foto conductor asignado"
                        className="object-cover rounded-lg transition-opacity duration-300"
                        priority={false}
                        src={fotoUrl || "/assets/not_user.avif"}
                        onError={handleLocalImageError}
                        onLoad={handleImageLoad}
                    />
                </div>

                {/* Overlay para estado de error o sin foto */}
                {(imageError || photoError || !fotoUrl) && imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500 p-4">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                    />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">Sin foto disponible</span>
                        </div>
                    </div>
                )}

                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        );
    };

    // Función para hacer llamadas a la API de Wialon
    const callWialonApi = async (
        sessionIdOrToken: string,
        service: string,
        params: any,
    ) => {
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
            const response = await fetch("/api/wialon-api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data && data.error) {
                throw new Error(
                    `Error Wialon API (${data.error}): ${data.reason || service}`,
                );
            }

            return data;
        } catch (err) {
            console.error(`Error llamando a ${service}:`, err);
            throw err;
        }
    };

    // Función para obtener la ruta desde Mapbox API
    const fetchMapboxRoute = async (
        origin: [number, number],
        destination: [number, number],
    ): Promise<number[][]> => {
        if (!MAPBOX_ACCESS_TOKEN) return [origin, destination];

        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`;

            const response = await fetch(url);

            if (!response.ok) throw new Error("Error en Mapbox API");

            const data = await response.json();

            if (!data.routes || data.routes.length === 0) {
                throw new Error("No se encontró ruta");
            }

            setDistancia(Number((data.routes[0].distance / 1000).toFixed(2)));
            setDuracion(data.routes[0].duration);

            return data.routes[0].geometry.coordinates;
        } catch (error) {
            console.error("Error obteniendo ruta:", error);

            return [origin, destination];
        }
    };

    // Función para crear popups
    const createPopupHTML = (type: "origen" | "destino") => {
        if (!servicio) return "";

        const isOrigin = type === "origen";

        return `
      <div class="marker-popup">
        <div class="popup-header" style="background-color: #059669; color: white; padding: 8px; font-weight: bold; border-radius: 4px 4px 0 0;">
          ${isOrigin ? "Punto de Origen" : "Punto de Destino"}
        </div>
        <div class="popup-content" style="padding: 8px;">
          <div class="font-medium" style="font-weight: 600; margin-bottom: 4px;">
            ${isOrigin
                ? servicio.origen_especifico ||
                servicio.origen?.nombre_municipio ||
                "Origen"
                : servicio.destino_especifico ||
                servicio.destino?.nombre_municipio ||
                "Destino"
            }
          </div>
          <div class="popup-divider" style="height: 1px; background-color: #e5e7eb; margin: 8px 0;"></div>
          <div class="text-sm" style="font-size: 0.875rem;">
            ${isOrigin
                ? `
                <div>
                  <div class="font-medium" style="font-weight: 500;">Tipo de servicio:</div>
                  <div style="color: #6b7280;">${servicio.proposito_servicio || "No especificado"}</div>
                </div>
              `
                : `
                <div>
                  <div class="font-medium" style="font-weight: 500;">Distancia estimada</div>
                  <div style="color: #6b7280;">${distancia || "Calculando..."} km</div>
                </div>
              `
            }
          </div>
        </div>
      </div>
    `;
    };

    // Función para crear marcador de vehículo
    const createVehicleMarker = (lngLat: [number, number], vehicleData: any) => {
        if (!map.current) return null;

        const el = document.createElement("div");

        el.className = "vehicle-marker";
        el.style.width = "38px";
        el.style.height = "38px";
        el.style.backgroundColor = "#0077b6";
        el.style.backgroundImage = "url('/assets/marker.png')";
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid #ffffff";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        const popupContent = `
      <div class="vehicle-popup" style="padding: 8px;">
        <h3 style="font-weight: bold; margin-bottom: 8px;">${vehicleData.name || "Vehículo"}</h3>
        <div style="font-size: 0.875rem;">
          <div style="margin-bottom: 4px;">
            <strong>Velocidad:</strong> ${vehicleData.position?.s || 0} km/h
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Dirección:</strong> ${vehicleData.position?.c || 0}°
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Coordenadas:</strong><br>
            ${vehicleData.position?.x?.toFixed(6)}, ${vehicleData.position?.y?.toFixed(6)}
          </div>
          <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px;">
            Actualizado: ${vehicleData.lastUpdate ? new Date(vehicleData.lastUpdate).toLocaleTimeString() : "N/A"}
          </div>
        </div>
      </div>
    `;

        const popup = new mapboxgl.Popup({
            offset: 25,
            closeOnClick: false,
            closeButton: true,
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map.current);

        el.addEventListener("click", (e) => {
            e.stopPropagation();
            marker.togglePopup();
        });

        return marker;
    };

    // Función para crear marcadores
    const createMarker = (
        lngLat: [number, number],
        type: "origen" | "destino",
        popupContent: string,
    ) => {
        if (!map.current) return null;

        const el = document.createElement("div");

        el.className = `custom-marker marker-${type}`;
        el.style.backgroundColor = "#059669";
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.borderRadius = "50%";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "white";
        el.style.fontWeight = "bold";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        el.innerText = type === "origen" ? "A" : "B";

        const popup = new mapboxgl.Popup({
            offset: 25,
            closeOnClick: false,
            closeButton: true,
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map.current);

        el.addEventListener("click", (e) => {
            e.stopPropagation();
            marker.togglePopup();
        });

        return marker;
    };

    // Función para obtener información del vehículo desde Wialon
    const fetchVehicleTracking = async (vehiclePlaca: string) => {
        if (!WIALON_API_TOKEN || !wialonSessionId) return;

        try {
            setTrackingError("");

            const vehiclesData = await callWialonApi(
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

            if (!vehiclesData?.items) {
                setTrackingError("No se pudieron obtener los vehículos");

                return;
            }

            const vehicleData = vehiclesData.items.find(
                (v: any) =>
                    v.nm.includes(vehiclePlaca) ||
                    v.nm.toLowerCase() === vehiclePlaca.toLowerCase(),
            );

            if (!vehicleData?.pos) {
                setTrackingError(
                    `No se encontró posición para el vehículo ${vehiclePlaca}`,
                );

                return;
            }

            const trackingData = {
                id: vehicleData.id,
                name: vehicleData.nm,
                position: vehicleData.pos,
                lastUpdate: new Date(),
                item: vehicleData,
            };

            setVehicleTracking(trackingData);

            return trackingData;
        } catch (error) {
            console.error("Error obteniendo tracking del vehículo:", error);
            setTrackingError("Error al obtener información del vehículo");
        }
    };

    // Función para limpiar marcadores y rutas
    const clearMapObjects = () => {
        if (!map.current) return;

        if (markersRef.current.origen) {
            markersRef.current.origen.remove();
            markersRef.current.origen = undefined;
        }
        if (markersRef.current.destino) {
            markersRef.current.destino.remove();
            markersRef.current.destino = undefined;
        }
        if (markersRef.current.vehicle) {
            markersRef.current.vehicle.remove();
            markersRef.current.vehicle = undefined;
        }

        try {
            if (map.current.getLayer("route")) {
                map.current.removeLayer("route");
            }
            if (map.current.getSource("route")) {
                map.current.removeSource("route");
            }
        } catch (err) {
            console.error("Error limpiando ruta:", err);
        }

        try {
            document.querySelectorAll(".mapboxgl-popup").forEach((popup) => {
                popup.remove();
            });
        } catch (err) {
            console.error("Error removiendo popups:", err);
        }
    };

    // Función para formatear duración
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        } else {
            return `${minutes}min`;
        }
    };

    // Función para manejar errores de carga de imagen
    const handleImageError = useCallback(() => {
        setPhotoError(true);
        setFotoUrl(null);
    }, []);

    // Efecto para obtener el servicio
    useEffect(() => {
        const getServicio = async (id: string) => {
            try {
                await obtenerServicio(id);
            } catch (error) {
                console.error("Error al obtener el servicio:", error);
            }
        };

        if (id) {
            getServicio(id);
        }
    }, [id, obtenerServicio]);

    // Efecto para cargar foto del conductor
    useEffect(() => {
        const cargarFotoPerfil = async () => {
            setFotoUrl(null);
            setPhotoError(false);
            setImageLoaded(false);

            const fotoPerfil = servicio?.conductor?.documentos?.find(
                (doc) => doc.categoria === "FOTO_PERFIL",
            );

            if (fotoPerfil?.s3_key) {
                setIsLoadingPhoto(true);
                try {
                    const url = await getPresignedUrl(fotoPerfil.s3_key);

                    if (url) {
                        setFotoUrl(url);
                    } else {
                        setPhotoError(true);
                        console.warn("No se pudo obtener la URL de la foto");
                    }
                } catch (error) {
                    console.error("Error al cargar foto de perfil:", error);
                    setPhotoError(true);
                } finally {
                    setIsLoadingPhoto(false);
                }
            } else {
                setIsLoadingPhoto(false);
            }
        };

        if (servicio?.conductor) {
            cargarFotoPerfil();
        }
    }, [servicio?.conductor?.id, getPresignedUrl]);

    // Efecto para inicializar Mapbox
    useEffect(() => {
        if (!MAPBOX_ACCESS_TOKEN) {
            setMapError("Token de Mapbox no configurado");

            return;
        }

        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    }, [MAPBOX_ACCESS_TOKEN]);

    // Efecto para inicializar sesión de Wialon
    useEffect(() => {
        const initWialon = async () => {
            if (!WIALON_API_TOKEN) return;

            try {
                const loginData = await callWialonApi(
                    WIALON_API_TOKEN,
                    "token/login",
                    {},
                );

                if (loginData?.eid) {
                    setWialonSessionId(loginData.eid);
                }
            } catch (error) {
                console.error("Error al iniciar sesión en Wialon:", error);
                setTrackingError("Error al conectar con Wialon");
            }
        };

        initWialon();
    }, [WIALON_API_TOKEN]);

    // Efecto para inicializar el mapa
    useEffect(() => {
        if (
            !MAPBOX_ACCESS_TOKEN ||
            !mapContainer.current ||
            map.current ||
            !servicio
        ) {
            return;
        }

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/outdoors-v12",
                center: [-72.395, 5.3377],
                zoom: 12,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

            map.current.on("load", () => {
                setIsMapLoaded(true);
            });

            map.current.on("error", (e) => {
                console.error("Error en el mapa:", e);
                setMapError("Error al cargar el mapa");
            });
        } catch (error) {
            console.error("Error al inicializar Mapbox:", error);
            setMapError("Error al inicializar el mapa");
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                setIsMapLoaded(false);
            }
        };
    }, [MAPBOX_ACCESS_TOKEN, servicio]);

    // Efecto para crear/actualizar ruta cuando cambie el servicio
    useEffect(() => {
        if (!isMapLoaded || !map.current || !servicio) return;

        clearMapObjects();

        const origenLat = servicio.origen_latitud || servicio.origen?.latitud;
        const origenLng = servicio.origen_longitud || servicio.origen?.longitud;
        const destinoLat = servicio.destino_latitud || servicio.destino?.latitud;
        const destinoLng = servicio.destino_longitud || servicio.destino?.longitud;

        if (!origenLat || !origenLng || !destinoLat || !destinoLng) {
            console.warn("Coordenadas incompletas para el servicio:", servicio);

            return;
        }

        const bounds = new mapboxgl.LngLatBounds();

        const origenCoords: [number, number] = [origenLng, origenLat];
        const markerOrigen = createMarker(
            origenCoords,
            "origen",
            createPopupHTML("origen"),
        );

        if (markerOrigen) {
            markersRef.current.origen = markerOrigen;
            bounds.extend(origenCoords);
        }

        const destinoCoords: [number, number] = [destinoLng, destinoLat];
        const markerDestino = createMarker(
            destinoCoords,
            "destino",
            createPopupHTML("destino"),
        );

        if (markerDestino) {
            markersRef.current.destino = markerDestino;
            bounds.extend(destinoCoords);
        }

        const createRouteWithTracking = async () => {
            if (!map.current) return;

            let startCoords = origenCoords;
            let endCoords = destinoCoords;
            let routeColor = "#059669";

            if (
                servicio.estado === "en_curso" &&
                servicio.vehiculo?.placa &&
                wialonSessionId
            ) {
                try {
                    const trackingData = await fetchVehicleTracking(
                        servicio.vehiculo.placa,
                    );

                    if (trackingData?.position) {
                        const vehiclePosition: [number, number] = [
                            trackingData.position.x,
                            trackingData.position.y,
                        ];

                        const vehicleMarker = createVehicleMarker(
                            vehiclePosition,
                            trackingData,
                        );

                        if (vehicleMarker) {
                            markersRef.current.vehicle = vehicleMarker;
                            bounds.extend(vehiclePosition);
                        }

                        startCoords = vehiclePosition;
                        routeColor = "#0077b6";
                    } else {
                        console.warn(
                            "No se pudo obtener tracking - usando ruta normal A->B",
                        );
                    }
                } catch (error) {
                    console.error("Error en tracking - usando ruta normal A->B:", error);
                }
            }

            try {
                map.current.addSource("route", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: [startCoords, endCoords],
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
                        "line-color": routeColor,
                        "line-width": 5,
                        "line-opacity": 0.8,
                    },
                });

                const routeCoordinates = await fetchMapboxRoute(startCoords, endCoords);

                if (map.current && map.current.getSource("route")) {
                    (map.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: routeCoordinates,
                        },
                    });

                    const routeBounds = new mapboxgl.LngLatBounds();

                    routeCoordinates.forEach((coord) => {
                        routeBounds.extend([coord[0], coord[1]]);
                    });

                    if (!routeBounds.isEmpty()) {
                        map.current.fitBounds(routeBounds, {
                            padding: 50,
                            maxZoom: 14,
                        });
                    }
                }
            } catch (error) {
                console.error("Error creando ruta:", error);
            }
        };

        createRouteWithTracking();

        if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, {
                padding: 50,
                maxZoom: 14,
            });
        }
    }, [isMapLoaded, servicio?.id, servicio?.estado, wialonSessionId]);

    if (loading) {
        return <LoadingPage>Cargando servicio</LoadingPage>;
    }

    if (!servicio) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Servicio no encontrado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        El servicio que buscas no existe o no tienes permisos para verlo.
                    </p>
                    <button
                        className={`
              px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto
              ${isNavigating
                                ? "bg-gray-300 cursor-not-allowed opacity-50"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }
            `}
                        disabled={isNavigating}
                        onClick={handleGoBack}
                    >
                        {isNavigating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Volviendo...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M15 19l-7-7 7-7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                Volver
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    const statusColors = getStatusColor(servicio.estado);

    return (
        <>
            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>

            <div className="min-h-screen bg-gray-50">
                {/* Header minimalista */}
                <div className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-6">
                            <div className="flex items-center gap-6">
                                <button
                                    className={`
                    w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center
                    ${isNavigating
                                            ? "bg-gray-100 cursor-not-allowed opacity-50"
                                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
                                        }
                `}
                                    disabled={isNavigating}
                                    title="Volver"
                                    onClick={handleGoBack}
                                >
                                    {isNavigating ? (
                                        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M15 19l-7-7 7-7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                            />
                                        </svg>
                                    )}
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-emerald-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Servicio de Transporte
                                        </h1>
                                        <p className="text-base text-gray-500 font-medium">
                                            ID: {servicio.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 font-medium">
                                        Estado:
                                    </span>
                                    <span
                                        className="px-4 py-2 rounded-xl text-sm font-semibold border"
                                        style={{
                                            backgroundColor: `${statusColors}15`,
                                            borderColor: `${statusColors}40`,
                                            color: statusColors,
                                        }}
                                    >
                                        {getStatusText(servicio.estado)}
                                    </span>
                                </div>

                                <div className="h-8 w-px bg-gray-200" />

                                <button
                                    className={`
                    px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium
                    ${isNavigating
                                            ? "bg-gray-100 cursor-not-allowed opacity-50 text-gray-400"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
                                        }
                `}
                                    disabled={isNavigating}
                                    onClick={handleShare}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                        />
                                    </svg>
                                    Compartir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Left Sidebar - Información del Conductor, Vehículo y Cliente */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Información del Conductor */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Conductor Asignado
                                    </h3>
                                </div>

                                {/* Foto del Conductor */}
                                <div className="mb-4">
                                    <ConductorPhoto />
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Nombre</p>
                                        <p className="text-base font-medium text-gray-900">
                                            {servicio.conductor?.nombre}{" "}
                                            {servicio.conductor?.apellido}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Identificación</p>
                                        <p className="text-sm text-gray-700">
                                            {servicio.conductor?.tipo_identificacion}:{" "}
                                            {servicio.conductor?.numero_identificacion ||
                                                "No especificado"}
                                        </p>
                                    </div>

                                    {servicio.conductor?.telefono && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                                            <p className="text-sm text-gray-700">
                                                {servicio.conductor.telefono}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <Button
                                        fullWidth
                                        color="primary"
                                        radius="sm"
                                        startContent={<FileText className="w-4 h-4" />}
                                        variant="flat"
                                    >
                                        Ver documentación
                                    </Button>
                                </div>
                            </div>

                            {/* Información del Vehículo */}
                            {servicio.vehiculo && (
                                <div className="bg-white rounded-xl border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Truck className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Vehículo
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Placa</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {servicio.vehiculo.placa}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Vehículo</p>
                                            <p className="text-sm text-gray-700">
                                                {servicio.vehiculo.marca} {servicio.vehiculo.linea}{" "}
                                                {servicio.vehiculo.modelo}
                                            </p>
                                        </div>

                                        {servicio.vehiculo.color && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Color</p>
                                                <p className="text-sm text-gray-700">
                                                    {servicio.vehiculo.color}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <Button
                                            fullWidth
                                            color="primary"
                                            radius="sm"
                                            startContent={<FileText className="w-4 h-4" />}
                                            variant="flat"
                                        >
                                            Ver documentación
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Información del Cliente */}
                            {servicio.cliente && (
                                <div className="bg-white rounded-xl border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                            <Building className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Cliente
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Nombre</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {servicio.cliente.nombre}
                                            </p>
                                        </div>

                                        {servicio.cliente.nit && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">NIT</p>
                                                <p className="text-sm text-gray-700">
                                                    {servicio.cliente.nit}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content - Mapa más grande */}
                        <div className="xl:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-full">
                                {mapError && (
                                    <div className="p-3 bg-red-100 text-red-800 text-sm border-b border-red-200">
                                        <span className="font-medium">Error:</span> {mapError}
                                    </div>
                                )}

                                <div className="relative h-full">
                                    <div ref={mapContainer} className="h-full w-full" />

                                    {!isMapLoaded && !mapError && (
                                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                <p className="text-gray-600 text-sm">
                                                    Cargando mapa...
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isMapLoaded && servicio && (
                                        <div className="absolute top-3 left-3 bg-white/95 p-2 rounded-lg text-xs shadow-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    A
                                                </div>
                                                <span>Origen</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    B
                                                </div>
                                                <span>Destino</span>
                                            </div>
                                            {vehicleTracking && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 bg-[#0077b6] rounded-full flex items-center justify-center text-white text-xs">
                                                        🚗
                                                    </div>
                                                    <span>Vehículo</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Información del Servicio con diseño minimalista */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Cronograma minimalista */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Cronograma
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Fecha de solicitud
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {formatearFecha(servicio.fecha_solicitud)}
                                        </p>
                                    </div>

                                    {servicio.fecha_realizacion && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Fecha de realización
                                            </p>
                                            <p className="text-base font-medium text-gray-900">
                                                {formatearFecha(servicio.fecha_realizacion)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información del Recorrido minimalista */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Route className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Recorrido
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {/* Ruta principal */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        A
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Origen</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {servicio.origen?.nombre_municipio ||
                                                            "No especificado"}
                                                    </p>
                                                    {servicio.origen_especifico && (
                                                        <p className="text-xs text-gray-400 italic">
                                                            ({servicio.origen_especifico})
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className="w-px h-8 bg-gray-200" />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        B
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Destino</p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {servicio.destino?.nombre_municipio ||
                                                            "No especificado"}
                                                    </p>
                                                    {servicio.destino_especifico && (
                                                        <p className="text-xs text-gray-400 italic">
                                                            ({servicio.destino_especifico})
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Métricas del viaje */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-1">Distancia</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {distancia} km
                                                </p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-1">Duración</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {formatDuration(duracion)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Propósito del servicio */}
                                    {servicio.proposito_servicio && (
                                        <div className="border-t border-gray-100 pt-4">
                                            <p className="text-sm text-gray-500 mb-1">
                                                Propósito del servicio
                                            </p>
                                            <p className="text-base text-gray-900 capitalize">
                                                Transporte de {servicio.proposito_servicio}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Observaciones */}
                            {servicio.observaciones ? (
                                <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Info className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Observaciones
                                        </h3>
                                    </div>
                                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                        {servicio.observaciones}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Info className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Observaciones
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-400 italic">
                                        No hay observaciones para este servicio.
                                    </p>
                                </div>
                            )}

                            {/* Coordenadas técnicas */}
                            {(servicio.origen_latitud || servicio.destino_latitud) && (
                                <div className="bg-white rounded-xl border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Coordenadas
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {servicio.origen_latitud && servicio.origen_longitud && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Origen</p>
                                                <p className="text-sm font-mono text-gray-900">
                                                    {servicio.origen_latitud.toFixed(6)},{" "}
                                                    {servicio.origen_longitud.toFixed(6)}
                                                </p>
                                            </div>
                                        )}
                                        {servicio.destino_latitud && servicio.destino_longitud && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Destino</p>
                                                <p className="text-sm font-mono text-gray-900">
                                                    {servicio.destino_latitud.toFixed(6)},{" "}
                                                    {servicio.destino_longitud.toFixed(6)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Auditoría */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Auditoría
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Fecha de creación
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(
                                                servicio.created_at || servicio.createdAt,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Última actualización
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(
                                                servicio.updated_at || servicio.updatedAt,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
