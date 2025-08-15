import React, { useEffect, useState, useCallback } from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";

import RouteAndDetails from "./routeAndDetails";

import { useTicketShare } from "@/components/shareTicketImage"; // Importar el hook
import { useService } from "@/context/serviceContext";
import { getStatusColor, getStatusText } from "@/utils/indext";
import { apiClient } from "@/config/apiClient";

export default function ModalTicket() {
  const { servicioTicket, modalTicket, handleModalTicket } = useService();
  const { shareTicket } = useTicketShare(); // Usar el hook
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Memoizar la función para evitar re-renders innecesarios
  const getPresignedUrl = useCallback(async (s3Key: string) => {
    try {
      const response = await apiClient.get(`/api/documentos/url-firma`, {
        params: { key: s3Key },
      });

      return response.data.url;
    } catch (error) {
      console.error("Error al obtener URL firmada:", error);

      return null;
    }
  }, []);

  // Obtener el servicio real del contexto
  const servicio = servicioTicket?.servicio;

  useEffect(() => {
    const cargarFotoPerfil = async () => {
      // Reset de estados
      setFotoUrl(null);
      setPhotoError(false);

      const fotoPerfil = servicio?.conductor?.documentos?.find(
        (doc) => doc.categoria === "FOTO_PERFIL",
      );

      if (fotoPerfil?.s3_key) {
        setIsLoadingPhoto(true);
        try {
          const url = await getPresignedUrl(fotoPerfil.s3_key);

          if (url) {
            setFotoUrl(url);
          } else {
            setPhotoError(true);
            console.warn("No se pudo obtener la URL de la foto");
          }
        } catch (error) {
          console.error("Error al cargar foto de perfil:", error);
          setPhotoError(true);
        } finally {
          setIsLoadingPhoto(false);
        }
      } else {
        setIsLoadingPhoto(false);
      }
    };

    if (servicio?.conductor) {
      cargarFotoPerfil();
    }
  }, [servicio?.conductor?.id, getPresignedUrl]); // Depender del ID del conductor en lugar del objeto completo

  // Función para manejar errores de carga de imagen
  const handleImageError = useCallback(() => {
    setPhotoError(true);
    setFotoUrl(null);
  }, []);

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

  // Función para manejar el compartir
  const handleShare = async () => {
    await shareTicket(servicio);
  };

  // Componente para la foto del conductor
  const ConductorPhoto = () => {
    if (!fotoUrl) return null;

    if (isLoadingPhoto) {
      return (
        <Skeleton className="w-30 md:w-full h-40 md:h-48 rounded-lg">
          <div className="h-full w-full bg-gray-200 rounded-lg" />
        </Skeleton>
      );
    }

    return (
      <div className="border-2 border-gray-300 rounded-lg relative overflow-hidden bg-gray-50">
        {fotoUrl && (
          <Image
            alt="Foto conductor asignado"
            className="object-cover rounded-lg transition-opacity duration-300"
            height={192}
            priority={false} // No es crítica para el LCP
            src={fotoUrl}
            width={210}
            onError={handleImageError}
          />
        )}
        {/* Overlay para estado de loading/error */}
        {photoError && !isLoadingPhoto && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-8 w-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </svg>
              <span className="text-xs">Sin foto</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Modal
        hideCloseButton
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
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
                      <div className="text-right flex items-center gap-3">
                        {/* Botón de compartir */}
                        <button
                          className="bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full p-2"
                          title="Compartir ticket"
                          onClick={handleShare}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
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
                      <ConductorPhoto />
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
                              "No cuenta con identificación"}
                          </p>
                          <p className="text-gray-500">
                            Teléfono:{" "}
                            {servicio.conductor?.telefono ||
                              "No cuenta con teléfono"}
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
