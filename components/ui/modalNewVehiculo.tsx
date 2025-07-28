import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { PlusIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";

import { ApiResponse, Vehiculo } from "@/context/serviceContext";
import { apiClient } from "@/config/apiClient";

const clasesVehiculo = [
  { key: "CAMIONETA", label: "Camioneta" },
  { key: "BUS", label: "Bus" },
  { key: "MICROBUS", label: "Microbús" },
];

export default function ModalNewVehiculo() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<Partial<Vehiculo>>({
    placa: "",
    marca: "",
    clase_vehiculo: "",
    color: "",
    modelo: "",
    linea: "",
  });

  // Estado para manejar la validación
  const [errores, setErrores] = useState({
    placa: false,
    marca: false,
    modelo: false,
    clase_vehiculo: false,
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error al escribir
    if (errores[name as keyof typeof errores]) {
      setErrores((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  // Función para crear una nueva empresa
  const createVehiculo = async (data: Vehiculo): Promise<Vehiculo> => {
    try {
      const response = await apiClient.post<ApiResponse<Vehiculo>>(
        "/api/flota/basico",
        data,
      );

      if (response.data && response.data.success && response.data.data) {
        onOpenChange();

        return response.data.data;
      } else {
        throw new Error(response.data?.message || "Error al crear empresa");
      }
    } catch (err: any) {
      // Definir un mensaje de error predeterminado
      let errorTitle = "Error al crear empresa";
      let errorDescription = "Ha ocurrido un error inesperado.";

      // Manejar errores específicos por código de estado
      if (err.response) {
        switch (err.response.status) {
          case 400: // Bad Request
            errorTitle = "Error en los datos enviados";

            // Verificar si tenemos detalles específicos del error en la respuesta
            if (err.response.data && err.response.data.message) {
              errorDescription = err.response.data.message;
            }

            // Verificar si hay errores específicos en formato español (errores)
            if (
              err.response.data &&
              err.response.data.errores &&
              Array.isArray(err.response.data.errores)
            ) {
              // Mapeo de nombres de campos para mensajes más amigables
              const fieldLabels: Record<string, string> = {
                nombre: "nombre",
                nit: "nit",
              };

              // Mostrar cada error de validación como un toast separado
              let errorShown = false;

              err.response.data.errores.forEach(
                (error: { campo: string; mensaje: string }) => {
                  errorShown = true;
                  const fieldLabel = fieldLabels[error.campo] || error.campo;

                  // Personalizar mensajes para errores comunes
                  let customMessage = error.mensaje;

                  if (error.mensaje.includes("must be unique")) {
                    customMessage = `Este ${fieldLabel.toLowerCase()} ya está registrado en el sistema`;
                  }

                  addToast({
                    title: `Error en ${fieldLabel}`,
                    description: customMessage,
                    color: "danger",
                  });
                },
              );

              // Si se mostraron errores específicos, lanzar error
              if (errorShown) {
                throw new Error("Error de validación en los campos");
              }
            }

            // Verificar errores específicos comunes en el mensaje
            if (
              errorDescription.includes("unique") ||
              errorDescription.includes("duplicado")
            ) {
              // Error genérico de duplicación
              errorTitle = "Datos duplicados";
              errorDescription =
                "Algunos de los datos ingresados ya existen en el sistema.";

              // Intentar ser más específico basado en el mensaje completo
              if (errorDescription.toLowerCase().includes("nombre")) {
                errorTitle = "Nombre duplicado";
                errorDescription = "Ya existe una empresa con este Nombre.";
              } else if (errorDescription.toLowerCase().includes("nit")) {
                errorTitle = "NIT duplicado";
                errorDescription = "Ya existe una empresa con este NIT.";
              }
            }
            break;

          case 401:
            errorTitle = "No autorizado";
            errorDescription = "No tienes permisos para realizar esta acción.";
            break;

          case 404:
            errorTitle = "Recurso no encontrado";
            errorDescription = "El endpoint solicitado no existe.";
            break;

          case 500:
            errorTitle = "Error del servidor";
            errorDescription = "Ha ocurrido un error interno del servidor.";
            break;

          default:
            errorTitle = "Error inesperado";
            errorDescription = `Error ${err.response.status}: ${err.response.statusText || "Error desconocido"}`;
            break;
        }
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorTitle = "Error de conexión";
        errorDescription =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        errorTitle = "Error en la solicitud";
        errorDescription =
          err.message || "Ha ocurrido un error al procesar la solicitud.";
      }

      // Mostrar el toast con el mensaje de error
      addToast({
        title: errorTitle,
        description: errorDescription,
        color: "danger",
      });

      // Registrar el error en la consola para depuración
      console.error("Error detallado:", err);

      // Siempre lanzamos el error, nunca retornamos null
      throw err;
    }
  };

  // Validar y guardar datos
  const handleSave = () => {
    // Validaciones con operador de encadenamiento opcional
    const nuevosErrores = {
      placa: !formData.placa?.trim(),
      marca: !formData.marca?.trim(),
      modelo: !formData.modelo?.trim(),
      clase_vehiculo: !formData.clase_vehiculo?.trim(),
    };

    setErrores(nuevosErrores);

    // Si hay errores, no continuar
    if (nuevosErrores.placa || nuevosErrores.marca) {
      return;
    }

    // Enviar datos
    createVehiculo(formData as Vehiculo); // Cast necesario porque onSave espera un objeto Vehiculo completo
  };

  return (
    <>
      <Button
        isIconOnly
        color="success"
        radius="sm"
        variant="light"
        onPress={onOpen}
      >
        <PlusIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Nueva Vehiculo
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    isRequired
                    errorMessage={errores.placa ? "La placa es requerida" : ""}
                    isInvalid={errores.placa}
                    label="Placa"
                    maxLength={6}
                    name="placa"
                    placeholder="Ingrese la placa"
                    value={formData.placa}
                    onChange={handleChange}
                  />

                  <Select
                    isRequired
                    errorMessage={
                      errores.clase_vehiculo ? "La clase es requerida" : ""
                    }
                    isInvalid={errores.clase_vehiculo}
                    label="Clase de Vehículo"
                    name="clase_vehiculo"
                    placeholder="Seleccione una clase"
                    selectedKeys={
                      formData.clase_vehiculo ? [formData.clase_vehiculo] : []
                    }
                    value={formData.clase_vehiculo || ""}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      setFormData((prev) => ({
                        ...prev,
                        clase_vehiculo: value,
                      }));

                      if (errores.clase_vehiculo) {
                        setErrores((prev) => ({
                          ...prev,
                          clase_vehiculo: false,
                        }));
                      }
                    }}
                  >
                    {clasesVehiculo.map((clase) => (
                      <SelectItem key={clase.key} textValue={clase.label}>
                        {clase.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    isRequired
                    errorMessage={errores.marca ? "La marca es requerida" : ""}
                    isInvalid={errores.marca}
                    label="Marca del vehículo"
                    name="marca"
                    placeholder="Ingrese la marca"
                    value={formData.marca}
                    onChange={handleChange}
                  />

                  <Input
                    label="Línea"
                    name="linea"
                    placeholder="Ingrese la línea"
                    value={formData.linea}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        linea: e.target.value,
                      }));
                    }}
                  />

                  <Input
                    isRequired
                    errorMessage={
                      errores.modelo ? "El modelo es requerido" : ""
                    }
                    isInvalid={errores.modelo}
                    label="Modelo"
                    name="modelo"
                    placeholder="Ingrese el modelo"
                    type="number"
                    value={formData.modelo}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        modelo: e.target.value,
                      }));
                    }}
                  />

                  <Input
                    label="Color"
                    name="color"
                    placeholder="Ingrese el color"
                    value={formData.color}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }));
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  radius="sm"
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full sm:w-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                  startContent={<SaveIcon className="h-4 w-4" />}
                  onPress={handleSave}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
