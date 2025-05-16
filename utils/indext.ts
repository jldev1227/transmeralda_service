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
