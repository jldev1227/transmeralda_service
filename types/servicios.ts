import { ReactNode } from "react";

import { Liquidacion } from "@/context/serviceContext";

// ==================== TIPOS BASE ====================

// Coordenadas y posición
export type LatLngTuple = [number, number];
export type LatLngExpression = LatLngTuple | { lat: number; lng: number };

// Estados de servicio
export type EstadoServicio =
  | "solicitado"
  | "en_curso"
  | "planificado"
  | "realizado"
  | "cancelado"
  | "liquidado"
  | "planilla_asignada";

// Propósitos de servicio
export type PropositoServicio = "personal" | "personal y herramienta";

// Estados de liquidación
export type EstadoLiquidacion =
  | "liquidado"
  | "aprobado"
  | "rechazada"
  | "facturado"
  | "anulada";

// Tipos de identificación
export type TipoIdentificacion = "CC" | "CE" | "TI" | "PA" | "RC" | "NIT";

// Tipos de operación histórica
export type TipoOperacion = "creacion" | "actualizacion" | "eliminacion";

// ==================== INTERFACES PRINCIPALES ====================

// Municipio
export interface Municipio {
  id: string;
  codigo_departamento: number;
  nombre_departamento: string;
  codigo_municipio: number;
  nombre_municipio: string;
  tipo: string;
  longitud: number;
  latitud: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Conductor
export interface Conductor {
  id: string;
  nombre: string;
  apellido: string;
  numero_identificacion?: string;
  tipo_identificacion: TipoIdentificacion;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: Date | string;
  foto_url?: string;
  estado?: "activo" | "inactivo" | "suspendido";
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Vehículo
export interface Vehiculo {
  id: string;
  placa: string;
  clase_vehiculo: string;
  marca: string;
  linea: string;
  color: string;
  modelo: string;
  tipo?: string;
  estado?: "activo" | "inactivo" | "mantenimiento";
  kilometraje?: number;
  ultima_revision?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Cliente/Empresa
export interface Cliente {
  id: string;
  nombre: string;
  nit?: string;
  representante?: string;
  paga_recargos: boolean;
  requiere_osi: boolean;
  cedula?: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  estado?: "activo" | "inactivo";
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Alias para Cliente (para compatibilidad)
export interface Empresa extends Cliente {}

// Usuario
export interface User {
  id: string;
  nombre: string;
  correo: string;
  email?: string;
  telefono?: string;
  rol?: string;
  estado?: "activo" | "inactivo";
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Servicio base
export interface Servicio {
  id: string;
  origen_id: string;
  destino_id: string;
  origen_especifico?: string;
  destino_especifico?: string;
  conductor_id?: string;
  vehiculo_id?: string;
  cliente_id: string;
  estado: EstadoServicio;
  proposito_servicio: PropositoServicio;
  fecha_solicitud: Date | string;
  fecha_realizacion?: Date | string;
  fecha_finalizacion?: Date | string;
  origen_latitud?: number;
  origen_longitud?: number;
  destino_latitud?: number;
  destino_longitud?: number;
  valor: number;
  numero_planilla?: string;
  observaciones?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Campos calculados/virtuales
  distancia_km?: number;
  hora_salida?: string;
  origenCoords?: LatLngTuple;
  destinoCoords?: LatLngTuple;
  geometry?: LatLngExpression[];
  routeDistance?: string;
  routeDuration?: number;
}

// Servicio con relaciones cargadas
export interface ServicioConRelaciones extends Servicio {
  origen: Municipio;
  destino: Municipio;
  conductor?: Conductor;
  vehiculo?: Vehiculo;
  cliente: Cliente;
  es_creador?: boolean;
  creador_id?: string;
}

// Histórico de servicios
export interface ServicioHistorico {
  id: string;
  servicio_id: string;
  usuario_id: string;
  campo_modificado: string;
  valor_anterior?: string;
  valor_nuevo: string;
  tipo_operacion: TipoOperacion;
  fecha_modificacion: Date | string;
  ip_usuario?: string;
  navegador_usuario?: string;
  detalles?: Record<string, any>;
  created_at?: Date | string;
  updated_at?: Date | string;

  // Relaciones
  servicio?: Servicio;
  usuario?: User;
}

// ==================== LIQUIDACIONES ====================

// Liquidación de servicio
export interface LiquidacionServicio {
  id: string;
  consecutivo: string;
  fecha_liquidacion: Date | string;
  valor_total: number;
  estado: EstadoLiquidacion;
  observaciones?: string;
  usuario_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  // Relaciones
  user?: User;
  servicios?: ServicioLiquidacion[];
}

// Relación many-to-many entre servicios y liquidaciones
export interface ServicioLiquidacion {
  id?: string;
  servicio_id: string;
  liquidacion_id: string;
  valor_liquidado: number;
  created_at?: Date | string;
  updated_at?: Date | string;

  // Relaciones
  servicio?: Servicio;
  liquidacion?: LiquidacionServicio;
}

// ==================== DTOs Y PAYLOADS ====================

// DTO para crear servicio
export interface CreateServicioDTO {
  origen_id: string;
  destino_id: string;
  origen_especifico?: string;
  destino_especifico?: string;
  origen_latitud?: number;
  origen_longitud?: number;
  destino_latitud?: number;
  destino_longitud?: number;
  conductor_id?: string;
  vehiculo_id?: string;
  cliente_id: string;
  proposito_servicio: PropositoServicio;
  fecha_solicitud: string | Date;
  estado?: EstadoServicio;
  fecha_realizacion?: string | Date;
  valor: number;
  observaciones?: string;
}

// DTO para actualizar servicio
export interface UpdateServicioDTO {
  origen_id?: string;
  destino_id?: string;
  origen_especifico?: string;
  destino_especifico?: string;
  origen_latitud?: number;
  origen_longitud?: number;
  destino_latitud?: number;
  destino_longitud?: number;
  conductor_id?: string;
  vehiculo_id?: string;
  cliente_id?: string;
  estado?: EstadoServicio;
  proposito_servicio?: PropositoServicio;
  fecha_solicitud?: string | Date;
  fecha_realizacion?: string | Date;
  fecha_finalizacion?: string | Date;
  valor?: number;
  numero_planilla?: string;
  observaciones?: string;
}

// DTO para cambiar estado
export interface CambiarEstadoDTO {
  estado: EstadoServicio;
  observaciones?: string;
}

// DTO para asignar planilla
export interface AsignarPlanillaDTO {
  numero_planilla: string;
  observaciones?: string;
}

// DTO para crear liquidación
export interface CreateLiquidacionDTO {
  servicios_ids: string[];
  observaciones?: string;
  fecha_liquidacion?: string | Date;
}

// ==================== PARÁMETROS DE BÚSQUEDA ====================

export interface BuscarServiciosParams {
  estado?: EstadoServicio | EstadoServicio[];
  proposito_servicio?: PropositoServicio;
  fecha_solicitud_desde?: string | Date;
  fecha_solicitud_hasta?: string | Date;
  fecha_realizacion_desde?: string | Date;
  fecha_realizacion_hasta?: string | Date;
  conductor_id?: string;
  vehiculo_id?: string;
  cliente_id?: string;
  origen_id?: string;
  destino_id?: string;
  valor_min?: number;
  valor_max?: number;
  numero_planilla?: string;
  es_creador?: boolean;
  pagina?: number;
  limite?: number;
  ordenar_por?:
    | "fecha_solicitud"
    | "fecha_realizacion"
    | "valor"
    | "created_at";
  orden?: "ASC" | "DESC";
  busqueda?: string; // Búsqueda general
}

export interface BuscarLiquidacionesParams {
  estado?: EstadoLiquidacion | EstadoLiquidacion[];
  fecha_desde?: string | Date;
  fecha_hasta?: string | Date;
  usuario_id?: string;
  consecutivo?: string;
  pagina?: number;
  limite?: number;
  ordenar_por?: "fecha_liquidacion" | "valor_total" | "created_at";
  orden?: "ASC" | "DESC";
}

// ==================== RESPUESTAS DE API ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
  value?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ==================== TRACKING Y POSICIÓN ====================

export interface Position {
  c: number; // Counter
  f: number; // Flag
  lc: number; // Last count
  s: number; // Status
  sc: number; // Status code
  t: number; // Timestamp
  x: number; // Longitud
  y: number; // Latitud
  z: number; // Altitud
}

export interface VehicleTracking {
  id: number;
  name: string;
  flags: number;
  position: Position;
  lastUpdate: Date;
  item: {
    cls: number;
    id: number;
    lmsg: {
      t: number;
      f: number;
      tp: string;
      pos: Position;
      lc: number;
    };
    mu: number;
    nm: string;
    pos: Position;
    uacl: number;
  };
}

// ==================== SOCKET Y EVENTOS ====================

export interface SocketEventLog {
  eventName: string;
  data: any;
  timestamp: Date;
}

export interface SocketEvent<T = any> {
  event: string;
  data: T;
  timestamp?: Date;
  userId?: string;
}

// ==================== ESTADOS DE MODAL ====================

export interface ServicioEditar {
  servicio: ServicioConRelaciones | null;
  isEditing: boolean;
}

export interface ServicioTicket {
  servicio: ServicioConRelaciones | null;
}

export interface ServicioLiquidar {
  servicio: ServicioConRelaciones | null;
}

export interface ServicioPlanilla {
  servicio: ServicioConRelaciones | null;
}

// ==================== CONTEXTO DE SERVICIOS ====================

export interface ServiceContextType {
  // Datos principales
  servicios: ServicioConRelaciones[];
  liquidaciones: Liquidacion[];
  servicio: ServicioConRelaciones | null;
  municipios: Municipio[];
  conductores: Conductor[];
  vehiculos: Vehiculo[];
  empresas: Empresa[];

  // Estados
  loading: boolean;
  error: string | null;

  // Métodos principales
  registrarServicio: (
    servicioData: CreateServicioDTO,
  ) => Promise<ServicioConRelaciones>;
  actualizarServicio: (
    id: string,
    servicioData: UpdateServicioDTO,
  ) => Promise<ServicioConRelaciones>;
  actualizarEstadoServicio: (
    id: string,
    estado: EstadoServicio,
  ) => Promise<ServicioConRelaciones>;
  asignarPlanilla: (
    servicioId: string,
    numeroPlanilla: string,
  ) => Promise<ServicioConRelaciones>;
  obtenerServicio: (id: string) => Promise<ServicioConRelaciones>;
  eliminarServicio: (id: string) => Promise<void>;
  obtenerServicios: (
    params?: BuscarServiciosParams,
  ) => Promise<ServicioConRelaciones[]>;

  // Liquidaciones
  crearLiquidacion: (datos: CreateLiquidacionDTO) => Promise<Liquidacion>;
  obtenerLiquidaciones: (
    params?: BuscarLiquidacionesParams,
  ) => Promise<Liquidacion[]>;
  setLiquidaciones: (liquidaciones: Liquidacion[]) => void;

  // Utilidades
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  clearError: () => void;
  refetchServicios: () => Promise<void>;

  // Tracking de vehículos
  vehicleTracking?: VehicleTracking | null;
  trackingError?: string;
  selectedServicio?: ServicioConRelaciones | null;
  serviciosWithRoutes?: ServicioConRelaciones[];
  setServiciosWithRoutes?: React.Dispatch<
    React.SetStateAction<ServicioConRelaciones[]>
  >;
  selectServicio?: (servicio: ServicioConRelaciones) => void;
  clearSelectedServicio: () => void;
  setSelectedServicio: React.Dispatch<
    React.SetStateAction<ServicioConRelaciones | null>
  >;

  // Estados de modales
  modalForm: boolean;
  modalTicket: boolean;
  modalPlanilla: boolean;
  modalLiquidar: boolean;
  servicioEditar: ServicioEditar;
  servicioTicket: ServicioTicket;
  servicioPlanilla: ServicioPlanilla;

  // Manejadores de modales
  handleModalForm: (servicio?: ServicioConRelaciones | null) => void;
  handleModalTicket: (servicio?: ServicioConRelaciones | null) => void;
  handleModalPlanilla: (servicio?: ServicioConRelaciones | null) => void;
  handleModalLiquidar: () => void;

  // Socket.IO
  socketConnected: boolean;
  socketEventLogs: SocketEventLog[];
  clearSocketEventLogs: () => void;
  connectSocket?: (userId: string) => void;
  disconnectSocket?: () => void;
}

// Props del provider
export interface ServicesProviderProps {
  children: ReactNode;
}

// ==================== ESTADÍSTICAS Y GRÁFICOS ====================

export interface EstadisticaServicio {
  estado: string;
  cantidad: number;
  valor: number;
  color?: string;
}

export interface EstadisticaMunicipio {
  municipio: string;
  municipio_completo: string;
  servicios: number;
  valor_total: number;
}

export interface EstadisticaConductor {
  conductor: string;
  conductor_completo: string;
  servicios: number;
  realizados: number;
  valor_total: number;
  identificacion?: string;
  eficiencia: number;
}

export interface EstadisticaVehiculo {
  vehiculo: string;
  vehiculo_completo: string;
  servicios: number;
  valor_total: number;
  placa: string;
  marca?: string;
  modelo?: string;
}

export interface EstadisticaRuta {
  ruta: string;
  ruta_completa: string;
  frecuencia: number;
  valor_promedio: number;
}

export interface EstadisticaEmpresa {
  empresa: string;
  empresa_completa: string;
  total: number;
  realizados: number;
  cancelados: number;
  valor_total: number;
  eficiencia: number;
}

export interface TendenciaTemporal {
  fecha: string;
  fecha_completa: string;
  solicitados: number;
  realizados: number;
  valor_total: number;
}

export interface DatosGraficos {
  estados: EstadisticaServicio[];
  municipios: EstadisticaMunicipio[];
  conductores: EstadisticaConductor[];
  vehiculos: EstadisticaVehiculo[];
  rutas: EstadisticaRuta[];
  empresas: EstadisticaEmpresa[];
  tendencias: TendenciaTemporal[];
}

// ==================== EVENTOS DE ERROR ====================

export interface LiquidacionErrorEvent {
  error: string;
  id: string;
  details?: any;
}

export interface ServicioErrorEvent {
  error: string;
  servicioId?: string;
  details?: any;
}

// ==================== FILTROS Y ORDENAMIENTO ====================

export interface FiltroServicio {
  campo: keyof ServicioConRelaciones;
  valor: any;
  operador?:
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "in"
    | "between";
}

export interface OrdenamientoServicio {
  campo: keyof ServicioConRelaciones;
  direccion: "ASC" | "DESC";
}

// ==================== CONFIGURACIÓN ====================

export interface ConfiguracionApp {
  itemsPorPagina: number;
  tiempoRefresh: number;
  habilitarSocket: boolean;
  mostrarNotificaciones: boolean;
  formatoMoneda: string;
  zonaHoraria: string;
}

// ==================== EXPORTACIONES ADICIONALES ====================

// Re-exportar tipos comunes
export type { ReactNode } from "react";

// Tipos de utilidad
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Tipos para formularios
export type ServicioFormData = Omit<CreateServicioDTO, "fecha_solicitud"> & {
  fecha_solicitud: Date;
};

// Tipos para respuestas específicas
export type ServiciosResponse = ApiResponse<ServicioConRelaciones[]>;
export type ServicioResponse = ApiResponse<ServicioConRelaciones>;
export type LiquidacionesResponse = ApiResponse<Liquidacion[]>;
export type LiquidacionResponse = ApiResponse<Liquidacion>;

// ==================== CONSTANTES DE TIPOS ====================

export const ESTADOS_SERVICIO: EstadoServicio[] = [
  "solicitado",
  "en_curso",
  "planificado",
  "realizado",
  "cancelado",
  "liquidado",
  "planilla_asignada",
];

export const PROPOSITOS_SERVICIO: PropositoServicio[] = [
  "personal",
  "personal y herramienta",
];

export const ESTADOS_LIQUIDACION: EstadoLiquidacion[] = [
  "liquidado",
  "aprobado",
  "rechazada",
  "facturado",
  "anulada",
];

export const TIPOS_IDENTIFICACION: TipoIdentificacion[] = [
  "CC",
  "CE",
  "TI",
  "PA",
  "RC",
  "NIT",
];
