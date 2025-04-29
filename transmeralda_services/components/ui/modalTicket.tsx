import React from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { useService } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

export default function ModalTicket() {
  const { servicioTicket, modalTicket, handleModalTicket } = useService();

  // Obtener el servicio real del contexto
  const servicio = servicioTicket?.servicio;

  // Función para obtener colores según el estado
  const getStatusColors = (estado: string) => {
    switch (estado) {
      case "en curso":
        return { bg: "bg-emerald-500", text: "text-emerald-600" };
      case "realizado":
        return { bg: "bg-primary-600", text: "text-primary-600" };
      case "planificado":
        return { bg: "bg-amber-500", text: "text-amber-600" };
      case "solicitado":
        return { bg: "bg-gray-500", text: "text-gray-600" };
      case "cancelado":
        return { bg: "bg-red-500", text: "text-red-600" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-600" };
    }
  };

  // Función para formatear valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Función para formatear fechas
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Fecha no definida";
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM yyyy", { locale: es });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  // Si no hay servicio, mostrar mensaje o regresar null
  if (!servicio) {
    return (
      <Modal
        isOpen={modalTicket}
        size={"4xl"}
        onClose={() => handleModalTicket()}
      >
        <ModalContent className="p-6 bg-transparent shadow-none">
          {() => (
            <ModalBody className="p-6 bg-white">
              <p className="text-center text-gray-500">
                No hay información del servicio disponible
              </p>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    );
  }

  const statusColors = getStatusColors(servicio.estado);

  return (
    <>
      <Modal
        isOpen={modalTicket}
        size={"5xl"}
        onClose={() => {
          handleModalTicket();
        }}
      >
        <ModalContent className="p-6 bg-transparent shadow-none">
          {() => (
            <>
              <ModalBody className="p-0">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                  {/* Encabezado del ticket */}
                  <div className={`p-4 text-white ${statusColors.bg}`}>
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Transmeralda</h2>
                      <div className="text-right">
                        <span className="text-sm font-medium block">
                          Ticket de Servicio
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cuerpo del ticket */}
                  <div className="flex flex-col md:flex-row">
                    {/* Sección izquierda - espacio para foto del conductor */}
                    <div className="w-full md:w-2/6 p-4 border-b md:border-b-0 md:border-r border-dashed border-gray-300">
                      <div className="border-2 border-gray-300 rounded-lg h-56 w-full flex items-center justify-center">
                        <Image
                          alt="Foto conductor asignado"
                          className="h-full w-full"
                          width={200}
                          height={250}
                          src={"/assets/camilo velasco.jpeg"}
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className={`font-bold ${statusColors.text}`}>
                          Conductor
                        </h3>
                        <p className="text-gray-700">
                          {servicio.conductor?.nombre}{" "}
                          {servicio.conductor?.apellido}
                        </p>
                        <p className="text-sm text-gray-500">
                          {servicio.conductor?.tipo_identificacion}:{" "}
                          {servicio.conductor?.numero_identificacion ||
                            "No disponible"}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h3 className={`font-bold ${statusColors.text}`}>
                          Vehículo
                        </h3>
                        <p className="text-gray-700">
                          {servicio.vehiculo?.placa}{" "}{servicio.vehiculo?.linea}{" "}{servicio.vehiculo?.modelo}
                        </p>
                      </div>
                    </div>

                    {/* Sección derecha - detalles del viaje */}
                    <div className="w-full md:w-3/4 p-6">
                      {/* Número de ticket */}
                      <div className="flex justify-between items-center mb-6">
                        <h1 className={`text-xl font-bold ${statusColors.text}`}>
                          Servicio #{servicio.id}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-sm text-white ${statusColors.bg}`}>
                          {servicio.estado === "en curso"
                            ? "En Curso"
                            : servicio.estado === "realizado"
                              ? "Completado"
                              : servicio.estado === "planificado"
                                ? "Planificado"
                                : servicio.estado === "solicitado"
                                  ? "Solicitado"
                                  : "Cancelado"}
                        </span>
                      </div>

                      {/* Ruta */}
                      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                        <div className="w-full md:w-2/5 mb-3 md:mb-0">
                          <p className="text-sm text-gray-500">Origen</p>
                          <p className="font-semibold text-lg">
                            {servicio.origen?.nombre_municipio || "No definido"}
                          </p>
                          <p className="text-sm text-gray-700">
                            {servicio.origen_especifico}
                          </p>
                        </div>
                        <div className="w-full md:w-1/5 flex justify-center my-2">
                          <div className="relative">
                            <div className="hidden md:block w-16 absolute top-1/2 -left-8" />
                            <ArrowRight className={statusColors.text} />
                            <div className="hidden md:block w-16 absolute top-1/2 -right-8" />
                          </div>
                        </div>
                        <div className="w-full md:w-2/5 text-left md:text-right">
                          <p className="text-sm text-gray-500">Destino</p>
                          <p className="font-semibold text-lg">
                            {servicio.destino?.nombre_municipio ||
                              "No definido"}
                          </p>
                          <p className="text-sm text-gray-700">
                            {servicio.destino_especifico}
                          </p>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">
                            Fecha del servicio
                          </p>
                          <p className="font-medium">
                            {formatearFecha(servicio.fecha_realizacion)}
                          </p>
                        </div>

                        {/* Distancia y propósito */}
                        <div>
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

                      {/* Cliente y precio */}
                      <div className="flex flex-col md:flex-row justify-between mt-4">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-gray-500">Cliente</p>
                          <p className="font-semibold">
                            {servicio.cliente?.Nombre ||
                              "Cliente no especificado"}
                          </p>
                          {servicio.cliente?.NIT && (
                            <p className="text-xs text-gray-500">
                              NIT: {servicio.cliente.NIT}
                            </p>
                          )}
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-sm text-gray-500">
                            Valor del servicio
                          </p>
                          <p className={`font-bold text-lg ${statusColors.text}`}>
                            {formatCurrency(servicio.valor || 0)}
                          </p>
                        </div>
                      </div>

                      {/* Observaciones si existen */}
                      {servicio.observaciones && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500 font-medium">
                            Observaciones:
                          </p>
                          <p className="text-sm text-gray-700">
                            {servicio.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
