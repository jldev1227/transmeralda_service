import React from "react";
import {
  Hash,
  Edit,
  Ticket,
  History,
  CheckCircle,
  Trash2,
  User,
  Car,
  Building2,
  Phone,
  IdCard,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Map,
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useConfirmDialogWithTextarea } from "./confirmDialogWithTextArea";
import ModalMap from "./modalMap";

import {
  EstadoServicio,
  ServicioConRelaciones,
  useService,
} from "@/context/serviceContext";
import { getStatusColor, getStatusText } from "@/utils/indext";
import { apiClient } from "@/config/apiClient";
import { useAuth } from "@/context/AuthContext";

interface ServiciosListCardsProps {
  filteredServicios: ServicioConRelaciones[];
  selectedServicio: ServicioConRelaciones | null | undefined;
  handleSelectServicio: (servicio: ServicioConRelaciones) => void;
  formatearFecha: (fechaISOString: Date | string | undefined) => string;
}

const ServiciosListCards = ({
  filteredServicios,
  formatearFecha,
}: ServiciosListCardsProps) => {
  const navigation = useRouter();
  const [navigatingToId, setNavigatingToId] = useState<string | null>(null);

  const handleNavigateToService = async (servicioId: string | undefined) => {
    if (!servicioId) return;

    setNavigatingToId(servicioId);

    // Pequeño delay para mostrar el loading
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(servicioId);

    navigation.push(`/servicio/${servicioId}`);

    // El loading se limpiará cuando el componente se desmonte
    // o puedes limpiarlo después de un timeout
    setTimeout(() => setNavigatingToId(null), 2000);
  };
  const { user } = useAuth();

  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
  const [modalFinalizarOpen, setModalFinalizarServicio] = useState(false);
  const [modalMapOpen, setModalMapOpen] = useState(false);
  const [servicioHistorialId, setServicioHistorialId] = useState<string | null>(
    null,
  );
  const [servicioFinalizarId, setServicioFinalizarId] = useState<string | null>(
    null,
  );

  const {
    setServicioWithRoutes,
    handleModalForm,
    handleModalTicket,
    handleModalPlanilla,
    clearSelectedServicio,
    socketEventLogs,
  } = useService();

  const {
    confirm,
    DialogComponent,
    setLoading: setConfirmLoading,
  } = useConfirmDialogWithTextarea();

  const [rowAnimations, setRowAnimations] = useState<RowAnimationState>({});

  interface RowAnimationState {
    [key: string]: {
      isNew: boolean;
      isUpdated: boolean;
      eventType: string;
      timestamp: number;
    };
  }

  // Event handlers
  const handleEdit = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation();
    if (servicio.estado === "realizado" || servicio.estado === "cancelado")
      return;

    clearSelectedServicio();
    setTimeout(() => handleModalForm(servicio), 50);
  };

  const handleViewTicket = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation();
    if (servicio.estado === "solicitado" || servicio.estado === "cancelado")
      return;

    setTimeout(() => handleModalTicket(servicio), 50);
  };

  const handleViewLiquidacion = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation();
    if (servicio.estado === "solicitado" || servicio.estado === "cancelado")
      return;

    setTimeout(() => handleModalPlanilla(servicio), 50);
  };

  const handleViewHistorial = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation();
    if (servicio.id) {
      setServicioHistorialId(servicio.id);
      setModalHistorialOpen(true);
    }
  };

  const handleFinalizar = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation();
    if (
      servicio.id &&
      (servicio.estado === "en_curso" || servicio.estado === "realizado")
    ) {
      setServicioFinalizarId(servicio.id);
      setModalFinalizarServicio(true);
    }
  };

  const handleMap = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation();
    setModalMapOpen(true);
    setServicioWithRoutes(servicio);
  };

  const eliminarServicio = async (
    e: MouseEvent<HTMLButtonElement>,
    id: string | undefined,
  ) => {
    e.stopPropagation();
    if (!id) return;

    const { confirmed } = await confirm({
      title: "Eliminar Servicio",
      message:
        "¿Estás seguro de que deseas eliminar este servicio? Esta acción puede requerir aprobación adicional.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      textareaRequired: false,
    });

    if (!confirmed) return;

    setConfirmLoading(true);
    try {
      await apiClient.delete<ServicioConRelaciones>(`/api/servicios/${id}`);
    } catch (err) {
      console.error("Error al eliminar el servicio:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Permission checks
  const shouldShowEditButton = (estado: EstadoServicio) => {
    return (
      estado === "solicitado" ||
      estado === "planificado" ||
      estado === "en_curso"
    );
  };

  const shouldGetTicket = (estado: EstadoServicio) => {
    return estado !== "solicitado" && estado !== "cancelado";
  };

  const showPlanillaNumber = (estado: EstadoServicio) => {
    if (
      user?.permisos.gestor_planillas ||
      ["admin", "gestor_planillas"].includes(user?.role || "")
    ) {
      return estado === "realizado" || estado === "planilla_asignada";
    }
  };

  const showFinalizar = (estado: EstadoServicio) => {
    if (
      user?.permisos.gestor_planillas ||
      ["admin", "gestor_servicio"].includes(user?.role || "")
    ) {
      return estado === "en_curso" || estado === "realizado";
    }
  };

  const showDelete = (estado: EstadoServicio) => {
    if (
      user?.permisos.gestor_planillas ||
      ["admin", "gestor_servicio"].includes(user?.role || "")
    ) {
      return (
        estado === "solicitado" ||
        estado === "planificado" ||
        estado === "en_curso"
      );
    }
  };

  // Socket animations effect
  useEffect(() => {
    if (!socketEventLogs || socketEventLogs.length === 0) return;

    const latestEvents = [...socketEventLogs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    const now = Date.now();
    const newAnimations: RowAnimationState = { ...rowAnimations };

    latestEvents.forEach((event) => {
      let servicioId = "";

      if (event.data.servicio) {
        servicioId = event.data.servicio.id;
      } else if (event.data.id) {
        servicioId = event.data.id;
      }

      if (!servicioId) return;

      if (event.eventName === "servicio:creado") {
        newAnimations[servicioId] = {
          isNew: true,
          isUpdated: false,
          eventType: event.eventName,
          timestamp: now,
        };
      } else {
        newAnimations[servicioId] = {
          isNew: false,
          isUpdated: true,
          eventType: event.eventName,
          timestamp: now,
        };
      }
    });

    setRowAnimations(newAnimations);

    const timer = setTimeout(() => {
      setRowAnimations((prev) => {
        const updated: RowAnimationState = {};

        Object.entries(prev).forEach(([id, state]) => {
          if (now - state.timestamp < 5000) {
            updated[id] = state;
          }
        });

        return updated;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [socketEventLogs]);

  // Lazy load modals
  const ModalHistorialServicio = React.lazy(
    () => import("./modalHistorialServicio"),
  );
  const ModalFinalizarServicio = React.lazy(() => import("./modalFinalizar"));

  if (navigatingToId)
    return (
      <div className="flex items-center justify-center rounded-lg h-32">
        <div className="flex items-center gap-2 text-emerald-600">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Redirigiendo...</span>
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      {DialogComponent}

      <React.Suspense>
        {modalMapOpen && (
          <ModalMap
            isOpen={modalMapOpen}
            onClose={() => setModalMapOpen(false)}
          />
        )}
      </React.Suspense>

      <React.Suspense>
        {modalHistorialOpen && (
          <ModalHistorialServicio
            isOpen={modalHistorialOpen}
            servicioId={servicioHistorialId}
            onClose={() => setModalHistorialOpen(false)}
          />
        )}
      </React.Suspense>

      <React.Suspense>
        {modalFinalizarOpen && (
          <ModalFinalizarServicio
            isOpen={modalFinalizarOpen}
            servicioId={servicioFinalizarId}
            onClose={() => setModalFinalizarServicio(false)}
          />
        )}
      </React.Suspense>

      {filteredServicios.map((servicio: ServicioConRelaciones) => {
        const serviceId = servicio.id || "";
        const animation = rowAnimations[serviceId];
        const isNew = animation?.isNew || false;
        const isUpdated = animation?.isUpdated || false;

        return (
          <div
            key={servicio.id}
            className={`
              bg-white border rounded-lg transition-all duration-200 cursor-pointer
              ${isNew ? "animate-pulse border-green-400" : ""}
              ${isUpdated ? "border-blue-400" : ""}
            `}
            role="button"
            onClick={() => handleNavigateToService(servicio.id)}
          >
            {/* Header Section */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {servicio.es_creador && (
                      <div
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                        title="Eres el creador"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 truncate">
                      {servicio.origen_especifico ||
                        `${servicio.origen.nombre_municipio} → ${servicio.destino.nombre_municipio}`}
                    </h3>
                  </div>

                  {servicio.destino_especifico && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {servicio.destino_especifico}
                      </span>
                    </div>
                  )}

                  {servicio.observaciones && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {servicio.observaciones}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
                  style={{
                    backgroundColor: `${getStatusColor(servicio.estado)}15`,
                    color: getStatusColor(servicio.estado),
                    border: `1px solid ${getStatusColor(servicio.estado)}30`,
                  }}
                >
                  {getStatusText(servicio.estado)}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Solicitado</p>
                    <p className="font-medium text-gray-900">
                      {formatearFecha(servicio.fecha_solicitud)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Realización</p>
                    <p className="font-medium text-gray-900">
                      {formatearFecha(servicio.fecha_realizacion)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Entity Information */}
              <div className="space-y-3">
                {/* Client */}
                {servicio.cliente && (
                  <div className="flex items-center gap-3 p-2 bg-blue-25 rounded-md">
                    <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {servicio.cliente.nombre}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {servicio.cliente.nit && (
                          <span>NIT: {servicio.cliente.nit}</span>
                        )}
                        {servicio.cliente.representante && (
                          <span className="truncate">
                            • {servicio.cliente.representante}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Driver and Vehicle Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Driver */}
                  {servicio.conductor ? (
                    <div className="flex items-center gap-3 p-2 bg-green-25 rounded-md">
                      <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {servicio.conductor.nombre}{" "}
                          {servicio.conductor.apellido}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {servicio.conductor.numero_identificacion && (
                            <span className="flex items-center gap-1">
                              <IdCard className="w-3 h-3" />
                              {servicio.conductor.numero_identificacion}
                            </span>
                          )}
                          {servicio.conductor.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {servicio.conductor.telefono}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 bg-amber-25 rounded-md">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-amber-700">
                        Conductor pendiente
                      </span>
                    </div>
                  )}

                  {/* Vehicle */}
                  {servicio.vehiculo ? (
                    <div className="flex items-center gap-3 p-2 bg-orange-25 rounded-md">
                      <Car className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">
                          {servicio.vehiculo.placa}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {servicio.vehiculo.marca}
                          {servicio.vehiculo.modelo &&
                            ` (${servicio.vehiculo.modelo})`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 bg-amber-25 rounded-md">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-amber-700">
                        Vehículo pendiente
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  {/* Always visible actions */}
                  <button
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    title="Ver historial"
                    onClick={(e) => handleViewHistorial(e, servicio)}
                  >
                    <History className="w-4 h-4" />
                  </button>

                  {shouldShowEditButton(servicio.estado) && (
                    <button
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                      title="Editar"
                      onClick={(e) => handleEdit(e, servicio)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}

                  {shouldGetTicket(servicio.estado) && (
                    <button
                      className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-md transition-colors"
                      title="Ver ticket"
                      onClick={(e) => handleViewTicket(e, servicio)}
                    >
                      <Ticket className="w-4 h-4" />
                    </button>
                  )}

                  {showPlanillaNumber(servicio.estado) && (
                    <button
                      className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Ver planilla"
                      onClick={(e) => handleViewLiquidacion(e, servicio)}
                    >
                      <Hash className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    className="p-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors"
                    title="Ver mapa"
                    onClick={(e) => handleMap(e, servicio)}
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {showFinalizar(servicio.estado) && (
                    <button
                      className="p-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Finalizar"
                      onClick={(e) => handleFinalizar(e, servicio)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}

                  {showDelete(servicio.estado) && (
                    <button
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar"
                      onClick={(e) => eliminarServicio(e, servicio.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiciosListCards;
