import { DollarSign, Edit, Ticket } from "lucide-react";
import { MouseEvent } from "react";
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
    handleModalLiquidacion,
    clearSelectedServicio,
  } = useService();

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
      handleModalLiquidacion(servicio);
    }, 50); // Pequeño retraso para asegurar que la limpieza se complete
  };

  // Determinar si se debe mostrar el botón de edición
  const shouldShowEditButton = (estado: EstadoServicio) => {
    return estado !== "realizado" && estado !== "cancelado";
  };

  // Determinar si se debe mostrar el botón de ticket
  const shouldGetTicket = (estado: EstadoServicio) => {
    return estado !== "solicitado" && estado !== "cancelado";
  };

  // Determinar si se debe mostrar el botón de proceder a liquidar
  const showLiquidar = (estado: EstadoServicio) => {
    return estado === "realizado";
  };

  // Determinar el color de la tarjeta según el estado del servicio
  const getColorCard = (servicio: ServicioConRelaciones) => {
    switch (servicio.estado) {
      case "en curso":
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

  return (
    <div className="servicios-slider-container space-y-3">
      {filteredServicios.map((servicio: ServicioConRelaciones) => (
        <div
          key={servicio.id}
          className="px-1 relative group"
          style={{ width: "auto", minWidth: "280px", maxWidth: "350px" }}
        >
          <div
            className={`select-none p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md relative ${
              selectedServicio?.id === servicio.id ? getColorCard(servicio) : ""
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
                  className={`absolute right-0 ${shouldShowEditButton(servicio.estado) ? "top-3/4" : showLiquidar(servicio.estado) ? "top-1/4" : "top-1/2"} transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                  onClick={(e) => handleViewTicket(e, servicio)}
                >
                  <Ticket size={16} />
                </button>
              </Tooltip>
            )}

            {showLiquidar(servicio.estado) && (
              <Tooltip color="primary" content="Liquidar">
                <button
                  className={`absolute right-0 ${shouldGetTicket(servicio.estado) ? "top-3/4" : "top-1/2"} transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                  onClick={(e) => handleViewLiquidacion(e, servicio)}
                >
                  <DollarSign size={16} />
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
      ))}
    </div>
  );
};

export default ServiciosListCards;
