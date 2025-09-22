import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DateInput } from "@heroui/date-input";
import { useDisclosure } from "@heroui/use-disclosure";
import { parseZonedDateTime, ZonedDateTime } from "@internationalized/date";
import { DEFAULT_MOTIVOS } from "@/utils/indext";
import { MotivoCancelacion } from "@/types";

interface ConfirmDialogWithTextareaProps {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (data: {
    observaciones: string;
    motivo?: string;
    fechaCancelacion?: ZonedDateTime;
  }) => void;
  onCancel?: () => void;
  confirmVariant?: "primary" | "danger" | "warning" | "success" | "default";
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  textareaLabel?: string;
  textareaPlaceholder?: string;
  textareaRequired?: boolean;
  textareaHelperText?: string;
  // Nuevas props para selector de motivo
  showMotivoSelector?: boolean;
  motivoLabel?: string;
  motivoOptions?: MotivoCancelacion[];
  motivoRequired?: boolean;
  // Nuevas props para selector de fecha
  showFechaCancelacion?: boolean;
  fechaCancelacionLabel?: string;
  fechaCancelacionRequired?: boolean;
}

/**
 * Componente de diálogo de confirmación con textarea, selector de motivo y DatePicker
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
  textareaRequired = false,
  showMotivoSelector = false,
  motivoLabel = "Motivo",
  motivoOptions = DEFAULT_MOTIVOS,
  motivoRequired = false,
  showFechaCancelacion = false,
  fechaCancelacionLabel = "Fecha de cancelación",
  fechaCancelacionRequired = false,
}) => {
  // Estados para el formulario
  const [observaciones, setObservaciones] = useState("");
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>(
    motivoOptions.length > 0 ? motivoOptions[0].value : "",
  );
  const [fechaCancelacion, setFechaCancelacion] = useState<ZonedDateTime>(
    parseZonedDateTime(
      `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
    ),
  );
  const [errors, setErrors] = useState<{
    observaciones?: string;
    motivo?: string;
    fechaCancelacion?: string;
  }>({});

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (textareaRequired && !observaciones.trim()) {
      newErrors.observaciones = "Este campo es requerido";
    }

    if (showMotivoSelector && motivoRequired && !motivoSeleccionado) {
      newErrors.motivo = "Debe seleccionar un motivo";
    }

    if (showFechaCancelacion && fechaCancelacionRequired && !fechaCancelacion) {
      newErrors.fechaCancelacion = "Debe seleccionar una fecha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejadores de eventos
  const handleConfirm = () => {
    if (!validateForm()) return;

    onConfirm({
      observaciones: observaciones.trim(),
      motivo: showMotivoSelector ? motivoSeleccionado : undefined,
      fechaCancelacion: showFechaCancelacion ? fechaCancelacion : undefined,
    });
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
    setMotivoSeleccionado(
      motivoOptions.length > 0 ? motivoOptions[0].value : "",
    );
    setFechaCancelacion(
      parseZonedDateTime(
        `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
      ),
    );
    setErrors({});
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
      size="3xl"
      onClose={handleCloseModal}
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
              {/* Mensaje dinámico - puede ser string o JSX */}
              <div className="mb-6">
                {typeof message === "string" ? (
                  <p className="text-sm text-gray-600">{message}</p>
                ) : (
                  <div className="text-sm text-gray-600">{message}</div>
                )}
              </div>

              {/* Selector de motivo (opcional) */}
              {showMotivoSelector && (
                <div className="mb-4 space-y-2">
                  <label
                    htmlFor="motivo-selector"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {motivoLabel}
                    {motivoRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Select
                    id="motivo-selector"
                    placeholder="Seleccione un motivo"
                    selectedKeys={
                      motivoSeleccionado ? [motivoSeleccionado] : []
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setMotivoSeleccionado(selected);
                      if (errors.motivo && selected) {
                        setErrors({ ...errors, motivo: undefined });
                      }
                    }}
                    isDisabled={isLoading}
                    isInvalid={!!errors.motivo}
                    errorMessage={errors.motivo}
                    className="w-full"
                  >
                    {motivoOptions.map((motivo) => (
                      <SelectItem key={motivo.value}>{motivo.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              {/* DateInput para fecha de cancelación (opcional) */}
              {showFechaCancelacion && (
                <div className="mb-4 space-y-2">
                  <label
                    htmlFor="fecha-cancelacion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {fechaCancelacionLabel}
                    {fechaCancelacionRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <DateInput
                    hideTimeZone
                    classNames={{
                      inputWrapper: [
                        "!bg-transparent",
                        "data-[hover=true]:!bg-transparent",
                        "border-1",
                        "py-7",
                        "group-data-[focus=true]:!bg-transparent",
                        "rounded-md",
                        errors.fechaCancelacion
                          ? "border-red-300"
                          : "border-gray-300",
                      ],
                    }}
                    defaultValue={parseZonedDateTime(
                      `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
                    )}
                    granularity="minute"
                    value={fechaCancelacion}
                    onChange={(value) => {
                      if (value) {
                        setFechaCancelacion(value);
                        if (errors.fechaCancelacion) {
                          setErrors({ ...errors, fechaCancelacion: undefined });
                        }
                      }
                    }}
                    isDisabled={isLoading}
                  />
                  {errors.fechaCancelacion && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.fechaCancelacion}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {fechaCancelacionRequired
                      ? "Seleccione la fecha y hora efectiva de cancelación"
                      : "Si no se especifica, se usará la fecha y hora actual"}
                  </p>
                </div>
              )}

              {/* Textarea para observaciones */}
              <div className="space-y-2">
                <label
                  htmlFor="observaciones"
                  className="block text-sm font-medium text-gray-700"
                >
                  {textareaLabel}
                  {textareaRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <Textarea
                  className="w-full"
                  id="observaciones"
                  isDisabled={isLoading}
                  isRequired={textareaRequired}
                  placeholder={textareaPlaceholder}
                  radius="sm"
                  rows={4}
                  value={observaciones}
                  onChange={(e) => {
                    setObservaciones(e.target.value);
                    if (errors.observaciones && e.target.value.trim()) {
                      setErrors({ ...errors, observaciones: undefined });
                    }
                  }}
                  isInvalid={!!errors.observaciones}
                  errorMessage={errors.observaciones}
                />
                {textareaRequired && (
                  <p className="text-xs text-gray-500 mt-1">
                    Por favor, proporcione detalles sobre esta acción.
                  </p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  isDisabled={isLoading}
                  radius="sm"
                  variant="flat"
                  onPress={handleCancel}
                >
                  {cancelText}
                </Button>
                <Button
                  className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonClass()}`}
                  isLoading={isLoading}
                  radius="sm"
                  onPress={handleConfirm}
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
 */
export const useConfirmDialogWithTextarea = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [config, setConfig] = useState<
    Omit<ConfirmDialogWithTextareaProps, "isOpen" | "onClose">
  >({
    title: "Confirmar acción",
    message: "¿Estás seguro de que quieres realizar esta acción?",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: () => {},
    confirmVariant: "danger",
    isLoading: false,
    textareaLabel: "Observaciones",
    textareaPlaceholder: "Ingrese sus observaciones aquí...",
    textareaRequired: false,
    showMotivoSelector: false,
    motivoLabel: "Motivo",
    motivoOptions: DEFAULT_MOTIVOS,
    motivoRequired: false,
    showFechaCancelacion: false,
    fechaCancelacionLabel: "Fecha de cancelación",
    fechaCancelacionRequired: false,
  });

  const confirm = (
    options: Partial<
      Omit<ConfirmDialogWithTextareaProps, "isOpen" | "onClose">
    >,
  ) => {
    setConfig({ ...config, ...options });
    onOpen();

    // Promesa que se resolverá cuando el usuario confirme o cancele
    return new Promise<{
      confirmed: boolean;
      observaciones: string;
      motivo?: string;
      fechaCancelacion?: ZonedDateTime;
    }>((resolve) => {
      setConfig({
        ...config,
        ...options,
        onConfirm: (data: {
          observaciones: string;
          motivo?: string;
          fechaCancelacion?: ZonedDateTime;
        }) => {
          if (options.onConfirm) {
            options.onConfirm(data);
          }
          resolve({
            confirmed: true,
            observaciones: data.observaciones,
            motivo: data.motivo,
            fechaCancelacion: data.fechaCancelacion,
          });
          onClose();
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          resolve({
            confirmed: false,
            observaciones: "",
            motivo: undefined,
            fechaCancelacion: undefined,
          });
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
