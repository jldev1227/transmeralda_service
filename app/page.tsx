"use client";

import React, { useState, useCallback, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Alert } from "@heroui/alert";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; // al inicio del archivo
import {
  AlertTriangle,
  ArrowDownIcon,
  ArrowUpIcon,
  BuildingIcon,
  CalendarIcon,
  RefreshCw,
} from "lucide-react";
import SelectReact from "react-select";
import { Button } from "@heroui/button";
import { useMediaQuery } from "react-responsive";

import EnhancedMapComponent from "@/components/enhancedMapComponent";
import {
  useService,
  VehicleTracking,
  ServicioConRelaciones,
} from "@/context/serviceContext";
import ModalFormServicio from "@/components/ui/modalFormServicio";
import { formatearFecha } from "@/helpers";
import ServiciosListCards from "@/components/ui/serviciosListCards";
import ModalTicket from "@/components/ui/modalTicket";
import ModalPlanilla from "@/components/ui/modalPlanilla";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/loadingPage";

interface MapboxRoute {
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
  };
}

interface Filters {
  estado: string;
  origen: string;
  destino: string;
  fechaSolicitud: string;
  fechaRealizacion: string;
  propositoServicio: string;
  empresa: string;
}

const serviceTypeTextMap: Record<string, string> = {
  herramienta: "Cargado con herramienta",
  personal: "Deplazamineto de personal",
  vehiculo: "Posicionar vehiculo",
};

const getServiceTypeText = (tipo: string): string => {
  return serviceTypeTextMap[tipo] || tipo;
};

// Main Dashboard Component
const AdvancedDashboard = () => {
  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || "";
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const [token] = useState(WIALON_API_TOKEN);

  const isMobile = useMediaQuery({ maxWidth: 1024 });

  // State
  const {
    servicios,
    socketConnected,
    selectedServicio,
    setSelectedServicio,
    empresas,
  } = useService();
  const [servicioWithRoutes, setServicioWithRoutes] =
    useState<ServicioConRelaciones | null>(null);
  const [vehicleTracking, setVehicleTracking] =
    useState<VehicleTracking | null>(null);
  const [trackingError, setTrackingError] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    estado: "",
    origen: "",
    destino: "",
    fechaSolicitud: "",
    fechaRealizacion: "",
    propositoServicio: "",
    empresa: "",
  });

  const [sortOptions, setSortOptions] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "fecha_solicitud",
    direction: "desc",
  });

  const [dateFilterType, setDateFilterType] = useState<
    "solicitud" | "realizacion"
  >("solicitud");
  const [dateRange, setDateRange] = useState<{
    from: string;
    to: string;
  }>({
    from: "",
    to: "",
  });

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
        let origenLat = Number(
          servicio.origen_latitud || servicio.origen.latitud,
        );
        let origenLng = Number(
          servicio.origen_longitud || servicio.origen.longitud,
        );
        let destinoLat = Number(
          servicio.destino_latitud || servicio.destino.latitud,
        );
        let destinoLng = Number(
          servicio.destino_longitud || servicio.destino.longitud,
        );
        let useVehiclePosition = false;

        if (
          servicio.estado === "en_curso" &&
          servicio.vehiculo?.placa &&
          token
        ) {
          try {
            setTrackingError("");

            // Login to Wialon to get session ID
            const loginData = await callWialonApi(token, "token/login", {});

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
          }
        }

        // Ensure coordinates exist and are valid
        if (!origenLat || !origenLng || !destinoLat || !destinoLng) {
          throw new Error("Coordenadas de origen o destino no válidas");
        }

        const origenCoords: LatLngTuple = [origenLat, origenLng];
        const destinoCoords: LatLngTuple = [destinoLat, destinoLng];

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
    [MAPBOX_ACCESS_TOKEN, token, callWialonApi],
  );

  // Select a service
  const handleSelectServicio = useCallback(
    async (servicio: ServicioConRelaciones) => {
      setSelectedServicio(servicio);
      await fetchRouteGeometry(servicio);
    },
    [fetchRouteGeometry],
  );

  // Filter services
  const filteredServicios = servicios.filter((servicio) => {
    // Filtros existentes
    if (filters.estado && servicio.estado !== filters.estado) return false;
    if (
      filters.origen &&
      !servicio.origen_especifico
        .toLowerCase()
        .includes(filters.origen.toLowerCase())
    )
      return false;
    if (
      filters.destino &&
      !servicio.destino_especifico
        .toLowerCase()
        .includes(filters.destino.toLowerCase())
    )
      return false;
    if (
      filters.empresa &&
      !servicio.cliente_id.toLowerCase().includes(filters.empresa.toLowerCase())
    )
      return false;
    if (
      filters.propositoServicio &&
      servicio.proposito_servicio !== filters.propositoServicio
    )
      return false;

    // Filtrar por rango de fechas
    if (dateRange.from || dateRange.to) {
      // Determinar qué campo de fecha usar según el tipo seleccionado
      const dateField =
        dateFilterType === "solicitud"
          ? servicio.fecha_solicitud
          : servicio.fecha_realizacion;

      // Si no hay fecha de realización y ese es el filtro seleccionado, excluir
      if (dateFilterType === "realizacion" && !dateField) {
        return false;
      }

      // Convertir la fecha del servicio a formato YYYY-MM-DD para comparación
      const serviceDate = dateField
        ? new Date(dateField).toISOString().split("T")[0]
        : "";

      // Si no hay fecha válida, excluir
      if (!serviceDate) return false;

      // Comprobar el rango "desde"
      if (dateRange.from && serviceDate < dateRange.from) {
        return false;
      }

      // Comprobar el rango "hasta"
      if (dateRange.to && serviceDate > dateRange.to) {
        return false;
      }
    }

    return true;
  });

  const empresaOptions = empresas.map((empresa) => ({
    value: empresa.id,
    label: `${empresa.nombre} (NIT: ${empresa.nit})`,
  }));

  function sortServicios(
    servicios: ServicioConRelaciones[],
    field: string,
    direction: "asc" | "desc",
  ): ServicioConRelaciones[] {
    return [...servicios].sort((a, b) => {
      // Función para acceder de forma segura a propiedades anidadas
      function getProperty(obj: any, path: string): any {
        return path.split(".").reduce((o, p) => (o ? o[p] : undefined), obj);
      }

      const valueA = getProperty(a, field);
      const valueB = getProperty(b, field);

      // Manejo de valores indefinidos
      if (valueA === undefined && valueB === undefined) return 0;
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;

      // Ordenamiento por tipo
      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Fechas
      if (
        valueA instanceof Date ||
        valueB instanceof Date ||
        (typeof valueA === "string" && /^\d{4}-\d{2}-\d{2}/.test(valueA)) ||
        (typeof valueB === "string" && /^\d{4}-\d{2}-\d{2}/.test(valueB))
      ) {
        const dateA =
          valueA instanceof Date ? valueA : new Date(valueA as string);
        const dateB =
          valueB instanceof Date ? valueB : new Date(valueB as string);

        return direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Numéricos
      const numA = Number(valueA);
      const numB = Number(valueB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === "asc" ? numA - numB : numB - numA;
      }

      // Fallback para otros tipos
      return direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }
  const sortedServices = sortServicios(
    filteredServicios,
    sortOptions.field,
    sortOptions.direction,
  );

  const handleClosePanel = useCallback(() => {
    if (isPanelOpen && isMobile) {
      const panel = document.querySelector(".animate-bottomToTop");

      if (panel) {
        panel.classList.remove("animate-bottomToTop");
        panel.classList.add("animate-topToBottom");
        // Espera la duración de la animación antes de cerrar el panel
        setTimeout(() => {
          setIsPanelOpen(false);
          // Limpia la clase de animación para futuras aperturas
          panel.classList.remove("animate-topToBottom");
          panel.classList.add("animate-bottomToTop");
        }, 400); // Ajusta este valor si cambias la duración de la animación en CSS
      } else {
        setIsPanelOpen(false);
      }
    } else {
      setIsPanelOpen(true);
    }
  }, [isPanelOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setIsPanelOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-dvh relative overflow-hidden">
      {/* Sidebar/floating panel */}
      {isPanelOpen && (
        <div
          aria-modal="true"
          className="absolute lg:relative z-50 w-full lg:max-w-[30rem] animate-bottomToTop"
          role="dialog"
        >
          <div className="bg-white p-3 md:p-4 border-b flex items-center justify-between sticky top-0">
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold">Servicios</h2>
                {isPanelOpen && isMobile && (
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onPress={handleClosePanel}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                )}
              </div>
              {socketConnected ? (
                <Alert
                  className="py-2"
                  color="success"
                  radius="sm"
                  title="Obteniendo cambios en tiempo real"
                  variant="faded"
                />
              ) : (
                <Alert
                  className="py-2"
                  color="danger"
                  radius="sm"
                  title="Desconectado de conexión en tiempo real"
                  variant="faded"
                />
              )}
            </div>
          </div>

          {/* Panel content with scrolling */}
          <div className="bg-white h-[calc(100vh-56px)] relative flex flex-col overflow-y-auto">
            {/* Filters */}
            <div className="p-4 md:p-4 border-b">
              <div className="mb-3">
                <h3 className="font-semibold mb-2">Filtros</h3>
                <form
                  autoComplete="off"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {/* Estado */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="estado"
                    >
                      Estado
                    </label>
                    <select
                      className="w-full p-2 border rounded-md text-sm"
                      id="estado"
                      value={filters.estado}
                      onChange={(e) =>
                        setFilters({ ...filters, estado: e.target.value })
                      }
                    >
                      <option value="">Todos</option>
                      <option value="solicitado">Solicitado</option>
                      <option value="planificado">Planificado</option>
                      <option value="en_curso">En curso</option>
                      <option value="realizado">Realizado</option>
                      <option value="planilla_asignada">
                        Planilla asignada
                      </option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  {/* Tipo de Servicio */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="propositoServicio"
                    >
                      Tipo de Servicio
                    </label>
                    <select
                      className="w-full p-2 border rounded-md text-sm"
                      id="propositoServicio"
                      value={filters.propositoServicio}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          propositoServicio: e.target.value,
                        })
                      }
                    >
                      <option value="">Todos</option>
                      <option value="personal">Personal</option>
                      <option value="herramienta">Herramienta</option>
                      <option value="vehiculo">Posicionar vehículo</option>
                    </select>
                  </div>

                  {/* Origen */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="origen"
                    >
                      Origen
                    </label>
                    <input
                      className="w-full p-2 border rounded-md text-sm"
                      id="origen"
                      placeholder="Buscar origen..."
                      type="text"
                      value={filters.origen}
                      onChange={(e) =>
                        setFilters({ ...filters, origen: e.target.value })
                      }
                    />
                  </div>

                  {/* Destino */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="destino"
                    >
                      Destino
                    </label>
                    <input
                      className="w-full p-2 border rounded-md text-sm"
                      id="destino"
                      placeholder="Buscar destino..."
                      type="text"
                      value={filters.destino}
                      onChange={(e) =>
                        setFilters({ ...filters, destino: e.target.value })
                      }
                    />
                  </div>

                  {/* Empresa */}
                  <div className="sm:col-span-2">
                    <label
                      className="block text-sm font-medium mb-1 truncate max-w-full"
                      htmlFor="empresa"
                    >
                      Empresa
                    </label>
                    <div className="relative shadow-sm rounded-md group transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <SelectReact
                        isClearable
                        isSearchable
                        required
                        className="pl-10 border-1 pr-3 block w-full rounded-md sm:text-sm appearance-none text-gray-800 focus:outline-none"
                        classNamePrefix="react-select"
                        inputId="empresa"
                        menuPortalTarget={
                          typeof window !== "undefined"
                            ? document.body
                            : undefined
                        }
                        name="empresa"
                        options={empresaOptions}
                        placeholder="Seleccione una empresa"
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: "100%",
                            minWidth: 0,
                            maxWidth: "100%",
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            border: "none",
                            boxShadow: undefined,
                            "&:hover": { borderColor: "#059669" },
                            backgroundColor: "white",
                            transition: "box-shadow 0.2s",
                            minWidth: 0,
                            maxWidth: "100%",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#9ca3af",
                            fontSize: "0.875rem",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#1f2937",
                            fontSize: "0.875rem",
                            maxWidth: "calc(100% - 2rem)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 50,
                          }),
                          option: (base, state) => ({
                            ...base,
                            color: state.isSelected ? "#059669" : "#1f2937",
                            backgroundColor: state.isFocused
                              ? "#f0fdf4"
                              : "white",
                            fontSize: "0.875rem",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "#374151",
                            paddingRight: "0rem",
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "#1f2937",
                            fontSize: "0.875rem",
                          }),
                          clearIndicator: (base) => ({
                            ...base,
                            color: "#9ca3af",
                            "&:hover": { color: "#ef4444" },
                            padding: "0px 8px",
                          }),
                        }}
                        onChange={(option) =>
                          setFilters({
                            ...filters,
                            empresa: option ? option.value : "",
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Rango de Fechas */}
                  <div className="sm:col-span-2">
                    <p className="block text-sm font-medium mb-1">
                      Rango de Fechas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          checked={dateFilterType === "solicitud"}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          id="fechaSolicitudRadio"
                          name="tipoFecha"
                          type="radio"
                          value="solicitud"
                          onChange={() => setDateFilterType("solicitud")}
                        />
                        <label
                          className="text-sm text-gray-700"
                          htmlFor="fechaSolicitudRadio"
                        >
                          Fecha de Solicitud
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          checked={dateFilterType === "realizacion"}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          id="fechaRealizacionRadio"
                          name="tipoFecha"
                          type="radio"
                          value="realizacion"
                          onChange={() => setDateFilterType("realizacion")}
                        />
                        <label
                          className="text-sm text-gray-700"
                          htmlFor="fechaRealizacionRadio"
                        >
                          Fecha de Realización
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          htmlFor="fechaDesde"
                        >
                          Desde
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            id="fechaDesde"
                            type="date"
                            value={dateRange.from || ""}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                from: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          htmlFor="fechaHasta"
                        >
                          Hasta
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            id="fechaHasta"
                            min={dateRange.from || undefined}
                            type="date"
                            value={dateRange.to || ""}
                            onChange={(e) =>
                              setDateRange({ ...dateRange, to: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* Botones de acción rápida para fechas */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 border hover:bg-gray-100"
                        type="button"
                        onClick={() => {
                          const today = new Date().toISOString().split("T")[0];

                          setDateRange({ from: today, to: today });
                        }}
                      >
                        Hoy
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 border hover:bg-gray-100"
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const lastWeek = new Date();

                          lastWeek.setDate(today.getDate() - 7);
                          setDateRange({
                            from: lastWeek.toISOString().split("T")[0],
                            to: today.toISOString().split("T")[0],
                          });
                        }}
                      >
                        Última semana
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 border hover:bg-gray-100"
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const lastMonth = new Date();

                          lastMonth.setMonth(today.getMonth() - 1);
                          setDateRange({
                            from: lastMonth.toISOString().split("T")[0],
                            to: today.toISOString().split("T")[0],
                          });
                        }}
                      >
                        Último mes
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 border hover:bg-gray-100"
                        type="button"
                        onClick={() => {
                          setDateRange({ from: "", to: "" });
                        }}
                      >
                        Limpiar fechas
                      </button>
                    </div>
                  </div>

                  {/* Ordenación */}
                  <div className="sm:col-span-2 flex flex-col gap-2 mt-2">
                    <label
                      className="text-sm font-medium whitespace-nowrap"
                      htmlFor="sortBy"
                    >
                      Ordenar por:
                    </label>
                    <div className="flex w-full justify-between items-center gap-2">
                      <select
                        className="text-sm border w-full rounded-md p-1.5 bg-white"
                        id="sortBy"
                        value={sortOptions.field}
                        onChange={(e) =>
                          setSortOptions({
                            ...sortOptions,
                            field: e.target.value,
                          })
                        }
                      >
                        <option value="fecha_solicitud">
                          Fecha de Solicitud
                        </option>
                        <option value="fecha_realizacion">
                          Fecha de Realización
                        </option>
                        <option value="estado">Estado</option>
                        <option value="origen_especifico">Origen</option>
                        <option value="destino_especifico">Destino</option>
                        <option value="createdAt">Fecha de Creación</option>
                      </select>
                      <button
                        className="p-1.5 rounded-md border hover:bg-gray-50 transition-colors"
                        title={
                          sortOptions.direction === "asc"
                            ? "Ascendente"
                            : "Descendente"
                        }
                        type="button"
                        onClick={() =>
                          setSortOptions({
                            ...sortOptions,
                            direction:
                              sortOptions.direction === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        {sortOptions.direction === "asc" ? (
                          <ArrowUpIcon className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ArrowDownIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Service list */}
            <div className="p-3 md:p-4 mb-14 flex-1">
              {sortedServices.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No se encontraron servicios
                </div>
              ) : (
                <div className="h-dvh">
                  <ServiciosListCards
                    filteredServicios={sortedServices}
                    formatearFecha={formatearFecha}
                    handleClosePanel={handleClosePanel}
                    handleSelectServicio={handleSelectServicio}
                    selectedServicio={selectedServicio}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main map panel - takes full width/height when sidebar is closed */}
      <div className="h-full w-full transition-all duration-300">
        <EnhancedMapComponent
          getServiceTypeText={getServiceTypeText}
          handleClosePanel={handleClosePanel}
          handleSelectServicio={handleSelectServicio}
          isPanelOpen={isPanelOpen}
          mapboxToken={MAPBOX_ACCESS_TOKEN}
          selectedServicio={servicioWithRoutes}
          servicios={servicios}
          setSelectedServicio={setSelectedServicio}
          setServicioWithRoutes={setServicioWithRoutes}
          trackingError={trackingError}
          vehicleTracking={vehicleTracking}
          wialonToken={WIALON_API_TOKEN}
          onWialonRequest={callWialonApi}
        />
        <ModalFormServicio />
        <ModalTicket />
        <ModalPlanilla />
      </div>

      {/* Additional styles */}
      <style global jsx>{`
        .vehicle-marker {
          transition: transform 0.2s ease-in-out;
        }
        .vehicle-marker:hover {
          transform: scale(1.1);
        }

        @media (max-width: 980px) {
          /* Mobile drag handle appearance */
          .panel-drag-handle {
            width: 40px;
            height: 5px;
            background-color: #cbd5e0;
            border-radius: 3px;
            margin: 10px auto;
          }
        }
      `}</style>
    </div>
  );
};

// Componente para manejar permisos en la página y mostrar errores personalizados
function PermissionHandler({
  children,
  requiredPermissions,
  errorMessage,
}: {
  children: React.ReactNode;
  requiredPermissions: string[];
  errorMessage: string;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Si está cargando, mostrar loading
  if (loading) {
    return <LoadingPage>Verificando acceso</LoadingPage>;
  }

  // Si no está autenticado, redirigir al login (esto debería ser manejado por el middleware)
  if (!isAuthenticated || !user) {
    // En un entorno de cliente, redirigiría automáticamente
    router.push("/login");

    return <LoadingPage>Redirigiendo al login</LoadingPage>;
  }

  // Verificar permisos
  const hasPermission =
    user.role === "admin" ||
    requiredPermissions.some(
      (permission) =>
        user.role === permission ||
        (user.permisos && user.permisos[permission] === true),
    );

  // Si no tiene permisos, mostrar mensaje de error personalizado
  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4 flex justify-center">
            <AlertTriangle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="flex flex-col space-y-3">
            <button
              className="flex items-center justify-center w-full py-2 px-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar Nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene permisos, mostrar el contenido
  return <>{children}</>;
}

// Componente con PermissionHandler para proteger la página principal
const DashboardPage = () => {
  return (
    <PermissionHandler
      errorMessage="Necesitas ser gestor de servicios, gestor de planillas o administrador para acceder a esta sección"
      requiredPermissions={["gestor_servicio", "gestor_planillas", "admin"]}
    >
      <AdvancedDashboard />
    </PermissionHandler>
  );
};

export default DashboardPage;
