import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import {
  ClockIcon,
  UserIcon,
  ClipboardListIcon,
  TruckIcon,
  FlagIcon,
} from "lucide-react";
import { Button } from "@heroui/button";
import { parseZonedDateTime, ZonedDateTime } from "@internationalized/date";
import { DateInput } from "@heroui/date-input";

import { apiClient } from "@/config/apiClient";
import { ServicioConRelaciones } from "@/context/serviceContext";
import { convertirFechaParaDB, formatearFecha } from "@/helpers";

interface ModalFinalizarServicioProps {
  isOpen: boolean;
  onClose: () => void;
  servicioId: string | null;
}

const ModalFinalizarServicio: React.FC<ModalFinalizarServicioProps> = ({
  isOpen,
  onClose,
  servicioId,
}) => {
  const [servicio, setServicio] = useState<ServicioConRelaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for date to do request
  const [fechaFinalizacion, setFechaFinalizacion] = useState<ZonedDateTime>(
    parseZonedDateTime(
      `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
    ),
  );

  // Cargar datos del historial cuando cambia el ID
  useEffect(() => {
    const fetchServicio = async () => {
      if (!servicioId) return;

      setLoading(true);
      setError(null);

      try {
        // Obtener información del servicio
        const servicioResponse = await apiClient.get<{
          success: boolean;
          data: ServicioConRelaciones;
        }>(`/api/servicios/${servicioId}`);

        if (servicioResponse.data.success) {
          setServicio(servicioResponse.data.data);

          const { fecha_finalizacion } = servicioResponse.data.data;

          if (fecha_finalizacion) {
            try {
              // Crear una fecha en UTC a partir de la cadena ISO
              const utcDate = new Date(fecha_finalizacion);

              // Crear la fecha en formato que necesita parseZonedDateTime pero respetando la zona horaria de Bogotá
              // Calcular componentes de fecha y hora en la zona horaria de Bogotá (GMT-5)
              const year = utcDate.getUTCFullYear();
              const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
              const day = String(utcDate.getUTCDate()).padStart(2, "0");

              // Ajustar la hora UTC a la hora de Bogotá (GMT-5)
              let hours = utcDate.getUTCHours() - 5;
              // Manejar el cambio de día si las horas son negativas
              let adjustedDay = day;

              if (hours < 0) {
                hours += 24;
                // Crear una nueva fecha restando un día y obtener el día correcto
                const prevDay = new Date(utcDate);

                prevDay.setUTCDate(utcDate.getUTCDate() - 1);
                adjustedDay = String(prevDay.getUTCDate()).padStart(2, "0");
              }

              const minutes = String(utcDate.getUTCMinutes()).padStart(2, "0");
              const seconds = String(utcDate.getUTCSeconds()).padStart(2, "0");

              const formattedDate = `${year}-${month}-${adjustedDay}T${String(hours).padStart(2, "0")}:${minutes}:${seconds}[America/Bogota]`;

              setFechaFinalizacion(parseZonedDateTime(formattedDate));
            } catch (dateError) {
              console.error("Error al parsear la fecha:", dateError);
              // Mantener la fecha actual si hay error en la conversión
            }
          }
        }
      } catch (err) {
        console.error("Error al cargar el servicio:", err);
        setError(
          "Error al cargar del servicio. Por favor, intenta nuevamente.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && servicioId) {
      fetchServicio();
    } else {
      // Limpiar datos cuando se cierra el modal
      setServicio(null);
    }
  }, [isOpen, servicioId]);

  const finalizarServicio = async () => {
    if (!servicioId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch<{
        success: boolean;
        data: ServicioConRelaciones;
      }>(`/api/servicios/${servicioId}/estado`, {
        estado: "realizado",
        fecha_finalizacion: convertirFechaParaDB(fechaFinalizacion),
      });

      if (response.data.success) {
        setServicio(response.data.data);
        onClose();
      } else {
        setError("No se pudo finalizar el servicio. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error al finalizar el servicio:", err);
      setError(
        "Error al finalizar el servicio. Por favor, intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl" // Mantenemos el valor estándar, pero lo sobreescribimos con classNames
      onClose={onClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              {servicio && (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h2 className="text-xl font-bold">
                      Finalización de Servicio
                    </h2>
                    <p className="text-sm text-gray-500">
                      {servicio.origen_especifico} →{" "}
                      {servicio.destino_especifico}
                    </p>
                  </div>
                </div>
              )}
            </ModalHeader>

            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : servicio ? (
                <>
                  <div className="mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Información del Servicio
                      </h3>

                      {servicio && (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                              <div>
                                <span className="block text-sm text-gray-500">
                                  Fecha de Solicitud
                                </span>
                                <span className="font-medium">
                                  {formatearFecha(
                                    servicio.fecha_solicitud,
                                    true,
                                    false,
                                    false,
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FlagIcon className="h-5 w-5 mr-2 text-gray-500" />
                              <div>
                                <span className="block text-sm text-gray-500">
                                  Fecha de Realización
                                </span>
                                <span className="font-medium">
                                  {formatearFecha(
                                    servicio.fecha_realizacion,
                                    true,
                                    false,
                                    false,
                                  )}
                                </span>
                              </div>
                            </div>

                            {servicio.conductor && (
                              <div className="flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                  <span className="block text-sm text-gray-500">
                                    Conductor
                                  </span>
                                  <span className="font-medium">
                                    {servicio.conductor.nombre}{" "}
                                    {servicio.conductor.apellido}
                                  </span>
                                </div>
                              </div>
                            )}

                            {servicio.vehiculo && (
                              <div className="flex items-center">
                                <TruckIcon className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                  <span className="block text-sm text-gray-500">
                                    Vehículo
                                  </span>
                                  <span className="font-medium">
                                    {servicio.vehiculo.placa}{" "}
                                    {servicio.vehiculo.linea}{" "}
                                    {servicio.vehiculo.modelo}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center">
                              <ClipboardListIcon className="h-5 w-5 mr-2 text-gray-500" />
                              <div>
                                <span className="block text-sm text-gray-500">
                                  Estado Actual
                                </span>
                                <Chip
                                  color={
                                    servicio.estado === "realizado"
                                      ? "primary"
                                      : servicio.estado === "cancelado"
                                        ? "danger"
                                        : servicio.estado === "en_curso"
                                          ? "success"
                                          : servicio.estado === "planificado"
                                            ? "warning"
                                            : servicio.estado ===
                                                "planilla_asignada"
                                              ? "secondary"
                                              : "default"
                                  }
                                  size="sm"
                                  variant="flat"
                                >
                                  {servicio.estado.charAt(0).toUpperCase() +
                                    servicio.estado.slice(1).replace("_", " ")}
                                </Chip>
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <label
                              className="block text-sm font-medium text-gray-700 mb-1"
                              htmlFor="serviceDate"
                            >
                              Fecha y Hora de Finalización
                            </label>
                            <div className="relative space-y-2">
                              <DateInput
                                hideTimeZone
                                classNames={{
                                  inputWrapper: [
                                    "!bg-transparent",
                                    "data-[hover=true]:!bg-transparent",
                                    "border-1",
                                    "py-7",
                                    "group-data-[focus=true]:!bg-transparent",
                                    "rounded-md",
                                  ],
                                }}
                                defaultValue={parseZonedDateTime(
                                  `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
                                )}
                                granularity="minute"
                                value={fechaFinalizacion}
                                onChange={(value) => {
                                  if (value) setFechaFinalizacion(value);
                                }}
                              />
                              <p className="text-default-500 text-sm">
                                Fecha:{" "}
                                {fechaFinalizacion
                                  ? new Intl.DateTimeFormat("es-CO", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(fechaFinalizacion.toDate())
                                  : "--"}
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <Button
                              fullWidth
                              color="primary"
                              variant="flat"
                              onPress={finalizarServicio}
                            >
                              {servicio.fecha_finalizacion
                                ? "Editar Fecha Finalización"
                                : "Finalizar servicio"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No hay informacion del servicio a finalizar
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalFinalizarServicio;
