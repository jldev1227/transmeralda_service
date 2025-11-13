import React, { useEffect, useState, useCallback } from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

import RouteAndDetails from "./routeAndDetails";

import { useTicketShare } from "@/components/shareTicketImage";
import { useService } from "@/context/serviceContext";
import { getStatusColor, getStatusText } from "@/utils/indext";
import { apiClient } from "@/config/apiClient";

export default function ModalTicket() {
  const { servicioTicket, modalTicket, handleModalTicket } = useService();
  const { shareTicket } = useTicketShare();
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

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
  }, [servicio?.conductor?.id, getPresignedUrl, servicio]);

  // Función para manejar errores de carga de imagen
  const handleImageError = useCallback(() => {
    setPhotoError(true);
    setFotoUrl(null);
  }, []);

  // Función mejorada para manejar el compartir
  const handleShare = async () => {
    if (!servicio || isSharing) return;

    setIsSharing(true);

    try {
      await shareTicket(servicio);
    } catch (error) {
      console.error("Error al compartir ticket:", error);
    } finally {
      // Pequeño delay para mejor UX visual
      setTimeout(() => {
        setIsSharing(false);
      }, 500);
    }
  };

  // Si no hay servicio, mostrar mensaje o regresar null
  if (!servicio) {
    return (
      <Modal
        backdrop={"blur"}
        className="max-w-[1200px]"
        isOpen={modalTicket}
        scrollBehavior="inside"
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

  // Componente mejorado para la foto del conductor
  const ConductorPhoto = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    const handleLocalImageError = () => {
      setImageError(true);
      setImageLoaded(true);
      handleImageError();
    };

    // Mostrar skeleton mientras carga la URL o la imagen
    if (isLoadingPhoto) {
      return (
        <div className="w-30 md:w-full h-40 md:h-48 rounded-lg relative overflow-hidden">
          {/* Skeleton con animación mejorada */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                animation: "shimmer 1.5s ease-in-out infinite",
                transform: "translateX(-100%)",
              }}
            />
          </div>

          {/* Indicador visual de carga */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>

          {/* Texto de carga */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-black/20 backdrop-blur-sm rounded px-2 py-1">
              <div className="text-xs text-white text-center font-medium">
                Cargando foto...
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-30 md:w-5/6 h-40 md:h-64 rounded-lg relative overflow-hidden bg-gray-50 group">
        {/* Placeholder mientras carga la imagen */}
        {!imageLoaded && fotoUrl && !imageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Imagen principal con transición suave */}
        <div
          className={`relative w-full h-full transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <Image
            fill
            alt="Foto conductor asignado"
            className="object-cover rounded-lg transition-opacity duration-300"
            priority={false}
            src={fotoUrl || "/assets/not_user.avif"}
            onError={handleLocalImageError}
            onLoad={handleImageLoad}
          />
        </div>

        {/* Overlay para estado de error o sin foto */}
        {(imageError || photoError || !fotoUrl) && imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500 p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
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
              </div>
              <span className="text-xs font-medium">Sin foto disponible</span>
            </div>
          </div>
        )}

        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

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
              <ModalBody className="!p-0 bg-white rounded-lg shadow-xl">
                {/* Encabezado del ticket */}
                <div className={`p-4 text-white bg-emerald-600`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Transmeralda</h2>
                    <div className="text-right flex items-center gap-3">
                      {/* Botón de compartir mejorado */}
                      <button
                        className={`relative bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-full p-2 ${
                          isSharing
                            ? "cursor-wait opacity-70"
                            : "cursor-pointer"
                        }`}
                        disabled={isSharing}
                        title={
                          isSharing ? "Compartiendo..." : "Compartir ticket"
                        }
                        onClick={handleShare}
                      >
                        {isSharing ? (
                          // Spinner mientras comparte
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          // Icono de compartir
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
                        )}
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
                    {!isMobile && <ConductorPhoto />}
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
                          {servicio.vehiculo?.placa} {servicio.vehiculo?.marca}{" "}
                          {servicio.vehiculo?.linea} {servicio.vehiculo?.modelo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sección derecha - detalles del viaje */}
                  <div className="w-full md:w-4/6 p-4 space-y-6">
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
