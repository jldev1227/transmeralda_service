import React, { useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useEffect, useState } from "react";
import SelectReact from "react-select";
import { SelectInstance } from "react-select";
// Ajusta esta importación según la biblioteca que uses
import { Textarea } from "@heroui/input";
import { DateInput } from "@heroui/date-input";
import { parseZonedDateTime, ZonedDateTime } from "@internationalized/date";
import { addToast } from "@heroui/toast";
import { BuildingIcon, PlusIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import { EstadoServicio, useService } from "@/context/serviceContext";
import SearchInputsPlaces from "@/components/ui/originDestInputsPlaces";
import { convertirFechaParaDB } from "@/helpers";
import { Button } from "@heroui/button";
import Link from "next/link";

const UserIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LocationMarkerIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TruckIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5a1.125 1.125 0 0 0 1.125-1.125V6.75a1.125 1.125 0 0 0-1.125-1.125H3.375A1.125 1.125 0 0 0 2.25 6.75v10.5a1.125 1.125 0 0 0 1.125 1.125Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface EmpresaOption {
  value: string;
  label: string;
  // Otros campos que pueda tener
}

export default function ModalFormServicio() {
  const {
    municipios,
    conductores,
    vehiculos,
    empresas,
    modalForm,
    handleModalForm,
    servicioEditar,
    setError,
    registrarServicio,
    actualizarServicio,
    // actualizarEstadoServicio,
    clearSelectedServicio, // Añadimos esta función para limpiar manualmente el servicio seleccionado
    selectedServicio, // Añadimos para verificar si hay un servicio seleccionado
  } = useService();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const { servicio, isEditing } = servicioEditar;

  const selectRef = useRef<SelectInstance<EmpresaOption> | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  // Función para limpiar todos los estados del formulario
  const resetFormStates = () => {
    setCurrentStep(1);
    setCliente("");
    setConductorSelected("");
    setVehicleSelected("");

    // Crear fechas para el momento actual con formato correcto para ZonedDateTime
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const zonedDateTimeStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}[America/Bogota]`;

    setFechaSolicitud(parseZonedDateTime(zonedDateTimeStr));
    setFechaRealizacion(parseZonedDateTime(zonedDateTimeStr));

    setSelectedOriginMun("");
    setSelectedDestMun("");
    setOriginSpecific("");
    setDestSpecific("");
    setOriginCoords({ lat: 0, lng: 0 });
    setDestCoords({ lat: 0, lng: 0 });
    setPurpose("");
    setState("solicitado");
    setObservaciones("");
  };

  // State for cliente selected
  const [clienteSelected, setCliente] = useState("");

  // State for conductor
  const [conductorSelected, setConductorSelected] = useState("");

  // State for vehicle
  const [vehicleSelected, setVehicleSelected] = useState("");

  // State for date request
  const [fechaSolicitud, setFechaSolicitud] = useState<ZonedDateTime>(
    parseZonedDateTime(
      `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
    ),
  );

  // State for date to do request
  const [fechaRealizacion, setFechaRealizacion] = useState<ZonedDateTime>(
    parseZonedDateTime(
      `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
    ),
  );

  // State for selected locations
  const [selectedOriginMun, setSelectedOriginMun] = useState("");
  const [selectedDestMun, setSelectedDestMun] = useState("");

  // State for specific address inputs
  const [originSpecific, setOriginSpecific] = useState("");
  const [destSpecific, setDestSpecific] = useState("");

  // States for coordinates
  const [originCoords, setOriginCoords] = useState({ lat: 0, lng: 0 });
  const [destCoords, setDestCoords] = useState({ lat: 0, lng: 0 });

  // purpose
  const [purpose, setPurpose] = useState("");

  // state
  const [state, setState] = useState<EstadoServicio>("solicitado");

  // state
  const [observaciones, setObservaciones] = useState<string>("");

  // Estado para controlar si se puede editar el servicio
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [loading, setLoading] = useState(false);

  // Asegurarse de que el servicio seleccionado se limpie cuando se abre el modal
  useEffect(() => {
    // Si el modal se abrió, limpiar inmediatamente el servicio seleccionado
    if (modalForm && selectedServicio !== null) {
      clearSelectedServicio();
    }
  }, [modalForm, clearSelectedServicio, selectedServicio]);

  // Cargar datos del servicio cuando estamos en modo edición
  useEffect(() => {
    // Si el modal está abierto y es para editar
    if (modalForm && isEditing && servicio) {
      // Determinar si el servicio está en estado no editable
      // Se permite la edición para servicios en estado 'en_curso'
      const isServiceReadOnly =
        servicio.estado === "realizado" || servicio.estado === "cancelado";

      setIsReadOnly(isServiceReadOnly);

      // Llenar los campos con la información del servicio
      setCliente(servicio.cliente_id || "");
      setConductorSelected(servicio.conductor_id || "");
      setVehicleSelected(servicio.vehiculo_id || "");

      // Convertir fechas a objetos ZonedDateTime
      if (servicio.fecha_solicitud) {
        try {
          const fechaSolDate = new Date(servicio.fecha_solicitud);
          const year = fechaSolDate.getFullYear();
          const month = String(fechaSolDate.getMonth() + 1).padStart(2, "0");
          const day = String(fechaSolDate.getDate()).padStart(2, "0");
          const hours = String(fechaSolDate.getHours()).padStart(2, "0");
          const minutes = String(fechaSolDate.getMinutes()).padStart(2, "0");
          const seconds = String(fechaSolDate.getSeconds()).padStart(2, "0");

          setFechaSolicitud(
            parseZonedDateTime(
              `${year}-${month}-${day}T${hours}:${minutes}:${seconds}[America/Bogota]`,
            ),
          );
        } catch (error) {
          console.error("Error al parsear fecha_solicitud:", error);
          // Usar fecha actual como fallback
          setFechaSolicitud(
            parseZonedDateTime(
              `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
            ),
          );
        }
      }

      if (servicio.fecha_realizacion) {
        try {
          const fechaRealDate = new Date(servicio.fecha_realizacion);
          const year = fechaRealDate.getFullYear();
          const month = String(fechaRealDate.getMonth() + 1).padStart(2, "0");
          const day = String(fechaRealDate.getDate()).padStart(2, "0");
          const hours = String(fechaRealDate.getHours()).padStart(2, "0");
          const minutes = String(fechaRealDate.getMinutes()).padStart(2, "0");
          const seconds = String(fechaRealDate.getSeconds()).padStart(2, "0");

          setFechaRealizacion(
            parseZonedDateTime(
              `${year}-${month}-${day}T${hours}:${minutes}:${seconds}[America/Bogota]`,
            ),
          );
        } catch (error) {
          console.error("Error al parsear fecha_realizacion:", error);
          // Usar fecha actual como fallback
          setFechaRealizacion(
            parseZonedDateTime(
              `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
            ),
          );
        }
      }

      setSelectedOriginMun(servicio.origen_id || "");
      setSelectedDestMun(servicio.destino_id || "");
      setOriginSpecific(servicio.origen_especifico || "");
      setDestSpecific(servicio.destino_especifico || "");

      // Coordenadas
      if (servicio.origen_latitud && servicio.origen_longitud) {
        setOriginCoords({
          lat: servicio.origen_latitud,
          lng: servicio.origen_longitud,
        });
      }

      if (servicio.destino_latitud && servicio.destino_longitud) {
        setDestCoords({
          lat: servicio.destino_latitud,
          lng: servicio.destino_longitud,
        });
      }

      setPurpose(servicio.proposito_servicio || "");
      setState(servicio.estado || "solicitado");
      setObservaciones(servicio.observaciones || "");
    } else if (!modalForm) {
      // Si el modal está cerrado, resetear los estados
      resetFormStates();
      setIsReadOnly(false);
    }
  }, [modalForm, isEditing, servicio]);

  // Función para manejar el cambio de origen específico con coordenadas
  const handleOriginSpecificChange = (
    address: string,
    coords?: { lat: number; lng: number },
  ) => {
    setOriginSpecific(address);
    if (coords) {
      setOriginCoords(coords);
    }
  };

  // Función para manejar el cambio de destino específico con coordenadas
  const handleDestSpecificChange = (
    address: string,
    coords?: { lat: number; lng: number },
  ) => {
    setDestSpecific(address);
    if (coords) {
      setDestCoords(coords);
    }
  };

  const nextStep = () => {
    // Validate required fields based on current step
    if (currentStep === 1) {
      // Step 1: Basic Info validation
      if (!clienteSelected) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor seleccione un cliente",
          color: "danger",
        });

        return;
      }

      if (!fechaSolicitud) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor seleccione una fecha de solicitud",
          color: "danger",
        });

        return;
      }

      if (!fechaRealizacion) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor seleccione una fecha de realización",
          color: "danger",
        });

        return;
      }
      // Date validations can be added here if needed
    } else if (currentStep === 2) {
      // Step 2: Journey Details validation
      if (!selectedOriginMun) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor seleccione un origen",
          color: "danger",
        });

        return;
      }
      if (!selectedDestMun) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor seleccione un destino",
          color: "danger",
        });

        return;
      }
      if (!originSpecific) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor ingrese una dirección de origen específica",
          color: "danger",
        });

        return;
      }
      if (!destSpecific) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor ingrese una dirección de destino específica",
          color: "danger",
        });

        return;
      }
      if (!purpose) {
        addToast({
          title: "Campos requeridos",
          description: "Por favor seleccione un propósito para el servicio",
          color: "danger",
        });

        return;
      }
    } else if (currentStep === 3) {
      // Step 3: Planning validation (all fields are optional)
      // No validation required here
    }

    // If all validations pass, proceed to next step
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Asegurarse de limpiar el servicio seleccionado primero
      if (selectedServicio !== null) {
        clearSelectedServicio();
      }

      // Validar que la fecha de realización no sea anterior a la actual si no hay conductor y vehículo asignados
      const now = new Date();
      const fechaReal = fechaRealizacion?.toDate?.() ?? null;

      if (
        fechaReal &&
        fechaReal < now &&
        (!conductorSelected || !vehicleSelected)
      ) {
        setLoading(false);
        addToast({
          title: "Fecha inválida",
          description:
            "No se puede registrar un servicio con fecha de realización anterior a la actual sin conductor y vehículo asignados.",
          color: "danger",
        });

        return;
      }

      // Determinar el estado automáticamente basado en la presencia de conductor y vehículo
      const estadoServicio: EstadoServicio =
        conductorSelected && vehicleSelected
          ? fechaReal && fechaReal < now
            ? "en_curso"
            : "planificado"
          : "solicitado";

      // Crear un objeto de datos que cumpla con la interfaz y modelo Servicio
      const servicioData = {
        origen_id: selectedOriginMun,
        destino_id: selectedDestMun,
        origen_especifico: originSpecific,
        destino_especifico: destSpecific.trim(),
        origen_latitud: originCoords.lat || null,
        origen_longitud: originCoords.lng || null,
        destino_latitud: destCoords.lat || null,
        destino_longitud: destCoords.lng || null,
        conductor_id: conductorSelected,
        vehiculo_id: vehicleSelected,
        cliente_id: clienteSelected,
        proposito_servicio: purpose,
        fecha_solicitud: convertirFechaParaDB(fechaSolicitud),
        fecha_realizacion: convertirFechaParaDB(fechaRealizacion),
        estado: estadoServicio,
        valor: 0,
        observaciones: observaciones,
      };

      if (isEditing && servicio?.id) {
        await actualizarServicio(servicio.id, servicioData);
      } else {
        await registrarServicio(servicioData);
      }

      handleModalForm();
      resetFormStates();
    } catch (error) {
      setLoading(false);
      console.error(
        isEditing
          ? "Error al actualizar el servicio:"
          : "Error al registrar el servicio:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Error desconocido al actualizar el servicio"
            : "Error desconocido al registrar el servicio",
      );

      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al procesar el servicio",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Step Indicator Component ---
  const StepIndicator = ({
    stepNumber,
    title,
  }: {
    stepNumber: number;
    title: string;
  }) => {
    const isActive = currentStep === stepNumber;
    const isCompleted = currentStep > stepNumber;

    return (
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isActive ? "border-emerald-600 bg-emerald-600 text-white" : isCompleted ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 bg-white text-gray-500"}`}
        >
          {isCompleted ? <CheckCircleIcon /> : stepNumber}
        </div>
        <span
          className={`ml-2 text-sm font-medium ${isActive ? "text-emerald-600" : "text-gray-500"}`}
        >
          {title}
        </span>
      </div>
    );
  };

  const empresaOptions = empresas.map((empresa) => ({
    value: empresa.id,
    label: `${empresa.nombre} (NIT: ${empresa.nit})`,
  }));

  const municipioOptions = municipios
    .map((municipio) => ({
      value: municipio.id,
      label: `${municipio.nombre_municipio} (DEP: ${municipio.nombre_departamento}) (COD: ${municipio.codigo_municipio})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
        }}
        isOpen={modalForm}
        scrollBehavior="inside"
        size={"5xl"}
        onClose={() => {
          // En NextUI/uso-modal.d.ts, isOpen es false cuando se cierra el modal
          // No es necesario verificar !isOpen ya que siempre será false durante onClose

          // Primero limpiar el servicio seleccionado para eliminar cualquier ruta/marcador en el mapa
          if (selectedServicio) {
            clearSelectedServicio();
          }

          if (selectRef.current) {
            try {
              // Intenta usar los métodos directamente
              selectRef.current.clearValue?.();
              selectRef.current.blur?.();
            } catch (error) {
              console.error("Error al limpiar el select:", error);
            }
          }

          // Luego cerrar el modal
          handleModalForm();
          resetFormStates();
        }}
      >
        <ModalContent className="p-6">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditing
                  ? isReadOnly
                    ? `Ver detalles de servicio (${servicio?.estado})`
                    : "Editar servicio"
                  : "Registro de servicio"}
              </ModalHeader>
              <ModalBody className="space-y-4">
                {/* Step Progress Bar - solo mostrar si no estamos en modo solo lectura */}
                {!isReadOnly &&
                  (isMobile ? (
                    <div className="flex items-center justify-center mb-4">
                      <StepIndicator
                        stepNumber={currentStep}
                        title={
                          [
                            "Información Básica",
                            "Detalles Viaje",
                            "Planificación",
                            "Estado",
                          ][currentStep - 1]
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <StepIndicator
                        stepNumber={1}
                        title="Información Básica"
                      />
                      <div
                        className={`flex-1 h-0.5 mx-4 ${currentStep > 1 ? "bg-emerald-600" : "bg-gray-200"}`}
                      />
                      <StepIndicator stepNumber={2} title="Detalles Viaje" />
                      <div
                        className={`flex-1 h-0.5 mx-4 ${currentStep > 2 ? "bg-emerald-600" : "bg-gray-200"}`}
                      />
                      <StepIndicator stepNumber={3} title="Planificación" />
                      <div
                        className={`flex-1 h-0.5 mx-4 ${currentStep > 3 ? "bg-emerald-600" : "bg-gray-200"}`}
                      />
                      <StepIndicator stepNumber={4} title="Estado" />
                    </div>
                  ))}

                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Si está en modo solo lectura, mostrar todos los detalles juntos */}
                  {isReadOnly ? (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                          Información Básica
                        </h3>
                        {/* Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Cliente
                            </p>
                            <p className="text-md">
                              {empresas.find(
                                (e) => e.id === servicio?.cliente_id,
                              )?.nombre || "No asignado"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Estado
                            </p>
                            <p className="text-md capitalize">
                              {servicio?.estado}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Fecha de Solicitud
                            </p>
                            <p className="text-md">
                              {servicio?.fecha_solicitud
                                ? new Date(
                                  servicio.fecha_solicitud,
                                ).toLocaleString()
                                : "No definida"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Fecha de Realización
                            </p>
                            <p className="text-md">
                              {servicio?.fecha_realizacion
                                ? new Date(
                                  servicio.fecha_realizacion,
                                ).toLocaleString()
                                : "No definida"}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                          Origen y Destino
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Origen
                            </p>
                            <p className="text-md">
                              {servicio?.origen_especifico}
                            </p>
                            <p className="text-sm text-gray-500">
                              {municipios.find(
                                (m) => m.id === servicio?.origen_id,
                              )?.nombre_municipio || "No especificado"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Destino
                            </p>
                            <p className="text-md">
                              {servicio?.destino_especifico}
                            </p>
                            <p className="text-sm text-gray-500">
                              {municipios.find(
                                (m) => m.id === servicio?.destino_id,
                              )?.nombre_municipio || "No especificado"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Propósito
                            </p>
                            <p className="text-md capitalize">
                              {servicio?.proposito_servicio ||
                                "No especificado"}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                          Asignaciones
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Conductor
                            </p>
                            <p className="text-md">
                              {conductores.find(
                                (c) => c.id === servicio?.conductor_id,
                              )
                                ? `${conductores.find((c) => c.id === servicio?.conductor_id)?.nombre} ${conductores.find((c) => c.id === servicio?.conductor_id)?.apellido}`
                                : "No asignado"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                              Vehículo
                            </p>
                            <p className="text-md">
                              {vehiculos.find(
                                (v) => v.id === servicio?.vehiculo_id,
                              )
                                ? `${vehiculos.find((v) => v.id === servicio?.vehiculo_id)?.placa} (${vehiculos.find((v) => v.id === servicio?.vehiculo_id)?.marca})`
                                : "No asignado"}
                            </p>
                          </div>
                        </div>

                        {servicio?.observaciones && (
                          <>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                              Observaciones
                            </h3>
                            <p className="text-md">{servicio.observaciones}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Step 1: Basic Info */}
                      {currentStep === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                          {/* Client - Changed to SelectReact */}
                          <div className="relative">
                            <label
                              className="block text-sm font-medium text-gray-700 mb-1"
                              htmlFor="client"
                            >
                              Cliente
                            </label>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 relative shadow-sm rounded-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <BuildingIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <SelectReact
                                  ref={selectRef}
                                  isClearable
                                  isSearchable
                                  required
                                  blurInputOnSelect={true}
                                  className="pl-10 border-1 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                                  classNamePrefix="react-select"
                                  inputId="client"
                                  menuShouldScrollIntoView={false}
                                  name="client"
                                  options={empresaOptions}
                                  placeholder="Seleccione una empresa"
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      border: "none",
                                      boxShadow: undefined,
                                      backgroundColor: "white",
                                    }),
                                    placeholder: (base) => ({
                                      ...base,
                                      color: "#9ca3af",
                                      fontSize: "0.875rem",
                                    }),
                                    singleValue: (base) => ({
                                      ...base,
                                      color: "#1f2937",
                                      fontSize: "0.875rem",
                                    }),
                                    menu: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      marginLeft: -35,
                                    }),
                                    option: (base, state) => ({
                                      ...base,
                                      color: state.isSelected
                                        ? "#059669"
                                        : "#1f2937",
                                      backgroundColor: state.isFocused
                                        ? "#f0fdf4"
                                        : "white",
                                      fontSize: "0.875rem",
                                    }),
                                    dropdownIndicator: (base) => ({
                                      ...base,
                                      color: "#374151",
                                      paddingRight: "0rem",
                                    }),
                                    indicatorSeparator: () => ({
                                      display: "none",
                                    }),
                                    input: (base) => ({
                                      ...base,
                                      color: "#1f2937",
                                      fontSize: "0.875rem",
                                    }),
                                    clearIndicator: (base) => ({
                                      ...base,
                                      color: "#9ca3af",
                                      "&:hover": { color: "#ef4444" },
                                      padding: "0px 8px",
                                    }),
                                  }} // Aproximadamente 5-6 opciones dependiendo del tamaño
                                  value={
                                    empresaOptions.find(
                                      (opt) => opt.value === clienteSelected,
                                    ) || null
                                  }
                                  onChange={(option) =>
                                    setCliente(option ? option.value : "")
                                  }
                                  menuShouldBlockScroll={true}
                                  // Limita la cantidad de opciones visibles en el menú
                                  maxMenuHeight={150}
                                />
                              </div>
                              <Button
                                as={Link}
                                href={process.env.NEXT_PUBLIC_EMPRESAS_SYSTEM}
                                color="success"
                                isIconOnly
                                variant="light"
                                radius="sm"
                                target="_blank"
                              >
                                <PlusIcon />
                              </Button>
                            </div>
                          </div>
                          {/* Dates */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                              <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="requestDate"
                              >
                                Fecha y hora de solicitud
                              </label>
                              <div className="relative space-y-2">
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
                                    ],
                                  }}
                                  defaultValue={parseZonedDateTime(
                                    `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
                                  )}
                                  granularity="minute"
                                  value={fechaSolicitud}
                                  onChange={(value) => {
                                    if (value) setFechaSolicitud(value);
                                  }}
                                />
                                <p className="text-default-500 text-sm">
                                  Fecha:{" "}
                                  {fechaSolicitud
                                    ? new Intl.DateTimeFormat("es-CO", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(fechaSolicitud.toDate())
                                    : "--"}
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="serviceDate"
                              >
                                Fecha y hora de realización
                              </label>
                              <div className="relative space-y-2">
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
                                    ],
                                  }}
                                  defaultValue={parseZonedDateTime(
                                    `${new Date().toISOString().split("T")[0]}T${new Date().toTimeString().split(" ")[0]}[America/Bogota]`,
                                  )}
                                  granularity="minute"
                                  value={fechaRealizacion}
                                  onChange={(value) => {
                                    if (value) setFechaRealizacion(value);
                                  }}
                                />
                                <p className="text-default-500 text-sm">
                                  Fecha:{" "}
                                  {fechaRealizacion
                                    ? new Intl.DateTimeFormat("es-CO", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(fechaRealizacion.toDate())
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Journey Details */}
                      {currentStep === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                          {/* Location */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                              <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="origin"
                              >
                                Origen del Trayecto
                              </label>
                              <div className="relative shadow-sm rounded-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <LocationMarkerIcon />
                                </div>
                                <SelectReact
                                  isClearable
                                  isSearchable
                                  required
                                  className="border-1 pl-10 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                                  classNamePrefix="react-select"
                                  inputId="origin"
                                  menuShouldScrollIntoView={false}
                                  name="origin"
                                  options={municipioOptions}
                                  placeholder="Seleccione un origen"
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      border: "none",
                                      boxShadow: undefined,
                                      backgroundColor: "white",
                                    }),
                                    placeholder: (base) => ({
                                      ...base,
                                      color: "#9ca3af",
                                      fontSize: "0.875rem",
                                    }),
                                    singleValue: (base) => ({
                                      ...base,
                                      color: "#1f2937",
                                      fontSize: "0.875rem",
                                    }),
                                    menu: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      marginLeft: -35,
                                    }),
                                    option: (base, state) => ({
                                      ...base,
                                      color: state.isSelected
                                        ? "#059669"
                                        : "#1f2937",
                                      backgroundColor: state.isFocused
                                        ? "#f0fdf4"
                                        : "white",
                                      fontSize: "0.875rem",
                                    }),
                                    dropdownIndicator: (base) => ({
                                      ...base,
                                      color: "#374151",
                                      paddingRight: "0rem",
                                    }),
                                    indicatorSeparator: () => ({
                                      display: "none",
                                    }),
                                    input: (base) => ({
                                      ...base,
                                      color: "#1f2937",
                                      fontSize: "0.875rem",
                                    }),
                                    clearIndicator: (base) => ({
                                      ...base,
                                      color: "#9ca3af",
                                      "&:hover": { color: "#ef4444" },
                                      padding: "0px 8px",
                                    }),
                                  }} // Aproximadamente 5-6 opciones dependiendo del tamaño
                                  value={
                                    municipioOptions.find(
                                      (opt) => opt.value === selectedOriginMun,
                                    ) || null
                                  }
                                  onChange={(option) =>
                                    setSelectedOriginMun(
                                      option ? option.value : "",
                                    )
                                  }
                                  menuShouldBlockScroll={true}
                                  // Limita la cantidad de opciones visibles en el menú
                                  maxMenuHeight={150}
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="destination"
                              >
                                Destino del Trayecto
                              </label>
                              <div className="relative shadow-sm rounded-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <LocationMarkerIcon />
                                </div>
                                <SelectReact
                                  isClearable
                                  isSearchable
                                  required
                                  className="border-1 pl-10 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                                  classNamePrefix="react-select"
                                  inputId="destination"
                                  menuShouldScrollIntoView={false}
                                  name="destination"
                                  options={municipioOptions}
                                  placeholder="Seleccione un destino"
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      border: "none",
                                      boxShadow: undefined,
                                      backgroundColor: "white",
                                    }),
                                    placeholder: (base) => ({
                                      ...base,
                                      color: "#9ca3af",
                                      fontSize: "0.875rem",
                                    }),
                                    singleValue: (base) => ({
                                      ...base,
                                      color: "#1f2937",
                                      fontSize: "0.875rem",
                                    }),
                                    menu: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      marginLeft: -35,
                                    }),
                                    option: (base, state) => ({
                                      ...base,
                                      color: state.isSelected
                                        ? "#059669"
                                        : "#1f2937",
                                      backgroundColor: state.isFocused
                                        ? "#f0fdf4"
                                        : "white",
                                      fontSize: "0.875rem",
                                    }),
                                    dropdownIndicator: (base) => ({
                                      ...base,
                                      color: "#374151",
                                      paddingRight: "0rem",
                                    }),
                                    indicatorSeparator: () => ({
                                      display: "none",
                                    }),
                                    input: (base) => ({
                                      ...base,
                                      color: "#1f2937",
                                      fontSize: "0.875rem",
                                    }),
                                    clearIndicator: (base) => ({
                                      ...base,
                                      color: "#9ca3af",
                                      "&:hover": { color: "#ef4444" },
                                      padding: "0px 8px",
                                    }),
                                  }} // Aproximadamente 5-6 opciones dependiendo del tamaño
                                  value={
                                    municipioOptions.find(
                                      (opt) => opt.value === selectedDestMun,
                                    ) || null
                                  }
                                  onChange={(option) =>
                                    setSelectedDestMun(
                                      option ? option.value : "",
                                    )
                                  }
                                  menuShouldBlockScroll={true}
                                  // Limita la cantidad de opciones visibles en el menú
                                  maxMenuHeight={150}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <SearchInputsPlaces
                              initialDestination={destSpecific}
                              initialOrigin={originSpecific}
                              onDestinationChange={(address, coords) =>
                                handleDestSpecificChange(address, coords)
                              }
                              onOriginChange={(address, coords) =>
                                handleOriginSpecificChange(address, coords)
                              }
                            />
                          </div>
                          {/* Purpose */}
                          <div>
                            <label
                              className="block text-sm font-medium text-gray-700 mb-2"
                              htmlFor="purpose-personnel"
                            >
                              Propósito del Servicio
                            </label>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex items-center">
                                <input
                                  required
                                  checked={purpose === "personal"}
                                  className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                  id="purpose-personnel"
                                  name="purpose"
                                  type="radio"
                                  value="personal"
                                  onChange={() => setPurpose("personal")}
                                />
                                <label
                                  className="ml-2 flex items-center text-sm text-gray-900 gap-2"
                                  htmlFor="purpose-personnel"
                                >
                                  <UsersIcon />
                                  Transporte de personal
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  checked={purpose === "personal y herramienta"}
                                  className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                  id="purpose-tools"
                                  name="purpose"
                                  type="radio"
                                  value="personal y herramienta"
                                  onChange={() =>
                                    setPurpose("personal y herramienta")
                                  }
                                />
                                <label
                                  className="ml-2 flex items-center text-sm text-gray-900 gap-2"
                                  htmlFor="purpose-tools"
                                >
                                  <TruckIcon />
                                  Transporte de personal y herramienta
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Planning (Optional) */}
                      {currentStep === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                          {/* Location */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                              <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="origin"
                              >
                                Vehículo Asignado
                              </label>
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 relative shadow-sm rounded-md">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TruckIcon />
                                  </div>
                                  <SelectReact
                                    isClearable
                                    isSearchable
                                    className="pl-10 border-1 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                                    classNamePrefix="react-select"
                                    inputId="driver"
                                    name="driver"
                                    options={vehiculos.map((vehiculo) => ({
                                      value: vehiculo.id,
                                      label: `${vehiculo.placa} ${vehiculo.linea} (${vehiculo.modelo})`,
                                    }))}
                                    placeholder="Seleccione un vehiculo"
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        border: "none",
                                        boxShadow: state.isFocused
                                          ? "0 0 0 1px #059669"
                                          : undefined,
                                        "&:hover": { borderColor: "#059669" },
                                        backgroundColor: "white",
                                      }),
                                      placeholder: (base) => ({
                                        ...base,
                                        color: "#9ca3af",
                                        fontSize: "0.875rem",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "#1f2937",
                                        fontSize: "0.875rem",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        marginLeft: -35,
                                      }),
                                      option: (base, state) => ({
                                        ...base,
                                        color: state.isSelected
                                          ? "#059669"
                                          : "#1f2937",
                                        backgroundColor: state.isFocused
                                          ? "#f0fdf4"
                                          : "white",
                                        fontSize: "0.875rem",
                                      }),
                                      dropdownIndicator: (base) => ({
                                        ...base,
                                        color: "#374151",
                                        paddingRight: "0rem",
                                      }),
                                      indicatorSeparator: () => ({
                                        display: "none",
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        color: "#1f2937",
                                        fontSize: "0.875rem",
                                      }),
                                    }}
                                    value={
                                      vehiculos
                                        .map((vehiculo) => ({
                                          value: vehiculo.id,
                                          label: `${vehiculo.placa} ${vehiculo.linea} (${vehiculo.modelo})`,
                                        }))
                                        .find(
                                          (opt) => opt.value === vehicleSelected,
                                        ) || null
                                    }
                                    onChange={(option) =>
                                      setVehicleSelected(
                                        option ? option.value : "",
                                      )
                                    }
                                    menuShouldBlockScroll={true}
                                    // Limita la cantidad de opciones visibles en el menú
                                    maxMenuHeight={150}
                                  />
                                </div>

                                <Button
                                  as={Link}
                                  href={process.env.NEXT_PUBLIC_FLOTA_SYSTEM}
                                  color="success"
                                  isIconOnly
                                  variant="light"
                                  radius="sm"
                                  target="_blank"
                                >
                                  <PlusIcon />
                                </Button>
                              </div>
                            </div>
                            <div className="relative">
                              <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="destination"
                              >
                                Conductor Asignado
                              </label>
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 relative shadow-sm rounded-md">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon />
                                  </div>
                                  <SelectReact
                                    isClearable
                                    isSearchable
                                    className="border-1 pl-10 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                                    classNamePrefix="react-select"
                                    inputId="driver"
                                    name="driver"
                                    options={conductores.map((conductor) => ({
                                      value: conductor.id,
                                      label: `${conductor.nombre} ${conductor.apellido} (${conductor.numero_identificacion})`,
                                    }))}
                                    placeholder="Seleccione un conductor"
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        border: "none",
                                        boxShadow: state.isFocused
                                          ? "0 0 0 1px #059669"
                                          : undefined,
                                        "&:hover": { borderColor: "#059669" },
                                        backgroundColor: "white",
                                      }),
                                      placeholder: (base) => ({
                                        ...base,
                                        color: "#9ca3af",
                                        fontSize: "0.875rem",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "#1f2937",
                                        fontSize: "0.875rem",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        marginLeft: -35,
                                      }),
                                      option: (base, state) => ({
                                        ...base,
                                        color: state.isSelected
                                          ? "#059669"
                                          : "#1f2937",
                                        backgroundColor: state.isFocused
                                          ? "#f0fdf4"
                                          : "white",
                                        fontSize: "0.875rem",
                                      }),
                                      dropdownIndicator: (base) => ({
                                        ...base,
                                        color: "#374151",
                                        paddingRight: "0rem",
                                      }),
                                      indicatorSeparator: () => ({
                                        display: "none",
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        color: "#1f2937",
                                        fontSize: "0.875rem",
                                      }),
                                    }}
                                    value={
                                      conductores
                                        .map((conductor) => ({
                                          value: conductor.id,
                                          label: `${conductor.nombre} ${conductor.apellido} (${conductor.numero_identificacion})`,
                                        }))
                                        .find(
                                          (opt) =>
                                            opt.value === conductorSelected,
                                        ) || null
                                    }
                                    onChange={(option) =>
                                      setConductorSelected(
                                        option ? option.value : "",
                                      )
                                    }
                                    menuShouldBlockScroll={true}
                                    // Limita la cantidad de opciones visibles en el menú
                                    maxMenuHeight={150}
                                  />
                                </div>
                                <Button
                                  as={Link}
                                  href={process.env.NEXT_PUBLIC_CONDUCTORES_SYSTEM}
                                  color="success"
                                  isIconOnly
                                  variant="light"
                                  radius="sm"
                                  target="_blank"
                                >
                                  <PlusIcon />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {/* Observaciones */}
                          <div className="relative md:col-span-2">
                            <label
                              className="block text-sm font-medium text-gray-700 mb-1"
                              htmlFor="departureTime"
                            >
                              Observaciones
                            </label>
                            <div className="relative bg-white">
                              <Textarea
                                classNames={{
                                  inputWrapper: [
                                    "!bg-transparent",
                                    "data-[hover=true]:!bg-transparent",
                                    "group-data-[focus=true]:!bg-transparent",
                                    "border-1",
                                    "focus-within:border-emerald-600",
                                    "focus-within:border", // Corregido desde "focus-within:border-1"
                                    "transition-colors",
                                    "duration-300",
                                    "ease-in-out",
                                    "rounded-md",
                                  ],
                                }}
                                placeholder="Escribe las observaciones del servicio"
                                value={observaciones}
                                onChange={(e) =>
                                  setObservaciones(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Status */}
                      {currentStep === 4 && (
                        <div className="space-y-6 animate-fadeIn">
                          <div className="relative">
                            <label
                              className="block text-sm font-medium text-gray-700 mb-1"
                              htmlFor="status"
                            >
                              Estado del Servicio
                            </label>
                            <div className="relative">
                              <p className="text-md font-medium mb-4">
                                {(() => {
                                  const now = new Date();
                                  const fechaReal =
                                    fechaRealizacion?.toDate?.() ?? null;

                                  if (fechaReal && fechaReal < now) {
                                    if (conductorSelected && vehicleSelected) {
                                      return "El servicio será registrado como EN CURSO ya que la fecha de realización es anterior a la actual y tiene conductor y vehículo asignados.";
                                    } else {
                                      return "El servicio NO puede ser registrado porque la fecha de realización es anterior a la actual y requiere conductor y vehículo asignados.";
                                    }
                                  }

                                  return conductorSelected && vehicleSelected
                                    ? "El servicio será registrado como PLANIFICADO ya que tiene conductor y vehículo asignados."
                                    : "El servicio será registrado como SOLICITADO ya que no tiene conductor o vehículo asignados.";
                                })()}
                              </p>
                              <p className="text-xs text-gray-500">
                                El estado se determina automáticamente según las
                                asignaciones realizadas.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    {isReadOnly ? (
                      // Botones para modo solo lectura
                      <button
                        className="border-1 py-2 px-4 rounded-md shadow-sm"
                        type="button"
                        onClick={() => {
                          handleModalForm();
                          resetFormStates();
                        }}
                      >
                        Cerrar
                      </button>
                    ) : (
                      // Botones para modo edición/creación
                      <>
                        <button
                          className="border-1 py-2 px-4 rounded-md shadow-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={currentStep === 1}
                          type="button"
                          onClick={prevStep}
                        >
                          Anterior
                        </button>
                        {currentStep < totalSteps ? (
                          <button
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            type="button"
                            onClick={nextStep}
                          >
                            Siguiente
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            {/* Botón de Cancelar Servicio para servicios en estado solicitado, planificado o en_curso */}
                            {isEditing &&
                              servicio &&
                              (servicio.estado === "solicitado" ||
                                servicio.estado === "planificado" ||
                                servicio.estado === "en_curso") && (
                                <button
                                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                  type="button"
                                // onClick={async () => {
                                //   if (
                                //     servicio.id &&
                                //     window.confirm(
                                //       "¿Estás seguro de que deseas cancelar este servicio?",
                                //     )
                                //   ) {
                                //     try {
                                //       await actualizarEstadoServicio(
                                //         servicio.id,
                                //         "cancelado",
                                //       );
                                //       addToast({
                                //         title: "Éxito",
                                //         description:
                                //           "Servicio cancelado correctamente",
                                //         color: "success",
                                //       });
                                //       handleModalForm(); // Cerrar modal
                                //       resetFormStates();
                                //     } catch (error) {
                                //       addToast({
                                //         title: "Error",
                                //         description:
                                //           "No se pudo cancelar el servicio",
                                //         color: "danger",
                                //       });
                                //     }
                                //   }
                                // }}
                                >
                                  Cancelar Servicio
                                </button>
                              )}
                            <button
                              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                              disabled={loading}
                              type="submit"
                            >
                              {isEditing
                                ? "Actualizar Servicio"
                                : "Registrar Servicio"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </form>
                <style global jsx>{`
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                  }
                `}</style>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
