"use client";

import React from "react";
import {
  CheckCircleIcon,
  CircleAlert,
  ClockIcon,
  PlusIcon,
  TruckIcon,
} from "lucide-react";

import { SearchIcon } from "@/components/icons";
import { useFlota, Vehiculo } from "@/context/FlotaContext";

// Función para verificar el estado de documentos
const checkDocumentStatus = (date: string) => {
  if (!date) return "NA";
  const today = new Date();
  const expiryDate = new Date(date);
  const thirtyDaysFromNow = new Date();

  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (expiryDate < today) {
    return "VENCIDO";
  } else if (expiryDate <= thirtyDaysFromNow) {
    return "PRÓXIMO";
  } else {
    return "VIGENTE";
  }
};

// Función para obtener la clase de color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case "DISPONIBLE":
      return "bg-emerald-100 text-emerald-800";
    case "NO DISPONIBLE":
      return "bg-red-100 text-red-800";
    case "MANTENIMIENTO":
      return "bg-amber-100 text-amber-800";
    case "INACTIVO":
      return "bg-gray-100 text-gray-800";
    case "VENCIDO":
      return "bg-red-100 text-red-800";
    case "PRÓXIMO":
      return "bg-amber-100 text-amber-800";
    case "VIGENTE":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Función para obtener todos los documentos clasificados
const getDocumentStatus = (vehicle: Vehiculo) => {
  // Definir todos los documentos requeridos
  const requiredDocs = [
    { name: "SOAT", date: vehicle.soatVencimiento },
    { name: "Técnico-mecánica", date: vehicle.tecnomecanicaVencimiento },
    {
      name: "Tarjeta de Operación",
      date: vehicle.tarjetaDeOperacionVencimiento,
    },
    { name: "Póliza Contractual", date: vehicle.polizaContractualVencimiento },
    {
      name: "Póliza Extra-Contractual",
      date: vehicle.polizaExtraContractualVencimiento,
    },
    { name: "Póliza Todo Riesgo", date: vehicle.polizaTodoRiesgoVencimiento },
  ];

  // Todos los documentos con su estado
  const allDocs = requiredDocs.map((doc) => ({
    ...doc,
    status: doc.date ? checkDocumentStatus(doc.date) : "NA",
    date: doc.date ? new Date(doc.date) : null,
  }));

  // Separar por estado
  const pendientes = allDocs.filter((doc) => doc.status === "NA");
  const vencidos = allDocs.filter((doc) => doc.status === "VENCIDO");
  const proximos = allDocs.filter((doc) => doc.status === "PRÓXIMO");
  const vigentes = allDocs.filter((doc) => doc.status === "VIGENTE");

  // Ordenar los que tienen fecha por proximidad
  vencidos.sort(
    (a, b) => (a.date as Date).getTime() - (b.date as Date).getTime(),
  );
  proximos.sort(
    (a, b) => (a.date as Date).getTime() - (b.date as Date).getTime(),
  );
  vigentes.sort(
    (a, b) => (a.date as Date).getTime() - (b.date as Date).getTime(),
  );

  // Determinar el documento de mayor prioridad
  // 1. Pendientes (NA), 2. Vencidos, 3. Próximos, 4. Vigentes
  const priorityDoc =
    pendientes.length > 0
      ? pendientes[0]
      : vencidos.length > 0
        ? vencidos[0]
        : proximos.length > 0
          ? proximos[0]
          : vigentes.length > 0
            ? vigentes[0]
            : null;

  return {
    allDocs,
    pendientes,
    vencidos,
    proximos,
    vigentes,
    priorityDoc,
  };
};

export default function Dashboard() {
  const {
    vehiculos,
    vehiculosFiltrados,
    abrirModalDetalle,
    filtros,
    setFiltros,
  } = useFlota();

  return (
    <div className="flex-grow px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Vehiculos</h1>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            onClick={() => console.log("Agregar nuevo vehículo")}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nuevo Vehículo</span>
          </button>
        </div>
        {/* Filtros y búsqueda */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Buscar por placa, marca o propietario..."
              type="text"
              value={filtros.busqueda}
              onChange={(e) =>
                setFiltros({ ...filtros, busqueda: e.target.value })
              }
            />
          </div>

          <div className="sm:w-64">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={filtros.estado}
              onChange={(e) =>
                setFiltros({ ...filtros, estado: e.target.value })
              }
            >
              <option value="">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="NO DISPONIBLE">No disponible</option>
              <option value="MANTENIMIENTO">En mantenimiento</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
                <TruckIcon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Vehículos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {vehiculos.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Disponibles
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {vehiculos.filter((v) => v.estado === "DISPONIBLE").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-amber-100 text-amber-600">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Próximos a vencer
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {
                      vehiculos.filter(
                        (v) =>
                          checkDocumentStatus(v.soatVencimiento) ===
                            "PRÓXIMO" ||
                          checkDocumentStatus(v.tecnomecanicaVencimiento) ===
                            "PRÓXIMO" ||
                          checkDocumentStatus(
                            v.tarjetaDeOperacionVencimiento,
                          ) === "PRÓXIMO",
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-100 text-red-600">
                <CircleAlert className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Documentos vencidos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {
                      vehiculos.filter(
                        (v) =>
                          checkDocumentStatus(v.soatVencimiento) ===
                            "VENCIDO" ||
                          checkDocumentStatus(v.tecnomecanicaVencimiento) ===
                            "VENCIDO" ||
                          checkDocumentStatus(
                            v.tarjetaDeOperacionVencimiento,
                          ) === "VENCIDO",
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de vehículos */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Vehículos ({vehiculosFiltrados.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {vehiculosFiltrados.map((vehicle) => {
              return (
                <div
                  key={vehicle.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => abrirModalDetalle(vehicle.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {vehicle.placa}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {vehicle.marca} {vehicle.linea}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.estado)}`}
                      >
                        {vehicle.estado}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Modelo:</span>
                        <span className="ml-1 text-gray-900">
                          {vehicle.modelo}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="ml-1 text-gray-900">
                          {vehicle.color}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Clase:</span>
                        <span className="ml-1 text-gray-900">
                          {vehicle.claseVehiculo}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Combustible:</span>
                        <span className="ml-1 text-gray-900">
                          {vehicle.combustible}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700">
                        Propietario
                      </h5>
                      <p className="text-sm text-gray-900 truncate">
                        {vehicle.propietarioNombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vehicle.propietarioIdentificacion}
                      </p>
                    </div>

                    <DocumentInfo vehicle={vehicle} />
                  </div>
                </div>
              );
            })}
          </div>

          {vehiculosFiltrados.length === 0 && (
            <div className="py-8 text-center">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay vehículos
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron vehículos con los criterios de búsqueda
                actuales.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DocumentInfo = ({ vehicle }) => {
  const { pendientes, vencidos, proximos, priorityDoc } =
    getDocumentStatus(vehicle);

  // Determinar el texto de estado y color basados en la prioridad
  let statusText = "";
  let statusColor = "";

  if (pendientes.length > 0) {
    statusText = `${pendientes.length} documento${pendientes.length > 1 ? "s" : ""} sin registrar`;
    statusColor = "bg-gray-100 text-gray-800";
  } else if (vencidos.length > 0) {
    statusText = `${vencidos.length} documento${vencidos.length > 1 ? "s" : ""} vencido${vencidos.length > 1 ? "s" : ""}`;
    statusColor = "bg-red-100 text-red-800";
  } else if (proximos.length > 0) {
    statusText = `${proximos.length} documento${proximos.length > 1 ? "s" : ""} próximo${proximos.length > 1 ? "s" : ""} a vencer`;
    statusColor = "bg-amber-100 text-amber-800";
  }

  // Formatear fecha para mostrar
  const formatDate = (date: Date | null) => {
    if (!date) return "No registrada";

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Obtener color basado en estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VENCIDO":
        return "bg-red-100 text-red-800";
      case "PRÓXIMO":
        return "bg-amber-100 text-amber-800";
      case "VIGENTE":
        return "bg-emerald-100 text-emerald-800";
      case "NA":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Indicador de estado general */}
      {(pendientes.length > 0 ||
        vencidos.length > 0 ||
        proximos.length > 0) && (
        <div className="flex items-center mb-2">
          <span
            className={`text-xs font-medium p-1 rounded-md ${statusColor} w-full text-center`}
          >
            {statusText}
          </span>
        </div>
      )}

      {/* Documento prioritario */}
      {priorityDoc && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {priorityDoc.status === "NA"
              ? "Documento pendiente:"
              : priorityDoc.status === "VENCIDO"
                ? "Documento vencido:"
                : priorityDoc.status === "PRÓXIMO"
                  ? "Próximo vencimiento:"
                  : "Vencimiento más próximo:"}
          </span>
          <span
            className={`text-xs font-medium p-1 rounded-md ${getStatusColor(priorityDoc.status)}`}
          >
            {priorityDoc.name}:{" "}
            {priorityDoc.status === "NA"
              ? "No registrado"
              : formatDate(priorityDoc.date)}
          </span>
        </div>
      )}
    </div>
  );
};