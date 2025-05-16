import React from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

import RouteAndDetails from "./routeAndDetails";

import { useService } from "@/context/serviceContext";
import { getStatusColor, getStatusText } from "@/utils/indext";

export default function ModalTicket() {
  const { servicioTicket, modalTicket, handleModalTicket } = useService();
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  // Obtener el servicio real del contexto
  const servicio = servicioTicket?.servicio;

  // Si no hay servicio, mostrar mensaje o regresar null
  if (!servicio) {
    return (
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-20",
        }}
        isOpen={modalTicket}
        scrollBehavior="inside"
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
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
          // Personalizar el tamaño del modal a 6xl (entre 5xl y full)
        }}
        isOpen={modalTicket}
        scrollBehavior="inside"
        size={"5xl"}
        onClose={() => {
          handleModalTicket();
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className="!p-0">
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
                    <div className="flex flex-row items-center gap-4 md:flex-col w-full md:w-2/6 p-4 border-b md:border-b-0 md:border-r border-dashed border-gray-300">
                      <div className="border-2 border-gray-300 rounded-lg w-30 md:w-full h-40 md:h-48 relative">
                        <Image
                          alt="Foto conductor asignado"
                          fill
                          className="object-cover rounded-lg"
                          src={
                            servicio.conductor.foto_url ??
                            "/assets/not_user.avif"
                          }
                        />
                      </div>
                      <div>
                        <div>
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
                          <p className="text-gray-500">
                            Teléfono:{' '}
                            {servicio.conductor?.telefono || 'No cuenta con teléfono'}
                          </p>
                        </div>
                        <div className="mt-4">
                          <h3 className={`font-bold text-emerald-600`}>
                            Vehículo
                          </h3>
                          <p className="text-gray-700">
                            {servicio.vehiculo?.placa}{" "}
                            {servicio.vehiculo?.marca}{" "}
                            {servicio.vehiculo?.linea}{" "}
                            {servicio.vehiculo?.modelo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sección derecha - detalles del viaje */}
                    <div className="w-full md:w-4/6 p-6 space-y-6">
                      {/* Ruta */}
                      <RouteAndDetails servicio={servicio} />

                      <div className="flex justify-end items-center">
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
