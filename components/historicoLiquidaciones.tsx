import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell
} from "@heroui/table";
import { 
  Pagination
} from "@heroui/pagination";
import { 
  Spinner
} from "@heroui/spinner";
import { 
  Chip
} from "@heroui/chip";

import { 
  Button
} from "@heroui/button";
import { 
  Input
} from "@heroui/input";
import { 
  Tooltip
} from "@heroui/tooltip";
import { 
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { 
  EyeIcon, 
  SearchIcon, 
  FileTextIcon, 
  FilterIcon, 
  CalendarIcon,
  ChevronDownIcon
} from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiClient } from '@/config/apiClient';
import { useRouter } from 'next/navigation';

// Tipado para la respuesta de liquidaciones
interface Liquidacion {
  id: string;
  consecutivo: string;
  fecha_liquidacion: string;
  valor_total: string;
  estado: 'pendiente' | 'procesada' | 'anulada' | 'liquidado';
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

const HistoricoLiquidaciones = () => {
  // Estados para la tabla y paginación
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  
  const router = useRouter();

  // Cargar datos
  const fetchLiquidaciones = async () => {
    setLoading(true);
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (filtroEstado) {
        params.append('estado', filtroEstado);
      }
      
      if (fechaInicio && fechaFin) {
        params.append('desde', fechaInicio);
        params.append('hasta', fechaFin);
      }
      
      // Realizar petición
      const response = await apiClient.get<LiquidacionesResponse>(`/api/liquidaciones_servicios/${params.toString()}`);
      
      setLiquidaciones(response.data.liquidaciones);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error('Error al cargar liquidaciones:', err);
      setError('Error al cargar las liquidaciones. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando cambien los filtros o la página
  useEffect(() => {
    fetchLiquidaciones();
  }, [page, filtroEstado]);

  // Manejar búsqueda
  const handleSearch = () => {
    setPage(1); // Resetear a la primera página
    fetchLiquidaciones();
  };

  // Manejar búsqueda por tecla Enter
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Manejar filtro de fechas
  const aplicarFiltroFechas = () => {
    setPage(1);
    fetchLiquidaciones();
  };

  // Resetear filtros
  const resetearFiltros = () => {
    setSearchTerm('');
    setFiltroEstado(null);
    setFechaInicio('');
    setFechaFin('');
    setPage(1);
    fetchLiquidaciones();
  };

  // Ver detalles de una liquidación
  const verDetalleLiquidacion = (id: string) => {
    router(`/liquidaciones_servicios/${id}`);
  };

  // Generar reporte PDF
  const generarReportePDF = (id: string) => {
    window.open(`/api/liquidaciones_servicios/${id}/pdf`, '_blank');
  };

  // Renderizar chip de estado
  const renderEstadoChip = (estado: string) => {
    let color;
    
    switch (estado) {
      case 'pendiente':
        color = 'warning';
        break;
      case 'procesada':
        color = 'success';
        break;
      case 'anulada':
        color = 'danger';
        break;
      case 'liquidado':
        color = 'success';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip color={color} variant="flat" size="sm">
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Chip>
    );
  };

  // Formatear valor como moneda
  const formatearMoneda = (valor: string) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(parseFloat(valor));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Histórico de Liquidaciones</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              type="text"
              placeholder="Buscar por consecutivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
          
          {/* Filtro por estado */}
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="bordered" 
                  className="w-full justify-between"
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                >
                  <div className="flex items-center">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    {filtroEstado ? 
                      filtroEstado.charAt(0).toUpperCase() + filtroEstado.slice(1) : 
                      "Filtrar por estado"}
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Estados" 
                onAction={(key) => {
                  setFiltroEstado(key === 'todos' ? null : key as string);
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
          
          {/* Filtro por fecha */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                type="date"
                placeholder="Desde"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                type="date"
                placeholder="Hasta"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-2">
            <Button color="primary" className="flex-1" onPress={aplicarFiltroFechas}>
              Aplicar Filtros
            </Button>
            <Button variant="light" className="flex-1" onPress={resetearFiltros}>
              Limpiar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabla de liquidaciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table aria-label="Tabla de liquidaciones">
          <TableHeader>
            <TableColumn>CONSECUTIVO</TableColumn>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>USUARIO</TableColumn>
            <TableColumn>SERVICIOS</TableColumn>
            <TableColumn>VALOR TOTAL</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex justify-center p-4">
                    <Spinner size="lg" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-center p-4 text-red-500">{error}</div>
                </TableCell>
              </TableRow>
            ) : liquidaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-center p-4 text-gray-500">
                    No se encontraron liquidaciones con los filtros seleccionados
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              liquidaciones.map((liquidacion) => (
                <TableRow key={liquidacion.id}>
                  <TableCell>
                    <div className="font-semibold">{liquidacion.consecutivo}</div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(liquidacion.fecha_liquidacion), 'dd MMM yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{liquidacion.user.nombre}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">{liquidacion.servicios.length}</span>
                      <Tooltip content="Ver servicios incluidos">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => verDetalleLiquidacion(liquidacion.id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {formatearMoneda(liquidacion.valor_total)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderEstadoChip(liquidacion.estado)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Tooltip content="Ver detalles">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => verDetalleLiquidacion(liquidacion.id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Generar reporte">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => generarReportePDF(liquidacion.id)}
                        >
                          <FileTextIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Paginación */}
        <div className="flex justify-center p-4">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricoLiquidaciones;