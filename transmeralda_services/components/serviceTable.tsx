import { useRef, useState } from "react";
import { ClipboardSignature } from "lucide-react";
import { useRouter } from "next/navigation";

import { conductores, empresas, municipios, vehiculos } from "@/app/lib/data";
import { limitText } from "@/helpers";

// Nueva interfaz para controlar animaciones de filas
interface RowAnimationState {
  [key: string]: {
    isNew: boolean;
    isUpdated: boolean;
    timestamp: number;
  };
}

// Componente principal de tabla de vehículos
const ServiceTable = ({ services }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const router = useRouter();

  // Filtrar vehículos según la página actual
  const servicesPaginados = services.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
      setPage(nuevaPagina);
    }
  };

  // Obtener color según el estado del vehículo
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "EN_CURSO":
        return "bg-emerald-100 text-emerald-800";
      case "CANCELADO":
        return "bg-red-100 text-red-800";
      case "PROGRAMADO":
        return "bg-amber-100 text-amber-800";
      case "COMPLETADO":
        return "bg-primary-100 text-primary-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Estado para animaciones de filas
  const [rowAnimations, setRowAnimations] = useState<RowAnimationState>({});

  // Referencia para scroll automático a nuevos elementos
  const tableRef = useRef<HTMLTableElement>(null);

  // // Procesar eventos de socket para marcar filas como nuevas o actualizadas
  // useEffect(() => {
  //     if (!socketEventLogs || socketEventLogs.length === 0) return;

  //     // Obtener el evento más reciente
  //     const latestEvents = [...socketEventLogs]
  //         .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  //         .slice(0, 5); // Solo procesar los 5 eventos más recientes

  //     const now = Date.now();
  //     const newAnimations: RowAnimationState = { ...rowAnimations };

  //     latestEvents.forEach((event) => {
  //         // Manejar creación de liquidación
  //         if (event.eventName === "vehiculo_creado" && event.data.vehiculo) {
  //             const vehiculoId = event.data.vehiculo.id;

  //             newAnimations[vehiculoId] = {
  //                 isNew: true,
  //                 isUpdated: false,
  //                 timestamp: now,
  //             };

  //             // Scroll a la liquidación nueva (en el siguiente ciclo de renderizado)
  //             setTimeout(() => {
  //                 const row = document.getElementById(
  //                     `vehiculo-row-${vehiculoId}`,
  //                 );

  //                 if (row) {
  //                     row.scrollIntoView({ behavior: "smooth", block: "center" });
  //                 }
  //             }, 100);
  //         }

  //         // Manejar actualización de liquidación
  //         else if (
  //             event.eventName === "vehiculo_actualizado" &&
  //             event.data.vehiculo
  //         ) {
  //             const vehiculoId = event.data.vehiculo.id;

  //             // Solo marcar como actualizada si no es nueva
  //             if (!newAnimations[vehiculoId]?.isNew) {
  //                 newAnimations[vehiculoId] = {
  //                     isNew: false,
  //                     isUpdated: true,
  //                     timestamp: now,
  //                 };
  //             }
  //         }
  //     });

  //     setRowAnimations(newAnimations);

  //     // Limpiar animaciones después de 5 segundos
  //     const timer = setTimeout(() => {
  //         setRowAnimations((prev) => {
  //             const updated: RowAnimationState = {};

  //             // Solo mantener animaciones que sean más recientes que 5 segundos
  //             Object.entries(prev).forEach(([id, state]) => {
  //                 if (now - state.timestamp < 5000) {
  //                     updated[id] = state;
  //                 }
  //             });

  //             return updated;
  //         });
  //     }, 5000);

  //     return () => clearTimeout(timer);
  // }, [socketEventLogs]);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr className="uppercase">
              <th
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                Origen
              </th>
              <th
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                Destino
              </th>
              <th
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                Cliente
              </th>
              <th
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                Vehiculo
              </th>
              <th
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                Conductor
              </th>
              <th
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                scope="col"
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {servicesPaginados.length > 0 ? (
              servicesPaginados.map((service) => {
                // Verificar si esta fila tiene animación activa
                const animation = rowAnimations[service.id];
                const isNew = animation?.isNew || false;
                const isUpdated = animation?.isUpdated || false;

                return (
                  <tr
                    key={service.id}
                    className={`
                                            hover:bg-gray-50 hover:cursor-pointer 
                                            ${isNew ? "animate-highlight-new bg-green-50" : ""}
                                            ${isUpdated ? "animate-highlight-update bg-blue-50" : ""}
                                          `}
                    id={`servicio-row-${service.id}`}
                    onClick={() => router.push(`/servicio/${service.id}`)}
                  >
                    {/* Información del vehículo */}
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm relative">
                      <div className="font-semibold text-gray-900">
                        {/* Indicador de elemento nuevo/actualizado */}
                        {isNew && (
                          <span className="absolute h-full w-1 bg-green-500 left-0 top-0" />
                        )}
                        {isUpdated && !isNew && (
                          <span className="absolute h-full w-1 bg-blue-500 left-0 top-0" />
                        )}
                        {service.placa}
                      </div>
                      <div className="text-gray-500">
                        <div className="text-gray-900">
                          {
                            municipios.find(
                              (m) =>
                                m["Código Municipio"] === service.origen_id,
                            )?.["Nombre Municipio"]
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          {limitText(service.origen_especifico, 30)}
                        </div>
                      </div>
                    </td>

                    {/* Información del propietario */}
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="text-gray-900">
                        {
                          municipios.find(
                            (m) => m["Código Municipio"] === service.destino_id,
                          )?.["Nombre Municipio"]
                        }
                      </div>
                      <div className="text-gray-500 text-xs">
                        {limitText(service.destino_especifico, 30)}
                      </div>
                    </td>

                    {/* Características del vehículo */}
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="text-gray-900">
                        {limitText(
                          empresas.find((e) => e.id === service.cliente_id)
                            ?.Nombre,
                          30,
                        ) || ""}
                      </div>
                      <div className="text-gray-500 text-xs">
                        NIT:{" "}
                        {empresas.find((e) => e.id === service.cliente_id)
                          ?.NIT || ""}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="text-gray-900">
                        {
                          vehiculos.find((v) => v.id === service.vehiculo_id)
                            ?.placa
                        }
                      </div>
                      <div className="text-gray-500 text-xs">
                        {
                          vehiculos.find((v) => v.id === service.vehiculo_id)
                            ?.linea
                        }{" "}
                        {
                          vehiculos.find((v) => v.id === service.vehiculo_id)
                            ?.modelo
                        }
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="text-gray-900">
                        {limitText(
                          `${conductores.find((v) => v.id === service.conductor_id)?.nombre} ${conductores.find((v) => v.id === service.conductor_id)?.nombre}`,
                          30,
                        )}
                      </div>
                      <div className="text-gray-500 text-xs">
                        C.C.{" "}
                        {
                          conductores.find((v) => v.id === service.conductor_id)
                            ?.numeroDocumento
                        }
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.estado)}`}
                      >
                        {service.estado}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="py-8 text-center" colSpan={6}>
                  <ClipboardSignature className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay sertvicios
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No se encontraron servicios con los criterios de búsqueda
                    actuales.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {services.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
              disabled={page === 1}
              onClick={() => cambiarPagina(page - 1)}
            >
              Anterior
            </button>
            <button
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
              disabled={page === totalPages}
              onClick={() => cambiarPagina(page + 1)}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {(page - 1) * itemsPerPage + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(page * itemsPerPage, services.length)}
                </span>{" "}
                de <span className="font-medium">{services.length}</span>{" "}
                vehículos
              </p>
            </div>
            <div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 border rounded-md ${page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  disabled={page === 1}
                  onClick={() => cambiarPagina(page - 1)}
                >
                  Anterior
                </button>

                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(services.length / itemsPerPage),
                    ),
                  },
                  (_, i) => {
                    // Lógica para mostrar páginas alrededor de la página actual
                    let pageNum;
                    const totalPages = Math.ceil(
                      services.length / itemsPerPage,
                    );

                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`px-3 py-1 border rounded-md ${page === pageNum
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        onClick={() => cambiarPagina(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}

                <button
                  className={`px-3 py-1 border rounded-md ${page === Math.ceil(services.length / itemsPerPage)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  disabled={page === Math.ceil(services.length / itemsPerPage)}
                  onClick={() => cambiarPagina(page + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
