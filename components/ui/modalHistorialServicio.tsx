import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  ClockIcon,
  UserIcon,
  ClipboardListIcon,
  HistoryIcon,
} from "lucide-react";

import CustomTable from "./CustomTable";

import { apiClient } from "@/config/apiClient";
import { ServicioConRelaciones } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

// Definición del tipo para los registros históricos
interface HistoricoServicio {
  id: string;
  servicio_id: string;
  usuario_id: string;
  campo_modificado: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  tipo_operacion: "creacion" | "actualizacion" | "eliminacion";
  fecha_modificacion: string;
  ip_usuario?: string;
  navegador_usuario?: string;
  detalles?: any;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: string;
  };
}

interface ModalHistorialServicioProps {
  isOpen: boolean;
  onClose: () => void;
  servicioId: string | null;
}

const ModalHistorialServicio: React.FC<ModalHistorialServicioProps> = ({
  isOpen,
  onClose,
  servicioId,
}) => {
  const [historico, setHistorico] = useState<HistoricoServicio[]>([]);
  const [servicio, setServicio] = useState<ServicioConRelaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del historial cuando cambia el ID
  useEffect(() => {
    const fetchHistorial = async () => {
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
        }

        // Obtener historial del servicio
        const historicoResponse = await apiClient.get<{
          success: boolean;
          data: HistoricoServicio[];
          total: number;
        }>(`/api/servicios-historico/servicio/${servicioId}`);

        if (historicoResponse.data.success) {
          setHistorico(historicoResponse.data.data);
        } else {
          throw new Error("No se pudo obtener el historial del servicio");
        }
      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError(
          "Error al cargar el historial del servicio. Por favor, intenta nuevamente.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && servicioId) {
      fetchHistorial();
    } else {
      // Limpiar datos cuando se cierra el modal
      setHistorico([]);
      setServicio(null);
    }
  }, [isOpen, servicioId]);

  // Renderizar chip para el tipo de operación
  const renderTipoOperacionChip = (tipo: string) => {
    let color:
      | "primary"
      | "default"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | undefined;

    switch (tipo) {
      case "creacion":
        color = "success";
        break;
      case "actualizacion":
        color = "warning";
        break;
      case "eliminacion":
        color = "danger";
        break;
      default:
        color = "default";
    }

    return (
      <Chip color={color} size="sm" variant="flat">
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Chip>
    );
  };

  // Función para obtener un valor legible del campo modificado
  const getCampoLegible = (campo: string): string => {
    const camposLegibles: Record<string, string> = {
      creacion_servicio: "Creación de servicio",
      eliminacion_servicio: "Eliminación de servicio",
      estado: "Estado",
      origen_id: "Origen",
      destino_id: "Destino",
      origen_especifico: "Origen específico",
      destino_especifico: "Destino específico",
      conductor_id: "Conductor",
      vehiculo_id: "Vehículo",
      cliente_id: "Cliente",
      proposito_servicio: "Propósito del servicio",
      fecha_solicitud: "Fecha de solicitud",
      fecha_realizacion: "Fecha de realización",
      fecha_finalizacion: "Fecha de finalización",
      valor: "Valor",
      numero_planilla: "Número de planilla",
      observaciones: "Observaciones",
    };

    return camposLegibles[campo] || campo;
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
      size="5xl" // Mantenemos el valor estándar, pero lo sobreescribimos con classNames
      onClose={onClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              {servicio ? (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h2 className="text-xl font-bold">Historial de Servicio</h2>
                    <p className="text-sm text-gray-500">
                      {servicio.origen_especifico} →{" "}
                      {servicio.destino_especifico}
                    </p>
                  </div>
                  <Chip color="primary" size="sm" variant="flat">
                    {historico.length} Registros
                  </Chip>
                </div>
              ) : (
                <h2 className="text-xl font-bold">Historial de Servicio</h2>
              )}
            </ModalHeader>

            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : historico.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Información del Servicio
                      </h3>

                      {servicio && (
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
                                  false,
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
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Resumen de Cambios
                      </h3>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <HistoryIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <span className="block text-sm text-gray-500">
                              Última Modificación
                            </span>
                            <span className="font-medium">
                              {formatearFecha(
                                historico[0]?.fecha_modificacion,
                                true,
                                false,
                                false,
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <span className="block text-sm text-gray-500 mb-1">
                            Tipos de Cambios
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(
                              new Set(historico.map((h) => h.tipo_operacion)),
                            ).map((tipo, index) => (
                              <Chip
                                key={index}
                                color={
                                  tipo === "creacion"
                                    ? "success"
                                    : tipo === "actualizacion"
                                      ? "warning"
                                      : "danger"
                                }
                                size="sm"
                                variant="flat"
                              >
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Registro de Cambios
                    </h3>

                    <CustomTable
                      className="rounded-lg"
                      columns={[
                        {
                          key: "fecha",
                          label: "FECHA",
                          renderCell: (item: HistoricoServicio) => (
                            <div>
                              <div className="font-semibold">
                                {formatearFecha(
                                  item.fecha_modificacion,
                                  true,
                                  false,
                                  false,
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {renderTipoOperacionChip(item.tipo_operacion)}
                              </div>
                            </div>
                          ),
                        },
                        {
                          key: "campo",
                          label: "CAMBIO",
                          renderCell: (item: HistoricoServicio) => (
                            <div>
                              <p className="font-medium">
                                {getCampoLegible(item.campo_modificado)}
                              </p>
                              {item.tipo_operacion === "actualizacion" && (
                                <div className="text-sm">
                                  <span className="text-red-500 line-through mr-2">
                                    {item.valor_anterior
                                      ? item.valor_anterior.length > 30
                                        ? item.valor_anterior.substring(0, 30) +
                                          "..."
                                        : item.valor_anterior
                                      : "Sin valor"}
                                  </span>
                                  <span className="text-green-500">
                                    {item.valor_nuevo
                                      ? item.valor_nuevo.length > 30
                                        ? item.valor_nuevo.substring(0, 30) +
                                          "..."
                                        : item.valor_nuevo
                                      : "Sin valor"}
                                  </span>
                                </div>
                              )}
                            </div>
                          ),
                        },
                        {
                          key: "usuario",
                          label: "USUARIO",
                          renderCell: (item: HistoricoServicio) => (
                            <div>
                              <p>
                                {item.usuario.nombre} {item.usuario.apellido}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.usuario.role}
                              </p>
                            </div>
                          ),
                        },
                        {
                          key: "detalles",
                          label: "DETALLES",
                          renderCell: (item: HistoricoServicio) => (
                            <div>
                              {item.ip_usuario && (
                                <p className="text-xs text-gray-500">
                                  IP: {item.ip_usuario}
                                </p>
                              )}
                              {item.navegador_usuario &&
                                item.navegador_usuario.length > 0 && (
                                  <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                    Navegador:{" "}
                                    {item.navegador_usuario.substring(0, 20)}...
                                  </p>
                                )}
                            </div>
                          ),
                        },
                      ]}
                      data={historico}
                      emptyContent={
                        <div className="text-center p-4 text-gray-500">
                          No se encontraron registros históricos
                        </div>
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No hay registros históricos disponibles para este servicio
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalHistorialServicio;
