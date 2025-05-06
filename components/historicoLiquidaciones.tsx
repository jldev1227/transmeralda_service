import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Select, SelectItem } from "@heroui/select";
import {
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  ChevronDownIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";

import CustomTable, { SortDescriptor, Column } from "./ui/CustomTable";
import ModalDetalleLiquidacion from "./ui/modalDetalleLiquidacion";

import { apiClient } from "@/config/apiClient";
import { formatearFecha } from "@/helpers";

// Tipado para la respuesta de liquidaciones
interface Liquidacion {
  id: string;
  consecutivo: string;
  fecha_liquidacion: string;
  valor_total: string;
  estado: "pendiente" | "procesada" | "anulada" | "liquidado";
  observaciones: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nombre: string;
    correo: string;
  };
  servicios: Array<{
    id: string;
    origen_especifico: string;
    destino_especifico: string;
    valor: string;
    numero_planilla: string;
    ServicioLiquidacion: {
      valor_liquidado: string;
    };
  }>;
}

interface LiquidacionesResponse {
  total: number;
  pages: number;
  currentPage: number;
  liquidaciones: Liquidacion[];
}

interface Usuario {
  id: string;
  nombre: string;
}

const HistoricoLiquidaciones = () => {
  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });

  // Estados para la tabla y paginación
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroUsuario, setFiltroUsuario] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Ahora los filtros siempre son visibles - eliminamos este estado
  const [totalResults, setTotalResults] = useState(0);
  const [allLiquidaciones, setAllLiquidaciones] = useState<Liquidacion[]>([]);
  const [filteredLiquidaciones, setFilteredLiquidaciones] = useState<
    Liquidacion[]
  >([]);

  // Estado para ordenamiento (ahora maneja ordenamiento local)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "fecha_liquidacion",
    direction: "descending",
  });

  // Estado para el modal de detalle
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLiquidacionId, setSelectedLiquidacionId] = useState<
    string | null
  >(null);

  // Cargar datos de usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await apiClient.get("/api/usuarios");

      setUsuarios(response.data.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  // Cargar usuarios al inicio
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Cargar todos los datos desde la API
  const fetchAllLiquidaciones = async () => {
    setLoading(true);
    try {
      // Para la carga inicial, no aplicamos filtros para obtener todo
      const params = new URLSearchParams();

      params.append("limit", "1000"); // Traer una cantidad grande o todos los datos

      // Realizar petición
      const response = await apiClient.get<LiquidacionesResponse>(
        `/api/liquidaciones_servicios?${params.toString()}`,
      );

      setAllLiquidaciones(response.data.liquidaciones);
      setTotalResults(response.data.total || 0);

      // Aplicar filtros y ordenamiento a los datos cargados
      applyFiltersAndSort(response.data.liquidaciones);
    } catch (err) {
      console.error("Error al cargar liquidaciones:", err);
      setError(
        "Error al cargar las liquidaciones. Por favor, intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para aplicar filtros y ordenamiento localmente
  const applyFiltersAndSort = useCallback(
    (data: Liquidacion[]) => {
      let filtered = [...data];

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        filtered = filtered.filter((item) =>
          item.consecutivo.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Aplicar filtro de estado
      if (filtroEstado) {
        filtered = filtered.filter((item) => item.estado === filtroEstado);
      }

      // Aplicar filtro de usuario
      if (filtroUsuario) {
        filtered = filtered.filter((item) => item.user.id === filtroUsuario);
      }

      // Aplicar filtro de fechas
      if (fechaInicio && fechaFin) {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);

        fechaFinObj.setHours(23, 59, 59); // Incluir todo el día final

        filtered = filtered.filter((item) => {
          const fechaLiquidacion = new Date(item.fecha_liquidacion);

          return (
            fechaLiquidacion >= fechaInicioObj &&
            fechaLiquidacion <= fechaFinObj
          );
        });
      }

      // Aplicar ordenamiento
      const column = sortDescriptor.column as
        | keyof Liquidacion
        | "user.nombre"
        | "servicios.length";
      const direction = sortDescriptor.direction;

      filtered.sort((a, b) => {
        let valueA, valueB;

        // Manejar casos especiales (propiedades anidadas)
        if (column === "user.nombre") {
          valueA = a.user.nombre;
          valueB = b.user.nombre;
        } else if (column === "servicios.length") {
          valueA = a.servicios.length;
          valueB = b.servicios.length;
        } else if (column === "valor_total") {
          valueA = parseFloat(a.valor_total);
          valueB = parseFloat(b.valor_total);
        } else {
          // @ts-ignore - Acceso dinámico a propiedades
          valueA = a[column];
          // @ts-ignore - Acceso dinámico a propiedades
          valueB = b[column];
        }

        // Ordenar ascendente o descendente
        if (direction === "ascending") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Calcular paginación
      const ITEMS_PER_PAGE = 10;
      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

      setTotalPages(totalPages || 1);

      // Aplicar paginación
      const start = (page - 1) * ITEMS_PER_PAGE;
      const paginatedData = filtered.slice(start, start + ITEMS_PER_PAGE);

      setTotalResults(filtered.length);
      setFilteredLiquidaciones(filtered);
      setLiquidaciones(paginatedData);
    },
    [
      searchTerm,
      filtroEstado,
      filtroUsuario,
      fechaInicio,
      fechaFin,
      sortDescriptor,
      page,
    ],
  );

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    fetchAllLiquidaciones();
  }, []);

  // Aplicar filtros y ordenamiento cuando cambian
  useEffect(() => {
    if (allLiquidaciones.length > 0) {
      applyFiltersAndSort(allLiquidaciones);
    }
  }, [
    page,
    filtroEstado,
    filtroUsuario,
    searchTerm,
    fechaInicio,
    fechaFin,
    sortDescriptor,
    applyFiltersAndSort,
  ]);

  // Manejar búsqueda
  const handleSearch = () => {
    setPage(1); // Resetear a la primera página
    // La actualización de filtrados se maneja en el useEffect
  };

  // Manejar búsqueda por tecla Enter
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Resetear filtros
  const resetearFiltros = () => {
    setSearchTerm("");
    setFiltroEstado(null);
    setFiltroUsuario(null);
    setFechaInicio("");
    setFechaFin("");
    setPage(1);
    // La actualización de filtrados se maneja en el useEffect
  };

  // Manejar cambio de ordenamiento (ahora es local, no requiere petición al servidor)
  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    // La actualización del ordenamiento se maneja en el useEffect
  };

  // Abrir modal para ver detalles
  const abrirModalDetalle = (id: string) => {
    setSelectedLiquidacionId(id);
    setModalOpen(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedLiquidacionId(null);
  };

  // Renderizar chip de estado
  const renderEstadoChip = (estado: string) => {
    let color:
      | "primary"
      | "default"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | undefined;

    switch (estado) {
      case "pendiente":
        color = "warning";
        break;
      case "procesada":
        color = "success";
        break;
      case "anulada":
        color = "danger";
        break;
      case "liquidado":
        color = "success";
        break;
      default:
        color = "default";
    }

    return (
      <Chip color={color} size="sm" variant="flat">
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Chip>
    );
  };

  // Formatear valor como moneda
  const formatearMoneda = (valor: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(parseFloat(valor));
  };

  // Determinar las columnas a mostrar según el tamaño de pantalla
  const columnasVisibles = useMemo(() => {
    if (isMobile) {
      // En móvil solo mostramos las columnas más importantes
      return ["consecutivo", "valor_total", "estado"];
    } else if (isTablet) {
      // En tablet mostramos más columnas
      return ["consecutivo", "fecha_liquidacion", "valor_total", "estado"];
    } else {
      // En desktop mostramos todas
      return [
        "consecutivo",
        "fecha_liquidacion",
        "user.nombre",
        "servicios.length",
        "valor_total",
        "estado",
      ];
    }
  }, [isMobile, isTablet]);

  // Renderizar el contenido de la celda basado en su tipo
  const renderCellContent = (liquidacion: Liquidacion, columnKey: string) => {
    switch (columnKey) {
      case "consecutivo":
        return (
          <div className="font-semibold flex flex-col">
            <span>{liquidacion.consecutivo}</span>
            {isMobile && (
              <span className="text-xs text-gray-500">
                {formatearFecha(liquidacion.fecha_liquidacion)}
              </span>
            )}
          </div>
        );
      case "fecha_liquidacion":
        return formatearFecha(liquidacion.fecha_liquidacion);
      case "user.nombre":
        return (
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
            {liquidacion.user.nombre}
          </div>
        );
      case "servicios.length":
        return liquidacion.servicios.length;
      case "valor_total":
        return (
          <div className="font-semibold">
            {formatearMoneda(liquidacion.valor_total)}
          </div>
        );
      case "estado":
        return renderEstadoChip(liquidacion.estado);
      default:
        return null;
    }
  };

  // Map de nombres de columnas para mostrar
  const columnNames: Record<string, string> = {
    consecutivo: "CONSECUTIVO",
    fecha_liquidacion: "FECHA",
    "user.nombre": "USUARIO",
    "servicios.length": "SERVICIOS",
    valor_total: "VALOR TOTAL",
    estado: "ESTADO",
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">
          Histórico de Liquidaciones
        </h1>
      </div>

      {/* Panel de filtros (siempre visible) */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        {/* Barra de búsqueda y botones principales */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-grow">
            <Input
              fullWidth
              placeholder="Buscar por consecutivo..."
              radius="sm"
              startContent={<SearchIcon className="h-4 w-4 text-gray-400" />}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
          </div>
          {(searchTerm ||
            filtroEstado ||
            filtroUsuario ||
            fechaInicio ||
            fechaFin) && (
            <Button
              className="sm:w-auto"
              color="danger"
              startContent={<XIcon className="h-4 w-4" />}
              variant="light"
              onPress={resetearFiltros}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Filtros avanzados (siempre visibles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por usuario */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="usuario"
            >
              Usuario
            </label>
            <Select
              id="usuario"
              items={usuarios}
              placeholder="Selecciona usuario"
              selectedKeys={filtroUsuario ? [filtroUsuario] : []}
              startContent={<UserIcon className="h-4 w-4 text-gray-400" />}
              onChange={(e) => setFiltroUsuario(e.target.value)}
            >
              {(usuario) => <SelectItem>{usuario.nombre}</SelectItem>}
            </Select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="estado"
            >
              Estado
            </label>
            <Dropdown id="estado">
              <DropdownTrigger>
                <Button
                  className="w-full justify-between"
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                  radius="sm"
                  variant="bordered"
                >
                  <div className="flex items-center">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    {filtroEstado
                      ? filtroEstado.charAt(0).toUpperCase() +
                        filtroEstado.slice(1)
                      : "Todos los estados"}
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Estados"
                onAction={(key) => {
                  setFiltroEstado(key === "todos" ? null : (key as string));
                }}
              >
                <DropdownItem key="todos">Todos</DropdownItem>
                <DropdownItem key="pendiente">Pendiente</DropdownItem>
                <DropdownItem key="procesada">Procesada</DropdownItem>
                <DropdownItem key="anulada">Anulada</DropdownItem>
                <DropdownItem key="liquidado">Liquidado</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Filtro por fecha inicio */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="inicio"
            >
              Fecha inicio
            </label>
            <Input
              id="inicio"
              placeholder="Fecha inicio"
              radius="sm"
              startContent={<CalendarIcon className="h-4 w-4 text-gray-400" />}
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          {/* Filtro por fecha fin */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="fin"
            >
              Fecha fin
            </label>
            <Input
              id="fin"
              placeholder="Fecha fin"
              radius="sm"
              startContent={<CalendarIcon className="h-4 w-4 text-gray-400" />}
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      {!loading && (
        <div className="text-sm text-gray-600 mb-2">
          {totalResults}{" "}
          {totalResults === 1
            ? "liquidación encontrada"
            : "liquidaciones encontradas"}
        </div>
      )}

      {/* Tabla de liquidaciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {useMemo(() => {
          // Definir las columnas para la tabla personalizada
          const tableColumns: Column[] = columnasVisibles.map((columnKey) => ({
            key: columnKey,
            label: columnNames[columnKey],
            renderCell: (liquidacion) =>
              renderCellContent(liquidacion, columnKey),
          }));

          return (
            <CustomTable
              className="rounded-t-lg"
              columns={tableColumns}
              data={liquidaciones}
              emptyContent={
                error ? (
                  <div className="text-center p-4 text-red-500">{error}</div>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    No se encontraron liquidaciones con los filtros
                    seleccionados
                  </div>
                )
              }
              isLoading={loading}
              loadingContent={
                <div className="flex justify-center p-4">
                  <Spinner color="success" size="lg" />
                </div>
              }
              sortDescriptor={sortDescriptor}
              onRowClick={(liquidacion) => abrirModalDetalle(liquidacion.id)}
              onSortChange={handleSortChange}
            />
          );
        }, [
          columnasVisibles,
          columnNames,
          liquidaciones,
          sortDescriptor,
          loading,
          error,
        ])}

        {/* Paginación */}
        {!loading && filteredLiquidaciones.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4">
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              Mostrando {liquidaciones.length === 0 ? 0 : (page - 1) * 10 + 1} a{" "}
              {Math.min(page * 10, filteredLiquidaciones.length)} de{" "}
              {filteredLiquidaciones.length} resultados
            </div>
            <Pagination
              showControls
              classNames={{
                cursor: "bg-emerald-600 text-white",
              }}
              color="success"
              page={page}
              radius="sm"
              total={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Modal de detalle de liquidación */}
      <ModalDetalleLiquidacion
        isOpen={modalOpen}
        liquidacionId={selectedLiquidacionId}
        onClose={cerrarModal}
      />
    </div>
  );
};

export default HistoricoLiquidaciones;
