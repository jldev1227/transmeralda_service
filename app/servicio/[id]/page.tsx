"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  use,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import Image from "next/image";

import "mapbox-gl/dist/mapbox-gl.css";

// Declaración global para Wialon SDK
declare global {
  interface Window {
    wialon: any;
  }
}

import {
  Truck,
  Clock,
  Route,
  MapPin,
  Calendar,
  Info,
  Building,
  User,
  Ban,
} from "lucide-react";
import { Button } from "@heroui/button";

import LoadingPage from "@/components/loadingPage";
import { useTicketShare } from "@/components/shareTicketImage";
import { DEFAULT_MOTIVOS, getStatusColor, getStatusText } from "@/utils/indext";
import { apiClient } from "@/config/apiClient";
import { formatearFecha } from "@/helpers";
import { PublicTokenGuard } from "@/components/guards/publicTokenGuard";
import { Documento } from "@/types";
import {
  Cancelacion,
  ServicioConRelaciones,
  useService,
} from "@/context/serviceContext";
import ModalShareServicio from "@/components/ui/modalShareServicio";
import { useAuth } from "@/context/AuthContext";
import ModalDocumentosConductor from "@/components/ui/modalDocumentosConductor";
import ModalDocumentosVehiculo from "@/components/ui/modalDocumentosVehiculo";

// Hook personalizado para servicios públicos
const usePublicService = (servicioId: string, token: string | null) => {
  const [servicio, setServicio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicio = async () => {
      if (!token) {
        setError("Token requerido");
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/servicios/publico/${servicioId}?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();

          setServicio(data.data);
        } else {
          const errorData = await response.json();

          setError(errorData.message || "Error al cargar el servicio");
        }
      } catch (err) {
        console.error("Error fetching servicio:", err);
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [servicioId, token]);

  return { servicio, loading, error };
};

function ServicioContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Only use PublicTokenGuard if there's a token
  if (token) {
    return (
      <PublicTokenGuard servicioId={params.id}>
        <ServicioViewCliente servicioId={params.id} />
      </PublicTokenGuard>
    );
  }

  // For authenticated users, render directly
  return <ServicioViewCliente servicioId={params.id} />;
}

function ServicioViewCliente({ servicioId }: { servicioId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useAuth();

  // Determine if it's public access first
  const isPublicAccess = !!token;

  // Use different hooks based on whether token is present
  const publicService = usePublicService(servicioId, token);
  const { servicio, obtenerServicio, loading: authLoading } = useService();

  const currentServicio = isPublicAccess 
    ? publicService.servicio 
    : servicio;

  const loading = isPublicAccess 
    ? publicService.loading 
    : authLoading;

  const { shareTicket } = useTicketShare();

  // Fetch service if authenticated and servicioId is provided
  useEffect(() => {
    const fetchServicio = async () => {
      if (!isPublicAccess && servicioId && obtenerServicio) {
        await obtenerServicio(servicioId);
      }
    };

    fetchServicio();
  }, [isPublicAccess, servicioId, obtenerServicio]);

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

  // Estados para WebSocket del vehículo específico
  const [isVehicleWSConnected, setIsVehicleWSConnected] = useState(false);
  const [vehicleWSError, setVehicleWSError] = useState<string | null>(null);
  const [realTimePosition, setRealTimePosition] = useState<any>(null);
  
  // Referencias para WebSocket
  const wialonSessionRef = useRef<any>(null);
  const vehicleUnitRef = useRef<any>(null);
  const wsReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positionListenerRef = useRef<((event: any) => void) | null>(null);
  const isWebSocketActiveRef = useRef<boolean>(false);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Referencias para controlar inicializaciones y evitar loops
  const isWialonInitializedRef = useRef(false);
  const wialonInitPromiseRef = useRef<Promise<void> | null>(null);

  // Tokens desde variables de entorno
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  // Función para manejar la navegación hacia atrás con loading
  const handleGoBack = async () => {
    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    router.back();
    setTimeout(() => setIsNavigating(false), 3000);
  };

  // Función para manejar el compartir
  const handleShare = async () => {
    // Abrir modal de share
    if (currentServicio) {
      await shareTicket(currentServicio);
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
      <div className="w-full h-48 md:h-56 xl:h-96 rounded-lg relative overflow-hidden bg-gray-50 group">
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

  // Función para hacer llamadas a la API de Wialon con manejo automático de token
  const callWialonApi = useCallback(async (
    sessionIdOrToken: string | null,
    service: string,
    params: any,
    isRetry: boolean = false,
  ) => {
    console.log('🔍 Llamada Wialon:', { sessionIdOrToken, service, params, isRetry });

    // Obtener token del localStorage si no se proporciona uno específico
    const getStoredToken = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('wialon_session_id');
      }
      return null;
    };

    // Guardar token en localStorage
    const saveToken = (token: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('wialon_session_id', token);
        setWialonSessionId(token);
      }
    };

    // Limpiar token del localStorage
    const clearToken = () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wialon_session_id');
        setWialonSessionId(null);
      }
    };

    // Función para hacer login y obtener nuevo token
    const performLogin = async () => {
      console.log('� Iniciando sesión en Wialon...');
      
      try {
        const loginResponse = await fetch("/api/wialon-api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: "token/login",
            params: {},
          }),
        });

        if (!loginResponse.ok) {
          const loginError = await loginResponse.json();
          throw new Error(`Error HTTP en login: ${loginError.details || loginError.error}`);
        }

        const loginData = await loginResponse.json();

        if (loginData && loginData.eid) {
          saveToken(loginData.eid);
          console.log('✅ Nuevo token Wialon obtenido y guardado:', loginData.eid);
          return loginData.eid;
        } else {
          throw new Error("No se pudo obtener token de Wialon");
        }
      } catch (error) {
        console.error('❌ Error en login:', error);
        clearToken();
        throw error;
      }
    };

    // Determinar qué token usar
    let currentToken = sessionIdOrToken || getStoredToken();

    // Si no hay token y no es una llamada de login, hacer login primero
    if (!currentToken && service !== "token/login") {
      currentToken = await performLogin();
    }

    // Si es una llamada de login explícita, proceder directamente
    if (service === "token/login") {
      return await performLogin();
    }

    // Preparar el payload para la API
    const payload = {
      service,
      params,
      sid: currentToken, // Usar sid en lugar de token para las llamadas normales
    };

    try {
      console.log(`📞 Llamando a Wialon API: ${service}`);
      
      const response = await fetch("/api/wialon-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Verificar si la respuesta HTTP es exitosa
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP ${response.status}: ${errorData.details || errorData.error || 'Error desconocido'}`);
      }

      const data = await response.json();

      // Verificar si es un error de autenticación de Wialon (token expirado o inválido)
      if (data && typeof data.error === 'number' && (data.error === 8 || data.error === 1 || data.error === 4)) {
        if (isRetry) {
          // Si ya reintentamos una vez, limpiar token y fallar
          clearToken();
          throw new Error(
            `Error Wialon API después del reintento (${data.error}): ${data.reason || service}`,
          );
        }

        console.warn('⚠️ Token expirado/inválido. Renovando automáticamente...');
        
        // Limpiar token actual y obtener uno nuevo
        clearToken();
        const newToken = await performLogin();
        
        // Reintentar la llamada original con el nuevo token
        console.log('🔄 Reintentando llamada con nuevo token...');
        return await callWialonApi(newToken, service, params, true);
      }

      // Manejar otros errores de Wialon (números de error diferentes)
      if (data && typeof data.error === 'number') {
        throw new Error(
          `Error Wialon API (${data.error}): ${data.reason || service}`,
        );
      }

      console.log(`✅ Respuesta exitosa de ${service}`);
      return data;
    } catch (err: any) {
      console.error(`❌ Error llamando a ${service}:`, err);
      
      // Si hay error de conexión/HTTP y no es retry, intentar renovar token
      if (!isRetry && err?.message?.includes('HTTP')) {
        console.warn('🔄 Error HTTP, intentando renovar token...');
        clearToken();
        try {
          const newToken = await performLogin();
          return await callWialonApi(newToken, service, params, true);
        } catch (loginErr) {
          console.error('❌ Falló el reintento con nuevo token:', loginErr);
        }
      }
      
      throw err;
    }
  }, []); // Sin dependencias para evitar re-creación

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
    if (!currentServicio) return "";

    const isOrigin = type === "origen";

    return `
      <div class="marker-popup">
        <div class="popup-header" style="background-color: #059669; color: white; padding: 8px; font-weight: bold; border-radius: 4px 4px 0 0;">
          ${isOrigin ? "Punto de Origen" : "Punto de Destino"}
        </div>
        <div class="popup-content" style="padding: 8px;">
          <div class="font-medium" style="font-weight: 600; margin-bottom: 4px;">
            ${
              isOrigin
                ? currentServicio.origen_especifico ||
                  currentServicio.origen?.nombre_municipio ||
                  "Origen"
                : currentServicio.destino_especifico ||
                  currentServicio.destino?.nombre_municipio ||
                  "Destino"
            }
          </div>
          <div class="popup-divider" style="height: 1px; background-color: #e5e7eb; margin: 8px 0;"></div>
          <div class="text-sm" style="font-size: 0.875rem;">
            ${
              isOrigin
                ? `
                <div>
                  <div class="font-medium" style="font-weight: 500;">Tipo de servicio:</div>
                  <div style="color: #6b7280;">${currentServicio.proposito_servicio || "No especificado"}</div>
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

  // Función para obtener información del vehículo desde Wialon con WebSocket
  const fetchVehicleTracking = useCallback(async (vehiclePlaca: string) => {
    // Obtener token de localStorage o del estado
    const currentToken = (typeof window !== 'undefined' ? localStorage.getItem('wialon_session_id') : null) || wialonSessionId;
    
    if (!currentToken) {
      console.warn("⚠️ No hay sessionId de Wialon disponible para tracking. Intentando login...");
      try {
        await callWialonApi(null, "token/login", {});
        // Después del login, volver a intentar
        return fetchVehicleTracking(vehiclePlaca);
      } catch (error) {
        console.error("❌ Error obteniendo token para tracking:", error);
        setTrackingError("Error al conectar con Wialon para tracking");
        return;
      }
    }

    try {
      setTrackingError("");
      console.log(`🚗 Buscando vehículo con placa: ${vehiclePlaca}`);

      const vehiclesData = await callWialonApi(
        currentToken,
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

      // Iniciar conexión WebSocket específica para este vehículo usando token permanente
      const permanentToken = process.env.NEXT_PUBLIC_WIALON_TOKEN;
      console.log("🔑 Verificando token permanente para WebSocket:", !!permanentToken);
      
      if (permanentToken) {
        console.log("🚀 Iniciando conexión WebSocket para vehículo:", vehicleData.nm);
        await connectVehicleWebSocket(vehicleData, permanentToken);
      } else {
        console.warn("⚠️ Token permanente no disponible para WebSocket");
        console.warn("⚠️ Variables de entorno disponibles:", Object.keys(process.env).filter(k => k.includes('WIALON')));
      }

      return trackingData;
    } catch (error) {
      console.error("Error obteniendo tracking del vehículo:", error);
      setTrackingError("Error al obtener información del vehículo");
    }
  }, [wialonSessionId]); // Solo dependencia estable

  // Función para conectar WebSocket específico al vehículo
  const connectVehicleWebSocket = useCallback(async (vehicleData: any, sessionToken: string) => {
    try {
      // Verificar que el SDK esté disponible
      if (!window.wialon) {
        console.warn("SDK de Wialon no disponible para WebSocket");
        return;
      }

      // Limpiar conexión anterior si existe
      disconnectVehicleWebSocket();

      console.log(`🔌 Conectando WebSocket para vehículo: ${vehicleData.nm}`);

      const session = window.wialon.core.Session.getInstance();
      wialonSessionRef.current = session;

      if (!session.getBaseUrl()) {
        session.initSession("https://hst-api.wialon.com");
      }

      // Usar token permanente desde variables de entorno para WebSocket
      const permanentToken = process.env.NEXT_PUBLIC_WIALON_TOKEN;
      console.log("🔑 Token permanente disponible:", !!permanentToken);
      
      if (!permanentToken) {
        throw new Error("Token permanente de Wialon no configurado en variables de entorno");
      }

      // Login con el token permanente
      await new Promise<void>((resolve, reject) => {
        console.log("🔐 Intentando login con token permanente...");
        session.loginToken(permanentToken, "", (code: number) => {
          console.log(`🔐 Resultado del login WebSocket: código ${code}`);
          if (code !== 0) {
            reject(new Error(`Error de autenticación WebSocket: código ${code}`));
            return;
          }
          console.log("✅ WebSocket autenticado en Wialon con token permanente");
          resolve();
        });
      });

      // Cargar bibliotecas necesarias
      session.loadLibrary("itemIcon");
      session.loadLibrary("unitEvents");

      // Actualizar la sesión para cargar las unidades
      await new Promise<void>((resolve, reject) => {
        session.updateDataFlags(
          [{ type: "type", data: "avl_unit", flags: 1025, mode: 0 }],
          (code: number) => {
            if (code !== 0) {
              reject(new Error(`Error cargando unidades WebSocket: código ${code}`));
              return;
            }
            console.log("🚗 Unidades cargadas en WebSocket");
            resolve();
          }
        );
      });

      // Obtener la unidad específica del vehículo
      const unit = session.getItem(vehicleData.id);
      if (!unit) {
        // Si no se encuentra por ID, buscar por nombre
        const units = session.getItems("avl_unit");
        const foundUnit = units.find((u: any) => 
          u.getName().includes(vehicleData.nm) || 
          u.getName().toLowerCase() === vehicleData.nm.toLowerCase()
        );
        
        if (!foundUnit) {
          throw new Error(`No se pudo obtener la unidad del vehículo ${vehicleData.nm}`);
        }
        vehicleUnitRef.current = foundUnit;
      } else {
        vehicleUnitRef.current = unit;
      }

      const actualUnit = vehicleUnitRef.current;
      console.log(`🛰️ WebSocket suscrito a vehículo: ${actualUnit.getName()}`);

      // Obtener posición inicial
      const currentPos = actualUnit.getPosition();
      if (currentPos) {
        const initialPosition = {
          lat: currentPos.y,
          lng: currentPos.x,
          speed: currentPos.s || 0,
          timestamp: currentPos.t || Date.now() / 1000,
          direction: currentPos.c || 0
        };

        setRealTimePosition(initialPosition);
        console.log("📍 Posición inicial WebSocket:", initialPosition);
      }

      // Configurar listener para cambios de posición en tiempo real
      const positionListener = (event: any) => {
        const pos = event.getPosition();
        const newPosition = {
          lat: pos.y,
          lng: pos.x,
          speed: pos.s || 0,
          timestamp: pos.t || Date.now() / 1000,
          direction: pos.c || 0,
          lastUpdate: new Date()
        };

        console.log("📡 Nueva posición WebSocket:", newPosition);
        setRealTimePosition(newPosition);

        // Actualizar también el tracking data para el marcador
        const updatedTrackingData = {
          id: vehicleData.id,
          name: vehicleData.nm,
          position: {
            x: pos.x,
            y: pos.y,
            s: pos.s || 0,
            c: pos.c || 0,
            t: pos.t || Date.now() / 1000
          },
          lastUpdate: new Date(),
          item: vehicleData,
        };
        setVehicleTracking(updatedTrackingData);
      };

      // Guardar referencia del listener y agregarlo
      positionListenerRef.current = positionListener;
      actualUnit.addListener("changePosition", positionListener);
      console.log("👂 Listener de posición agregado al vehículo:", actualUnit.getName());

      setIsVehicleWSConnected(true);
      setVehicleWSError(null);
      isWebSocketActiveRef.current = true;
      
      // Iniciar heartbeat para mantener la conexión viva
      heartbeatIntervalRef.current = setInterval(() => {
        if (wialonSessionRef.current && vehicleUnitRef.current) {
          try {
            // Verificar que la sesión siga activa
            const sessionId = wialonSessionRef.current.getId();
            if (sessionId) {
              console.log("💓 Heartbeat WebSocket - Conexión activa");
            } else {
              console.warn("💔 Heartbeat WebSocket - Sesión perdida");
              // Triggear reconexión
              setIsVehicleWSConnected(false);
            }
          } catch (error) {
            console.error("💔 Error en heartbeat WebSocket:", error);
            setIsVehicleWSConnected(false);
          }
        }
      }, 60000); // Cada 60 segundos
      
      console.log("🎉 WebSocket del vehículo conectado exitosamente");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error("❌ Error conectando WebSocket del vehículo:", errorMessage);
      setVehicleWSError(errorMessage);
      setIsVehicleWSConnected(false);
      isWebSocketActiveRef.current = false;

      // Programar reconexión automática en 10 segundos
      wsReconnectTimeoutRef.current = setTimeout(() => {
        console.log("🔄 Intentando reconectar WebSocket del vehículo...");
        connectVehicleWebSocket(vehicleData, sessionToken);
      }, 10000);
    }
  }, []);

  // Función para desconectar WebSocket del vehículo
  /**
   * Desconecta de forma segura el WebSocket del vehículo y limpia recursos asociados.
   *
   * Este procedimiento realiza varias acciones de saneamiento y cierre:
   * - Cancela y limpia cualquier temporizador de reconexión pendiente.
   * - Elimina el listener "changePosition" del vehículo para evitar fugas de memoria
   *   o callbacks residuales.
   * - Si la sesión de Wialon está activa y el WebSocket del vehículo se reporta como conectado,
   *   ejecuta `logout` para cerrar correctamente la sesión y liberar la conexión.
   * - Restablece referencias internas (`vehicleUnitRef`, `wialonSessionRef`) a `null`
   *   para impedir accesos posteriores no válidos.
   * - Actualiza el estado de la UI, marcando la conexión como desconectada,
   *   limpiando errores previos y reiniciando la posición en tiempo real.
   *
   * Nota sobre el comportamiento condicional:
   * - El cierre de sesión en Wialon sólo se ejecuta si existen tanto una sesión activa
   *   como un estado que indique conexión (`isVehicleWSConnected`). Esto evita
   *   invocaciones redundantes o excepciones cuando no hay conexión real.
   * - La eliminación del listener y el reseteo de referencias se realizan únicamente
   *   si dichas referencias existen, previniendo errores al operar sobre valores nulos.
   *
   * Efectos colaterales:
   * - Ajusta estados React relacionados con la conexión, error y posición.
   * - Emite trazas en consola para facilitar la observabilidad del ciclo de desconexión.
   *
   * Dependencias:
   * - Depende de `isVehicleWSConnected` para decidir si cerrar la sesión de Wialon.
   */
  const disconnectVehicleWebSocket = useCallback(() => {
    console.log("🛑 Iniciando desconexión del WebSocket del vehículo...");
    
    // Cancelar reconexión automática si existe
    if (wsReconnectTimeoutRef.current) {
      clearTimeout(wsReconnectTimeoutRef.current);
      wsReconnectTimeoutRef.current = null;
      console.log("⏹️ Reconexión automática cancelada");
    }

    // Cancelar heartbeat si existe
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
      console.log("💔 Heartbeat cancelado");
    }

    // Remover listener usando la referencia guardada
    if (vehicleUnitRef.current && positionListenerRef.current) {
      try {
        vehicleUnitRef.current.removeListener("changePosition", positionListenerRef.current);
        console.log("🧹 Listener de posición removido correctamente");
        positionListenerRef.current = null;
      } catch (err) {
        console.error("❌ Error removiendo listener de posición:", err);
      }
    }

    // Limpiar referencia del vehículo
    if (vehicleUnitRef.current) {
      vehicleUnitRef.current = null;
      console.log("🧹 Referencia del vehículo limpiada");
    }

    // Cerrar sesión de Wialon si está conectada
    if (wialonSessionRef.current && isVehicleWSConnected) {
      try {
        wialonSessionRef.current.logout(() => {
          console.log("👋 Sesión WebSocket cerrada correctamente");
        });
      } catch (err) {
        console.error("❌ Error cerrando sesión WebSocket:", err);
      } finally {
        wialonSessionRef.current = null;
      }
    }

    // Actualizar estados
    setIsVehicleWSConnected(false);
    setVehicleWSError(null);
    setRealTimePosition(null);
    isWebSocketActiveRef.current = false;
    
    console.log("✅ Desconexión del WebSocket completada");
  }, [isVehicleWSConnected]);

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

  // Efecto para cargar foto del conductor
  useEffect(() => {
    const cargarFotoPerfil = async () => {
      setFotoUrl(null);
      setPhotoError(false);
      setImageLoaded(false);

      const fotoPerfil = currentServicio?.conductor?.documentos?.find(
        (doc: Documento) => doc.categoria === "FOTO_PERFIL",
      );

      if (fotoPerfil?.s3_key) {
        setIsLoadingPhoto(true);
        try {
          const url = await getPresignedUrl(fotoPerfil.s3_key);
          if (url) {
            setFotoUrl(url);
          } else {
            setPhotoError(true);
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

    if (currentServicio?.conductor) {
      cargarFotoPerfil();
    }
  }, [currentServicio?.conductor?.id, getPresignedUrl]);

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
    // Evitar inicialización múltiple
    if (isWialonInitializedRef.current || wialonInitPromiseRef.current) {
      return;
    }

    const initWialon = async () => {
      try {
        console.log("🔐 Verificando sesión de Wialon...");
        
        // Verificar si ya hay un token en localStorage
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('wialon_session_id') : null;
        
        if (storedToken) {
          console.log("📱 Token encontrado en localStorage:", storedToken);
          setWialonSessionId(storedToken);
          
          // Verificar si el token sigue siendo válido haciendo una llamada de prueba
          try {
            await callWialonApi(storedToken, "core/search_items", {
              spec: { itemsType: "avl_unit", propName: "sys_name", propValueMask: "*" },
              force: 1, flags: 1, from: 0, to: 1
            });
            console.log("✅ Token de localStorage válido");
            isWialonInitializedRef.current = true;
            return; // Token válido, no necesitamos hacer login
          } catch (error) {
            console.warn("⚠️ Token de localStorage inválido, obteniendo nuevo...");
            // El token no es válido, se limpiará automáticamente en callWialonApi
          }
        }
        
        // Si no hay token o no es válido, hacer login
        console.log("🔐 Iniciando nueva sesión...");
        await callWialonApi(null, "token/login", {});
        console.log("✅ Sesión de Wialon iniciada exitosamente");
        isWialonInitializedRef.current = true;
        
      } catch (error) {
        console.error("❌ Error al inicializar Wialon:", error);
        setTrackingError("Error al conectar con el sistema de tracking");
      } finally {
        wialonInitPromiseRef.current = null;
      }
    };

    // Crear promesa para evitar múltiples inicializaciones
    wialonInitPromiseRef.current = initWialon();
  }, []); // Solo ejecutar una vez al cargar el componente

  // Efecto para inicializar el mapa
  useEffect(() => {
    if (
      !MAPBOX_ACCESS_TOKEN ||
      !mapContainer.current ||
      map.current ||
      !currentServicio
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
  }, [MAPBOX_ACCESS_TOKEN, currentServicio?.id]);

  // Efecto para cargar SDK de Wialon
  useEffect(() => {
    const loadWialonSDK = () => {
      if (window.wialon) {
        return;
      }

      console.log("📦 Cargando SDK de Wialon para WebSocket...");
      
      const script = document.createElement("script");
      script.src = "https://hst-api.wialon.com/wsdk/script/wialon.js";
      script.async = true;
      
      script.onload = () => {
        console.log("✅ SDK de Wialon para WebSocket cargado");
      };
      
      script.onerror = () => {
        console.error("❌ Error cargando SDK de Wialon para WebSocket");
        setVehicleWSError("Error cargando SDK de Wialon");
      };

      document.head.appendChild(script);
    };

    loadWialonSDK();
  }, []);

  // Efecto para limpiar WebSocket al desmontar el componente
  useEffect(() => {
    return () => {
      // Solo desconectar si realmente se está desmontando (no durante Fast Refresh)
      const shouldDisconnect = () => {
        // En desarrollo, verificar si es Fast Refresh o desmontaje real
        if (process.env.NODE_ENV === 'development') {
          // Si tenemos una conexión activa y es desarrollo, no desconectar inmediatamente
          if (isWebSocketActiveRef.current) {
            console.log("🛠️ Desarrollo: postponiendo desconexión WebSocket durante Fast Refresh");
            setTimeout(() => {
              // Verificar si aún no se ha reconectado después de 5 segundos
              if (!isWebSocketActiveRef.current) {
                console.log("🧹 Limpiando WebSocket después de timeout en desarrollo");
                disconnectVehicleWebSocket();
              }
            }, 5000);
            return false;
          }
        }
        return true;
      };

      if (shouldDisconnect()) {
        console.log("🏭 Limpiando WebSocket al desmontar componente");
        disconnectVehicleWebSocket();
      }
    };
  }, []);

  // Efecto para verificar el estado de la conexión WebSocket periódicamente
  useEffect(() => {
    if (!isVehicleWSConnected) return;

    const checkConnection = () => {
      if (wialonSessionRef.current && vehicleUnitRef.current) {
        try {
          // Verificar si la sesión sigue activa
          const session = wialonSessionRef.current;
          if (session && typeof session.getId === 'function') {
            const sessionId = session.getId();
            if (!sessionId) {
              console.warn("⚠️ Sesión WebSocket perdida, reconectando...");
              setIsVehicleWSConnected(false);
              setVehicleWSError("Conexión perdida, reconectando...");
              
              // Intentar reconectar si tenemos datos del vehículo
              if (vehicleTracking) {
                const permanentToken = process.env.NEXT_PUBLIC_WIALON_TOKEN;
                if (permanentToken) {
                  connectVehicleWebSocket(vehicleTracking.item, permanentToken);
                }
              }
            }
          }
        } catch (error) {
          console.error("❌ Error verificando estado de la conexión:", error);
        }
      }
    };

    const interval = setInterval(checkConnection, 30000); // Verificar cada 30 segundos

    return () => {
      clearInterval(interval);
    };
  }, [isVehicleWSConnected, vehicleTracking, connectVehicleWebSocket]);

  // Efecto para actualizar marcador del vehículo en tiempo real
  useEffect(() => {
    if (!realTimePosition || !map.current || !isMapLoaded) return;

    // Actualizar marcador del vehículo con la nueva posición
    if (markersRef.current.vehicle) {
      const newLngLat: [number, number] = [realTimePosition.lng, realTimePosition.lat];
      markersRef.current.vehicle.setLngLat(newLngLat);

      // Actualizar popup si está abierto
      const popup = markersRef.current.vehicle.getPopup();
      if (popup && popup.isOpen()) {
        const updatedPopupContent = `
          <div class="vehicle-popup" style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${vehicleTracking?.name || "Vehículo"}</h3>
            <div style="font-size: 0.875rem;">
              <div style="margin-bottom: 4px;">
                <strong>Velocidad:</strong> ${realTimePosition.speed || 0} km/h
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Dirección:</strong> ${realTimePosition.direction || 0}°
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Coordenadas:</strong><br>
                ${realTimePosition.lng?.toFixed(6)}, ${realTimePosition.lat?.toFixed(6)}
              </div>
              <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
                  <span>En tiempo real</span>
                </div>
              </div>
            </div>
          </div>
        `;
        popup.setHTML(updatedPopupContent);
      }

      console.log("🔄 Marcador del vehículo actualizado en tiempo real");
    }
  }, [realTimePosition, vehicleTracking?.name, map, isMapLoaded]);

  // Memoizar las coordenadas del servicio para evitar re-renders innecesarios
  const servicioCoords = useMemo(() => {
    if (!currentServicio) return null;
    
    const origenLat = currentServicio.origen_latitud || currentServicio.origen?.latitud;
    const origenLng = currentServicio.origen_longitud || currentServicio.origen?.longitud;
    const destinoLat = currentServicio.destino_latitud || currentServicio.destino?.latitud;
    const destinoLng = currentServicio.destino_longitud || currentServicio.destino?.longitud;
    
    if (!origenLat || !origenLng || !destinoLat || !destinoLng) {
      return null;
    }
    
    return {
      origen: [origenLng, origenLat] as [number, number],
      destino: [destinoLng, destinoLat] as [number, number],
      servicioId: currentServicio.id,
      estado: currentServicio.estado,
      vehiculoPlaca: currentServicio.vehiculo?.placa || null
    };
  }, [
    currentServicio?.id,
    currentServicio?.estado,
    currentServicio?.origen_latitud,
    currentServicio?.origen_longitud,
    currentServicio?.destino_latitud,
    currentServicio?.destino_longitud,
    currentServicio?.origen?.latitud,
    currentServicio?.origen?.longitud,
    currentServicio?.destino?.latitud,
    currentServicio?.destino?.longitud,
    currentServicio?.vehiculo?.placa,
  ]);

  // Efecto para crear/actualizar ruta cuando cambie el servicio
  useEffect(() => {
    if (!isMapLoaded || !map.current || !servicioCoords) return;

    clearMapObjects();

    const { origen: origenCoords, destino: destinoCoords, estado, vehiculoPlaca } = servicioCoords;
    const bounds = new mapboxgl.LngLatBounds();

    const markerOrigen = createMarker(
      origenCoords,
      "origen",
      createPopupHTML("origen"),
    );

    if (markerOrigen) {
      markersRef.current.origen = markerOrigen;
      bounds.extend(origenCoords);
    }

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

      if (estado === "en_curso" && vehiculoPlaca && isWialonInitializedRef.current) {
        try {
          const trackingData = await fetchVehicleTracking(vehiculoPlaca);

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
  }, [isMapLoaded, servicioCoords, fetchVehicleTracking]); // Dependencias optimizadas

  if (loading) {
    return <LoadingPage>Cargando servicio</LoadingPage>;
  }

  if (!currentServicio) {
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
              ${
                isNavigating
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

  const statusColors = getStatusColor(currentServicio.estado);

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
            <div className="py-4 sm:py-6">
              {/* Mobile Layout */}
              <div className="block lg:hidden">
                {/* Top row - Back button and title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {user && (
                      <button
                        className={`
                                  w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center
                                  ${
                                    isNavigating
                                      ? "bg-gray-100 cursor-not-allowed opacity-50"
                                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
                                  }
                              `}
                        disabled={isNavigating}
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
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600"
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
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                          Servicio de Transporte
                        </h1>
                        <p className="text-sm text-gray-500 font-medium hidden sm:block">
                          ID: {currentServicio.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom row - Status and share button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                      Estado:
                    </span>
                    <span
                      className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold border"
                      style={{
                        backgroundColor: `${statusColors}15`,
                        borderColor: `${statusColors}40`,
                        color: statusColors,
                      }}
                    >
                      {getStatusText(currentServicio.estado)}
                    </span>
                  </div>

                  {user && (
                    <ModalShareServicio
                      isNavigating={isNavigating}
                      servicioId={servicioId}
                      handleShareBasicTicket={handleShare}
                    />
                  )}
                </div>

                {/* Mobile ID display */}
                <div className="block sm:hidden mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">
                    ID: {currentServicio.id}
                  </p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {user && (
                    <button
                      className={`
                              w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center
                              ${
                                isNavigating
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
                  )}

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
                        ID: {currentServicio.id}
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
                      {getStatusText(currentServicio.estado)}
                    </span>
                  </div>

                  {user && (
                    <>
                      <div className="h-8 w-px bg-gray-200" />
                      <ModalShareServicio
                        isNavigating={isNavigating}
                        servicioId={servicioId}
                        handleShareBasicTicket={handleShare}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Sidebar - Información del Conductor, Vehículo y Cliente */}
            <div className="xl:col-span-1 space-y-2">
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

                <div className="grid grid-cols-2 xl:grid-cols-1 gap-4 items-center">
                  {/* Foto del Conductor */}
                  <div className="mb-4">
                    <ConductorPhoto />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nombre</p>
                      <p className="text-base font-medium text-gray-900">
                        {currentServicio.conductor?.nombre}{" "}
                        {currentServicio.conductor?.apellido}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Identificación
                      </p>
                      <p className="text-sm text-gray-700">
                        {currentServicio.conductor?.tipo_identificacion}:{" "}
                        {currentServicio.conductor?.numero_identificacion ||
                          "No especificado"}
                      </p>
                    </div>

                    {currentServicio.conductor?.telefono && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                        <p className="text-sm text-gray-700">
                          {currentServicio.conductor.telefono}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <ModalDocumentosConductor
                    conductorData={currentServicio.conductor}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {/* Información del Vehículo */}
                {currentServicio.vehiculo && (
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
                          {currentServicio.vehiculo.placa}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Clase Vehículo
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {currentServicio.vehiculo.clase_vehiculo}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Vehículo</p>
                        <p className="text-sm text-gray-700">
                          {currentServicio.vehiculo.marca}{" "}
                          {currentServicio.vehiculo.linea}{" "}
                          {currentServicio.vehiculo.modelo}
                        </p>
                      </div>

                      {currentServicio.vehiculo.color && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Color</p>
                          <p className="text-sm text-gray-700">
                            {currentServicio.vehiculo.color}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <ModalDocumentosVehiculo
                        vehicleData={currentServicio.vehiculo}
                      />
                    </div>
                  </div>
                )}

                {/* Información del Cliente */}
                {currentServicio.cliente && (
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
                          {currentServicio.cliente.nombre}
                        </p>
                      </div>

                      {currentServicio.cliente.nit && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">NIT</p>
                          <p className="text-sm text-gray-700">
                            {currentServicio.cliente.nit}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-3 flex flex-col">
              {/* Main Content - Mapa más grande */}
              <div className="h-full mb-2">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-full">
                  {mapError && (
                    <div className="p-3 bg-red-100 text-red-800 text-sm border-b border-red-200">
                      <span className="font-medium">Error:</span> {mapError}
                    </div>
                  )}

                  <div className="relative h-96 xl:h-full">
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

                    {isMapLoaded && currentServicio && (
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
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 bg-[#0077b6] rounded-full flex items-center justify-center text-white text-xs">
                              🚗
                            </div>
                            <span>Vehículo</span>
                          </div>
                        )}
                        {/* Indicador WebSocket */}
                        {currentServicio.estado === "en_curso" && currentServicio.vehiculo?.placa && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  isVehicleWSConnected ? 'bg-green-500 animate-pulse' : 
                                  vehicleWSError ? 'bg-red-500' : 'bg-gray-400'
                                }`} />
                                <span className={`text-xs font-medium ${
                                  isVehicleWSConnected ? 'text-green-700' : 
                                  vehicleWSError ? 'text-red-700' : 'text-gray-600'
                                }`}>
                                  {isVehicleWSConnected ? 'Tiempo real' : 
                                   vehicleWSError ? 'Error WS' : 'Desconectado'}
                                </span>
                              </div>
                              
                              {/* Botón de reconexión */}
                              {!isVehicleWSConnected && vehicleTracking && (
                                <button
                                  onClick={async () => {
                                    const permanentToken = process.env.NEXT_PUBLIC_WIALON_TOKEN;
                                    if (permanentToken && vehicleTracking.item) {
                                      await connectVehicleWebSocket(vehicleTracking.item, permanentToken);
                                    }
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                  title="Reconectar WebSocket"
                                >
                                  🔄
                                </button>
                              )}
                            </div>
                            
                            {vehicleWSError && (
                              <div className="text-xs text-red-600 mb-1 max-w-40 truncate" title={vehicleWSError}>
                                {vehicleWSError}
                              </div>
                            )}
                            
                            {realTimePosition && isVehicleWSConnected && (
                              <div className="text-xs text-blue-600 font-medium">
                                {realTimePosition.speed} km/h • {realTimePosition.direction}°
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Información del Servicio con diseño minimalista */}
              <div className="grid sm:grid-cols-2 gap-2">
                <div className="space-y-2">
                  <CronogramaCard
                    servicio={currentServicio}
                    formatearFecha={formatearFecha}
                  />
                  <ObservacionesCard
                    observaciones={currentServicio.observaciones}
                  />
                  <CoordenadasCard servicio={currentServicio} />
                  {currentServicio.cancelacion && (
                    <CancelacionCard
                      cancelacion={currentServicio.cancelacion}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <RecorridoCard
                    servicio={currentServicio}
                    distancia={distancia}
                    duracion={duracion}
                    formatDuration={formatDuration}
                  />
                  <ProcesamientoCard servicio={currentServicio} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ServicioPublicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params); // ✅ Usar React.use() en lugar de await

  return (
    <Suspense fallback={<LoadingPage>Cargando servicio...</LoadingPage>}>
      <ServicioContent params={resolvedParams} />
    </Suspense>
  );
}

// Componentes separados
const CronogramaCard = ({
  servicio,
  formatearFecha,
}: {
  servicio: ServicioConRelaciones;
  formatearFecha: (fechaISOString: Date | string | undefined) => string;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-2">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
        <Calendar className="w-4 h-4 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Cronograma</h3>
    </div>
    <div className="space-y-6">
      {/* Fecha de solicitud - siempre mostrar */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Fecha de solicitud</p>
        <p className="text-base font-medium text-gray-900">
          {formatearFecha(servicio.fecha_solicitud)}
        </p>
      </div>

      {/* Fecha de realización - solo si existe */}
      {servicio.fecha_realizacion && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Fecha de realización</p>
          <p className="text-base font-medium text-gray-900">
            {formatearFecha(servicio.fecha_realizacion)}
          </p>
        </div>
      )}

      {/* Fecha de finalización - solo si existe */}
      {servicio.fecha_finalizacion && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Fecha de finalización</p>
          <p className="text-base font-medium text-gray-900">
            {formatearFecha(servicio.fecha_finalizacion)}
          </p>
        </div>
      )}
    </div>
  </div>
);

const ObservacionesCard = ({ observaciones }: { observaciones: string }) => (
  <div
    className={`rounded-xl border p-6 ${
      observaciones
        ? "bg-amber-50 border-amber-100"
        : "bg-white border-gray-100"
    }`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          observaciones ? "bg-amber-100" : "bg-gray-100"
        }`}
      >
        <Info
          className={`w-4 h-4 ${
            observaciones ? "text-amber-600" : "text-gray-400"
          }`}
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Observaciones</h3>
    </div>
    {observaciones ? (
      <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
        {observaciones}
      </p>
    ) : (
      <p className="text-sm text-gray-400 italic">
        No hay observaciones para este servicio.
      </p>
    )}
  </div>
);

const CoordenadasCard = ({ servicio }: { servicio: ServicioConRelaciones }) => {
  const origenLat = servicio.origen_especifico
    ? servicio.origen_latitud
    : servicio.origen?.latitud;
  const origenLng = servicio.origen_especifico
    ? servicio.origen_longitud
    : servicio.origen?.longitud;
  const destinoLat = servicio.destino_especifico
    ? servicio.destino_latitud
    : servicio.destino?.latitud;
  const destinoLng = servicio.destino_especifico
    ? servicio.destino_longitud
    : servicio.destino?.longitud;

  if (!origenLat && !destinoLat) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Coordenadas</h3>
      </div>
      <div className="space-y-3">
        {origenLat && origenLng && (
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Origen {servicio.origen_especifico && "(Específico)"}
            </p>
            <p className="text-sm font-mono text-gray-900">
              {origenLat}, {origenLng}
            </p>
          </div>
        )}
        {destinoLat && destinoLng && (
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Destino {servicio.destino_especifico && "(Específico)"}
            </p>
            <p className="text-sm font-mono text-gray-900">
              {destinoLat}, {destinoLng}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CancelacionCard = ({ cancelacion }: { cancelacion: Cancelacion }) => {
  if (!cancelacion) return null;

  return (
    <div className="bg-red-50 rounded-xl border border-red-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <Ban className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Cancelación</h3>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">Motivo</p>
          <p className="text-sm font-medium text-gray-900">
            {DEFAULT_MOTIVOS.find(
              (motivo) => motivo.value === cancelacion.motivo_cancelacion,
            )?.label || cancelacion.motivo_cancelacion}
          </p>
        </div>

        {cancelacion.observaciones && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Observaciones</p>
            <p className="text-sm text-gray-900">{cancelacion.observaciones}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-1">Fecha de cancelación</p>
          <p className="text-sm text-gray-900">
            {new Date(cancelacion.fecha_cancelacion).toLocaleString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {cancelacion.usuario_cancelacion && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Cancelado por</p>
            <p className="text-sm text-gray-900">
              {cancelacion.usuario_cancelacion.nombre}
              <span className="text-xs text-gray-500 ml-2">
                ({cancelacion.usuario_cancelacion.role})
              </span>
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-1">Fecha de registro</p>
          <p className="text-xs text-gray-600">
            {new Date(cancelacion.created_at).toLocaleString("es-CO", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const RecorridoCard = ({
  servicio,
  distancia,
  duracion,
  formatDuration,
}: {
  servicio: ServicioConRelaciones;
  distancia: number;
  duracion: number;
  formatDuration: (duracion: number) => string;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
        <Route className="w-4 h-4 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Recorrido</h3>
    </div>

    <div className="space-y-6">
      {/* Ruta principal */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Origen</p>
              <p className="text-base font-medium text-gray-900">
                {servicio.origen?.nombre_municipio || "No especificado"}
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
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destino</p>
              <p className="text-base font-medium text-gray-900">
                {servicio.destino?.nombre_municipio || "No especificado"}
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
          <p className="text-sm text-gray-500 mb-1">Propósito del servicio</p>
          <p className="text-base text-gray-900 capitalize">
            Transporte de {servicio.proposito_servicio}
          </p>
        </div>
      )}
    </div>
  </div>
);

const ProcesamientoCard = ({
  servicio,
}: {
  servicio: ServicioConRelaciones;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
        <Clock className="w-4 h-4 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Procesamiento</h3>
    </div>
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500 mb-1">Fecha de creación</p>
        <p className="text-sm text-gray-900">
          {new Date(servicio.created_at || servicio.createdAt).toLocaleString(
            "es-CO",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Última actualización</p>
        <p className="text-sm text-gray-900">
          {new Date(servicio.updated_at || servicio.updatedAt).toLocaleString(
            "es-CO",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
        </p>
      </div>
    </div>
  </div>
);
