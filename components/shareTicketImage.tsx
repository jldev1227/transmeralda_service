import html2canvas from "html2canvas";

import { ServicioConRelaciones } from "@/context/serviceContext";

// Función principal para generar y compartir la imagen
export const shareTicketImage = async (servicio: ServicioConRelaciones) => {
  let canvas: HTMLCanvasElement | null = null;

  try {
    // Crear elemento temporal para renderizar
    const ticketElement = createTicketElement(servicio);

    // Agregar al DOM temporalmente
    document.body.appendChild(ticketElement);

    // Generar la imagen usando html2canvas
    canvas = await html2canvas(ticketElement, {
      backgroundColor: "#ffffff",
      width: 600,
      height: 400,
      scale: 2, // Para mejor calidad
      useCORS: true,
      allowTaint: true,
    });

    // Remover elemento temporal
    document.body.removeChild(ticketElement);

    // Convertir canvas a blob
    const blob = await new Promise<Blob | null>((resolve) => {
      if (canvas) {
        canvas.toBlob((b) => resolve(b), "image/png", 0.9);
      } else {
        resolve(null);
      }
    });

    if (!blob) {
      throw new Error("No se pudo generar la imagen del ticket.");
    }

    // Detectar si estamos en móvil o web y compartir
    await shareImage(blob, servicio);
  } catch (error) {
    console.error("Error al generar/compartir imagen:", error);
    // Fallback: descargar la imagen
    if (canvas) {
      downloadImage(canvas, servicio);
    }
  }
};

// Función para crear el elemento HTML del ticket
const createTicketElement = (servicio: ServicioConRelaciones) => {
  const ticketDiv = document.createElement("div");

  ticketDiv.style.position = "absolute";
  ticketDiv.style.left = "-9999px";
  ticketDiv.style.width = "600px";
  ticketDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";

  ticketDiv.innerHTML = `
    <div style="background: white; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <!-- Encabezado -->
        <div style="padding: 16px; color: white; background: #059669;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Transmeralda</h2>
                <div style="text-align: right;">
                    <span style="font-size: 14px; font-weight: 500; display: block;">
                        Ticket de Servicio
                    </span>
                </div>
            </div>
        </div>

        <!-- Contenido -->
        <div style="padding: 24px;">
            <!-- Información del Conductor -->
            <div style="margin-bottom: 24px;">
                <h3 style="font-weight: bold; color: #059669; margin: 0 0 8px 0; font-size: 18px;">
                    Conductor
                </h3>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Nombre:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.conductor?.nombre || ""} ${servicio.conductor?.apellido || ""}</span>
                </div>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">${servicio.conductor?.tipo_identificacion || "ID"}:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.conductor?.numero_identificacion || "No disponible"}</span>
                </div>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Teléfono:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.conductor?.telefono || "No disponible"}</span>
                </div>
            </div>

            <!-- Información del Vehículo -->
            <div>
                <h3 style="font-weight: bold; color: #059669; margin: 0 0 8px 0; font-size: 18px;">
                    Vehículo
                </h3>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Placa:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.vehiculo?.placa || ""}</span>
                </div>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Marca:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.vehiculo?.marca || ""}</span>
                </div>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Línea:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.vehiculo?.linea || ""}</span>
                </div>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Modelo:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.vehiculo?.modelo || ""}</span>
                </div>
                <div style="margin: 4px 0; font-size: 16px;">
                    <span style="color: #000; font-weight: 500;">Color:</span>
                    <span style="color: #6B7280; margin-left: 8px;">${servicio.vehiculo?.color || ""}</span>
                </div>
            </div>
        </div>
    </div>
`;

  return ticketDiv;
};

const shareImage = async (
  blob: Blob,
  servicio: ServicioConRelaciones,
): Promise<void> => {
  const fileName = `ticket-${servicio.id || Date.now()}.png`;

  // Verificar si el navegador soporta Web Share API
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], fileName, { type: "image/png" });

    // Verificar si se pueden compartir archivos
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Ticket de Servicio - Transmeralda",
          text: `Información del conductor y vehículo asignado`,
          files: [file],
        });

        return;
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name !== "AbortError"
        ) {
          console.error("Error compartiendo:", error);
        }
      }
    }
  }

  // Fallback: descargar la imagen
  downloadImageFromBlob(blob, fileName);
};

// Función para descargar la imagen como fallback
const downloadImageFromBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadImage = (
  canvas: HTMLCanvasElement,
  servicio: ServicioConRelaciones,
): void => {
  const link = document.createElement("a");

  link.download = `ticket-${servicio.id || Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

// Hook personalizado para usar en componentes React
export const useTicketShare = () => {
  const shareTicket = async (
    servicio: ServicioConRelaciones,
  ): Promise<void> => {
    if (!servicio) {
      console.error("No hay información del servicio para compartir");

      return;
    }

    await shareTicketImage(servicio);
  };

  return { shareTicket };
};
