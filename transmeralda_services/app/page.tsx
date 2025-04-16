"use client";

import React from "react";
import {
  Ban,
  CheckCircleIcon,
  ClipboardSignature,
  ClockIcon,
  PlusIcon,
  TruckIcon,
} from "lucide-react";

import { SearchIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useService } from "@/context/serviceContext";
import ServiceTable from "@/components/serviceTable";


// Función para obtener la clase de color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case "Solicitado":
      return "bg-emerald-100 text-emerald-800";
    case "En ejecución":
      return "bg-red-100 text-red-800";
    case "Realizado":
      return "bg-amber-100 text-amber-800";
    case "Cancelado":
      return "bg-gray-100 text-gray-800";
    case "planificado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function Dashboard() {
  const {
    servicios
  } = useService();

  const router = useRouter()

  return (
    <div className="flex-grow px-6 py-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Servicios</h1>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            onClick={() => router.push("/agregar")}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nuevo Servicio</span>
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
            // value={filtros.busqueda}
            // onChange={(e) =>
            //   setFiltros({ ...filtros, busqueda: e.target.value })
            // }
            />
          </div>

          <div className="sm:w-64">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            // value={filtros.estado}
            // onChange={(e) =>
            //   setFiltros({ ...filtros, estado: e.target.value })
            // }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
                <ClipboardSignature className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Servicios
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {servicios.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
                <TruckIcon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {servicios.filter((s) => s.estado === "EN_CURSO").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-primary-100 text-primary-600">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Realizados
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {servicios.filter((s) => s.estado === "COMPLETADO").length}
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
                    Pendientes
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {servicios.filter((s) => s.estado === "PROGRAMADO").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-100 text-red-600">
                <Ban className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cancelados
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {servicios.filter((s) => s.estado === "CANCELADO").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de vehículos */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-2 bg-green-50 text-green-700 border-b border-green-100 flex items-center text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <span>Sincronización en tiempo real activa</span>
          </div>
          <ServiceTable services={servicios} />
        </div>
      </div>
    </div>
  );
}
