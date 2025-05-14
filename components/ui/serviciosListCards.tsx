import React from "react";
import {
  Hash,
  Edit,
  Ticket,
  History,
  StampIcon,
  Trash2Icon,
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";

import { useConfirmDialogWithTextarea } from "./confirmDialogWithTextArea";

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
  handleClosePanel: () => void;
  formatearFecha: (fechaISOString: Date | string | undefined) => string;
}

const ServiciosListCards = ({
  filteredServicios,
  selectedServicio,
  handleSelectServicio,
  formatearFecha,
  handleClosePanel,
}: ServiciosListCardsProps) => {

  const { user } = useAuth()

  // Variable de estado para controlar la apertura/cierre del modal de historial
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
  const [modalFinalizarOpen, setModalFinalizarServicio] = useState(false);
  // Variable de estado para almacenar el ID del servicio del cual mostrar el historial
  const [servicioHistorialId, setServicioHistorialId] = useState<string | null>(
    null,
  );
  const [servicioFinalizarId, setServicioFinalizarId] = useState<string | null>(
    null,
  );

  const {
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

  // Estado para animaciones de servicios
  const [rowAnimations, setRowAnimations] = useState<RowAnimationState>({});

  // Función para manejar el evento de edición
  const handleEdit = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation(); // Evita que se active también el onClick del contenedor

    // No mostrar botón de edición si el servicio está completado o cancelado
    if (servicio.estado === "realizado" || servicio.estado === "cancelado") {
      return;
    }

    // Primero limpiar forzosamente el servicio seleccionado antes de abrir el modal
    // Esto asegura que el mapa se limpie completamente
    clearSelectedServicio();

    // Después de limpiar, abrimos el modal con el servicio a editar
    setTimeout(() => {
      handleModalForm(servicio);
    }, 50); // Pequeño retraso para asegurar que la limpieza se complete
  };

  // Función para manejar el evento de edición
  const handleViewTicket = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation(); // Evita que se active también el onClick del contenedor

    // No mostrar botón de edición si el servicio está completado o cancelado
    if (servicio.estado === "solicitado" || servicio.estado === "cancelado") {
      return;
    }

    // Después de limpiar, abrimos el modal con el servicio a editar
    setTimeout(() => {
      handleModalTicket(servicio);
    }, 50); // Pequeño retraso para asegurar que la limpieza se complete
  };

  // Función para manejar el evento de edición
  const handleViewLiquidacion = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation(); // Evita que se active también el onClick del contenedor

    // No mostrar botón de edición si el servicio está completado o cancelado
    if (servicio.estado === "solicitado" || servicio.estado === "cancelado") {
      return;
    }

    // Después de limpiar, abrimos el modal con el servicio a editar
    setTimeout(() => {
      handleModalPlanilla(servicio);
    }, 50); // Pequeño retraso para asegurar que la limpieza se complete
  };

  // Función para manejar la apertura del modal de historial
  const handleViewHistorial = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation(); // Evita que se active también el onClick del contenedor

    // Establecer el ID del servicio y abrir el modal
    // Asegurarse de que el ID no sea undefined antes de establecerlo
    if (servicio.id) {
      setServicioHistorialId(servicio.id);
      setModalHistorialOpen(true);
    }
  };

  // Función para manejar la apertura del modal de finalizar servicio
  const handleFinalizar = (
    e: MouseEvent<HTMLButtonElement>,
    servicio: ServicioConRelaciones,
  ) => {
    e.stopPropagation(); // Evita que se active también el onClick del contenedor

    // No mostrar botón de edición si el servicio está completado o cancelado
  if (servicio.id && (servicio.estado === "en_curso" || servicio.estado === "realizado")) {
    setServicioFinalizarId(servicio.id);
    setModalFinalizarServicio(true);
  }
  };

  // Determinar si se debe mostrar el botón de edición
  const shouldShowEditButton = (estado: EstadoServicio) => {
    return (
      estado === "solicitado" ||
      estado === "planificado" ||
      estado === "en_curso"
    );
  };

  // Determinar si se debe mostrar el botón de ticket
  const shouldGetTicket = (estado: EstadoServicio) => {
    return estado !== "solicitado" && estado !== "cancelado";
  };

  // Determinar si se debe mostrar el botón de proceder a liquidar
  const showPlanillaNumber = (estado: EstadoServicio) => {
    if (user?.permisos.gestor_planillas || ["admin", "gestor_planillas"].includes(user?.role || '')) {
      return estado === "realizado" || estado === "planilla_asignada";
    }
  }

  // Determinar si se debe mostrar el botón de proceder a finalizar servicio
  const showFinalizar = (estado: EstadoServicio) => {
    return estado === "en_curso" || estado === "realizado";
  };

  // Determinar si se debe mostrar el botón para eliminar servicio
  const showDelete = (estado: EstadoServicio) => {
    return (
      estado === "solicitado" ||
      estado === "planificado" ||
      estado === "en_curso"
    );
  };

  // Determinar el color de la tarjeta según el estado del servicio
  const getColorCard = (estado: EstadoServicio) => {
    switch (estado) {
      case "planilla_asignada":
        return "border-purple-500 bg-purple-50";
      case "en_curso":
        return "border-emerald-500 bg-emerald-50";
      case "planificado":
        return "border-amber-500 bg-amber-50";
      case "cancelado":
        return "border-red-500 bg-red-50";
      case "realizado":
        return "border-primary-500 bg-primary-50";
      case "solicitado":
        return "border-gray-400 bg-gray-50";
      default:
        return "";
    }
  };

  const getBorderLeftColorByEvent = (eventType: string) => {
    switch (eventType) {
      case "servicio:creado":
        return "border-l-4 border-l-green-500"; // Success para creación
      case "servicio:actualizado":
      case "servicio:estado-actualizado":
        return "border-l-4 border-l-blue-500"; // Primary para actualizaciones
      case "servicio:numero-planilla-actualizado":
        return "border-l-4 border-l-purple-500"; // Purple para asignación de planilla
      case "servicio:eliminado":
      case "servicio:cancelado":
        return "border-l-4 border-l-red-500"; // Red para eliminaciones/cancelaciones
      case "servicio:asignado":
        return "border-l-4 border-l-amber-500"; // Amber para asignaciones
      case "servicio:desasignado":
        return "border-l-4 border-l-gray-500"; // Gray para desasignaciones
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  // Modifica la interfaz RowAnimationState para incluir el tipo de evento
  interface RowAnimationState {
    [key: string]: {
      isNew: boolean;
      isUpdated: boolean;
      eventType: string; // Añadir el tipo de evento
      timestamp: number;
    };
  }

  // Actualiza el useEffect donde procesas los eventos de socket
  useEffect(() => {
    if (!socketEventLogs || socketEventLogs.length === 0) return;

    // Obtener el evento más reciente
    const latestEvents = [...socketEventLogs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5); // Solo procesar los 5 eventos más recientes

    const now = Date.now();
    const newAnimations: RowAnimationState = { ...rowAnimations };

    latestEvents.forEach((event) => {
      // Obtener ID del servicio según el tipo de evento
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
        // Para cualquier otro evento, marcar como actualizado
        newAnimations[servicioId] = {
          isNew: false,
          isUpdated: true,
          eventType: event.eventName,
          timestamp: now,
        };
      }

      // Scroll al servicio si es nuevo
      if (event.eventName === "servicio:creado") {
        setTimeout(() => {
          const row = document.getElementById(`servicio-row-${servicioId}`);

          if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    });

    setRowAnimations(newAnimations);

    // Limpiar animaciones después de 5 segundos
    const timer = setTimeout(() => {
      setRowAnimations((prev) => {
        const updated: RowAnimationState = {};

        // Solo mantener animaciones que sean más recientes que 5 segundos
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

  // Importar el componente modal de historial
  const ModalHistorialServicio = React.lazy(
    () => import("./modalHistorialServicio"),
  );

  // Importar el componente modal de historial
  const ModalFinalizarServicio = React.lazy(() => import("./modalFinalizar"));

  const eliminarServicio = async (id: string | undefined) => {
    if (!id) return;

    // Mostrar diálogo de confirmación con textarea obligatorio
    const { confirmed } = await confirm({
      title: "Eliminar Servicio",
      message:
        "¿Estás seguro de que deseas eliminar este servcicio? Esta acción puede requerir aprobación adicional.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      textareaRequired: false,
    });

    if (!confirmed) return;

    setConfirmLoading(true);

    try {
      const response = await apiClient.delete<ServicioConRelaciones>(
        `/api/servicios/${id}`,
      );
    } catch (err) {
      console.error("Error al eliminar el servicio:", err);
    }
  };

  return (
    <div className="space-y-3 px-3 py-3">
      {/* Modal de Historial de Servicio */}

      {DialogComponent}

      <React.Suspense>
        {modalHistorialOpen && (
          <ModalHistorialServicio
            isOpen={modalHistorialOpen}
            servicioId={servicioHistorialId}
            onClose={() => setModalHistorialOpen(false)}
          />
        )}
      </React.Suspense>

      {/* Modal de finalización de Servicio */}
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
        // Usar una verificación de nulidad para garantizar que id no sea undefined
        const serviceId = servicio.id || "";
        const animation = rowAnimations[serviceId];
        const isNew = animation?.isNew || false;
        const isUpdated = animation?.isUpdated || false;
        const eventType = animation?.eventType || "";

        // Determinar si mostrar el borde y qué color usar
        const showAnimation = isNew || isUpdated;

        return (
          <div
            key={servicio.id}
            className="px-1 relative group"
            id={`servicio-${servicio.id}`}
            style={{ width: "auto" }}
          >
            <div
              className={`
              select-none p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md relative
              ${showAnimation ? getBorderLeftColorByEvent(eventType) : "border-l"}
              ${isNew ? "animate-pulse" : ""}
              ${isUpdated ? "animate-fadeIn" : ""}
              ${selectedServicio?.id === servicio.id ? getColorCard(servicio.estado) : ""}
              w-auto lg:w-[30rem] max-w-full
            `}
              role="button"
              tabIndex={0}
              onClick={() => {
                handleClosePanel();
                handleSelectServicio(servicio);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectServicio(servicio);
                }
              }}
            >
              {/* Contenedor para los botones flotantes left */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                {/* Botones con posición fija y manejo simplificado */}
                <div className="flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Botón de finalizar */}
                  {showFinalizar(servicio.estado) && (
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                      onClick={(e) => handleFinalizar(e, servicio)}
                    >
                      <StampIcon size={16} />
                    </button>
                  )}
                  {showDelete(servicio.estado) && (
                    <button
                      className="bg-red-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                      onClick={() => eliminarServicio(servicio.id)}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Contenedor para los botones flotantes right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                {/* Botones con posición fija y manejo simplificado */}
                <div className="flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Botón para ver historial - siempre visible */}
                  <button
                    className="bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                    onClick={(e) => handleViewHistorial(e, servicio)}
                  >
                    <History size={16} />
                  </button>

                  {/* Botón de editar */}
                  {shouldShowEditButton(servicio.estado) && (
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                      onClick={(e) => handleEdit(e, servicio)}
                    >
                      <Edit size={16} />
                    </button>
                  )}

                  {/* Botón de ticket */}
                  {shouldGetTicket(servicio.estado) && (
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                      onClick={(e) => handleViewTicket(e, servicio)}
                    >
                      <Ticket size={16} />
                    </button>
                  )}

                  {/* Botón de planilla */}
                  {showPlanillaNumber(servicio.estado) && (
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                      onClick={(e) => handleViewLiquidacion(e, servicio)}
                    >
                      <Hash size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="overflow-hidden">
                  <div className="font-semibold truncate">
                    {servicio.origen_especifico}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    → {servicio.destino_especifico}
                  </div>
                </div>
                <span
                  className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-1 flex-shrink-0"
                  style={{
                    backgroundColor: `${getStatusColor(servicio.estado)}20`,
                    color: getStatusColor(servicio.estado),
                  }}
                >
                  {getStatusText(servicio.estado)}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                <div className="truncate">
                  Solicitado: {formatearFecha(servicio.fecha_solicitud)}
                </div>
                <div className="truncate">
                  Realización: {formatearFecha(servicio.fecha_realizacion)}
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
