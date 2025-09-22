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
import { apiClient } from "@/config/apiClient";
import { useCopyToClipboard } from "react-use";

function CopySnippet({ text }: { text: string }) {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
      <code className="flex-1 text-sm font-mono text-gray-800 truncate">
        {text}
      </code>
      <button
        onClick={handleCopy}
        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {showSuccess ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

interface ModalShareServicioProps {
  isNavigating: boolean;
  handleShareBasicTicket: () => void;
  servicioId: string;
}

interface ShareResponse {
  success: boolean;
  data: {
    enlace: string;
    token: string;
    expira_en: string;
    servicio_id: string;
  };
}

export default function ModalShareServicio({
  isNavigating,
  handleShareBasicTicket,
  servicioId,
}: ModalShareServicioProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleShareByUrl = async () => {
    try {
      setIsGeneratingUrl(true);
      setUrlError(null);
      setSharedUrl(null);

      const response = await apiClient.post(
        `/api/servicios/${servicioId}/compartir`,
      );

      if (response.data.success) {
        setSharedUrl(response.data.data.enlace);
      } else {
        setUrlError("Error al generar el enlace de compartir");
      }
    } catch (error) {
      console.error("Error generating share URL:", error);
      setUrlError("Error al generar el enlace de compartir");
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  const handleClose = () => {
    setSharedUrl(null);
    setUrlError(null);
    setIsGeneratingUrl(false);
  };

  return (
    <>
      <button
        className={`
          px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium
          text-base
          sm:px-6 sm:py-3 sm:rounded-xl sm:gap-3 sm:text-lg
          ${
            isNavigating
              ? "bg-gray-100 cursor-not-allowed opacity-50 text-gray-400"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
          }
        `}
        disabled={isNavigating}
        onClick={onOpen}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <span className="text-sm sm:text-base">Compartir</span>
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Compartir Servicio</h3>
                <p className="text-sm text-gray-500">
                  Elige cómo quieres compartir este servicio
                </p>
              </ModalHeader>

              <ModalBody className="gap-4">
                {/* Opción 1: Ticket Básico */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Ticket Básico</h4>
                      <p className="text-sm text-gray-500">
                        Información básica del servicio
                      </p>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    className="w-full"
                    onPress={() => {
                      handleShareBasicTicket();
                      onClose();
                    }}
                  >
                    Compartir Ticket Básico
                  </Button>
                </div>

                {/* Opción 3: Enlace Público */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Enlace Público</h4>
                      <p className="text-sm text-gray-500">
                        Generar enlace para compartir
                      </p>
                    </div>
                  </div>

                  {!sharedUrl ? (
                    <Button
                      color="secondary"
                      variant="flat"
                      className="w-full"
                      onPress={handleShareByUrl}
                      isLoading={isGeneratingUrl}
                      disabled={isGeneratingUrl}
                    >
                      {isGeneratingUrl
                        ? "Generando enlace..."
                        : "Generar Enlace"}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-2">
                        Enlace generado (expira en 7 días):
                      </p>
                      <CopySnippet text={sharedUrl} />
                    </div>
                  )}

                  {urlError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {urlError}
                    </div>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    handleClose();
                    onClose();
                  }}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
