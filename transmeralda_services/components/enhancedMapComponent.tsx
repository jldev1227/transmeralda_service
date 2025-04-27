"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    SetStateAction,
    Dispatch,
} from "react";
import mapboxgl from "mapbox-gl";

import { Servicio, ServicioConRelaciones, VehicleTracking } from "@/context/serviceContext";
import "mapbox-gl/dist/mapbox-gl.css";

interface EnhancedMapComponentProps {
    servicios: ServicioConRelaciones[];
    selectedServicio: ServicioConRelaciones | null;
    vehicleTracking: VehicleTracking | null;
    trackingError: string;
    handleServicioClick: (servicio: ServicioConRelaciones) => void;
    getStatusText: (status: string) => string;
    getServiceTypeText: (text: string) => string;
    mapboxToken: string;
    onWialonRequest: (sessionId: string, endpoint: string, params: any) => Promise<any>;
    wialonToken: string;
    setServicioWithRoutes: Dispatch<SetStateAction<ServicioConRelaciones | null>>
}

interface VehicleMarkerData {
    vehicle: any;
    service: Servicio;
    marker?: mapboxgl.Marker;
}

interface MarkersRef {
    origen?: mapboxgl.Marker;
    destino?: mapboxgl.Marker;
    vehicle?: mapboxgl.Marker;
    activeVehicles: Map<string, mapboxgl.Marker>;
}

const EnhancedMapComponent = ({
    servicios,
    selectedServicio,
    vehicleTracking,
    trackingError,
    handleServicioClick,
    getStatusText,
    getServiceTypeText,
    mapboxToken,
    onWialonRequest,
    wialonToken,
    setServicioWithRoutes
}: EnhancedMapComponentProps) => {

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<MarkersRef>({
        activeVehicles: new Map(),
    });

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string>("");
    const [activeVehiclesData, setActiveVehiclesData] = useState<VehicleMarkerData[]>([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [detallesVisible, setDetallesVisible] = useState(false);
    const [wialonSessionId, setWialonSessionId] = useState<string | null>(null);

    const statusColors = {
        solicitado: "#6a7282",
        realizado: "#155dfc",
        "en curso": "#00bc7d",
        planificado: "#FF9800",
        cancelado: "#F44336",
        default: "#3388ff"
    };

    const color = useMemo(() => {
        if (!selectedServicio) return statusColors.default;
        return statusColors[selectedServicio.estado as keyof typeof statusColors] || statusColors.default;
    }, [selectedServicio]);

    useEffect(() => {
        const initWialon = async () => {
            if (!wialonToken) return;

            try {
                const loginData = await onWialonRequest(wialonToken, "token/login", {});
                if (loginData?.eid) {
                    setWialonSessionId(loginData.eid);
                }
            } catch (error) {
                console.error("Error al iniciar sesión en Wialon:", error);
            }
        };

        initWialon();
    }, [wialonToken, onWialonRequest]);

    useEffect(() => {
        if (selectedServicio || !wialonSessionId) return;

        const fetchActiveVehicles = async () => {
            setIsLoadingVehicles(true);
            try {
                const vehiclesData = await onWialonRequest(wialonSessionId, "core/search_items", {
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
                });

                if (!vehiclesData?.items) return;

                const serviciosEnCurso = servicios.filter(s => s.estado === "en curso");
                const vehicleMarkers: VehicleMarkerData[] = [];

                for (const servicio of serviciosEnCurso) {
                    if (servicio.vehiculo?.placa) {
                        const vehicleData = vehiclesData.items.find(v =>
                            v.nm.includes(servicio.vehiculo.placa) ||
                            v.nm.toLowerCase() === servicio.vehiculo.placa.toLowerCase()
                        );

                        if (vehicleData?.pos) {
                            vehicleMarkers.push({
                                vehicle: vehicleData,
                                service: servicio
                            });
                        }
                    }
                }

                setActiveVehiclesData(vehicleMarkers);
            } catch (error) {
                console.error("Error al obtener vehículos activos:", error);
            } finally {
                setIsLoadingVehicles(false);
            }
        };

        fetchActiveVehicles();
        const interval = setInterval(fetchActiveVehicles, 30000);

        return () => clearInterval(interval);
    }, [selectedServicio, servicios, wialonSessionId, onWialonRequest]);

    useEffect(() => {
        if (!mapboxToken) {
            setMapError("Token de Mapbox no configurado");
            return;
        }

        mapboxgl.accessToken = mapboxToken;
    }, [mapboxToken]);

    useEffect(() => {
        if (!mapboxToken || !mapContainer.current || map.current) return;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/outdoors-v12",
                center: [-72.395, 5.3377], // Yopal
                zoom: 12,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

            map.current.on("load", () => {
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

    const createPulsingVehicleMarker = (vehicleData: any, service: Servicio) => {
        if (!map.current) return null;

        const el = document.createElement("div");
        el.className = "pulsing-vehicle-marker";

        const center = document.createElement("div");
        center.className = "marker-center";
        el.appendChild(center);

        const pulse1 = document.createElement("div");
        pulse1.className = "pulse pulse-1";
        el.appendChild(pulse1);

        const pulse2 = document.createElement("div");
        pulse2.className = "pulse pulse-2";
        el.appendChild(pulse2);

        const popup = new mapboxgl.Popup({
            offset: 25,
            closeOnClick: false,
            closeButton: true
        }).setHTML(`
      <div class="vehicle-popup">
        <h3 class="font-bold">${vehicleData.nm}</h3>
        <div class="text-sm mt-1">
          <div>Servicio: ${service.id?.substring(0, 8)}...</div>
          <div>Origen: ${service.origen_especifico}</div>
          <div>Destino: ${service.destino_especifico}</div>
          <div>Velocidad: ${vehicleData.pos.s || 0} km/h</div>
        </div>
      </div>
    `);

        const marker = new mapboxgl.Marker(el)
            .setLngLat([vehicleData.pos.x, vehicleData.pos.y])
            .setPopup(popup)
            .addTo(map.current);

        // Split click behavior: toggle popup on marker click, select service on double click
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            marker.togglePopup();
        });

        el.addEventListener("dblclick", () => {
            handleServicioClick(service);
        });

        return marker;
    };

    // Track previous selectedServicio state to detect when it changes from non-null to null
    const prevSelectedServicioRef = useRef<ServicioConRelaciones | null>(null);

    // Track the number of times we've created markers to avoid duplicates
    const markersCreatedRef = useRef<boolean>(false);

    // Dedicated effect to create vehicle markers when data is ready
    useEffect(() => {
        if (!isMapLoaded || !map.current || selectedServicio || activeVehiclesData.length === 0) return;
        
        // Always clear markers before creating new ones
        markersRef.current.activeVehicles.forEach(marker => marker.remove());
        markersRef.current.activeVehicles.clear();
        
        // Create markers for all active vehicles
        activeVehiclesData.forEach(data => {
            const marker = createPulsingVehicleMarker(data.vehicle, data.service);
            if (marker) {
                markersRef.current.activeVehicles.set(data.vehicle.id.toString(), marker);
            }
        });
        
        markersCreatedRef.current = true;
        
        // Fit map to show all active vehicles
        if (map.current) {
            const bounds = new mapboxgl.LngLatBounds();
            activeVehiclesData.forEach(data => {
                bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
            });
            
            if (!bounds.isEmpty()) {
                map.current.fitBounds(bounds, {
                    padding: 100,
                    maxZoom: 14
                });
            }
        }
    }, [isMapLoaded, activeVehiclesData, selectedServicio, createPulsingVehicleMarker]);

    useEffect(() => {
        if (!isMapLoaded || !map.current) return;

        const wasServiceSelected = prevSelectedServicioRef.current !== null;
        const isServiceSelected = selectedServicio !== null;

        // Update reference for next render
        prevSelectedServicioRef.current = selectedServicio;

        // If we're still looking at a selected service, don't show the overview
        if (isServiceSelected) {
            // Clear existing active vehicle markers when selecting a service
            markersRef.current.activeVehicles.forEach(marker => marker.remove());
            markersRef.current.activeVehicles.clear();
            markersCreatedRef.current = false;
            return;
        }

        // Special handling for when transitioning from service view to overview
        if (wasServiceSelected && !isServiceSelected) {
            // Make sure the map properly resets when closing a service view
            if (map.current) {
                // Reset marker creation flag to allow fresh creation
                markersCreatedRef.current = false;
                
                setTimeout(() => {
                    if (!map.current || selectedServicio) return; // Double-check state
                    
                    // Create markers for all active vehicles
                    markersRef.current.activeVehicles.forEach(marker => marker.remove());
                    markersRef.current.activeVehicles.clear();
                    
                    activeVehiclesData.forEach(data => {
                        const marker = createPulsingVehicleMarker(data.vehicle, data.service);
                        if (marker) {
                            markersRef.current.activeVehicles.set(data.vehicle.id.toString(), marker);
                        }
                    });
                    markersCreatedRef.current = true;
                    
                    // Re-center the map if needed
                    if (activeVehiclesData.length > 0) {
                        const bounds = new mapboxgl.LngLatBounds();
                        activeVehiclesData.forEach(data => {
                            bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
                        });

                        map.current.fitBounds(bounds, {
                            padding: 100,
                            maxZoom: 14
                        });
                    }
                }, 150); // Short delay to ensure state is fully updated
            }
        }
    }, [activeVehiclesData, isMapLoaded, selectedServicio, handleServicioClick, createPulsingVehicleMarker]);

    const createPopupHTML = (type: "origen" | "destino") => {
        if (!selectedServicio) return "";

        const isOrigin = type === "origen";
        const statusClass = selectedServicio.estado.toLowerCase().replace(" ", "-");

        return `
      <div class="marker-popup">
        <div class="popup-header popup-${statusClass}">
          ${isOrigin ? "Origen" : "Destino"} - ${getStatusText(selectedServicio.estado || "")}
        </div>
        <div class="popup-content">
          <div class="font-medium">
            ${isOrigin ? selectedServicio.origen_especifico || "" : selectedServicio.destino_especifico || ""}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            ID: ${selectedServicio.id}
          </div>

          <div class="popup-divider"></div>

          ${isOrigin
                ? `<div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div class="font-medium">Tipo de servicio</div>
                <div>${getServiceTypeText(selectedServicio.tipo_servicio || "")}</div>
              </div>
              <div>
                <div class="font-medium">Fecha inicio</div>
                <div>${new Date(selectedServicio.fecha_inicio).toLocaleDateString()}</div>
              </div>
            </div>`
                : `<div class="text-sm">
              <div>
                <div class="font-medium">Distancia</div>
                <div>${selectedServicio.distancia_km} km</div>
              </div>
            </div>`
            }
        </div>
      </div>
    `;
    };

    const createMarker = (
        lngLat: [number, number],
        type: "origen" | "destino",
        popupContent: string,
    ) => {
        if (!map.current || !selectedServicio) return null;

        const el = document.createElement("div");
        el.className = `custom-marker marker-${type}`;
        el.style.backgroundColor = color;
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.borderRadius = "50%";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "white";
        el.style.fontWeight = "bold";
        el.innerText = type === "origen" ? "A" : "B";

        // Create popup with closeOnClick: false to prevent it from closing automatically
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeOnClick: false,
            closeButton: true
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map.current);

        // Add click event to show popup and prevent it from disappearing immediately
        el.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event from bubbling
            marker.togglePopup(); // Show/hide the popup instead of triggering the service click
        });

        return marker;
    };

    const createVehicleMarker = (lngLat: [number, number]) => {
        if (!map.current || !vehicleTracking) return null;

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

        const popup = new mapboxgl.Popup({
            offset: 25,
            closeOnClick: false,
            closeButton: true
        }).setHTML(popupContent);

        // Crear marcador y añadirlo al mapa
        return new mapboxgl.Marker(el)
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map.current);
    };

    const clearMapObjects = () => {
        // Clear existing markers
        Object.values(markersRef.current).forEach(marker => {
            if (marker && typeof marker.remove === 'function') marker.remove();
        });
        markersRef.current.activeVehicles.forEach(marker => marker.remove());
        markersRef.current.activeVehicles.clear();
        markersRef.current.origen = undefined;
        markersRef.current.destino = undefined;
        markersRef.current.vehicle = undefined;

        // Clear existing route layers if they exist
        if (map.current?.getSource("route")) {
            map.current.removeLayer("route");
            map.current.removeSource("route");
        }

        // Clear active route (vehicle to destination) if it exists
        if (map.current?.getSource("active-route")) {
            map.current.removeLayer("active-route");
            map.current.removeSource("active-route");
        }

        // Clear original route if it exists (used for "en curso" services)
        if (map.current?.getSource("original-route")) {
            map.current.removeLayer("original-route");
            map.current.removeSource("original-route");
        }
    };

    // Function to fetch route from Mapbox API
    const fetchMapboxRoute = async (origin: [number, number], destination: [number, number]): Promise<number[][]> => {
        if (!mapboxToken) return [origin, destination]; // Fallback to straight line

        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${mapboxToken}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Mapbox API error");

            const data = await response.json();
            if (!data.routes || data.routes.length === 0) throw new Error("No route found");

            return data.routes[0].geometry.coordinates;
        } catch (error) {
            console.error("Error fetching route:", error);
            return [origin, destination]; // Fallback to straight line
        }
    };

    useEffect(() => {
        if (!isMapLoaded || !map.current || !selectedServicio) return;

        clearMapObjects();

        // Adjust map bounds later
        const bounds = new mapboxgl.LngLatBounds();

        console.log(vehicleTracking)

        // Create origin marker (point A)
        if (selectedServicio.origen_latitud && selectedServicio.origen_longitud) {
            const lngLat: [number, number] = [
                selectedServicio.origen_longitud,
                selectedServicio.origen_latitud,
            ];

            markersRef.current.origen = createMarker(
                lngLat,
                "origen",
                createPopupHTML("origen"),
            );

            bounds.extend(lngLat);
        }

        // Create destination marker (point B)
        if (selectedServicio.destino_latitud && selectedServicio.destino_longitud) {
            const lngLat: [number, number] = [
                selectedServicio.destino_longitud,
                selectedServicio.destino_latitud,
            ];

            markersRef.current.destino = createMarker(
                lngLat,
                "destino",
                createPopupHTML("destino"),
            );

            bounds.extend(lngLat);
        }

        // Show route based on service state
        if (selectedServicio.estado === 'en curso' && vehicleTracking?.position) {
            // For 'en curso' with active vehicle, show route from vehicle to destination
            console.log(true)
            if (selectedServicio.destino_latitud && selectedServicio.destino_longitud) {
                const vehiclePosition: [number, number] = [vehicleTracking.position.x, vehicleTracking.position.y];
                const destinationPosition: [number, number] = [
                    selectedServicio.destino_longitud,
                    selectedServicio.destino_latitud
                ];

                // Add vehicle position to bounds
                bounds.extend(vehiclePosition);

                // First add a temporary straight line
                map.current.addSource("active-route", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: [vehiclePosition, destinationPosition],
                        },
                    },
                });

                map.current.addLayer({
                    id: "active-route",
                    type: "line",
                    source: "active-route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#00bc7d", // Active route color
                        "line-width": 5,
                        "line-opacity": 0.8,
                        "line-dasharray": [2, 1], // Dashed line for active route
                    },
                });

                // Then fetch and update with actual route
                (async () => {
                    console.log("vehiclefetch")
                    if (!map.current) return;

                    try {
                        const routeCoordinates = await fetchMapboxRoute(vehiclePosition, destinationPosition);

                        if (map.current.getSource("active-route")) {
                            (map.current.getSource("active-route") as mapboxgl.GeoJSONSource).setData({
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "LineString",
                                    coordinates: routeCoordinates,
                                },
                            });

                            // Add all route points to bounds and update the map view
                            // Create a new bounds object instead of cloning
                            const newBounds = new mapboxgl.LngLatBounds();
                            
                            // Extend with original bounds
                            if (!bounds.isEmpty()) {
                                // Get the corners of the original bounds
                                const sw = bounds.getSouthWest();
                                const ne = bounds.getNorthEast();
                                newBounds.extend([sw.lng, sw.lat]);
                                newBounds.extend([ne.lng, ne.lat]);
                            }
                            
                            // Add all route coordinates
                            routeCoordinates.forEach(coord => newBounds.extend(coord));

                            // Only fit bounds if we have valid bounds
                            if (!newBounds.isEmpty()) {
                                map.current.fitBounds(newBounds, {
                                    padding: 70,
                                    maxZoom: 14,
                                });
                            }
                        }
                    } catch (error) {
                        console.error("Error updating active route:", error);
                    }
                })();

                // Also show the original complete route with reduced opacity
                if (selectedServicio.geometry && selectedServicio.geometry.length > 0) {
                    const coordinates = selectedServicio.geometry.map((coord) => [
                        coord[1], // longitude
                        coord[0], // latitude
                    ]);

                    map.current.addSource("original-route", {
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
                        id: "original-route",
                        type: "line",
                        source: "original-route",
                        layout: {
                            "line-join": "round",
                            "line-cap": "round",
                        },
                        paint: {
                            "line-color": "#6a7282", // Grey color for original route
                            "line-width": 3,
                            "line-opacity": 0.3, // Low opacity
                        },
                    });

                    // Add all route points to bounds
                    coordinates.forEach(coord => bounds.extend(coord));
                }
            }
        } else if (selectedServicio.geometry && selectedServicio.geometry.length > 0) {
            // For other states, show the complete planned route
            const coordinates = selectedServicio.geometry.map((coord) => [
                coord[1], // longitude
                coord[0], // latitude
            ]);

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
                    "line-color": color,
                    "line-width": 5,
                    "line-opacity": 0.7,
                },
            });

            // Add all route points to bounds
            coordinates.forEach(coord => bounds.extend(coord));
        }

        // Fit map to include all relevant points
        if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, {
                padding: 70,
                maxZoom: 14,
            });
        }

        setDetallesVisible(true);

    }, [selectedServicio, isMapLoaded, color, handleServicioClick, getStatusText, getServiceTypeText, vehicleTracking, mapboxToken]);

      // Efecto para actualizar la posición del vehículo
    useEffect(() => {
        if (
            !isMapLoaded ||
            !map.current ||
            selectedServicio?.estado !== "en curso" ||
            !vehicleTracking ||
            !vehicleTracking.position
        ) {
            return;
        }

        // Limpiar marcador de vehículo existente
        if (markersRef.current.vehicle) {
            markersRef.current.vehicle.remove();
            markersRef.current.vehicle = undefined;
        }

        // Crear nuevo marcador de vehículo con la posición actual
        const vehiclePosition: [number, number] = [
            vehicleTracking.position.x,
            vehicleTracking.position.y,
        ];
        markersRef.current.vehicle = createVehicleMarker(vehiclePosition);

        // Actualizar la ruta activa si existe
        if (map.current.getSource("active-route") && 
            selectedServicio.destino_latitud && 
            selectedServicio.destino_longitud) {
            
            const destinationPosition: [number, number] = [
                selectedServicio.destino_longitud,
                selectedServicio.destino_latitud
            ];

            // Actualizar con una línea recta (retroalimentación visual inmediata)
            try {
                (map.current.getSource("active-route") as mapboxgl.GeoJSONSource).setData({
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: [vehiclePosition, destinationPosition],
                    },
                });
            } catch (error) {
                console.error("Error updating straight line route:", error);
            }

            // Luego obtener y actualizar con la ruta real
            (async () => {
                if (!map.current) return;

                try {
                    const routeCoordinates = await fetchMapboxRoute(vehiclePosition, destinationPosition);

                    // Verificar nuevamente si el mapa existe y la capa de ruta todavía está presente
                    if (map.current && map.current.getSource("active-route")) {
                        try {
                            (map.current.getSource("active-route") as mapboxgl.GeoJSONSource).setData({
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "LineString",
                                    coordinates: routeCoordinates,
                                },
                            });
                        } catch (error) {
                            console.error("Error updating route coordinates:", error);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching route:", error);
                }
            })();
        }
    }, [vehicleTracking, selectedServicio, isMapLoaded, createVehicleMarker, fetchMapboxRoute]);

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

    const getStatusColor = (estado: string) => {
        return statusColors[estado as keyof typeof statusColors] || statusColors.default;
    };

    const clearServicio = () => {
        // Clear selected servicio reference completely
        setServicioWithRoutes(null);
        prevSelectedServicioRef.current = null;
        
        setDetallesVisible(false);
        clearMapObjects();

        // Reset marker creation flag to allow fresh creation
        markersCreatedRef.current = false;
        
        // Force re-render of active vehicles after clearing service
        if (activeVehiclesData.length > 0 && map.current) {
            setTimeout(() => {
                if (!map.current) return;

                // First make sure all existing markers are removed
                markersRef.current.activeVehicles.forEach(marker => marker.remove());
                markersRef.current.activeVehicles.clear();

                // Create markers for all active vehicles
                activeVehiclesData.forEach(data => {
                    const marker = createPulsingVehicleMarker(data.vehicle, data.service);
                    if (marker) {
                        markersRef.current.activeVehicles.set(data.vehicle.id.toString(), marker);
                    }
                });
                
                // Mark that we've created markers
                markersCreatedRef.current = true;

                // Fit map to show all active vehicles
                if (activeVehiclesData.length > 0) {
                    const bounds = new mapboxgl.LngLatBounds();
                    activeVehiclesData.forEach(data => {
                        bounds.extend([data.vehicle.pos.x, data.vehicle.pos.y]);
                    });

                    map.current.fitBounds(bounds, {
                        padding: 100,
                        maxZoom: 14
                    });
                }
            }, 100); // Short delay to ensure state is updated
        }
    };

    return (
        <div className="h-full w-full relative">
            {mapError && (
                <div className="absolute top-2 left-2 right-2 z-[1000] bg-red-100 text-red-800 text-sm p-2 rounded-md shadow">
                    <span className="font-medium">Error:</span> {mapError}
                </div>
            )}

            <div ref={mapContainer} className="h-full w-full">
                {!isMapLoaded && (
                    <div className="h-full w-full flex items-center justify-center">
                        Cargando mapa...
                    </div>
                )}
            </div>

            {selectedServicio && detallesVisible && (
                <div className="animate-fade-up absolute top-2.5 right-14 bg-white p-4 rounded-lg shadow-lg w-80">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
                        <button
                            onClick={clearServicio}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span className="text-sm text-gray-500">Estado</span>
                            <div
                                className="inline-block ml-2 px-2 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor: `${getStatusColor(selectedServicio.estado)}20`,
                                    color: getStatusColor(selectedServicio.estado)
                                }}
                            >
                                {getStatusText(selectedServicio.estado)}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Origen</span>
                            <div className="font-medium">{selectedServicio.origen_especifico}</div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Destino</span>
                            <div className="font-medium">{selectedServicio.destino_especifico}</div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Cliente</span>
                            <div className="font-medium">{selectedServicio.cliente.Nombre}</div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Vehiculo</span>
                            <div className="font-medium">{selectedServicio.vehiculo.placa} {selectedServicio.vehiculo.linea} {selectedServicio.vehiculo.modelo}</div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Conductor</span>
                            <div className="font-medium">{selectedServicio.conductor.nombre} {selectedServicio.conductor.apellido} {selectedServicio.conductor.numero_identificacion}</div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Fecha y Hora</span>
                            <div className="font-medium">
                                {formatDate(selectedServicio.fecha_inicio)} · {selectedServicio.hora_salida}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Distancia</span>
                            <div className="font-medium">{selectedServicio.distancia_km} km</div>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">Valor</span>
                            <div className="font-medium">
                                ${selectedServicio.valor.toLocaleString('es-CO')}
                            </div>
                        </div>

                        {selectedServicio.estado === "en curso" && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold mb-2">Tracking del Vehículo</h4>
                                {vehicleTracking ? (
                                    <div className="space-y-1">
                                        <div>
                                            <span className="text-sm text-gray-500">Vehículo:</span> {vehicleTracking.name}
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Velocidad:</span> {vehicleTracking.position.s || 0} km/h
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Dirección:</span> {vehicleTracking.position.c || 0}°
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Ubicación:</span> {vehicleTracking.position.x.toFixed(6)}, {vehicleTracking.position.y.toFixed(6)}
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Última actualización:</span> {formatTime(vehicleTracking.lastUpdate)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-amber-600 text-sm">
                                        {trackingError || "Buscando información del vehículo..."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="absolute top-20 left-2 bg-white bg-opacity-90 p-2 rounded-md shadow">
                <span className="text-sm font-medium">
                </span>
            </div>

            {selectedServicio?.estado === "en curso" &&
                trackingError &&
                !vehicleTracking && (
                    <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white bg-opacity-90 text-amber-800 text-xs p-2 rounded-md shadow">
                        <span className="font-medium">Información:</span> {trackingError}
                    </div>
                )}

            <style global jsx>{`
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

        .popup-realizado {
          background-color: #155dfc;
        }
        .popup-en-curso {
          background-color: #00d492;
        }
        .popup-planificado {
          background-color: #ff9800;
        }
        .popup-cancelado {
          background-color: #f44336;
        }

        .vehicle-popup {
          padding: 8px;
        }

        .mapboxgl-popup-content {
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .pulsing-vehicle-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }

        .marker-center {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #00bc7d;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        .pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #00bc7d;
          animation: pulse-animation 2s infinite ease-out;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pulse-1 {
          animation-delay: 0s;
        }

        .pulse-2 {
          animation-delay: 1s;
        }

        @keyframes pulse-animation {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default EnhancedMapComponent;
