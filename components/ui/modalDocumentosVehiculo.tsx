import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Car,
} from "lucide-react";
import { Vehiculo } from "@/context/serviceContext";
import { apiClient } from "@/config/apiClient";
import { Documento } from "@/types";

export default function ModalDocumentosVehiculo({
  vehicleData,
}: {
  vehicleData: Vehiculo;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryName = (category: string) => {
    const names = {
      POLIZA_TODO_RIESGO: "Póliza Todo Riesgo",
      POLIZA_CONTRACTUAL: "Póliza Contractual",
      TARJETA_DE_OPERACION: "Tarjeta de Operación",
      SOAT: "SOAT",
      CERTIFICADO_GPS: "Certificado GPS",
      POLIZA_EXTRACONTRACTUAL: "Póliza Extracontractual",
      TECNOMECANICA: "Tecnomecánica",
      TARJETA_DE_PROPIEDAD: "Tarjeta de Propiedad",
    };
    return names[category as keyof typeof names] || category;
  };

  const getExpirationStatus = (
    fechaVigencia: string,
  ): {
    status: "expired" | "warning" | "valid" | "success";
    color: "danger" | "warning" | "success";
    text: string;
  } => {
    if (!fechaVigencia)
      return { status: "success", color: "success", text: "Sin vencimiento" };

    const today = new Date();
    const expirationDate = new Date(fechaVigencia);
    const timeDiff = expirationDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return { status: "expired", color: "danger", text: "Vencido" };
    } else if (daysDiff <= 30) {
      return {
        status: "warning",
        color: "warning",
        text: `Vence en ${daysDiff} días`,
      };
    } else {
      return { status: "valid", color: "success", text: "Vigente" };
    }
  };

  // Función para obtener URL presignada (mantén la que ya tienes)
  const getPresignedUrl = async (s3Key: string) => {
    try {
      const response = await apiClient.get(`/api/documentos/url-firma`, {
        params: { key: s3Key },
      });

      return response.data.url;
    } catch (error) {
      console.error("Error al obtener URL firmada:", error);

      return null;
    }
  };

  // Función mejorada para ver documentos
  const handleView = async (documento: Documento) => {
    try {
      const url = await getPresignedUrl(documento.s3_key);

      if (url) {
        window.open(url, "_blank");
      } else {
        // Mostrar notificación de error
        console.error("No se pudo obtener la URL del documento");
      }
    } catch (error) {
      console.error("Error al abrir documento:", error);
    }
  };

  // OPCIÓN 3: Descarga con fetch a través del backend
  const handleDownload = async (documento: Documento) => {
    try {
      const response = await apiClient.get(
        `/api/documentos/descargar/${documento.id}`,
        {
          responseType: "blob",
          timeout: 30000, // 30 segundos
        },
      );

      if (!response.data) {
        throw new Error("No se recibieron datos del servidor");
      }

      // Crear blob y descargar
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = documento.nombre_original;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error("❌ Error al descargar documento:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Error desconocido";

      alert(
        `Error al descargar "${documento.nombre_original}": ${errorMessage}`,
      );
    }
  };

  return (
    <>
      <Button
        fullWidth
        color="primary"
        radius="sm"
        startContent={<FileText className="w-4 h-4" />}
        variant="flat"
        onPress={onOpen}
      >
        Ver documentación
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Car className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold">
                      Documentación del Vehículo
                    </h2>
                    <p className="text-sm text-gray-600 font-normal">
                      {vehicleData.marca} {vehicleData.linea}{" "}
                      {vehicleData.modelo} - Placa: {vehicleData.placa}
                    </p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="space-y-4">
                  {/* Lista de documentos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Documentos ({vehicleData.documentos.length})
                    </h3>

                    <div className="space-y-3">
                      {vehicleData.documentos.map((doc) => {
                        const expirationStatus = getExpirationStatus(
                          doc.fecha_vigencia,
                        );

                        return (
                          <Card
                            key={doc.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardBody>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <h4 className="font-semibold text-sm">
                                      {getCategoryName(doc.categoria)}
                                    </h4>
                                    <Chip
                                      size="sm"
                                      color={expirationStatus.color}
                                      variant="flat"
                                      startContent={
                                        expirationStatus.status ===
                                        "expired" ? (
                                          <AlertTriangle className="w-3 h-3" />
                                        ) : (
                                          <CheckCircle className="w-3 h-3" />
                                        )
                                      }
                                    >
                                      {expirationStatus.text}
                                    </Chip>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    {doc.fecha_vigencia && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          Vigencia:{" "}
                                          {formatDate(doc.fecha_vigencia)}
                                        </span>
                                      </div>
                                    )}
                                    <span>
                                      Tamaño: {formatFileSize(doc.size)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-1 ml-2 sm:ml-4 sm:gap-2">
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    isIconOnly
                                    className="sm:hidden"
                                    onPress={() => handleView(doc)}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    startContent={<Eye className="w-3 h-3" />}
                                    className="hidden sm:flex"
                                    onPress={() => handleView(doc)}
                                  >
                                    Ver
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="secondary"
                                    isIconOnly
                                    className="sm:hidden"
                                    onPress={() => handleDownload(doc)}
                                  >
                                    <Download className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="secondary"
                                    startContent={
                                      <Download className="w-3 h-3" />
                                    }
                                    className="hidden sm:flex"
                                    onPress={() => handleDownload(doc)}
                                  >
                                    Descargar
                                  </Button>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Descargar Todo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
