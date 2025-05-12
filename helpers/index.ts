import { ZonedDateTime } from "@internationalized/date";

// Función de utilidad para formatear fechas
export const formatearFecha = (
  fechaISOString: Date | string | undefined,
  incluirHora = true,
  incluirSegundos = false,
  incluirDiaSemana = true,
) => {
  if (!fechaISOString) return "--";

  try {
    const fecha = new Date(fechaISOString);

    // Opciones básicas (fecha)
    const opciones: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Bogota",
    };

    // Incluir día de la semana si se solicita
    if (incluirDiaSemana) {
      opciones.weekday = "long"; // 'long' para nombre completo (lunes, martes...), 'short' para abreviado (lun, mar...)
    }

    // Si queremos incluir la hora
    if (incluirHora) {
      opciones.hour = "2-digit";
      opciones.minute = "2-digit";

      // Opcionalmente incluir segundos
      if (incluirSegundos) {
        opciones.second = "2-digit";
      }
    }

    return new Intl.DateTimeFormat("es-CO", opciones).format(fecha);
  } catch (error) {
    console.error("Error al formatear fecha:", error);

    return "Fecha inválida";
  }
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

// Función para convertir un objeto ZonedDateTime a formato para la base de datos
export const convertirFechaParaDB = (
  zonedDateTime: ZonedDateTime | null,
): string | null => {
  if (!zonedDateTime) return null;

  // Convertir a objeto Date de JavaScript
  const jsDate = zonedDateTime.toDate();

  // Convertir el Date a string en formato ISO (o el formato que necesite tu BD)
  return jsDate.toISOString();
};
