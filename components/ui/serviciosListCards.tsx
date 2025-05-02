import { Hash, Edit, Ticket } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { Tooltip } from "@heroui/tooltip";

import {
  EstadoServicio,
  ServicioConRelaciones,
  useService,
} from "@/context/serviceContext";

interface ServiciosListCardsProps {
  filteredServicios: ServicioConRelaciones[];
  selectedServicio: ServicioConRelaciones | null | undefined;
  handleSelectServicio: (servicio: ServicioConRelaciones) => void;
  getStatusColor: (estado: string) => string;
  getStatusText: (estado: string) => string;
  formatearFecha: (fechaISOString: Date | string | undefined) => string;
}

// Nueva interfaz para controlar animaciones de filas
interface RowAnimationState {
  [key: string]: {
    isNew: boolean;
    isUpdated: boolean;
    timestamp: number;
  };
}

const ServiciosListCards = ({
  filteredServicios,
  selectedServicio,
  handleSelectServicio,
  getStatusColor,
  getStatusText,
  formatearFecha,
}: ServiciosListCardsProps) => {
  const {
    handleModalForm,
    handleModalTicket,
    handleModalPlanilla,
    clearSelectedServicio,
    socketEventLogs
  } = useService();

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

  // Determinar si se debe mostrar el botón de edición
  const shouldShowEditButton = (estado: EstadoServicio) => {
    return estado === "solicitado" || estado === "planificado" || estado === "en_curso";
  };

  // Determinar si se debe mostrar el botón de ticket
  const shouldGetTicket = (estado: EstadoServicio) => {
    return estado !== "solicitado" && estado !== "cancelado";
  };

  // Determinar si se debe mostrar el botón de proceder a liquidar
  const showPlanillaNumber = (estado: EstadoServicio) => {
    return estado === "realizado" || estado === "planilla_asignada";
  };

  // Determinar el color de la tarjeta según el estado del servicio
  const getColorCard = (servicio: ServicioConRelaciones) => {
    switch (servicio.estado) {
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

  // Procesar eventos de socket para marcar filas como nuevas o actualizadas
  useEffect(() => {
    if (!socketEventLogs || socketEventLogs.length === 0) return;

    // Obtener el evento más reciente
    const latestEvents = [...socketEventLogs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5); // Solo procesar los 5 eventos más recientes

    const now = Date.now();
    const newAnimations: RowAnimationState = { ...rowAnimations };

    latestEvents.forEach((event) => {
      // Manejar creación de servicio
      if (event.eventName === "servicio:creado" && event.data.servicio) {
        const servicioId = event.data.servicio.id;

        newAnimations[servicioId] = {
          isNew: true,
          isUpdated: false,
          timestamp: now,
        };

        // Scroll a la servicio nueva (en el siguiente ciclo de renderizado)
        setTimeout(() => {
          const row = document.getElementById(
            `servicio-row-${servicioId}`,
          );

          if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }

      // Manejar actualización de servicio
      else if (
        event.eventName === "servicio:actualizado" &&
        event.data.servicio
      ) {
        const servicioId = event.data.servicio.id;

        // Solo marcar como actualizada si no es nueva
        if (!newAnimations[servicioId]?.isNew) {
          newAnimations[servicioId] = {
            isNew: false,
            isUpdated: true,
            timestamp: now,
          };
        }
      }
      // Manejar asignacion de planilla de servicio
      else if (
        event.eventName === "servicio:numero-planilla-actualizado" &&
        event.data.servicio
      ) {
        console.log(event)
        const servicioId = event.data.servicio.id;

        // Solo marcar como actualizada si no es nueva
        if (!newAnimations[servicioId]?.isNew) {
          newAnimations[servicioId] = {
            isNew: false,
            isUpdated: true,
            timestamp: now,
          };
        }
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

  return (
    <div className="servicios-slider-container space-y-3">
      {filteredServicios.map((servicio: ServicioConRelaciones) => {

        const animation = rowAnimations[servicio.id];
        const isNew = animation?.isNew || false;
        const isUpdated = animation?.isUpdated || false;

        return (
          <div
            key={servicio.id}
            id={`servicio-${servicio.id}`}
            className={`
              px-1 relative group 
              ${isNew ? "animate-highlight-new bg-green-50" : ""}
              ${isUpdated ? "" : ""}
            `}
            style={{ width: "auto", minWidth: "280px", maxWidth: "350px" }}
          >
            <div
              className={`select-none p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md relative ${selectedServicio?.id === servicio.id ? getColorCard(servicio) : ""
                }`}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectServicio(servicio)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectServicio(servicio);
                }
              }}
            >
              {/* Botón de edición que aparece al deslizar/hover */}

              {shouldShowEditButton(servicio.estado) && (
                <Tooltip color="primary" content="Editar">
                  <button
                    className={`absolute right-0 ${shouldGetTicket(servicio.estado) ? "top-1/4" : "top-1/2"} transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                    onClick={(e) => handleEdit(e, servicio)}
                  >
                    <Edit size={16} />
                  </button>
                </Tooltip>
              )}

              {shouldGetTicket(servicio.estado) && (
                <Tooltip color="primary" content="Ver">
                  <button
                    className={`absolute right-0 ${shouldShowEditButton(servicio.estado) ? "top-3/4" : showPlanillaNumber(servicio.estado) ? "top-1/4" : "top-1/2"} transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                    onClick={(e) => handleViewTicket(e, servicio)}
                  >
                    <Ticket size={16} />
                  </button>
                </Tooltip>
              )}

              {showPlanillaNumber(servicio.estado) && (
                <Tooltip color="primary" content="Añadir TM">
                  <button
                    className={`absolute right-0 ${shouldGetTicket(servicio.estado) ? "top-3/4" : "top-1/2"} transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                    onClick={(e) => handleViewLiquidacion(e, servicio)}
                  >
                    <Hash size={16} />
                  </button>
                </Tooltip>
              )}

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
        )
      })}
    </div>
  );
};

export default ServiciosListCards;
