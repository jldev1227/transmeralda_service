"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Time } from "@internationalized/date"; // Ajusta esta importación según la biblioteca que uses
import { LatLngExpression, LatLngTuple } from "leaflet";

import { apiClient } from "@/config/apiClient";

// Definiciones de tipos
export interface Conductor {
  id: string;
  nombre: string;
  apellido: string;
  numero_identificacion: string;
  salario_base: number;
  email: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  NIT: string;
  Nombre: string;
  Representante: string;
  Cedula: string;
  Telefono: string;
  Direccion: string;
}

export interface Vehiculo {
  id: string;
  placa: string;
  modelo: string;
  linea: string;
  marca: string;
}

export interface SocketEventLog {
  eventName: string;
  data: any;
  timestamp: Date;
}

// Interfaz para el contexto
interface ServiceContextType {
  // Datos
  servicios: ServicioConRelaciones[];
  servicio: Servicio | null;
  municipios: Municipio[];
  conductores: Conductor[];
  vehiculos: Vehiculo[];
  empresas: Empresa[];
  loading: boolean;
  registrarServicio: (servicioData: CreateServicioDTO) => void;
  obtenerServicio: (id: string) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  // Tracking de vehículos y servicios seleccionados
  vehicleTracking?: VehicleTracking | null;
  trackingError?: string;
  selectedServicio?: ServicioConRelaciones | null;
  serviciosWithRoutes?: ServicioConRelaciones[];
  setServiciosWithRoutes?: React.Dispatch<React.SetStateAction<ServicioConRelaciones[]>>;
  selectServicio?: (servicio: ServicioConRelaciones) => void;
  clearSelectedServicio?: () => void;
  setSelectedServicio?: React.Dispatch<React.SetStateAction<ServicioConRelaciones | null>>;

  // Nuevas propiedades para Socket.IO
  socketConnected?: boolean;
  socketEventLogs?: SocketEventLog[];
  clearSocketEventLogs?: () => void;
}

// Props para el provider
interface ServicesProviderContext {
  children: ReactNode;
}

export type EstadoServicio =
  | "solicitado"
  | "en curso"
  | "planificado"
  | "realizado"
  | "cancelado";

// Interface para el modelo Servicio
export interface Servicio {
  id?: string; // UUID
  origen_id: string; // UUID referencia a municipio
  destino_id: string; // UUID referencia a municipio
  origen_especifico: string;
  destino_especifico: string;
  conductor_id: string; // UUID referencia a user
  vehiculo_id: string;
  cliente_id: string;
  estado: EstadoServicio;
  tipo_servicio: string;
  fecha_inicio: Date | string;
  fecha_fin?: Date | string;
  hora_salida: string;
  distancia_km: number;
  valor: number;
  observaciones?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  origen: Municipio;
  destino: Municipio;
  origenCoords: LatLngTuple;
  destinoCoords: LatLngTuple;
  origen_latitud: number | null;
  origen_longitud: number | null;
  destino_latitud: number | null;
  destino_longitud: number | null;
  geometry: LatLngExpression[];
  routeDistance: string | number;
  routeDuration: number | null;
}

export interface CreateServicioDTO {
  origen_id: string;
  destino_id: string;
  origen_especifico: string;
  destino_especifico: string;
  origen_latitud: number | null;
  origen_longitud: number | null;
  destino_latitud: number | null;
  destino_longitud: number | null;
  conductor_id: string;
  vehiculo_id: string;
  cliente_id: string;
  tipo_servicio: string;
  fecha_inicio: Date | string;
  estado: EstadoServicio;
  hora_salida: Time | null;
  fecha_fin?: Date | string;
  valor: number;
  observaciones?: string;
}

export interface Municipio {
  id: string; // UUID
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

export interface Conductor {
  id: string; // UUID
  nombre: string;
  email: string;
  telefono?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// interfaces/vehiculo.interface.ts
export interface Vehiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  anio: number;
  capacidad: number;
  tipo?: string;
  estado?: string;
  kilometraje?: number;
  ultima_revision?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Interface para Servicio con relaciones cargadas
export interface ServicioConRelaciones extends Servicio {
  origen: Municipio;
  destino: Municipio;
  conductor: Conductor;
  vehiculo: Vehiculo;
  cliente: Cliente;
}

export interface VehicleTracking {
  id: number;
  name: string;
  flags: number; // 1025
  position: Position;
  lastUpdate: Date;
  item: {
    cls: number; // 2
    id: number; // 24616231
    lmsg: {
      t: number; // Timestamp (1745587111)
      f: number; // Flag (1)
      tp: string; // Tipo ('ud')
      pos: Position; // Objeto de posición
      lc: number; // 0
    };
    mu: number; // 3
    nm: string; // "EYX108"
    pos: Position; // Objeto de posición
    uacl: number; // 19327369763
  };
}

export interface Position {
  c: number; // 0 (posiblemente counter)
  f: number; // 1 (posiblemente flag)
  lc: number; // 0 (posiblemente last count)
  s: number; // 0 (posiblemente status)
  sc: number; // 0 (posiblemente status code)
  t: number; // Timestamp (1745587111)
  x: number; // Longitud (-71.6594783)
  y: number; // Latitud (3.77588)
  z: number; // Altitud (0)
}

export interface Cliente {
  id: number;
  Nombre: string;
  NIT?: string;
  Representante?: string;
  Cedula?: string;
  Telefono?: string;
  Direccion?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Interface para crear un nuevo servicio
export interface CrearServicioDTO {
  origen_id: string;
  destino_id: string;
  origen_especifico: string;
  destino_especifico: string;
  conductor_id: string;
  vehiculo_id: number;
  cliente_id: number;
  estado?: EstadoServicio;
  tipo_servicio: string;
  fecha_inicio: Date | string;
  fecha_fin?: Date | string;
  distancia_km: number;
  valor: number;
  observaciones?: string;
}

// Interface para actualizar un servicio existente (todos los campos opcionales)
export interface ActualizarServicioDTO {
  origen_id?: string;
  destino_id?: string;
  origen_especifico?: string;
  destino_especifico?: string;
  conductor_id?: string;
  vehiculo_id?: number;
  cliente_id?: number;
  estado?: EstadoServicio;
  tipo_servicio?: string;
  fecha_inicio?: Date | string;
  fecha_fin?: Date | string;
  distancia_km?: number;
  valor?: number;
  observaciones?: string;
}

// Interface para cambiar solo el estado de un servicio
export interface CambiarEstadoDTO {
  estado: EstadoServicio;
}

// Interface para parámetros de búsqueda
export interface BuscarServiciosParams {
  estado?: EstadoServicio;
  tipo_servicio?: string;
  fecha_inicio?: Date | string;
  fecha_fin?: Date | string;
  conductor_id?: string;
  cliente_id?: number;
  origen_id?: string;
  destino_id?: string;
  pagina?: number;
  limite?: number;
}

// Interface para respuesta de API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Crear el contexto
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Proveedor del contexto
export const ServicesProvider: React.FC<ServicesProviderContext> = ({
  children,
}) => {
  const [servicios, setServicios] = useState<ServicioConRelaciones[]>([]);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las servicios
  const obtenerServicios = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/servicios");

      if (response.data.success) {
        setServicios(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Error al obtener liquidaciones",
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas las municipios
  const obtenerMunicipios = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/municipios");

      if (response.data.success) {
        setMunicipios(response.data.data);
      } else {
        throw new Error(response.data.message || "Error al obtener municipios");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas las conductores
  const obtenerConductores = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/conductores/basicos");

      if (response.data.success) {
        setConductores(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Error al obtener conductores",
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas los vehiculos
  const obtenerVehiculos = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/flota/basicos");

      if (response.data.success) {
        setVehiculos(response.data.data);
      } else {
        throw new Error(response.data.message || "Error al obtener vehiculos");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas los empresas
  const obtenerEmpresas = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/empresas/basicos");

      if (response.data.success) {
        setEmpresas(response.data.data);
      } else {
        throw new Error(response.data.message || "Error al obtener empresas");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Dentro de tu hook/context useService
  const obtenerServicio = useCallback(
    async (id: string): Promise<Servicio | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get(`/api/servicios/${id}`);

        if (response.data.success) {
          console.log(response);
          setServicio(response.data.data);

          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Error al obtener la liquidación",
          );
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor",
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const registrarServicio = async (
    servicioData: CreateServicioDTO,
  ): Promise<ServicioConRelaciones> => {
    try {
      // Realizar la petición POST al endpoint de servicios
      const response = await apiClient.post<ApiResponse<ServicioConRelaciones>>(
        "/api/servicios",
        servicioData,
      );

      // Verificar si la operación fue exitosa
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // Si hay un mensaje de error específico, usarlo
        throw new Error(
          response.data.message || "Error al registrar el servicio",
        );
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Error desconocido al registrar el servicio");
      }
    }
  };

  useEffect(() => {
    obtenerServicios();
    obtenerMunicipios();
    obtenerConductores();
    obtenerVehiculos();
    obtenerEmpresas();
  }, []);

  // Estado para rastreo de vehículos y servicios seleccionados
  const [vehicleTracking, setVehicleTracking] = useState<VehicleTracking | null>(null);
  const [trackingError, setTrackingError] = useState<string>('');
  const [selectedServicio, setSelectedServicio] = useState<ServicioConRelaciones | null>(null);
  const [serviciosWithRoutes, setServiciosWithRoutes] = useState<ServicioConRelaciones[]>([]);

  // Seleccionar un servicio para mostrar detalles y tracking
  const selectServicio = useCallback(async (servicio: ServicioConRelaciones) => {
    setSelectedServicio(servicio);
    
    // Si el servicio está en curso, intentar obtener tracking del vehículo
    if (servicio.estado === 'en curso' && servicio.vehiculo?.placa) {
      setTrackingError('');
      try {
        // Aquí se implementaría la lógica para obtener el tracking del vehículo
        // Por ahora dejamos esto como un placeholder
        setVehicleTracking(null);
      } catch (error) {
        console.error("Error al obtener tracking del vehículo:", error);
        setTrackingError('No se pudo obtener información del vehículo.');
      }
    } else {
      setVehicleTracking(null);
    }
  }, []);

  // Limpiar la selección de servicio
  const clearSelectedServicio = useCallback(() => {
    setSelectedServicio(null);
    setVehicleTracking(null);
    setTrackingError('');
  }, []);

  // Valor del contexto
  const value: ServiceContextType = {
    servicios,
    servicio,
    municipios,
    conductores,
    vehiculos,
    empresas,
    loading,
    registrarServicio,
    obtenerServicio,
    setError,
    // Añadir estados y métodos de tracking
    vehicleTracking,
    trackingError,
    selectedServicio,
    serviciosWithRoutes,
    setServiciosWithRoutes,
    selectServicio,
    clearSelectedServicio,
    setSelectedServicio
  };

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useService = (): ServiceContextType => {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error("useService debe ser usado dentro de un ServicesProvider");
  }

  return context;
};

export default ServiceContext;
