import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import { ServicioConRelaciones } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

export default function RouteAndDetails({
  servicio,
}: {
  servicio: ServicioConRelaciones;
}) {
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  return (
    <div className="px-2 md:px-0">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 gap-4 md:gap-0">
        <div className="w-full md:w-2/5 mb-3 md:mb-0">
          <p className="text-xs md:text-sm text-gray-500">Origen</p>
          <p className="font-semibold text-base md:text-lg break-words">
            {servicio.origen?.nombre_municipio || "No definido"}
          </p>
          <p className="text-xs md:text-sm text-gray-700 break-words">
            {servicio.origen_especifico}
          </p>
        </div>
        {!isMobile && (
          <div className="w-full md:w-1/5 flex justify-center my-2 md:my-0">
            <div className="relative flex items-center justify-center h-full">
              <ArrowRight />
            </div>
          </div>
        )}
        <div className="w-full md:w-2/5 text-left md:text-right">
          <p className="text-xs md:text-sm text-gray-500">Destino</p>
          <p className="font-semibold text-base md:text-lg break-words">
            {servicio.destino?.nombre_municipio || "No definido"}
          </p>
          <p className="text-xs md:text-sm text-gray-700 break-words">
            {servicio.destino_especifico}
          </p>
        </div>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs md:text-sm text-gray-500">Fecha del servicio</p>
          <p className="font-medium break-words">
            {formatearFecha(servicio.fecha_realizacion)}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs md:text-sm text-gray-500">Propósito</p>
          <p className="font-medium break-words">
            Transporte de {servicio.proposito_servicio || "No especificado"}
          </p>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-dashed border-gray-300 my-4 relative">
        <div className="absolute -top-2 h-4 w-4 rounded-full bg-gray-200" />
        <div className="absolute right-0 -top-2 h-4 w-4 rounded-full bg-gray-200" />
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-10 justify-between mt-4">
        <div className="flex-1 mb-4 md:mb-0">
          <p className="text-xs md:text-sm text-gray-500">Cliente</p>
          <p className="font-semibold break-words">
            {servicio.cliente?.Nombre || "Cliente no especificado"}
          </p>
          {servicio.cliente?.NIT && (
            <p className="text-xs text-gray-500 break-words">
              NIT: {servicio.cliente.NIT}
            </p>
          )}
        </div>
        <div className="flex-1 mt-0 md:mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Observaciones:
          </p>
          <p className="text-xs md:text-sm text-gray-700 break-words">
            {!servicio.observaciones
              ? "No hay observaciones"
              : servicio.observaciones}
          </p>
        </div>
      </div>
    </div>
  );
}
