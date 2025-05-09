import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { useDisclosure } from "@heroui/use-disclosure";

interface ConfirmDialogWithTextareaProps {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (observaciones: string) => void;
  onCancel?: () => void;
  confirmVariant?: "primary" | "danger" | "warning" | "success" | "default";
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  textareaLabel?: string;
  textareaPlaceholder?: string;
  textareaRequired?: boolean;
  textareaHelperText?: string;
}

/**
 * Componente de diálogo de confirmación con textarea utilizando HeroUI
 */
const ConfirmDialogWithTextarea: React.FC<ConfirmDialogWithTextareaProps> = ({
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  confirmVariant = "danger",
  isOpen,
  onClose,
  isLoading = false,
  textareaLabel = "Observaciones",
  textareaPlaceholder = "Ingrese sus observaciones aquí...",
  textareaRequired = true,
  textareaHelperText = "Por favor, indique el motivo del rechazo.",
}) => {
  // Estado para el contenido del textarea
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Manejadores de eventos
  const handleConfirm = () => {
    // Validar si el textarea es requerido
    if (textareaRequired && !observaciones.trim()) {
      setError("Este campo es requerido");
      return;
    }
    
    onConfirm(observaciones);
    // No cerramos automáticamente por si hay que mostrar un loading state
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setObservaciones("");
    setError(null);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  // Mapear variante a color de botón
  const getButtonClass = () => {
    switch (confirmVariant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500";
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      default:
        return "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500";
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="3xl"
      placement="center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4">
                {typeof message === "string" ? (
                  <p className="text-sm text-gray-500">{message}</p>
                ) : (
                  message
                )}
              </div>
              
                <label htmlFor="observaciones">{textareaLabel}</label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => {
                    setObservaciones(e.target.value);
                    if (error && e.target.value.trim()) {
                      setError(null);
                    }
                  }}
                  placeholder={textareaPlaceholder}
                  rows={4}
                  className="w-full"
                  isDisabled={isLoading}
                  isRequired={textareaRequired}
                />
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  radius="sm"
                  variant="flat"
                  onPress={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  isDisabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  radius="sm"
                  onPress={handleConfirm}
                  className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonClass()}`}
                  isLoading={isLoading}
                >
                  {confirmText}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDialogWithTextarea;

/**
 * Hook personalizado para usar un diálogo de confirmación con textarea
 * @returns Objeto con funciones y propiedades para controlar el diálogo
 */
export const useConfirmDialogWithTextarea = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [config, setConfig] = useState<Omit<ConfirmDialogWithTextareaProps, "isOpen" | "onClose">>({
    title: "Confirmar acción",
    message: "¿Estás seguro de que quieres realizar esta acción?",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: () => {},
    confirmVariant: "danger",
    isLoading: false,
    textareaLabel: "Observaciones",
    textareaPlaceholder: "Ingrese sus observaciones aquí...",
    textareaRequired: true,
    textareaHelperText: "Por favor, indique el motivo.",
  });

  const confirm = (options: Partial<Omit<ConfirmDialogWithTextareaProps, "isOpen" | "onClose">>) => {
    setConfig({ ...config, ...options });
    onOpen();
    
    // Devuelve una promesa que se resolverá cuando el usuario confirme o cancele
    return new Promise<{confirmed: boolean, observaciones: string}>((resolve) => {
      setConfig({
        ...config,
        ...options,
        onConfirm: (observaciones: string) => {
          if (options.onConfirm) {
            options.onConfirm(observaciones);
          }
          resolve({confirmed: true, observaciones});
          onClose();
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          resolve({confirmed: false, observaciones: ""});
          onClose();
        },
      });
    });
  };

  const setLoading = (isLoading: boolean) => {
    setConfig({ ...config, isLoading });
  };

  return {
    confirm,
    setLoading,
    isOpen,
    onClose,
    DialogComponent: (
      <ConfirmDialogWithTextarea
        {...config}
        isOpen={isOpen}
        onClose={onClose}
      />
    ),
  };
};