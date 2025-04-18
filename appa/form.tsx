"use client"

import { useState } from 'react';
import { empresas, vehiculos, conductores, municipiosSort } from '../app/lib/data'; // Import data

interface Municipio {
  c_digo_dane_del_departamento: string;
  departamento: string;
  c_digo_dane_del_municipio: string; // Full DIVIPOLA code (Dept+Mun)
  municipio: string;
}

// Placeholder icons (keep existing definitions)
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008ZM9.75 18h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008ZM7.5 18h.008v.008H7.5v-.008ZM14.25 15h.008v.008H14.25v-.008ZM14.25 18h.008v.008H14.25v-.008ZM16.5 15h.008v.008H16.5v-.008ZM16.5 18h.008v.008H16.5v-.008Z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5a1.125 1.125 0 0 0 1.125-1.125V6.75a1.125 1.125 0 0 0-1.125-1.125H3.375A1.125 1.125 0 0 0 2.25 6.75v10.5a1.125 1.125 0 0 0 1.125 1.125Z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.87-5.87a2.652 2.652 0 0 0-1.62-.65H9.75a2.652 2.652 0 0 0-1.62.65L2.25 17.25A2.652 2.652 0 0 0 6 21l5.87-5.87a2.652 2.652 0 0 0 1.62-.65Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 17.25v4.5A2.25 2.25 0 0 1 18.75 24H5.25A2.25 2.25 0 0 1 3 21.75v-4.5c0-1.24.98-2.35 2.25-2.6V11.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v3.15c1.27.25 2.25 1.36 2.25 2.6Zm-9-9.48h.008v.008H12V7.77Zm0 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const BuildingOfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21h7.5M12 6.75a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h.008v.008H8.25V6.75Zm0 3.75h.008v.008H8.25v-.008Zm0 3.75h.008v.008H8.25v-.008Zm0 3.75h.008v.008H8.25v-.008Zm3-11.25h.008v.008H11.25V6.75Zm0 3.75h.008v.008H11.25v-.008Zm0 3.75h.008v.008H11.25v-.008Zm0 3.75h.008v.008H11.25v-.008Zm3-11.25h.008v.008H14.25V6.75Zm0 3.75h.008v.008H14.25v-.008Zm0 3.75h.008v.008H14.25v-.008Zm0 3.75h.008v.008H14.25v-.008Z" /></svg>;

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // State for cliente selected
  const [clienteSelected, setCliente] = useState("")

  // State for conductor
  const [conductorSelected, setConductorSelected] = useState("")

  // State for vehicle
  const [vehicleSelected, setVehicleSelected] = useState("")

  // State for date request
  const [dateRequest, setDateRequest] = useState("")

  // State for date to do request
  const [dateRequestToDo, setDateRequestToDo] = useState("")

  // State for selected locations
  const [selectedOriginMun, setSelectedOriginMun] = useState('');
  const [selectedDestMun, setSelectedDestMun] = useState('');

  // State for specific address inputs
  const [originSpecific, setOriginSpecific] = useState('');
  const [destSpecific, setDestSpecific] = useState('');

  // purpose
  const [purpose, setPurpose] = useState('');

  // purpose
  const [hourOut, setHourOut] = useState('');

  // purpose
  const [state, setState] = useState('solicitado');


  const nextStep = () => {
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a complete data object with all required fields
    const completeData = {
      origen_municipio_divipola: selectedOriginMun,
      origen_especifico: originSpecific,
      destino_municipio_divipola: selectedDestMun,
      destino_especifico: destSpecific.trim(),
      fecha_solicitud: dateRequest,
      fecha_realizacion: dateRequestToDo,
      cliente_id: clienteSelected,
      conductor_id: conductorSelected,
      vehiculo_id: vehicleSelected,
      proposito: purpose,
      hora_salida: hourOut,
      estado: state
    };

    // Save to localStorage
    // Generate a unique ID for this submission or use an existing one
    const submissionId = `trip_request_${Date.now()}`;

    // Get existing trips data or initialize an empty array
    const existingTrips = JSON.parse(localStorage.getItem('tripRequests') || '[]');

    // Add new trip data to the array
    existingTrips.push({
      id: submissionId,
      ...completeData,
      timestamp: new Date().toISOString()
    });

    // Save updated array back to localStorage
    localStorage.setItem('tripRequests', JSON.stringify(existingTrips));

    console.log("Form Data Submitted and saved to localStorage:", completeData);

    // Optional: Add success notification or redirect
    // alert("Trip request saved successfully!");
    // navigate('/trip-requests');
  };
  // --- Step Indicator Component ---
  const StepIndicator = ({ stepNumber, title }: { stepNumber: number, title: string }) => {
    const isActive = currentStep === stepNumber;
    const isCompleted = currentStep > stepNumber;

    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isActive ? 'border-emerald-600 bg-emerald-600 text-white' : isCompleted ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
          {isCompleted ? <CheckCircleIcon /> : stepNumber}
        </div>
        <span className={`ml-2 text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>{title}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-5xl mb-8">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between">
          <StepIndicator stepNumber={1} title="Info Básica" />
          <div className={`flex-1 h-0.5 mx-4 ${currentStep > 1 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          <StepIndicator stepNumber={2} title="Detalles Viaje" />
          <div className={`flex-1 h-0.5 mx-4 ${currentStep > 2 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          <StepIndicator stepNumber={3} title="Planificación" />
          <div className={`flex-1 h-0.5 mx-4 ${currentStep > 3 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          <StepIndicator stepNumber={4} title="Estado" />
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white p-6 sm:p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-8 text-center text-gray-800">
          Solicitud de Servicio - Transmeralda
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Client - Changed to Select */}
              <div className="relative">
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BuildingOfficeIcon /></div>
                  <select
                    name="client"
                    id="client"
                    className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none"
                    required
                    defaultValue=""
                    onChange={(e) => setCliente(e.target.value)}
                    value={clienteSelected}
                  >
                    <option value="" disabled>Seleccione una empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.Nombre} (NIT: {empresa.NIT})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon /></div>
                </div>
              </div>
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Solicitud</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CalendarIcon /></div>
                    <input type="date" name="requestDate" id="requestDate" className="text-gray-800 pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2" required value={dateRequest} onChange={(e) => setDateRequest(e.target.value)} />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Realización</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CalendarIcon /></div>
                    <input type="date" name="serviceDate" id="serviceDate" className="text-gray-800 pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2" required value={dateRequestToDo} onChange={(e) => setDateRequestToDo(e.target.value)} />
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
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origen del Trayecto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LocationMarkerIcon /></div>
                    <select
                      name="client"
                      id="client"
                      className={`${selectedOriginMun !== "" ? "text-gray-800" : "text-gray-400"} pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none outline-emerald-600`}
                      required
                      value={selectedOriginMun}
                      onChange={(e) => setSelectedOriginMun(e.target.value)}
                    >
                      <option value="" disabled>Seleccione un origen</option>
                      {municipiosSort.map((municipio, idx) => (
                        <option className='text-gray-800' key={idx} value={municipio["Código Municipio"]}>
                          {municipio["Nombre Municipio"]} (DEP: {municipio["Nombre Departamento"]}) (COD: {municipio["Código Municipio"]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destino del Trayecto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LocationMarkerIcon /></div>
                    <select
                      name="client"
                      id="client"
                      className={`${selectedDestMun !== "" ? "text-gray-800" : "text-gray-400"} pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none outline-emerald-600`}
                      required
                      value={selectedDestMun}
                      onChange={(e) => setSelectedDestMun(e.target.value)}
                    >
                      <option value="" disabled>Seleccione un destino</option>
                      {municipiosSort.map((municipio, idx) => (
                        <option className='text-gray-800' key={idx} value={municipio["Código Municipio"]}>
                          {municipio["Nombre Municipio"]} (DEP: {municipio["Nombre Departamento"]}) (COD: {municipio["Código Municipio"]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origen especifico del Trayecto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LocationMarkerIcon /></div>
                    <input type="text" className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none outline-emerald-600"
                      placeholder='Escribe un origen especifico'
                      onChange={(e) => setOriginSpecific(e.target.value)}
                      value={originSpecific}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destino especifico del Trayecto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LocationMarkerIcon /></div>
                    <input type="text" className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none outline-emerald-600"
                      placeholder='Escribe un destino especifico'
                      onChange={(e) => setDestSpecific(e.target.value)}
                      value={destSpecific}
                    />
                  </div>
                </div>
              </div>
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Propósito del Servicio</label>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center">
                    <input
                      id="purpose-personnel"
                      onChange={() => setPurpose('personal')}
                      checked={purpose === 'personal'}
                      name="purpose"
                      type="radio"
                      value="personal"
                      className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      required
                    />
                    <label htmlFor="purpose-personnel" className="ml-2 flex items-center text-sm text-gray-900">
                      <UsersIcon />Recoger Personal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="purpose-tools"
                      name="purpose"
                      onChange={() => setPurpose('herramienta')}
                      checked={purpose === 'herramienta'}
                      type="radio"
                      value="herramienta"
                      className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="purpose-tools" className="ml-2 flex items-center text-sm text-gray-900">
                      <WrenchScrewdriverIcon />Llevar Herramienta
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="purpose-vehicle"
                      name="purpose"
                      onChange={() => setPurpose('vehiculo')}
                      checked={purpose === 'vehiculo'}
                      type="radio"
                      value="vehiculo"
                      className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="purpose-vehicle" className="ml-2 flex items-center text-sm text-gray-900">
                      <TruckIcon />Posicionar Vehículo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Planning (Optional) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">Detalles Planificación (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Conductor - Changed to Select */}
                <div className="relative">
                  <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">Conductor Asignado</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon /></div>
                    <select
                      name="driver"
                      id="driver"
                      className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none"
                      value={conductorSelected}
                      onChange={(e) => setConductorSelected(e.target.value)}
                    >
                      <option value="" disabled>Seleccione un conductor</option>
                      {conductores.map((conductor) => (
                        <option key={conductor.id} value={conductor.id}>
                          {conductor.nombre} {conductor.apellido} ({conductor.numeroDocumento})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon /></div>
                  </div>
                </div>
                {/* Vehicle - Changed to Select */}
                <div className="relative">
                  <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">Vehículo Asignado</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><TruckIcon /></div>
                    <select
                      name="vehicle"
                      id="vehicle"
                      className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none"
                      value={vehicleSelected}
                      onChange={(e) => setVehicleSelected(e.target.value)}
                    >
                      <option value="" disabled>Seleccione un vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option key={vehiculo.id} value={vehiculo.id}>
                          {vehiculo.placa} ({vehiculo.marca} {vehiculo.linea} {vehiculo.modelo})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon /></div>
                  </div>
                </div>
                {/* Departure Time */}
                <div className="relative md:col-span-2">
                  <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">Hora de Salida Planificada</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ClockIcon /></div>
                    <input type="time" name="departureTime" id="departureTime" onChange={(e => setHourOut(e.target.value))} value={hourOut} className="text-gray-800 pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Status */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">Estado del Servicio</h3>
              <div className="relative">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial del Servicio</label>
                <div className="relative">
                  {/* Optional: Add an icon here */}
                  <select id="status" name="status" value={state} onChange={(e => setState(e.target.value))} className="text-gray-800 pl-3 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 appearance-none">
                    <option value="solicitado">Solicitado</option>
                    <option value="planificado">Planificado</option>
                    {/* Other statuses might be set later in the process */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDownIcon /></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">El estado inicial suele ser 'Solicitado' o 'Planificado'. Otros estados se actualizarán durante el seguimiento.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            {currentStep < totalSteps ? (
              <div
                onClick={nextStep}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Siguiente
              </div>
            ) : (
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Registrar Solicitud
              </button>
            )}
          </div>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
