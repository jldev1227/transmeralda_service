import { MotivoCancelacion } from "@/types";

const statusColors = {
  solicitado: "#6a7282",
  realizado: "#155dfc",
  liquidado: "#FF9800",
  en_curso: "#00bc7d",
  planificado: "#FF9800",
  cancelado: "#F44336",
  default: "#3388ff",
  planilla_asignada: "#9C27B0",
};

const statusTextMap: Record<string, string> = {
  realizado: "Realizado",
  liquidado: "Liquidado",
  en_curso: "En curso",
  planificado: "Planificado",
  cancelado: "Cancelado",
  solicitado: "Solicitado",
  planilla_asignada: "Planilla asignada",
};

export const getStatusColor = (estado: string): string => {
  return (
    statusColors[estado as keyof typeof statusColors] || statusColors.default
  );
};

export const getStatusText = (estado: string): string => {
  return statusTextMap[estado] || estado;
};

// Opciones por defecto para motivos de cancelación
export const DEFAULT_MOTIVOS: MotivoCancelacion[] = [
  { value: "cliente_solicito", label: "Cliente solicitó cancelación" },
  { value: "conductor_no_disponible", label: "Conductor no disponible" },
  { value: "vehiculo_averiado", label: "Vehículo averiado" },
  { value: "condiciones_climaticas", label: "Condiciones climáticas adversas" },
  { value: "problema_operativo", label: "Problema operativo" },
  { value: "duplicado", label: "Servicio duplicado" },
  { value: "error_sistema", label: "Error del sistema" },
  { value: "otro", label: "Otro motivo" },
];
