import { ArrowRight } from "lucide-react";

import { ServicioConRelaciones } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

export default function RouteAndDetails({
  servicio,
}: {
  servicio: ServicioConRelaciones;
}) {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="w-full md:w-2/5 mb-3 md:mb-0">
          <p className="text-sm text-gray-500">Origen</p>
          <p className="font-semibold text-lg">
            {servicio.origen?.nombre_municipio || "No definido"}
          </p>
          <p className="text-sm text-gray-700">{servicio.origen_especifico}</p>
        </div>
        <div className="w-full md:w-1/5 flex justify-center my-2">
          <div className="relative">
            <div className="hidden md:block w-16 absolute top-1/2 -left-8" />
            <ArrowRight />
            <div className="hidden md:block w-16 absolute top-1/2 -right-8" />
          </div>
        </div>
        <div className="w-full md:w-2/5 text-left md:text-right">
          <p className="text-sm text-gray-500">Destino</p>
          <p className="font-semibold text-lg">
            {servicio.destino?.nombre_municipio || "No definido"}
          </p>
          <p className="text-sm text-gray-700">{servicio.destino_especifico}</p>
        </div>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Fecha del servicio</p>
          <p className="font-medium">
            {formatearFecha(servicio.fecha_realizacion)}
          </p>
        </div>

        {/* Distancia y propósito */}
        <div className="text-right">
          <p className="text-sm text-gray-500">Propósito</p>
          <p className="font-medium">
            Transporte de {servicio.proposito_servicio || "No especificado"}
          </p>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-dashed border-gray-300 my-4 relative">
        <div className="absolute -top-2 h-4 w-4 rounded-full bg-gray-200" />
        <div className="absolute right-0 -top-2 h-4 w-4 rounded-full bg-gray-200" />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-10 justify-between mt-4">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-500">Cliente</p>
          <p className="font-semibold">
            {servicio.cliente?.Nombre || "Cliente no especificado"}
          </p>
          {servicio.cliente?.NIT && (
            <p className="text-xs text-gray-500">NIT: {servicio.cliente.NIT}</p>
          )}
        </div>
        {/* Observaciones si existen */}
        <div className="flex-1 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Observaciones:</p>
          <p className="text-sm text-gray-700">
            {!servicio.observaciones
              ? "No hay observaciones"
              : servicio.observaciones}
          </p>
        </div>
      </div>
    </div>
  );
}
