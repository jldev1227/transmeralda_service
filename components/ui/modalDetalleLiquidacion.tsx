import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
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
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import CustomTable from "./CustomTable";
import { useConfirmDialogWithTextarea } from "./confirmDialogWithTextArea";

import { apiClient } from "@/config/apiClient";
import { ServicioConRelaciones } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";
import { useAuth } from "@/context/AuthContext";

// Tipado para la liquidación
interface Liquidacion {
  id: string;
  consecutivo: string;
  fecha_liquidacion: string;
  valor_total: string;
  estado: "liquidado" | "aprobado" | "facturado" | "anulada";
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
  // Auth context
  const { user } = useAuth();
  const [liquidacion, setLiquidacion] = useState<Liquidacion | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    confirm,
    DialogComponent,
    setLoading: setConfirmLoading,
  } = useConfirmDialogWithTextarea();

  // Cargar datos de la liquidación cuando cambia el ID
  useEffect(() => {
    const fetchLiquidacion = async () => {
      if (!liquidacionId) return;

      setLoading(true);

      try {
        const response = await apiClient.get<Liquidacion>(
          `/api/liquidaciones_servicios/${liquidacionId}`,
        );

        setLiquidacion(response.data);
      } catch (err) {
        console.error("Error al cargar la liquidación:", err);
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
      case "liquidado":
        color = "warning";
        break;
      case "aprobado":
        color = "success";
        break;
      case "rechazada":
        color = "danger";
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

  const aprobarLiquidacion = async () => {
    if (!liquidacionId) return;

    setLoading(true);

    try {
      const response = await apiClient.patch<Liquidacion>(
        `/api/liquidaciones_servicios/${liquidacionId}/aprobar`,
      );

      setLiquidacion(response.data);
      onClose();
    } catch (err) {
      console.error("Error al aprobar la liquidación:", err);
      const errorMsg =
        "Error al aprobar la liquidación. Por favor, intenta nuevamente.";

      // Mostrar notificación de error
      addToast({
        title: "Error",
        description: errorMsg,
      });

      setLoading(false);
    }
  };

  const rechazarLiquidacion = async () => {
    if (!liquidacionId) return;

    // Mostrar diálogo de confirmación con textarea obligatorio
    const { confirmed, observaciones } = await confirm({
      title: "Rechazar liquidación",
      message:
        "¿Estás seguro de que deseas rechazar esta liquidación? Esta acción puede requerir aprobación adicional.",
      confirmText: "Rechazar",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      textareaRequired: true,
      textareaLabel: "Motivo del rechazo",
      textareaPlaceholder:
        "Indique el motivo por el cual rechaza esta liquidación...",
      textareaHelperText:
        "Es necesario especificar el motivo del rechazo para continuar.",
    });

    if (!confirmed) return;

    setLoading(true);
    setConfirmLoading(true);

    try {
      // Enviamos las observaciones al endpoint
      const response = await apiClient.patch<Liquidacion>(
        `/api/liquidaciones_servicios/${liquidacionId}/rechazar`,
        { observaciones }, // Enviar las observaciones al backend
      );

      setLiquidacion(response.data);

      // Mostrar notificación de éxito
      addToast({
        title: "Acción completada",
        description: "Liquidación rechazada correctamente",
        color: "danger",
      });

      onClose();
    } catch (err) {
      console.error("Error al rechazar la liquidación:", err);
      setLoading(false);
    }
  };

  const regresarEstadoLiquidado = async () => {
    if (!liquidacionId) return;

    // Mostrar diálogo de confirmación
    const { confirmed, observaciones } = await confirm({
      title: "Regresar a estado Liquidado",
      message:
        "¿Estás seguro de que deseas regresar esta liquidación al estado Liquidado?",
      confirmText: "Regresar a Liquidado",
      cancelText: "Cancelar",
      confirmVariant: "warning",
      textareaRequired: false,
      textareaLabel: "Observaciones (opcional)",
      textareaHelperText:
        "Puedes agregar observaciones adicionales si lo deseas.",
    });

    if (!confirmed) return;

    setLoading(true);
    setConfirmLoading(true);

    try {
      // Enviamos las observaciones al endpoint si las hay
      const response = await apiClient.patch<Liquidacion>(
        `/api/liquidaciones_servicios/${liquidacionId}/regresa-liquidado`,
        observaciones ? { observaciones } : undefined,
      );

      setLiquidacion(response.data);

      // Mostrar notificación de éxito
      addToast({
        title: "Estado actualizado",
        description: "Liquidación regresada a estado Liquidado correctamente",
        color: "success",
      });

      onClose();
    } catch (err) {
      console.error("Error al regresar a estado liquidación:", err);
      setLoading(false);
    }
  };

  return (
    <>
      {DialogComponent}

      <Modal
        backdrop="blur"
        classNames={{
          wrapper: "max-w-[96rem] w-[calc(100%-3rem)] mx-auto", // 96rem es mayor que 5xl (64rem) pero no es "full"
          // Asegurar que el contenido ocupe todo el ancho del modal
          base: "w-full",
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
                {!liquidacion && loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner color="success" size="lg" />
                  </div>
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
                              <p>
                                {liquidacion.servicios[0].cliente?.Nombre ||
                                  "N/A"}
                              </p>
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
                                {liquidacion.observaciones ||
                                  "Sin observaciones"}
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
              <ModalFooter>
                {user?.permisos?.aprobador && liquidacion && !loading && (
                  <div className="flex items-center gap-4">
                    {liquidacion.estado === "aprobado" && (
                      <Button
                        className="bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors"
                        isLoading={loading}
                        radius="sm"
                        onPress={regresarEstadoLiquidado}
                      >
                        Regresar a estado Liquidado
                      </Button>
                    )}
                    {liquidacion.estado === "liquidado" && (
                      <div className="space-x-2">
                        <Button
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors"
                          isLoading={loading}
                          radius="sm"
                          onPress={rechazarLiquidacion}
                        >
                          Rechazar liquidación
                        </Button>
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors"
                          isLoading={loading}
                          radius="sm"
                          onPress={aprobarLiquidacion}
                        >
                          Aprobar liquidación
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDetalleLiquidacion;
