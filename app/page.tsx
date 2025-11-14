"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPinIcon, PlusIcon } from "lucide-react"; // al inicio del archivo
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@heroui/button";

import { useService, ServicioConRelaciones } from "@/context/serviceContext";
import ModalFormServicio from "@/components/ui/modalFormServicio";
import { formatearFecha } from "@/helpers";
import ServiciosListCards from "@/components/ui/serviciosListCards";
import ModalTicket from "@/components/ui/modalTicket";
import ModalPlanilla from "@/components/ui/modalPlanilla";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/loadingPage";
import FiltersDrawer from "@/components/ui/filterDrawer";

interface Filters {
  estado: string;
  origen: string;
  destino: string;
  fechaSolicitud: string;
  fechaRealizacion: string;
  propositoServicio: string;
  empresa: string;
  vehiculo: string;
  conductor: string;
}

// Main Dashboard Component
const AdvancedDashboard = () => {
  // State
  const {
    servicios,
    stats,
    pagination,
    obtenerServicios,
    socketConnected,
    selectedServicio,
    handleModalForm,
    setSelectedServicio,
    empresas,
    vehiculos,
    conductores,
  } = useService();
  const { modalTicket } = useService();

  const [filters, setFilters] = useState<Filters>({
    estado: "",
    origen: "",
    destino: "",
    fechaSolicitud: "",
    fechaRealizacion: "",
    propositoServicio: "",
    empresa: "",
    vehiculo: "",
    conductor: "",
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

  // Select a service
  const handleSelectServicio = useCallback(
    async (servicio: ServicioConRelaciones) => {
      setSelectedServicio(servicio);
    },
    [],
  );

  const limpiarFiltros = () => {
    setFilters({
      estado: "",
      origen: "",
      destino: "",
      fechaSolicitud: "",
      fechaRealizacion: "",
      propositoServicio: "",
      empresa: "",
      vehiculo: "",
      conductor: "",
    });
    setDateRange({ from: "", to: "" });
    setDateFilterType("solicitud");
    setSortOptions({ field: "fecha_solicitud", direction: "desc" });
  };

  const contarFiltrosActivos = () => {
    let count = 0;

    Object.values(filters).forEach((value) => {
      if (value && value.trim() !== "") count++;
    });
    if (dateRange.from || dateRange.to) count++;

    return count;
  };

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

    // ✅ CORREGIDO: Filtro por empresa con igualdad estricta
    if (filters.empresa) {
      const clienteId = servicio.cliente_id?.toString().toLowerCase() || "";
      const filtroEmpresa = filters.empresa.toString().toLowerCase();

      if (clienteId !== filtroEmpresa && !clienteId.includes(filtroEmpresa)) {
        return false;
      }
    }

    if (
      filters.propositoServicio &&
      servicio.proposito_servicio !== filters.propositoServicio
    )
      return false;

    // ✅ CORREGIDO: Filtro por vehículo con igualdad estricta
    if (filters.vehiculo) {
      const vehiculoId = servicio.vehiculo_id?.toString().toLowerCase() || "";
      const filtroVehiculo = filters.vehiculo.toString().toLowerCase();

      // Solo buscar en servicios que TIENEN vehiculo_id (no undefined/null/empty)
      if (!servicio.vehiculo_id) return false;

      // Verificar coincidencia exacta O que contenga el filtro
      if (
        vehiculoId !== filtroVehiculo &&
        !vehiculoId.includes(filtroVehiculo)
      ) {
        return false;
      }
    }

    // ✅ CORREGIDO: Filtro por conductor con igualdad estricta
    if (filters.conductor) {
      const conductorNombre =
        `${servicio.conductor?.nombre || ""} ${servicio.conductor?.apellido || ""}`
          .toLowerCase()
          .trim();
      const conductorId = servicio.conductor_id?.toString().toLowerCase() || "";
      const filtroConductor = filters.conductor.toString().toLowerCase();

      // Solo buscar en servicios que TIENEN conductor
      if (!servicio.conductor_id && !conductorNombre) return false;

      // Verificar coincidencia exacta O que contenga el filtro
      const nombreMatch =
        conductorNombre === filtroConductor ||
        conductorNombre.includes(filtroConductor);
      const idMatch =
        conductorId === filtroConductor ||
        conductorId.includes(filtroConductor);

      if (!nombreMatch && !idMatch) return false;
    }

    // Filtrar por rango de fechas (sin cambios)
    if (dateRange.from || dateRange.to) {
      const dateField =
        dateFilterType === "solicitud"
          ? servicio.fecha_solicitud
          : servicio.fecha_realizacion;

      if (dateFilterType === "realizacion" && !dateField) {
        return false;
      }

      const serviceDate = dateField
        ? new Date(dateField).toISOString().split("T")[0]
        : "";

      if (!serviceDate) return false;

      if (dateRange.from && serviceDate < dateRange.from) {
        return false;
      }

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

  const vehiculoOptions = vehiculos.map((vehiculo) => ({
    value: vehiculo.id,
    label: `${vehiculo.placa} (${vehiculo.marca} ${vehiculo.modelo})`,
  }));

  const conductorOptions = conductores.map((conductor) => ({
    value: conductor.id,
    label: `${conductor.nombre} ${conductor.apellido}  (${conductor.numero_identificacion})`,
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

  const handleButtonPressForm = () => {
    // Pequeño retraso para asegurar que la limpieza se complete antes de abrir el modal
    setTimeout(() => {
      // Abrir el modal de agregar servicio
      handleModalForm();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Principal */}
        <header
          className="
          mb-8 bg-white border border-gray-200 p-6 
          sticky top-0 z-40 backdrop-blur-sm bg-white/95
          transition-all duration-300 ease-in-out
        "
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Título y Estado de Conexión */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-5">
                <div className="relative">
                  {socketConnected ? (
                    <>
                      <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                      <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    </>
                  ) : (
                    <div className="w-4 h-4 bg-red-500 rounded-full relative">
                      <div className="absolute inset-1 w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Planificación de Servicios
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {socketConnected ? (
                      <span className="flex flex-col xs:flex-row items-start xs:items-center gap-2 text-sm">
                        <span className="text-emerald-600 font-medium whitespace-nowrap">
                          Conectado en tiempo real
                        </span>
                        <span className="hidden xs:block w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                        <span className="text-gray-600 leading-relaxed break-words">
                          {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">
                          Desconectado
                        </span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>Reintentando conexión...</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas Rápidas y Acciones */}
            <div className="flex items-center gap-4">
              {/* Contador de Servicios */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {typeof stats?.total === "number"
                      ? stats.total
                      : pagination.total || sortedServices?.length || 0}
                  </p>
                </div>

                <div className="w-px h-8 bg-gray-300" />

                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Activos
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {stats?.en_curso ?? 0}
                  </p>
                </div>

                <div className="w-px h-8 bg-gray-300" />

                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Realizados
                  </p>
                  <p className="text-lg font-bold text-primary-600">
                    {stats?.realizado ?? 0}
                  </p>
                </div>

                <div className="w-px h-8 bg-gray-300" />

                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Solicitados
                  </p>
                  <p className="text-lg font-bold text-gray-600">
                    {stats?.solicitado ?? 0}
                  </p>
                </div>

                <div className="w-px h-8 bg-gray-300" />

                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Pendientes
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    {stats?.planificado ?? 0}
                  </p>
                </div>

                <div className="w-px h-8 bg-gray-300" />

                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Cancelados
                  </p>
                  <p className="text-lg font-bold text-danger-600">
                    {stats?.cancelado ?? 0}
                  </p>
                </div>
              </div>

              {/* Botón de Estadísticas */}
              {/* <GraphsModal /> */}
            </div>
          </div>

          {/* Barra de Progreso de Conexión (solo cuando está desconectado) */}
          {!socketConnected && (
            <div className="mt-4">
              <div className="w-full bg-red-100 rounded-full h-1">
                <div
                  className="bg-red-500 h-1 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Results Section */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Servicios Encontrados
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (página {pagination.page} de {pagination.totalPages}
                  {typeof pagination.total === "number"
                    ? ` • ${pagination.total} total`
                    : ""}
                  )
                </span>
              </h2>

              <div className="flex gap-3">
                <Button
                  color="success"
                  variant="flat"
                  onPress={handleButtonPressForm}
                >
                  <PlusIcon className="w-4 h-4" />
                  Nuevo servicio
                </Button>

                <FiltersDrawer
                  conductorOptions={conductorOptions}
                  contarFiltrosActivos={contarFiltrosActivos}
                  dateFilterType={dateFilterType}
                  dateRange={dateRange}
                  empresaOptions={empresaOptions}
                  filters={filters}
                  limpiarFiltros={limpiarFiltros}
                  setDateFilterType={setDateFilterType}
                  setDateRange={setDateRange}
                  setFilters={setFilters}
                  setSortOptions={setSortOptions}
                  sortOptions={sortOptions}
                  vehiculoOptions={vehiculoOptions}
                />
              </div>
            </div>

            {/* Services List */}
            {sortedServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPinIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron servicios
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta ajustar los filtros para encontrar más resultados.
                </p>
                <button
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  onClick={limpiarFiltros}
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <ServiciosListCards
                  filteredServicios={sortedServices}
                  formatearFecha={formatearFecha}
                  handleSelectServicio={handleSelectServicio}
                  selectedServicio={selectedServicio}
                />

                {/* Pagination controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mostrando {pagination.count} de {pagination.total} — página{" "}
                    {pagination.page} de {pagination.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-gray-50"
                      disabled={pagination.page <= 1}
                      onClick={() => {
                        if (pagination.page > 1) {
                          obtenerServicios(
                            pagination.page - 1,
                            pagination.limit,
                          );
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      Anterior
                    </button>
                    <button
                      className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-gray-50"
                      disabled={
                        pagination.totalPages === 0 ||
                        pagination.page >= pagination.totalPages
                      }
                      onClick={() => {
                        if (
                          pagination.totalPages > 0 &&
                          pagination.page < pagination.totalPages
                        ) {
                          obtenerServicios(
                            pagination.page + 1,
                            pagination.limit,
                          );
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ModalFormServicio />

          <React.Suspense>{modalTicket && <ModalTicket />}</React.Suspense>

          <ModalPlanilla />
        </div>
      </div>
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
