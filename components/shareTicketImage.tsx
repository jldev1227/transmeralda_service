import html2canvas from "html2canvas";
import { ServicioConRelaciones } from "@/context/serviceContext";

const CANVAS_TIMEOUT = 25000;

// Función principal para generar y compartir la imagen
export const shareTicketImage = async (servicio: ServicioConRelaciones) => {
  let canvas: HTMLCanvasElement | null = null;
  let ticketElement: HTMLDivElement | null = null;
  let timeoutId: NodeJS.Timeout | null = null;
  let blobTimeoutId: NodeJS.Timeout | null = null;

  try {
    // Crear elemento temporal
    ticketElement = createTicketElement(servicio);
    document.body.appendChild(ticketElement);

    // Esperar renderizado
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 50);
        });
      });
    });

    // Generar canvas
    const html2canvasPromise = html2canvas(ticketElement, {
      backgroundColor: "#ffffff",
      width: 600,
      height: 400,
      scale: 2,
      useCORS: false,
      allowTaint: false,
      logging: false,
      imageTimeout: 0,
      removeContainer: false,
      foreignObjectRendering: false,
      windowWidth: 600,
      windowHeight: 400,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    }).then(
      (result) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        return result;
      },
      (error) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        throw error;
      },
    );

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Timeout al generar canvas"));
      }, CANVAS_TIMEOUT);
    });

    canvas = await Promise.race([html2canvasPromise, timeoutPromise]);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Convertir a blob
    const blobPromise = new Promise<Blob | null>((resolve) => {
      if (canvas) {
        canvas.toBlob(
          (b) => {
            if (blobTimeoutId) {
              clearTimeout(blobTimeoutId);
              blobTimeoutId = null;
            }
            resolve(b);
          },
          "image/png",
          0.95,
        );
      } else {
        if (blobTimeoutId) {
          clearTimeout(blobTimeoutId);
          blobTimeoutId = null;
        }
        resolve(null);
      }
    });

    const blobTimeoutPromise = new Promise<never>((_, reject) => {
      blobTimeoutId = setTimeout(() => {
        reject(new Error("Timeout al convertir a blob"));
      }, 3000);
    });

    const blob = await Promise.race([blobPromise, blobTimeoutPromise]);

    if (blobTimeoutId) {
      clearTimeout(blobTimeoutId);
      blobTimeoutId = null;
    }

    if (!blob) {
      throw new Error("No se pudo generar la imagen del ticket.");
    }

    // Intentar compartir
    await shareImage(blob, servicio);
  } catch (error) {
    console.error("Error al generar/compartir imagen:", error);

    if (canvas) {
      try {
        downloadImage(canvas, servicio);
      } catch (downloadError) {
        console.error("Error en fallback de descarga:", downloadError);
        alert("No se pudo compartir ni descargar la imagen.");
      }
    } else {
      try {
        await createSimplifiedTicket(servicio);
      } catch (simplifiedError) {
        console.error("Error al crear ticket simplificado:", simplifiedError);
        alert("No se pudo generar la imagen.");
      }
    }
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (blobTimeoutId) {
      clearTimeout(blobTimeoutId);
      blobTimeoutId = null;
    }

    if (ticketElement && ticketElement.parentNode) {
      try {
        document.body.removeChild(ticketElement);
      } catch (e) {
        console.warn("Error al limpiar elemento temporal:", e);
      }
    }
  }
};

const createTicketElement = (
  servicio: ServicioConRelaciones,
): HTMLDivElement => {
  const ticketDiv = document.createElement("div");

  ticketDiv.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 600px;
    height: auto;
    font-family: Arial, sans-serif;
    background-color: white;
  `;

  ticketDiv.innerHTML = `
    <div style="background: white; width: 600px; min-height: 400px; box-sizing: border-box;">
        <div style="padding: 16px; color: white; background: rgb(5, 150, 105); box-sizing: border-box;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="font-size: 24px; font-weight: bold; padding: 0;">Transmeralda</td>
                    <td style="text-align: right; font-size: 14px; font-weight: 500; padding: 0;">Ticket de Servicio</td>
                </tr>
            </table>
        </div>

        <div style="padding: 24px; box-sizing: border-box;">
            <div style="margin-bottom: 24px;">
                <h3 style="font-weight: bold; color: rgb(5, 150, 105); margin: 0 0 8px 0; font-size: 18px;">Conductor</h3>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Nombre:</strong> <span style="color: rgb(107, 114, 128);">${servicio.conductor?.nombre || ""} ${servicio.conductor?.apellido || ""}</span>
                </p>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>${servicio.conductor?.tipo_identificacion || "ID"}:</strong> <span style="color: rgb(107, 114, 128);">${servicio.conductor?.numero_identificacion || "No disponible"}</span>
                </p>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Teléfono:</strong> <span style="color: rgb(107, 114, 128);">${servicio.conductor?.telefono || "No disponible"}</span>
                </p>
            </div>

            <div>
                <h3 style="font-weight: bold; color: rgb(5, 150, 105); margin: 0 0 8px 0; font-size: 18px;">Vehículo</h3>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Placa:</strong> <span style="color: rgb(107, 114, 128);">${servicio.vehiculo?.placa || ""}</span>
                </p>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Marca:</strong> <span style="color: rgb(107, 114, 128);">${servicio.vehiculo?.marca || ""}</span>
                </p>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Línea:</strong> <span style="color: rgb(107, 114, 128);">${servicio.vehiculo?.linea || ""}</span>
                </p>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Modelo:</strong> <span style="color: rgb(107, 114, 128);">${servicio.vehiculo?.modelo || ""}</span>
                </p>
                <p style="margin: 4px 0; font-size: 16px; color: #000;">
                    <strong>Color:</strong> <span style="color: rgb(107, 114, 128);">${servicio.vehiculo?.color || ""}</span>
                </p>
            </div>
        </div>
    </div>
`;

  return ticketDiv;
};

const createSimplifiedTicket = async (
  servicio: ServicioConRelaciones,
): Promise<void> => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No se pudo crear el contexto del canvas");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "#059669";
    ctx.fillRect(0, 0, 600, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Transmeralda", 20, 38);

    ctx.font = "14px Arial";
    ctx.fillText("Ticket de Servicio", 450, 38);

    ctx.fillStyle = "#059669";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Conductor", 20, 100);

    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText(
      `Nombre: ${servicio.conductor?.nombre || ""} ${servicio.conductor?.apellido || ""}`,
      20,
      130,
    );
    ctx.fillText(
      `${servicio.conductor?.tipo_identificacion || "ID"}: ${servicio.conductor?.numero_identificacion || "N/A"}`,
      20,
      155,
    );
    ctx.fillText(`Teléfono: ${servicio.conductor?.telefono || "N/A"}`, 20, 180);

    ctx.fillStyle = "#059669";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Vehículo", 20, 230);

    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText(`Placa: ${servicio.vehiculo?.placa || ""}`, 20, 260);
    ctx.fillText(
      `Marca: ${servicio.vehiculo?.marca || ""} ${servicio.vehiculo?.linea || ""}`,
      20,
      285,
    );
    ctx.fillText(
      `Modelo: ${servicio.vehiculo?.modelo || ""} - Color: ${servicio.vehiculo?.color || ""}`,
      20,
      310,
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png", 0.95);
    });

    if (blob) {
      await shareImage(blob, servicio);
    } else {
      throw new Error("No se pudo crear el blob");
    }
  } catch (error) {
    console.error("Error al crear ticket simplificado:", error);
    throw error;
  }
};

// FUNCIÓN MEJORADA PARA WEB SHARE API
const shareImage = async (
  blob: Blob,
  servicio: ServicioConRelaciones,
): Promise<void> => {
  const fileName = `ticket-${servicio.id || Date.now()}.png`;

  console.log("🔍 Verificando Web Share API", {
    hasShare: "share" in navigator,
    hasCanShare: "canShare" in navigator,
    isSecureContext: window.isSecureContext,
    protocol: window.location.protocol,
  });

  // Verificación mejorada para Web Share API
  const hasWebShareAPI =
    "share" in navigator &&
    typeof navigator.share === "function" &&
    window.isSecureContext;

  if (hasWebShareAPI) {
    try {
      // Crear el archivo
      const file = new File([blob], fileName, {
        type: "image/png",
        lastModified: Date.now(),
      });

      console.log("📄 Archivo creado:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Preparar datos para compartir
      const shareData: ShareData = {
        files: [file],
        title: "Ticket de Servicio - Transmeralda",
        text: "Información del conductor y vehículo asignado",
      };

      // Verificar si se puede compartir este contenido
      if (navigator.canShare && !navigator.canShare(shareData)) {
        console.warn(
          "⚠️ canShare retornó false, pero intentaremos de todos modos",
        );
      }

      console.log("🚀 Llamando a navigator.share()");

      // CRÍTICO: Llamar a share() directamente
      await navigator.share(shareData);

      console.log("✅ Share completado exitosamente");
      return;
    } catch (error: any) {
      console.error("❌ Error en Web Share API:", {
        name: error?.name,
        message: error?.message,
        error: error,
      });

      // Si el usuario cancela, no hacer nada
      if (error?.name === "AbortError") {
        console.log("👤 Usuario canceló el compartir");
        return;
      }

      // Si es otro tipo de error, continuar con fallback
      console.warn("⚠️ Fallback activado por error:", error?.name);
    }
  } else {
    console.log("❌ Web Share API no disponible");

    // Diagnóstico detallado
    if (!window.isSecureContext) {
      console.error("⚠️ NO SECURE CONTEXT - necesitas HTTPS o localhost");
    }
    if (!("share" in navigator)) {
      console.error("⚠️ navigator.share no existe");
    }
  }

  // Fallback: descargar
  console.log("💾 Ejecutando fallback - descarga directa");
  downloadImageFromBlob(blob, fileName);
};

const downloadImageFromBlob = (blob: Blob, fileName: string) => {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error al descargar imagen:", error);
    alert("No se pudo descargar la imagen. Por favor, intenta nuevamente.");
  }
};

const downloadImage = (
  canvas: HTMLCanvasElement,
  servicio: ServicioConRelaciones,
): void => {
  try {
    canvas.toBlob(async (blob) => {
      if (blob) {
        await shareImage(blob, servicio);
      }
    }, "image/png");
  } catch (error) {
    console.error("Error al descargar desde canvas:", error);
    throw error;
  }
};

export const useTicketShare = () => {
  const shareTicket = async (
    servicio: ServicioConRelaciones,
  ): Promise<void> => {
    if (!servicio) {
      console.error("No hay información del servicio para compartir");
      alert("No hay información del servicio disponible");
      return;
    }

    await shareTicketImage(servicio);
  };

  return { shareTicket };
};
