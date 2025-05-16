"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Select, SelectItem } from "@heroui/select";
import ReactSelect from "react-select";
import {
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  ChevronDownIcon,
  UserIcon,
  BuildingIcon,
  XIcon,
  ReceiptIcon,
  CheckCircleIcon,
  ArrowLeft,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

import CustomTable, { SortDescriptor, Column } from "./ui/CustomTable";
import ModalDetalleLiquidacion from "./ui/modalDetalleLiquidacion";

import { apiClient } from "@/config/apiClient";
import { formatearFecha } from "@/helpers";
import { Liquidacion, useService } from "@/context/serviceContext";

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

interface ClienteOption {
  value: string;
  label: string;
  nit: string;
}

const HistoricoLiquidaciones = () => {
  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });

  // Estados para la tabla y paginación
  const { liquidaciones, setLiquidaciones } = useService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroUsuario, setFiltroUsuario] = useState<string | null>(null);
  const [filtroCliente, setFiltroCliente] = useState<ClienteOption | null>(
    null,
  );
  const [opcionesClientes, setOpcionesClientes] = useState<ClienteOption[]>([]);
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

  // Estados para el modal de facturación
  const [numeroFactura, setNumeroFactura] = useState("");
  const [observacionesFactura, setObservacionesFactura] = useState("");
  const [loadingFacturar, setLoadingFacturar] = useState(false);

  // Estados para la selección múltiple
  const [liquidacionesSeleccionadas, setLiquidacionesSeleccionadas] = useState<
    Liquidacion[]
  >([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const [modalFacturacionMultipleOpen, setModalFacturacionMultipleOpen] =
    useState(false);

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

      setLiquidaciones(response.data.liquidaciones);
      setTotalResults(response.data.total || 0);

      // Extraer clientes únicos para el selector
      const clientesMap = new Map<string, ClienteOption>();

      response.data.liquidaciones.forEach((liquidacion) => {
        if (liquidacion.servicios.length > 0) {
          const cliente = liquidacion.servicios[0].cliente;

          if (cliente && !clientesMap.has(cliente.id)) {
            clientesMap.set(cliente.id, {
              value: cliente.id,
              label: cliente.nombre,
              nit: cliente.nit || "",
            });
          }
        }
      });

      setOpcionesClientes(Array.from(clientesMap.values()));

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

      // Aplicar filtro de cliente
      if (filtroCliente) {
        filtered = filtered.filter((item) => {
          if (item.servicios.length === 0) return false;

          // Comprobamos si el primer servicio de la liquidación tiene el cliente filtrado
          const clienteServicio = item.servicios[0].cliente;

          return clienteServicio && clienteServicio.id === filtroCliente.value;
        });
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
      filtroCliente,
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
    filtroCliente,
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
    setFiltroCliente(null);
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

  // Función para manejar la selección o deselección de una liquidación
  const toggleSeleccionLiquidacion = (liquidacion: Liquidacion) => {
    // Solo permitir seleccionar liquidaciones en estado "pendiente" o "procesada"
    if (liquidacion.estado !== "aprobado") {
      addToast({
        title: "No se puede seleccionar",
        description:
          "Solo liquidaciones en estado aprobado pueden ser seleccionadas",
        color: "danger",
      });

      return;
    }

    // Verificar si la liquidación ya está seleccionada
    const isSelected = liquidacionesSeleccionadas.some(
      (item) => item.id === liquidacion.id,
    );

    if (isSelected) {
      // Quitar de la selección
      setLiquidacionesSeleccionadas((prev) =>
        prev.filter((item) => item.id !== liquidacion.id),
      );

      // Si quedaron 0 liquidaciones seleccionadas, resetear el cliente seleccionado
      if (liquidacionesSeleccionadas.length === 1) {
        setClienteSeleccionado(null);
      }

      return;
    }

    // Obtener el cliente de la liquidación actual
    const clienteLiquidacion = liquidacion.servicios[0]?.cliente;

    if (!clienteLiquidacion) {
      addToast({
        title: "Error",
        description: "No se pudo determinar el cliente de la liquidación",
        color: "danger",
      });

      return;
    }

    // Si es la primera selección, establecer el cliente
    if (liquidacionesSeleccionadas.length === 0) {
      setClienteSeleccionado({
        id: clienteLiquidacion.id,
        nombre: clienteLiquidacion.nombre,
      });
      setLiquidacionesSeleccionadas([liquidacion]);

      return;
    }

    // Validar que la liquidación corresponda al mismo cliente ya seleccionado
    if (
      clienteSeleccionado &&
      clienteLiquidacion.id !== clienteSeleccionado.id
    ) {
      addToast({
        title: "Cliente diferente",
        description: `Solo puede seleccionar liquidaciones del cliente ${clienteSeleccionado.nombre}`,
        color: "danger",
      });

      return;
    }

    // Añadir a las seleccionadas
    setLiquidacionesSeleccionadas((prev) => [...prev, liquidacion]);
  };

  // Abrir el modal de facturación para múltiples liquidaciones
  const abrirModalFacturacionMultiple = () => {
    if (liquidacionesSeleccionadas.length === 0) {
      addToast({
        title: "Sin selección",
        description: "Debe seleccionar al menos una liquidación para facturar",
        color: "danger",
      });

      return;
    }

    setNumeroFactura("");
    setObservacionesFactura("");
    setModalFacturacionMultipleOpen(true);
  };

  // Cerrar el modal de facturación múltiple
  const cerrarModalFacturacionMultiple = () => {
    setModalFacturacionMultipleOpen(false);
  };

  // Limpiar selección de liquidaciones
  const limpiarSeleccion = () => {
    setLiquidacionesSeleccionadas([]);
    setClienteSeleccionado(null);
  };

  // Procesar la facturación de múltiples liquidaciones
  const procesarFacturacionMultiple = async () => {
    if (liquidacionesSeleccionadas.length === 0 || !numeroFactura.trim()) {
      addToast({
        title: "Error",
        description: "El número de factura es obligatorio",
        color: "danger",
      });

      return;
    }

    setLoadingFacturar(true);

    try {
      // Crear un array con todas las promesas de facturación
      const promesasFacturacion = liquidacionesSeleccionadas.map(
        (liquidacion) =>
          apiClient.patch(
            `/api/liquidaciones_servicios/${liquidacion.id}/facturar`,
            {
              numero_factura: numeroFactura.trim(),
              observaciones: observacionesFactura.trim(),
            },
          ),
      );

      // Ejecutar todas las peticiones en paralelo
      await Promise.all(promesasFacturacion);

      // Actualizar la lista después de facturar
      fetchAllLiquidaciones();

      addToast({
        title: "Éxito",
        description: `${liquidacionesSeleccionadas.length} liquidaciones han sido marcadas como facturadas`,
        color: "success",
      });

      // Cerrar modal y limpiar selección
      cerrarModalFacturacionMultiple();
      limpiarSeleccion();
    } catch (error: any) {
      console.error("Error al facturar las liquidaciones:", error);

      const mensaje =
        error.response?.data?.error ||
        "Ocurrió un error al procesar la facturación múltiple";

      addToast({
        title: "Error",
        description: mensaje,
        color: "danger",
      });
    } finally {
      setLoadingFacturar(false);
    }
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
      case "liquidado":
        color = "warning";
        break;
      case "aprobado":
        color = "success";
        break;
      case "facturado":
        color = "primary";
        break;
      case "rechazada":
        color = "danger";
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

  // Renderizar información del cliente
  const renderClienteInfo = (liquidacion: Liquidacion) => {
    if (liquidacion.servicios.length === 0) {
      return <span className="text-gray-400">Sin cliente</span>;
    }

    const cliente = liquidacion.servicios[0].cliente;

    if (!cliente) {
      return <span className="text-gray-400">Sin cliente</span>;
    }

    return (
      <div className="flex items-start">
        <BuildingIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
        <div>
          <div className="font-semibold">{cliente.nombre}</div>
          <div className="text-xs text-gray-500">
            nit: {cliente.nit || "N/A"}
          </div>
        </div>
      </div>
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
      return ["consecutivo", "estado"];
    } else if (isTablet) {
      // En tablet mostramos más columnas
      return ["consecutivo", "fecha_liquidacion", "valor_total", "estado"];
    } else {
      // En desktop mostramos todas
      return [
        "consecutivo",
        "fecha_liquidacion",
        "cliente",
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
      case "cliente":
        return renderClienteInfo(liquidacion);
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
    cliente: "CLIENTE",
    fecha_liquidacion: "FECHA",
    "user.nombre": "USUARIO",
    "servicios.length": "SERVICIOS",
    valor_total: "VALOR TOTAL",
    estado: "ESTADO",
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex gap-3 flex-col sm:flex-row w-full items-start md:items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">
            Histórico de Liquidaciones
          </h1>
          <Button
            as={Link}
            className="w-full sm:w-auto"
            color="primary"
            href="/liquidaciones"
            radius="sm"
          >
            <ArrowLeft />
            Volver
          </Button>
        </div>

        {/* Controles para la selección múltiple */}
        <div className="flex items-center gap-2">
          {liquidacionesSeleccionadas.length > 0 && (
            <>
              <div className="hidden sm:flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                <span className="font-medium">
                  {clienteSeleccionado?.nombre}
                </span>
                <span className="mx-1 text-gray-500">|</span>
                <span className="text-emerald-600 font-bold">
                  {liquidacionesSeleccionadas.length}
                </span>
                <span className="ml-1 text-gray-500">seleccionadas</span>
              </div>

              <Button
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                radius="sm"
                size="sm"
                startContent={<ReceiptIcon className="h-4 w-4" />}
                onPress={abrirModalFacturacionMultiple}
              >
                Facturar Selección
              </Button>

              <Button
                color="default"
                size="sm"
                variant="light"
                onPress={limpiarSeleccion}
              >
                Limpiar
              </Button>
            </>
          )}
        </div>
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
          {/* Filtro por cliente */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="cliente"
            >
              Cliente
            </label>
            <ReactSelect
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              filterOption={(option, input) => {
                const label = option.data.label.toLowerCase();
                const nit = option.data.nit?.toLowerCase() || "";
                const inputValue = input.toLowerCase();

                return label.includes(inputValue) || nit.includes(inputValue);
              }}
              formatOptionLabel={(option: ClienteOption) => (
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-gray-500">
                    nit: {option.nit || "N/A"}
                  </span>
                </div>
              )}
              id="cliente"
              options={opcionesClientes}
              placeholder="Buscar por nombre o nit..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.375rem",
                  borderColor: "#e5e7eb",
                  minHeight: "38px",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                }),
              }}
              value={filtroCliente}
              onChange={(selectedOption) =>
                setFiltroCliente(selectedOption as ClienteOption | null)
              }
            />
          </div>

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
                <DropdownItem key="liquidado">Liquidado</DropdownItem>
                <DropdownItem key="aprobado">Aprobado</DropdownItem>
                <DropdownItem key="facturado">Facturado</DropdownItem>
                <DropdownItem key="anulada">Anulada</DropdownItem>
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
              selectable={true}
              selectedItems={liquidacionesSeleccionadas}
              sortDescriptor={sortDescriptor}
              onRowClick={(liquidacion) => abrirModalDetalle(liquidacion.id)}
              onSelectionChange={toggleSeleccionLiquidacion}
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

      {/* Modal de facturación múltiple */}
      <Modal
        backdrop="blur"
        isOpen={modalFacturacionMultipleOpen}
        size="3xl"
        onClose={cerrarModalFacturacionMultiple}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  <ReceiptIcon className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold">
                    Facturación Múltiple
                  </h3>
                </div>
                {clienteSeleccionado && (
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      Cliente:{" "}
                      <span className="font-medium">
                        {clienteSeleccionado.nombre}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Liquidaciones seleccionadas:{" "}
                      <span className="font-medium">
                        {liquidacionesSeleccionadas.length}
                      </span>
                    </p>
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="numero_factura"
                    >
                      Número de Factura
                    </label>
                    <Input
                      fullWidth
                      id="numero_factura"
                      placeholder="Ingrese el número de factura"
                      radius="sm"
                      type="text"
                      value={numeroFactura}
                      onChange={(e) => setNumeroFactura(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="observaciones"
                    >
                      Observaciones
                    </label>
                    <Textarea
                      fullWidth
                      id="observaciones"
                      placeholder="Observaciones adicionales"
                      radius="sm"
                      rows={3}
                      value={observacionesFactura}
                      onChange={(e) => setObservacionesFactura(e.target.value)}
                    />
                  </div>

                  {/* Listado de liquidaciones seleccionadas */}
                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">
                      Liquidaciones a Facturar
                    </p>
                    <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
                      {liquidacionesSeleccionadas.map((liq) => (
                        <div
                          key={liq.id}
                          className="p-2 hover:bg-gray-50 flex justify-between"
                        >
                          <div className="text-sm">
                            <span className="font-medium">
                              {liq.consecutivo}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {formatearFecha(liq.fecha_liquidacion)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-emerald-600">
                            {formatearMoneda(liq.valor_total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  radius="sm"
                  variant="light"
                  onPress={cerrarModalFacturacionMultiple}
                >
                  Cancelar
                </Button>
                <Button
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  isLoading={loadingFacturar}
                  radius="sm"
                  startContent={
                    !loadingFacturar && <CheckCircleIcon className="h-4 w-4" />
                  }
                  onPress={procesarFacturacionMultiple}
                >
                  Facturar {liquidacionesSeleccionadas.length} Liquidaciones
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HistoricoLiquidaciones;
