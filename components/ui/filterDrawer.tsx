import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import {
  Filter,
  X,
  MapPin,
  Building2,
  Calendar,
  ArrowUp,
  ArrowDown,
  Truck,
  User,
} from "lucide-react";
import SelectReact from "react-select";
import { useDisclosure } from "@heroui/modal";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";

interface FiltersDrawerProps {
  filters: any;
  setFilters: (filters: any) => void;
  dateFilterType: "solicitud" | "realizacion";
  setDateFilterType: (type: "solicitud" | "realizacion") => void;
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
  sortOptions: { field: string; direction: "asc" | "desc" };
  setSortOptions: (options: {
    field: string;
    direction: "asc" | "desc";
  }) => void;
  empresaOptions: Array<{ value: any; label: string }>;
  vehiculoOptions: Array<{ value: any; label: string }>;
  conductorOptions: Array<{ value: any; label: string }>;
  contarFiltrosActivos: () => number;
  limpiarFiltros: () => void;
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
  filters,
  setFilters,
  dateFilterType,
  setDateFilterType,
  dateRange,
  setDateRange,
  sortOptions,
  setSortOptions,
  empresaOptions,
  vehiculoOptions,
  conductorOptions,
  contarFiltrosActivos,
  limpiarFiltros,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {/* Botón para abrir el drawer */}

      <Badge color="primary" content={contarFiltrosActivos()}>
        <Button
          className="relative"
          color="primary"
          startContent={<Filter className="w-4 h-4" />}
          variant="flat"
          onPress={onOpen}
        >
          Filtros
        </Button>
      </Badge>

      <Drawer
        hideCloseButton
        isDismissable={false}
        isOpen={isOpen}
        size="lg"
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Filtros y Búsqueda</h2>
                  {contarFiltrosActivos() > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {contarFiltrosActivos()} filtro
                      {contarFiltrosActivos() !== 1 ? "s" : ""} activo
                      {contarFiltrosActivos() !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </DrawerHeader>

              <DrawerBody>
                <form
                  autoComplete="off"
                  className="space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {/* Filtros Principales */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">
                      Filtros Principales
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Estado */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="estado"
                        >
                          Estado
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                          id="estado"
                          value={filters.estado}
                          onChange={(e) =>
                            setFilters({ ...filters, estado: e.target.value })
                          }
                        >
                          <option value="">Todos los estados</option>
                          <option value="solicitado">Solicitado</option>
                          <option value="planificado">Planificado</option>
                          <option value="en_curso">En curso</option>
                          <option value="realizado">Realizado</option>
                          <option value="planilla_asignada">
                            Planilla asignada
                          </option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>

                      {/* Tipo de Servicio */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="propositoServicio"
                        >
                          Tipo de Servicio
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                          id="propositoServicio"
                          value={filters.propositoServicio}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              propositoServicio: e.target.value,
                            })
                          }
                        >
                          <option value="">Todos los tipos</option>
                          <option value="personal">Personal</option>
                          <option value="herramienta">Herramienta</option>
                          <option value="vehiculo">Posicionar vehículo</option>
                        </select>
                      </div>

                      {/* Origen */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="origen"
                        >
                          Origen
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            className="pl-11 w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                            id="origen"
                            placeholder="Buscar origen..."
                            type="text"
                            value={filters.origen}
                            onChange={(e) =>
                              setFilters({ ...filters, origen: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Destino */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="destino"
                        >
                          Destino
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            className="pl-11 w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                            id="destino"
                            placeholder="Buscar destino..."
                            type="text"
                            value={filters.destino}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                destino: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selects de Entidades */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">
                      Entidades
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Empresa */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="empresa"
                        >
                          Empresa
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <SelectReact
                            isClearable
                            isSearchable
                            classNamePrefix="react-select"
                            inputId="empresa"
                            menuPortalTarget={
                              typeof window !== "undefined"
                                ? document.body
                                : undefined
                            }
                            name="empresa"
                            options={empresaOptions}
                            placeholder="Seleccione una empresa"
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: "100%",
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              control: (base) => ({
                                ...base,
                                border: "1px solid #d1d5db",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#059669" },
                                backgroundColor: "white",
                                transition: "box-shadow 0.2s",
                                paddingLeft: "2.5rem",
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
                                color: state.isSelected ? "#059669" : "#1f2937",
                                backgroundColor: state.isFocused
                                  ? "#f0fdf4"
                                  : "white",
                                fontSize: "0.875rem",
                              }),
                              dropdownIndicator: (base) => ({
                                ...base,
                                color: "#374151",
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
                              }),
                            }}
                            value={
                              empresaOptions.find(
                                (option) => option.value === filters.empresa,
                              ) || null
                            }
                            onChange={(option) =>
                              setFilters({
                                ...filters,
                                empresa: option ? option.value : "",
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Vehículo */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="vehiculo"
                        >
                          Vehículo
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Truck className="w-5 h-5 text-gray-400" />
                          </div>
                          <SelectReact
                            isClearable
                            isSearchable
                            classNamePrefix="react-select"
                            inputId="vehiculo"
                            menuPortalTarget={
                              typeof window !== "undefined"
                                ? document.body
                                : undefined
                            }
                            name="vehiculo"
                            options={vehiculoOptions}
                            placeholder="Seleccione un vehículo"
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: "100%",
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              control: (base) => ({
                                ...base,
                                border: "1px solid #d1d5db",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#059669" },
                                backgroundColor: "white",
                                transition: "box-shadow 0.2s",
                                paddingLeft: "2.5rem",
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
                                color: state.isSelected ? "#059669" : "#1f2937",
                                backgroundColor: state.isFocused
                                  ? "#f0fdf4"
                                  : "white",
                                fontSize: "0.875rem",
                              }),
                              dropdownIndicator: (base) => ({
                                ...base,
                                color: "#374151",
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
                              }),
                            }}
                            value={
                              vehiculoOptions.find(
                                (option) => option.value === filters.vehiculo,
                              ) || null
                            }
                            onChange={(option) =>
                              setFilters({
                                ...filters,
                                vehiculo: option ? option.value : "",
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Conductor */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="conductor"
                        >
                          Conductor
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <SelectReact
                            isClearable
                            isSearchable
                            classNamePrefix="react-select"
                            inputId="conductor"
                            menuPortalTarget={
                              typeof window !== "undefined"
                                ? document.body
                                : undefined
                            }
                            name="conductor"
                            options={conductorOptions}
                            placeholder="Seleccione un conductor"
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: "100%",
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              control: (base) => ({
                                ...base,
                                border: "1px solid #d1d5db",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#059669" },
                                backgroundColor: "white",
                                transition: "box-shadow 0.2s",
                                paddingLeft: "2.5rem",
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
                                color: state.isSelected ? "#059669" : "#1f2937",
                                backgroundColor: state.isFocused
                                  ? "#f0fdf4"
                                  : "white",
                                fontSize: "0.875rem",
                              }),
                              dropdownIndicator: (base) => ({
                                ...base,
                                color: "#374151",
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
                              }),
                            }}
                            value={
                              conductorOptions.find(
                                (option) => option.value === filters.conductor,
                              ) || null
                            }
                            onChange={(option) =>
                              setFilters({
                                ...filters,
                                conductor: option ? option.value : "",
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filtros de Fecha */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">
                      Filtrar por Fechas
                    </h3>

                    {/* Tipo de fecha */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            checked={dateFilterType === "solicitud"}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                            id="fechaSolicitudRadio"
                            name="tipoFecha"
                            type="radio"
                            value="solicitud"
                            onChange={() => setDateFilterType("solicitud")}
                          />
                          <label
                            className="text-sm font-medium text-gray-700"
                            htmlFor="fechaSolicitudRadio"
                          >
                            Fecha de Solicitud
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            checked={dateFilterType === "realizacion"}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                            id="fechaRealizacionRadio"
                            name="tipoFecha"
                            type="radio"
                            value="realizacion"
                            onChange={() => setDateFilterType("realizacion")}
                          />
                          <label
                            className="text-sm font-medium text-gray-700"
                            htmlFor="fechaRealizacionRadio"
                          >
                            Fecha de Realización
                          </label>
                        </div>
                      </div>

                      {/* Campos de fecha */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="fechaDesde"
                          >
                            Desde
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              className="pl-11 w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                              id="fechaDesde"
                              type="date"
                              value={dateRange.from || ""}
                              onChange={(e) =>
                                setDateRange({
                                  ...dateRange,
                                  from: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="fechaHasta"
                          >
                            Hasta
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              className="pl-11 w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                              id="fechaHasta"
                              min={dateRange.from || undefined}
                              type="date"
                              value={dateRange.to || ""}
                              onChange={(e) =>
                                setDateRange({
                                  ...dateRange,
                                  to: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción rápida */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="date"
                        >
                          Acciones Rápidas
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              const today = new Date()
                                .toISOString()
                                .split("T")[0];

                              setDateRange({ from: today, to: today });
                            }}
                          >
                            Hoy
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              const today = new Date();
                              const lastWeek = new Date();

                              lastWeek.setDate(today.getDate() - 7);
                              setDateRange({
                                from: lastWeek.toISOString().split("T")[0],
                                to: today.toISOString().split("T")[0],
                              });
                            }}
                          >
                            Última semana
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              const today = new Date();
                              const lastMonth = new Date();

                              lastMonth.setMonth(today.getMonth() - 1);
                              setDateRange({
                                from: lastMonth.toISOString().split("T")[0],
                                to: today.toISOString().split("T")[0],
                              });
                            }}
                          >
                            Último mes
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            variant="flat"
                            onPress={() => setDateRange({ from: "", to: "" })}
                          >
                            Limpiar fechas
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ordenación */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">
                      Ordenación
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="sortBy"
                        >
                          Ordenar por
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                          id="sortBy"
                          value={sortOptions.field}
                          onChange={(e) =>
                            setSortOptions({
                              ...sortOptions,
                              field: e.target.value,
                            })
                          }
                        >
                          <option value="fecha_solicitud">
                            Fecha de Solicitud
                          </option>
                          <option value="fecha_realizacion">
                            Fecha de Realización
                          </option>
                          <option value="estado">Estado</option>
                          <option value="origen_especifico">Origen</option>
                          <option value="destino_especifico">Destino</option>
                          <option value="createdAt">Fecha de Creación</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="direction"
                        >
                          Dirección
                        </label>
                        <Button
                          className="w-full h-12 justify-start"
                          startContent={
                            sortOptions.direction === "asc" ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : (
                              <ArrowDown className="w-4 h-4" />
                            )
                          }
                          variant="flat"
                          onPress={() =>
                            setSortOptions({
                              ...sortOptions,
                              direction:
                                sortOptions.direction === "asc"
                                  ? "desc"
                                  : "asc",
                            })
                          }
                        >
                          {sortOptions.direction === "asc"
                            ? "Ascendente"
                            : "Descendente"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </DrawerBody>

              <DrawerFooter>
                <Button
                  color="danger"
                  isDisabled={contarFiltrosActivos() === 0}
                  startContent={<X className="w-4 h-4" />}
                  variant="flat"
                  onPress={limpiarFiltros}
                >
                  Limpiar filtros
                </Button>
                <Button color="primary" variant="flat" onPress={onOpenChange}>
                  Cerrar
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FiltersDrawer;
