import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  CalendarIcon,
  UserIcon,
  ClipboardListIcon,
  MapPinIcon,
  BuildingIcon,
} from "lucide-react";

import CustomTable from "./CustomTable";

import { apiClient } from "@/config/apiClient";
import { ServicioConRelaciones } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

// Tipado para la liquidación
interface Liquidacion {
  id: string;
  consecutivo: string;
  fecha_liquidacion: string;
  valor_total: string;
  estado: "pendiente" | "procesada" | "anulada" | "liquidado";
  observaciones: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nombre: string;
    correo: string;
  };
  servicios: ServicioConRelaciones[];
}

interface ModalDetalleLiquidacionProps {
  isOpen: boolean;
  onClose: () => void;
  liquidacionId: string | null;
}

const ModalDetalleLiquidacion: React.FC<ModalDetalleLiquidacionProps> = ({
  isOpen,
  onClose,
  liquidacionId,
}) => {
  const [liquidacion, setLiquidacion] = useState<Liquidacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la liquidación cuando cambia el ID
  useEffect(() => {
    const fetchLiquidacion = async () => {
      if (!liquidacionId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<Liquidacion>(
          `/api/liquidaciones_servicios/${liquidacionId}`,
        );

        setLiquidacion(response.data);
      } catch (err) {
        console.error("Error al cargar la liquidación:", err);
        setError(
          "Error al cargar los detalles de la liquidación. Por favor, intenta nuevamente.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && liquidacionId) {
      fetchLiquidacion();
    } else {
      // Limpiar datos cuando se cierra el modal
      setLiquidacion(null);
    }
  }, [isOpen, liquidacionId]);

  // Formatear valor como moneda
  const formatearMoneda = (valor: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(parseFloat(valor));
  };

  // Renderizar chip de estado
  const renderEstadoChip = (estado: string) => {
    // Define el tipo correcto para color
    let color:
      | "primary"
      | "default"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | undefined;

    switch (estado) {
      case "pendiente":
        color = "warning";
        break;
      case "procesada":
        color = "success";
        break;
      case "anulada":
        color = "danger";
        break;
      case "liquidado":
        color = "success";
        break;
      default:
        color = "default";
    }

    return (
      <Chip color={color} size="sm" variant="flat">
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Chip>
    );
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
        // Personalizar el tamaño del modal a 6xl (entre 5xl y full)
        wrapper: "max-w-[96rem] w-[calc(100%-3rem)] mx-auto", // 96rem es mayor que 5xl (64rem) pero no es "full"
        // Asegurar que el contenido ocupe todo el ancho del modal
        base: "w-full"
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl" // Mantenemos el valor estándar, pero lo sobreescribimos con classNames
      onClose={onClose}
    >
      <ModalContent className="w-full max-w-full">
        {() => (
          <>
            <ModalHeader>
              {liquidacion ? (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h2 className="text-xl font-bold">
                      Liquidación #{liquidacion.consecutivo}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Creada el{" "}
                      {formatearFecha(
                        liquidacion.createdAt,
                        true,
                        false,
                        false,
                      )}
                    </p>
                  </div>
                  {renderEstadoChip(liquidacion.estado)}
                </div>
              ) : (
                <h2 className="text-xl font-bold">Detalles de Liquidación</h2>
              )}
            </ModalHeader>

            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : liquidacion ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Información General
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <span className="block text-sm text-gray-500">
                              Fecha de Liquidación
                            </span>
                            <span className="font-medium">
                              {formatearFecha(
                                liquidacion.fecha_liquidacion,
                                false,
                                false,
                                false,
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <span className="block text-sm text-gray-500">
                              Creado por
                            </span>
                            <span className="font-medium">
                              {liquidacion.user.nombre}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <ClipboardListIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <span className="block text-sm text-gray-500">
                              Total de Servicios
                            </span>
                            <span className="font-medium">
                              {liquidacion.servicios.length}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <BuildingIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <div className="font-medium">
                            <span className="block text-sm text-gray-500">
                              Cliente
                            </span>
                            <p>{liquidacion.servicios[0].cliente?.Nombre || "N/A"}</p>
                            <p className="text-xs text-gray-500">
                              {liquidacion.servicios[0].cliente?.NIT || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Resumen Financiero
                      </h3>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">Valor Total</span>
                          <span className="text-xl font-bold">
                            {formatearMoneda(liquidacion.valor_total)}
                          </span>
                        </div>

                        {liquidacion.observaciones && (
                          <div className="mt-4">
                            <span className="block text-sm text-gray-500 mb-1">
                              Observaciones
                            </span>
                            <p className="text-gray-700 bg-white p-2 rounded border text-sm">
                              {liquidacion.observaciones || "Sin observaciones"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Servicios Incluidos
                    </h3>

                    <CustomTable
                      className="rounded-lg"
                      columns={[
                        {
                          key: "planilla",
                          label: "PLANILLA",
                          renderCell: (servicio) => (
                            <div>
                              <div className="font-semibold">
                                {servicio.numero_planilla}
                              </div>
                              <div className="text-xs text-gray-500">
                                {servicio.proposito_servicio === "personal"
                                  ? "Personal"
                                  : "Personal y herramienta"}
                              </div>
                            </div>
                          ),
                        },
                        {
                          key: "origen_destino",
                          label: "ORIGEN / DESTINO",
                          renderCell: (servicio) => (
                            <div className="flex items-start">
                              <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium">De:</span>{" "}
                                  {servicio.origen?.nombre ||
                                    servicio.origen_especifico}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">A:</span>{" "}
                                  {servicio.destino?.nombre ||
                                    servicio.destino_especifico}
                                </div>
                              </div>
                            </div>
                          ),
                        },
                        {
                          key: "valor",
                          label: "VALOR",
                          renderCell: (servicio) => (
                            <div className="font-semibold">
                              {formatearMoneda(
                                servicio.ServicioLiquidacion.valor_liquidado,
                              )}
                            </div>
                          ),
                        },
                      ]}
                      data={liquidacion.servicios}
                      emptyContent={
                        <div className="text-center p-4 text-gray-500">
                          No se encontraron servicios
                        </div>
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No se ha seleccionado ninguna liquidación
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDetalleLiquidacion;
