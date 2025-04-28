import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/modal";
import { useEffect, useState } from "react";
import SelectReact from "react-select";
import { getLocalTimeZone } from "@internationalized/date"; // Ajusta esta importación según la biblioteca que uses
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DateInput } from "@heroui/date-input";
import { parseZonedDateTime } from "@internationalized/date";
import {
  CreateServicioDTO,
  EstadoServicio,
  useService,
} from "@/context/serviceContext";
import SearchInputsPlaces from "@/components/ui/originDestInputsPlaces";
import { addToast } from "@heroui/toast";

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
const ClockIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const WrenchScrewdriverIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.87-5.87a2.652 2.652 0 0 0-1.62-.65H9.75a2.652 2.652 0 0 0-1.62.65L2.25 17.25A2.652 2.652 0 0 0 6 21l5.87-5.87a2.652 2.652 0 0 0 1.62-.65Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 17.25v4.5A2.25 2.25 0 0 1 18.75 24H5.25A2.25 2.25 0 0 1 3 21.75v-4.5c0-1.24.98-2.35 2.25-2.6V11.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v3.15c1.27.25 2.25 1.36 2.25 2.6Zm-9-9.48h.008v.008H12V7.77Zm0 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Z"
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
const BuildingOfficeIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21h7.5M12 6.75a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.25 6.75h.008v.008H8.25V6.75Zm0 3.75h.008v.008H8.25v-.008Zm0 3.75h.008v.008H8.25v-.008Zm0 3.75h.008v.008H8.25v-.008Zm3-11.25h.008v.008H11.25V6.75Zm0 3.75h.008v.008H11.25v-.008Zm0 3.75h.008v.008H11.25v-.008Zm0 3.75h.008v.008H11.25v-.008Zm3-11.25h.008v.008H14.25V6.75Zm0 3.75h.008v.008H14.25v-.008Zm0 3.75h.008v.008H14.25v-.008Zm0 3.75h.008v.008H14.25v-.008Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function App() {
  const { municipios, conductores, vehiculos, empresas, modalAgregar, handleModalAdd } = useService();
  const { setError, registrarServicio } = useService();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // State for cliente selected
  const [clienteSelected, setCliente] = useState("");

  // State for conductor
  const [conductorSelected, setConductorSelected] = useState("");

  // State for vehicle
  const [vehicleSelected, setVehicleSelected] = useState("");

  // State for date request
  const [fechaSolicitud, setFechaSolicitud] = useState(parseZonedDateTime(`${new Date().toISOString().split('T')[0]}T${new Date().toTimeString().split(' ')[0]}[America/Bogota]`));

  // State for date to do request
  const [fechaRealizacion, setFechaRealizacion] = useState(parseZonedDateTime(`${new Date().toISOString().split('T')[0]}T${new Date().toTimeString().split(' ')[0]}[America/Bogota]`));

  // State for selected locations
  const [selectedOriginMun, setSelectedOriginMun] = useState("");
  const [selectedDestMun, setSelectedDestMun] = useState("");

  // State for specific address inputs
  const [originSpecific, setOriginSpecific] = useState("");
  const [destSpecific, setDestSpecific] = useState("");

  // States for coordinates
  const [originCoords, setOriginCoords] = useState({ lat: 0, lng: 0 });
  const [destCoords, setDestCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    console.log(originSpecific);
  }, [originSpecific]);

  // purpose
  const [purpose, setPurpose] = useState("");

  // state
  const [state, setState] = useState<EstadoServicio>("solicitado");

  // state
  const [observaciones, setObservaciones] = useState<string>("");

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
      console.log("Destination coordinates set:", coords);
    }
  };

    // Función para convertir un objeto ZonedDateTime a formato para la base de datos
    const convertirFechaParaDB = (zonedDateTime) => {
      if (!zonedDateTime) return null;
      
      // Convertir a objeto Date de JavaScript
      const jsDate = zonedDateTime.toDate(zonedDateTime.timeZone);
      
      // Para MySQL/PostgreSQL puedes usar directamente el objeto Date
      // o la representación ISO si prefieres
      return jsDate;
    };
  

  const nextStep = () => {
    // Validate required fields based on current step
    if (currentStep === 1) {
      // Step 1: Basic Info validation
      if (!clienteSelected || !fechaSolicitud || !fechaRealizacion) {

        console.log(clienteSelected, fechaSolicitud, "ss", fechaRealizacion)
        addToast({
          title: "Campos requeridos",
          description: "Por favor diligencie todos los campos",
          color: "danger",
        })
        return;
      }
      // Date validations can be added here if needed
    } else if (currentStep === 2) {
      // Step 2: Journey Details validation
      if (!selectedOriginMun) {
        alert("Por favor seleccione un origen");
        return;
      }
      if (!selectedDestMun) {
        alert("Por favor seleccione un destino");
        return;
      }
      if (!originSpecific) {
        alert("Por favor ingrese una dirección de origen específica");
        return;
      }
      if (!destSpecific) {
        alert("Por favor ingrese una dirección de destino específica");
        return;
      }
      if (!purpose) {
        alert("Por favor seleccione un propósito para el servicio");
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

    try {
      // Crear un objeto de datos que cumpla con la interfaz y modelo Servicio
      const servicioData: CreateServicioDTO = {
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
        tipo_servicio: purpose,
        fecha_solicitud: convertirFechaParaDB(fechaSolicitud),
        fecha_realizacion: convertirFechaParaDB(fechaRealizacion),
        estado: state,
        // Opción 2: Convierte el objeto Time a string al asignarlo
        distancia_km: 20,
        valor: 0,
        observaciones: observaciones,
      };

      console.log(servicioData);

      // Llamar a la función para registrar el servicio
      await registrarServicio(servicioData);

      // Opcional: Mostrar notificación de éxito
      alert("¡Servicio registrado exitosamente!");
    } catch (error) {
      // Manejar errores
      console.error("Error al registrar el servicio:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al registrar el servicio",
      );
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
    label: `${empresa.Nombre} (NIT: ${empresa.NIT})`,
  }));

  const municipioOptions = municipios
    .map((municipio) => ({
      value: municipio.id,
      label: `${municipio.nombre_municipio} (DEP: ${municipio.nombre_departamento}) (COD: ${municipio.codigo_municipio})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Modal isOpen={modalAgregar} size={"5xl"} onClose={handleModalAdd}>
        <ModalContent className="p-6">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registro de servicio
              </ModalHeader>
              <ModalBody className="space-y-4">
                {/* Step Progress Bar */}
                <div className="flex items-center justify-between">
                  <StepIndicator stepNumber={1} title="Información Básica" />
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

                <form className="space-y-8" onSubmit={handleSubmit}>
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
                        <div className="relative shadow-sm rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BuildingOfficeIcon />
                          </div>
                          <SelectReact
                            isSearchable
                            required
                            className="pl-10 border-1 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                            classNamePrefix="react-select"
                            inputId="client"
                            name="client"
                            options={empresaOptions}
                            placeholder="Seleccione una empresa"
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
                                zIndex: 50,
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
                              indicatorSeparator: () => ({ display: "none" }),
                              input: (base) => ({
                                ...base,
                                color: "#1f2937",
                                fontSize: "0.875rem",
                              }),
                            }}
                            value={
                              empresaOptions.find(
                                (opt) => opt.value === clienteSelected,
                              ) || null
                            }
                            onChange={(option) =>
                              setCliente(option ? option.value : "")
                            }
                          />
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
                              granularity="minute"
                              defaultValue={parseZonedDateTime(`${new Date().toISOString().split('T')[0]}T${new Date().toTimeString().split(' ')[0]}[America/Bogota]`)}
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
                              value={fechaSolicitud}
                              onChange={setFechaSolicitud}
                            />
                            <p className="text-default-500 text-sm">
                              Fecha: {fechaSolicitud ? new Intl.DateTimeFormat('es-CO', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(fechaSolicitud.toDate(getLocalTimeZone())) : "--"}
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
                              granularity="minute"
                              defaultValue={parseZonedDateTime(`${new Date().toISOString().split('T')[0]}T${new Date().toTimeString().split(' ')[0]}[America/Bogota]`)}
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
                              value={fechaRealizacion}
                              onChange={setFechaRealizacion}
                            />
                            <p className="text-default-500 text-sm">
                              Fecha: {fechaRealizacion ? new Intl.DateTimeFormat('es-CO', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(fechaRealizacion.toDate(getLocalTimeZone("CO"))) : "--"}
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
                              isSearchable
                              required
                              className="border-1 pl-10 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                              classNamePrefix="react-select"
                              inputId="origin"
                              name="origin"
                              options={municipioOptions}
                              placeholder="Seleccione un origen"
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
                                  zIndex: 50,
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
                                municipioOptions.find(
                                  (opt) => opt.value === selectedOriginMun,
                                ) || null
                              }
                              onChange={(option) =>
                                setSelectedOriginMun(
                                  option ? option.value : "",
                                )
                              }
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
                          <div className="relative  shadow-sm rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LocationMarkerIcon />
                            </div>
                            <SelectReact
                              isSearchable
                              required
                              className="border-1 pl-10 pr-3 block w-full rounded-md sm:text-sm py-2 appearance-none text-gray-800"
                              classNamePrefix="react-select"
                              inputId="destination"
                              name="destination"
                              options={municipioOptions}
                              placeholder="Seleccione un destino"
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
                                  zIndex: 50,
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
                                municipioOptions.find(
                                  (opt) => opt.value === selectedDestMun,
                                ) || null
                              }
                              onChange={(option) =>
                                setSelectedDestMun(option ? option.value : "")
                              }
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                              Recoger Personal
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              checked={purpose === "herramienta"}
                              className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                              id="purpose-tools"
                              name="purpose"
                              type="radio"
                              value="herramienta"
                              onChange={() => setPurpose("herramienta")}
                            />
                            <label
                              className="ml-2 flex items-center text-sm text-gray-900 gap-2"
                              htmlFor="purpose-tools"
                            >
                              <WrenchScrewdriverIcon />
                              Llevar Herramienta
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              checked={purpose === "vehiculo"}
                              className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                              id="purpose-vehicle"
                              name="purpose"
                              type="radio"
                              value="vehiculo"
                              onChange={() => setPurpose("vehiculo")}
                            />
                            <label
                              className="ml-2 flex items-center text-sm text-gray-900 gap-2"
                              htmlFor="purpose-vehicle"
                            >
                              <TruckIcon />
                              Posicionar Vehículo
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Planning (Optional) */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">
                        Detalles Planificación (Opcional)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Conductor - Changed to SelectReact */}
                        <div className="relative">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="driver"
                          >
                            Conductor Asignado
                          </label>
                          <div className="relative shadow-sm rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <UserIcon />
                            </div>
                            <SelectReact
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
                                  zIndex: 50,
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
                                    (opt) => opt.value === conductorSelected,
                                  ) || null
                              }
                              onChange={(option) =>
                                setConductorSelected(
                                  option ? option.value : "",
                                )
                              }
                            />
                          </div>
                        </div>
                        {/* Vehicle - Changed to SelectReact */}
                        <div className="relative">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="vehicle"
                          >
                            Vehículo Asignado
                          </label>
                          <div className="relative shadow-sm rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <TruckIcon />
                            </div>
                            <SelectReact
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
                                  zIndex: 50,
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
                                setVehicleSelected(option ? option.value : "")
                              }
                            />
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
                    </div>
                  )}

                  {/* Step 4: Status */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">
                        Estado del Servicio
                      </h3>
                      <div className="relative">
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="status"
                        >
                          Estado Inicial del Servicio
                        </label>
                        <div className="relative">
                          {/* Optional: Add an icon here */}
                          <Select
                            classNames={{
                              trigger: [
                                "!bg-transparent",
                                "data-[hover=true]:!bg-transparent",
                                "border-1",
                                "py-7",
                                "group-data-[focus=true]:!bg-transparent",
                                "rounded-md",
                              ],
                            }}
                            id="status"
                            name="status"
                            selectedKeys={[state]} // Cambia value por selectedKeys
                            onSelectionChange={(keys) => {
                              const selectedValue = Array.from(
                                keys,
                              )[0] as EstadoServicio;

                              setState(selectedValue);
                            }}
                          >
                            <SelectItem
                              key="solicitado"
                              textValue="Solicitado"
                            >
                              Solicitado
                            </SelectItem>
                            <SelectItem
                              key="planificado"
                              textValue="Planificado"
                            >
                              Planificado
                            </SelectItem>
                          </Select>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          El estado inicial suele ser 'Solicitado' o
                          'Planificado'. Otros estados se actualizarán durante
                          el seguimiento.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      className="border-1 py-2 px-4 rounded-md shadow-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={currentStep === 1}
                      type="button"
                      onClick={prevStep}
                    >
                      Anterior
                    </button>
                    {currentStep < totalSteps ? (
                      <div
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        role="button"
                        onClick={nextStep}
                      >
                        Siguiente
                      </div>
                    ) : (
                      <button
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        type="submit"
                      >
                        Registrar Servicio
                      </button>
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
