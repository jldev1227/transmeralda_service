import React from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { useService } from "@/context/serviceContext";
import { formatCurrency, formatearFecha } from "@/helpers";
import { getStatusColor, getStatusText } from "@/app/page";
import RouteAndDetails from "./routeAndDetails";

export default function ModalTicket() {
  const { servicioTicket, modalTicket, handleModalTicket } = useService();

  // Obtener el servicio real del contexto
  const servicio = servicioTicket?.servicio;

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

  const statusColors = getStatusColor(servicio.estado);

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
                  <div className={`p-4 text-white bg-emerald-600`}>
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
                          height={250}
                          src={"/assets/camilo velasco.jpeg"}
                          width={200}
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className={`font-bold text-emerald-600`}>
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
                        <h3 className={`font-bold text-emerald-600`}>
                          Vehículo
                        </h3>
                        <p className="text-gray-700">
                          {servicio.vehiculo?.placa} {servicio.vehiculo?.marca}{" "}
                          {servicio.vehiculo?.linea} {servicio.vehiculo?.modelo}
                        </p>
                      </div>
                    </div>

                    {/* Sección derecha - detalles del viaje */}
                    <div className="w-full md:w-3/4 p-6">
                      {/* Número de ticket */}
                      <div className="flex justify-between items-center mb-6">
                        <h1
                          className={`text-xl font-bold text-emerald-600`}
                        >
                          Servicio #{servicio.id}
                        </h1>
                        <span
                          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-1 flex-shrink-0"
                          style={{
                            backgroundColor: `${statusColors}20`,
                            color: statusColors,
                          }}
                        >
                          {getStatusText(servicio.estado)}
                        </span>
                      </div>

                      {/* Ruta */}
                      <RouteAndDetails servicio={servicio}/>
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
