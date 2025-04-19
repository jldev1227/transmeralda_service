"use client";
import { apiClient } from "@/config/apiClient";
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

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
  servicios: Servicio[];
  servicio: Servicio | null;
  municipios: Municipio[]
  conductores: Conductor[]
  vehiculos: Vehiculo[]
  empresas: Empresa[]
  registrarServicio: (servicioData: CrearServicioDTO) => void;
  obtenerServicio: (id: string) => void
  setError: React.Dispatch<React.SetStateAction<string | null>>

  // Nuevas propiedades para Socket.IO
  socketConnected?: boolean;
  socketEventLogs?: SocketEventLog[];
  clearSocketEventLogs?: () => void;
}

// Props para el provider
interface ServicesProviderContext {
  children: ReactNode;
}

export type EstadoServicio = 'solicitado' | 'en curso' | 'completado' | 'planificado' | 'realizado' | 'cancelado';

// Interface para el modelo Servicio
export interface Servicio {
  id: string; // UUID
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
  distancia_km: number;
  valor: number;
  observaciones?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
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
  origen?: Municipio;
  destino?: Municipio;
  conductor?: Conductor;
  vehiculo?: Vehiculo;
  cliente?: Cliente;
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
  const [servicios, setServicios] = useState<Servicio[]>([]);
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
        console.log(response)
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
        throw new Error(
          response.data.message || "Error al obtener municipios",
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
        throw new Error(
          response.data.message || "Error al obtener vehiculos",
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

  // Obtener todas los empresas
  const obtenerEmpresas = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/empresas/basicos");

      if (response.data.success) {
        setEmpresas(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Error al obtener empresas",
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

  // Obtener todas las servicios
  const obtenerServicio = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/servicios/${id}`);

      console.log(id)
      console.log(response)
      if (response.data.success) {
        console.log(response)
        setServicio(response.data.data);
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

  const registrarServicio = async (servicioData: CrearServicioDTO): Promise<ServicioConRelaciones> => {
    try {
      // Realizar la petición POST al endpoint de servicios
      const response = await apiClient.post<ApiResponse<ServicioConRelaciones>>('/api/servicios', servicioData);

      // Verificar si la operación fue exitosa
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // Si hay un mensaje de error específico, usarlo
        throw new Error(response.data.message || 'Error al registrar el servicio');
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error desconocido al registrar el servicio');
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

  // Valor del contexto
  const value: ServiceContextType = {
    servicios,
    servicio,
    municipios,
    conductores,
    vehiculos,
    empresas,
    registrarServicio,
    obtenerServicio,
    setError
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
