"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { addToast } from "@heroui/toast";

import { useAuth } from "./AuthContext";

import { apiClient } from "@/config/apiClient";
import socketService from "@/services/socketService";

// Definiciones de tipos
export interface Conductor {
  id: string;
  nombre: string;
  apellido: string;
  numero_identificacion?: string;
  tipo_identificacion: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: Date;
  foto_url?: string;
  documentos?: Array<{
    categoria: string;
    s3_key: string;
    url?: string; // URL opcional para la foto
  }>;
}

export interface Empresa {
  id: string;
  nombre: string;
  nit: string;
}

export interface Vehiculo {
  id: string;
  placa: string;
  clase_vehiculo: string;
  marca: string;
  linea: string;
  color: string;
  modelo: string;
}

export interface SocketEventLog {
  eventName: string;
  data: any;
  timestamp: Date;
}

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

// Tipado para la respuesta de liquidaciones
export interface Liquidacion {
  id: string;
  consecutivo: string;
  fecha_liquidacion: string;
  valor_total: string;
  estado: "liquidado" | "aprobado" | "rechazada" | "facturado" | "anulada";
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
    cliente: {
      id: string;
      nombre: string;
      nit: string;
    };
    ServicioLiquidacion: {
      valor_liquidado: string;
    };
  }>;
}

// Interfaz para el contexto
interface ServiceContextType {
  // Datos
  servicios: ServicioConRelaciones[];
  liquidaciones: Liquidacion[];
  servicio: ServicioConRelaciones | null;
  municipios: Municipio[];
  conductores: Conductor[];
  vehiculos: Vehiculo[];
  empresas: Empresa[];
  loading: boolean;
  registrarServicio: (servicioData: CreateServicioDTO) => void;
  actualizarServicio: (
    id: string,
    servicioData: CreateServicioDTO,
  ) => Promise<ServicioConRelaciones>;
  actualizarEstadoServicio: (
    id: string,
    estado: EstadoServicio,
  ) => Promise<ServicioConRelaciones>;
  asignarPlanilla: (
    servicioId: string,
    numeroPlanilla: string,
  ) => Promise<ServicioConRelaciones>;
  obtenerServicio: (id: string) => Promise<ServicioConRelaciones | null>; // ✅ Agregar Promise
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  // Tracking de vehículos y servicios seleccionados
  vehicleTracking?: VehicleTracking | null;
  trackingError?: string;
  selectedServicio?: ServicioConRelaciones | null;
  servicioWithRoutes: ServicioConRelaciones | null;
  setServicioWithRoutes: React.Dispatch<
    React.SetStateAction<ServicioConRelaciones | null>
  >;
  selectServicio?: (servicio: ServicioConRelaciones) => void;
  setLiquidaciones: (liquidaciones: Liquidacion[]) => void;
  clearSelectedServicio: () => void;
  setSelectedServicio: React.Dispatch<
    React.SetStateAction<ServicioConRelaciones | null>
  >;

  // modalStates
  modalForm: boolean;
  modalTicket: boolean;
  modalPlanilla: boolean;
  modalLiquidar: boolean;
  servicioEditar: ServicioEditar;
  servicioTicket: ServicioTicket;
  servicioPlanilla: ServicioLiquidar;
  vehiculoCreado: Vehiculo | null;
  conductorCreado: Conductor | null;
  empresaCreado: Empresa | null;

  // handle Modals
  handleModalForm: (servicio?: ServicioConRelaciones | null) => void;
  handleModalTicket: (servicio?: ServicioConRelaciones | null) => void;
  handleModalPlanilla: (servicio?: ServicioConRelaciones | null) => void;
  handleModalLiquidar: () => void;

  // Propiedades para Socket.IO
  socketConnected: boolean;
  socketEventLogs: SocketEventLog[];
  clearSocketEventLogs: () => void;
  connectSocket?: (userId: string) => void;
  disconnectSocket?: () => void;
}

// Props para el provider
interface ServicesProviderContext {
  children: ReactNode;
}

export type EstadoServicio =
  | "solicitado"
  | "en_curso"
  | "planificado"
  | "realizado"
  | "cancelado"
  | "liquidado"
  | "planilla_asignada";

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
  proposito_servicio: string;
  fecha_solicitud: string;
  fecha_realizacion?: string;
  fecha_finalizacion?: string;
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
  routeDistance: string;
  routeDuration: number | null;
  numero_planilla: string;
  createdAt: Date;
  updatedAt: Date;
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
  proposito_servicio: string;
  fecha_solicitud: string | null;
  estado: EstadoServicio;
  fecha_realizacion: string | null;
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

// interfaces/vehiculo.interface.ts
export interface Vehiculo {
  id: string;
  placa: string;
  modelo: string;
  linea: string;
  marca: string;
  clase_vehiculo: string;
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
  es_creador: boolean; // Indica si el usuario actual es el creador del servicio
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
  id: string;
  nombre: string;
  nit?: string;
  representante?: string;
  paga_recargos: boolean;
  requiere_osi: boolean;
  cedula?: string;
  Telefono?: string;
  Direccion?: string;
  created_at?: Date;
  updated_at?: Date;
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
  proposito_servicio: string;
  fecha_solicitud: string;
  fecha_realizacion?: string;
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
  proposito_servicio?: string;
  fecha_solicitud?: string;
  fecha_realizacion?: string;
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
  proposito_servicio?: string;
  fecha_solicitud?: string;
  fecha_realizacion?: string;
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

interface LiquidacionErrorEvent {
  error: string;
  id: string;
}

// Crear el contexto
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Proveedor del contexto
export const ServicesProvider: React.FC<ServicesProviderContext> = ({
  children,
}) => {
  const [servicios, setServicios] = useState<ServicioConRelaciones[]>([]);
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [servicio, setServicio] = useState<ServicioConRelaciones | null>(null);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState(false);
  const [modalTicket, setModalTicket] = useState(false);
  const [modalPlanilla, setModalPlanilla] = useState(false);
  const [modalLiquidar, setModalLiquidar] = useState(false);
  const [servicioEditar, setServicioEditar] = useState<ServicioEditar>({
    servicio: null,
    isEditing: false,
  });
  const [servicioTicket, setServicioTicket] = useState<ServicioTicket>({
    servicio: null,
  });
  const [servicioPlanilla, setServicioPlanilla] = useState<ServicioTicket>({
    servicio: null,
  });
  const [vehiculoCreado, setVehiculoCreado] = useState<Vehiculo | null>(null);
  const [conductorCreado, setConductorCreado] = useState<Conductor | null>(
    null,
  );
  const [empresaCreado, setEmpresaCreado] = useState<Empresa | null>(null);

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
    async (id: string): Promise<ServicioConRelaciones | null> => {
      try {
        setLoading(true);
        setError(null);

        console.log(id);

        const response = await apiClient.get(`/api/servicios/${id}`);

        if (response.data.success) {
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

  const actualizarServicio = async (
    id: string,
    servicioData: CreateServicioDTO,
  ): Promise<ServicioConRelaciones> => {
    try {
      // Realizar la petición PUT al endpoint de servicios
      const response = await apiClient.put<ApiResponse<ServicioConRelaciones>>(
        `/api/servicios/${id}`,
        servicioData,
      );

      // Verificar si la operación fue exitosa
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // Si hay un mensaje de error específico, usarlo
        throw new Error(
          response.data.message || "Error al actualizar el servicio",
        );
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Error desconocido al actualizar el servicio");
      }
    }
  };

  const actualizarEstadoServicio = async (
    id: string,
    estado: EstadoServicio,
  ): Promise<ServicioConRelaciones> => {
    try {
      // Realizar la petición PATCH al endpoint de servicios
      const response = await apiClient.patch<
        ApiResponse<ServicioConRelaciones>
      >(`/api/servicios/${id}/estado`, { estado });

      // Verificar si la operación fue exitosa
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // Si hay un mensaje de error específico, usarlo
        throw new Error(
          response.data.message || "Error al actualizar el estado del servicio",
        );
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Error desconocido al actualizar el estado del servicio",
        );
      }
    }
  };

  const asignarPlanilla = async (
    servicioId: string,
    numeroPlanilla: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<
        ApiResponse<ServicioConRelaciones>
      >(`/api/servicios/${servicioId}/planilla`, {
        numero_planilla: numeroPlanilla,
      });

      // Verificar si la operación fue exitosa
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // Si hay un mensaje de error específico, usarlo
        throw new Error(
          response.data.message || "Error al asociar planilla al servicio",
        );
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Error desconocido al asociar planilla al servicio");
      }
    }
  };

  const handleModalForm = (servicio?: ServicioConRelaciones | null) => {
    // IMPORTANTE: SIEMPRE limpiar el servicio seleccionado, independientemente de si
    // el modal se está abriendo o cerrando. Esto evita problemas de referencia.
    clearSelectedServicio();

    // Si el modal se está abriendo (actualmente está cerrado)
    if (!modalForm) {
      // Configurar el servicio para edición si se proporcionó uno
      if (servicio) {
        setServicioEditar({
          servicio: servicio,
          isEditing: true,
        });
      } else {
        setServicioEditar({
          servicio: null,
          isEditing: false,
        });
      }
    }
    // Si el modal se está cerrando (actualmente está abierto)
    else {
      // Retraso para asegurar que la animación de cierre funcione correctamente
      setTimeout(() => {
        setServicioEditar({
          servicio: null,
          isEditing: false,
        });
      }, 300);
    }

    // Cambiar el estado del modal
    setModalForm(!modalForm);
  };

  const handleModalTicket = (servicio?: ServicioConRelaciones | null) => {
    // Cambiar el estado del modal
    if (!modalTicket) {
      // Configurar el servicio para edición si se proporcionó uno
      if (servicio) {
        setServicioTicket({
          servicio: servicio,
        });
        setModalTicket(!modalTicket);
      } else {
        setServicioTicket({
          servicio: null,
        });
        setModalTicket(false);
      }
    }
    // Si el modal se está cerrando (actualmente está abierto)
    else {
      // Retraso para asegurar que la animación de cierre funcione correctamente
      setTimeout(() => {
        setServicioTicket({
          servicio: null,
        });
        setModalTicket(false);
      }, 300);
    }
  };

  const handleModalPlanilla = (servicio?: ServicioConRelaciones | null) => {
    // Cambiar el estado del modal
    if (!modalPlanilla) {
      // Configurar el servicio para edición si se proporcionó uno
      if (servicio) {
        setServicioPlanilla({
          servicio: servicio,
        });
        setModalPlanilla(!modalPlanilla);
      } else {
        setServicioPlanilla({
          servicio: null,
        });
        setModalPlanilla(false);
      }
    }
    // Si el modal se está cerrando (actualmente está abierto)
    else {
      // Retraso para asegurar que la animación de cierre funcione correctamente
      setTimeout(() => {
        setServicioPlanilla({
          servicio: null,
        });
        setModalPlanilla(false);
      }, 300);
    }
  };

  const handleModalLiquidar = () => {
    setModalLiquidar(!modalLiquidar);
  };

  useEffect(() => {
    obtenerServicios();
    obtenerMunicipios();
    obtenerConductores();
    obtenerVehiculos();
    obtenerEmpresas();
  }, []);

  // Estado para rastreo de vehículos y servicios seleccionados
  const [vehicleTracking, setVehicleTracking] =
    useState<VehicleTracking | null>(null);
  const [trackingError, setTrackingError] = useState<string>("");
  const [selectedServicio, setSelectedServicio] =
    useState<ServicioConRelaciones | null>(null);
  const [servicioWithRoutes, setServicioWithRoutes] =
    useState<ServicioConRelaciones | null>(null);

  // Estado para Socket.IO
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [socketEventLogs, setSocketEventLogs] = useState<SocketEventLog[]>([]);
  const { user } = useAuth();

  // Seleccionar un servicio para mostrar detalles y tracking
  const selectServicio = useCallback(
    async (servicio: ServicioConRelaciones) => {
      setSelectedServicio(servicio);

      // Si el servicio está en_curso, intentar obtener tracking del vehículo
      if (servicio.estado === "en_curso" && servicio.vehiculo?.placa) {
        setTrackingError("");
        try {
          // Aquí se implementaría la lógica para obtener el tracking del vehículo
          // Por ahora dejamos esto como un placeholder
          setVehicleTracking(null);
        } catch (error) {
          console.error("Error al obtener tracking del vehículo:", error);
          setTrackingError("No se pudo obtener información del vehículo.");
        }
      } else {
        setVehicleTracking(null);
      }
    },
    [],
  );

  // Limpiar la selección de servicio
  const clearSelectedServicio = useCallback(() => {
    setSelectedServicio(null);
    setVehicleTracking(null);
    setTrackingError("");
  }, []);

  // Inicializar Socket.IO cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.id) {
      // Conectar socket
      socketService.connect(user.id);

      // Verificar conexión inicial y configurar manejo de eventos de conexión
      const checkConnection = () => {
        const isConnected = socketService.isConnected();

        setSocketConnected(isConnected);
      };

      // Verificar estado inicial
      checkConnection();

      // Manejar eventos de conexión
      const handleConnect = () => {
        setSocketConnected(true);
      };

      const handleDisconnect = () => {
        setSocketConnected(false);
        addToast({
          title: "Error",
          description: "Desconectado de actualizaciones en tiempo real",
          color: "danger",
        });
      };

      // Manejadores para eventos de servicios
      const handleServicioCreado = (data: ServicioConRelaciones) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:creado",
            data,
            timestamp: new Date(),
          },
        ]);

        // Añadir a la lista principal de servicios
        setServicios((prevServicios) => [data, ...prevServicios]);

        // Añadir a servicioWithRoutes si existe
        if (servicioWithRoutes) {
          setServicioWithRoutes(data);
        }

        addToast({
          title: "Nuevo servicio",
          description: `Se ha creado un nuevo servicio hacia ${data.destino_especifico || data.destino.nombre_municipio}`,
          color: "success",
        });
      };

      const handleServicioActualizado = (data: ServicioConRelaciones) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:actualizado",
            data,
            timestamp: new Date(),
          },
        ]);

        // Actualizar en la lista de servicios
        setServicios((prevServicios) =>
          prevServicios.map((s) => (s.id === data.id ? data : s)),
        );

        // Si es el servicio seleccionado actualmente, actualizarlo
        if (selectedServicio?.id === data.id) {
          setSelectedServicio(data);
        }

        // Actualizar en servicioWithRoutes si existe
        if (servicioWithRoutes) {
          setServicioWithRoutes(data);
        }

        addToast({
          title: "Servicio actualizado",
          description: `El servicio hacia ${data.destino_especifico} ha sido actualizado`,
          color: "primary",
        });
      };

      const handleServicioAsignado = (data: {
        servicio: ServicioConRelaciones;
        conductorId: string;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:asignado",
            data,
            timestamp: new Date(),
          },
        ]);

        // Solo mostrar notificación si es relevante para el conductor actual
        if (user.id === data.conductorId) {
          addToast({
            title: "Servicio asignado",
            description: `Se te ha asignado un servicio hacia ${data.servicio.destino_especifico}`,
            color: "success",
          });
        }
      };

      const handleServicioDesasignado = (data: {
        servicio: ServicioConRelaciones;
        conductorId: string;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:desasignado",
            data,
            timestamp: new Date(),
          },
        ]);

        // Solo mostrar notificación si es relevante para el conductor actual
        if (user.id === data.conductorId) {
          addToast({
            title: "Servicio retirado",
            description: `Ya no estás asignado al servicio hacia ${data.servicio.destino_especifico}`,
            color: "warning",
          });
        }
      };

      const handleServicioEliminado = (data: {
        id: string;
        conductorId?: string;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:eliminado",
            data,
            timestamp: new Date(),
          },
        ]);

        console.log(data);

        // Eliminar de la lista principal de servicios
        setServicios((prevServicios) =>
          prevServicios.filter((s) => s.id !== data.id),
        );

        // Si es el servicio seleccionado actualmente, limpiarlo
        if (selectedServicio?.id === data.id) {
          clearSelectedServicio();
        }

        // Notificación específica para el conductor si aplica
        if (data.conductorId && user.id === data.conductorId) {
          addToast({
            title: "Servicio eliminado",
            description: "Un servicio asignado a ti ha sido eliminado",
            color: "danger",
          });
        } else {
          addToast({
            title: "Servicio eliminado",
            description: "Se ha eliminado un servicio del sistema",
            color: "danger",
          });
        }
      };

      const handleServicioEstadoActualizado = (data: {
        servicio: ServicioConRelaciones;
        estadoAnterior: EstadoServicio;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:estado-actualizado",
            data,
            timestamp: new Date(),
          },
        ]);

        // Actualizar en la lista principal de servicios
        setServicios((prevServicios) =>
          prevServicios.map((s) =>
            s.id === data.servicio.id ? data.servicio : s,
          ),
        );

        // Si es el servicio seleccionado actualmente, actualizarlo
        if (selectedServicio?.id === data.servicio.id) {
          setSelectedServicio(data.servicio);
        }

        // Mensaje personalizado según el estado
        let mensaje = "";
        let color: "success" | "warning" | "primary" | "danger" = "primary";

        switch (data.servicio.estado) {
          case "en_curso":
            mensaje = `El servicio hacia ${data.servicio.destino_especifico} está en_curso`;
            color = "success";
            break;
          case "realizado":
            mensaje = `El servicio hacia ${data.servicio.destino_especifico} ha sido completado`;
            color = "success";
            break;
          case "cancelado":
            mensaje = `El servicio hacia ${data.servicio.destino_especifico} ha sido cancelado`;
            color = "danger";
            break;
          case "planificado":
            mensaje = `El servicio hacia ${data.servicio.destino_especifico} ha sido planificado`;
            color = "warning";
            break;
          default:
            mensaje = `El estado del servicio hacia ${data.servicio.destino_especifico} ha cambiado a ${data.servicio.estado}`;
        }

        addToast({
          title: "Estado de servicio actualizado",
          description: mensaje,
          color: color,
        });
      };

      const handlePlanillaAsignada = (data: {
        id: string;
        servicio: ServicioConRelaciones;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "servicio:numero-planilla-actualizado",
            data,
            timestamp: new Date(),
          },
        ]);

        // Actualizar en la lista de servicios
        setServicios((prevServicios) =>
          prevServicios.map((s) => (s.id === data.id ? data.servicio : s)),
        );

        // Si es el servicio seleccionado actualmente, actualizarlo
        if (selectedServicio?.id === data.id) {
          setSelectedServicio(data.servicio);
        }

        addToast({
          title: "Planilla asignada",
          description: `Al servicio ${data.id} se le ha asignado la planilla ${data.servicio.numero_planilla}`,
          color: "success",
        });
      };

      // Manejadores para eventos de liquidacion
      const handleLiquidacionAprobada = (data: {
        liquidacion: Liquidacion;
        estado: Liquidacion["estado"];
        id: string;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "liquidacion:estado-aprobado",
            data,
            timestamp: new Date(),
          },
        ]);

        if (data.estado === "aprobado") {
          const liquidacionesActualizado = liquidaciones.map((liquidacion) =>
            liquidacion.id === data.id ? data.liquidacion : liquidacion,
          );

          setLiquidaciones(liquidacionesActualizado);

          addToast({
            title: "Liquidación aprobada!",
            description: `Se ha aprobado la liquidación ${data.liquidacion.consecutivo}`,
            color: "success",
          });
        }
      };

      // Manejadores para eventos de liquidacion
      const handleLiquidacionRechazada = (data: {
        liquidacion: Liquidacion;
        estado: Liquidacion["estado"];
        id: string;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "liquidacion:estado-rechazada",
            data,
            timestamp: new Date(),
          },
        ]);

        if (data.estado === "rechazada") {
          const liquidacionesActualizado = liquidaciones.map((liquidacion) =>
            liquidacion.id === data.id ? data.liquidacion : liquidacion,
          );

          setLiquidaciones(liquidacionesActualizado);

          addToast({
            title: "Liquidación rechazada!",
            description: `Se ha rechazado la liquidación ${data.liquidacion.consecutivo}, revisa las observaciones para realizar las correcciones`,
            color: "danger",
          });
        }
      };

      // Manejadores para eventos de liquidacion
      const handleLiquidacionRegresaLiquidado = (data: {
        liquidacion: Liquidacion;
        estado: Liquidacion["estado"];
        id: string;
      }) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "liquidacion:estado-regresa-liquidado",
            data,
            timestamp: new Date(),
          },
        ]);

        if (data.estado === "liquidado") {
          const liquidacionesActualizado = liquidaciones.map((liquidacion) =>
            liquidacion.id === data.id ? data.liquidacion : liquidacion,
          );

          setLiquidaciones(liquidacionesActualizado);

          addToast({
            title: 'Liquidación regresada a estado "Liquidado"!',
            description: `Se ha regresado la liquidación ${data.liquidacion.consecutivo} a estado "Liquidado"`,
            color: "warning",
          });
        }
      };

      // Manejadores para eventos de empresa
      const handleEmpresaCreadaGlobal = (data: {
        usuarioId: string;
        usuarioNombre: string;
        empresa: Empresa;
      }) => {
        if (data.usuarioId === user.id) return;
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "empresa:creado-global",
            data,
            timestamp: new Date(),
          },
        ]);
        const { id, nombre, nit } = data.empresa;

        setEmpresas((prev) => [...prev, { id, nombre, nit }]);
        addToast({
          title: "Se acaba de realizar el registro de una nueva Empresa!",
          description: `${data.usuarioNombre} ha registrado la empresa: "${data.empresa.nombre}" con el NIT: "${data.empresa.nit}"`,
          color: "success",
        });
      };

      // Manejadores para eventos de empresa
      const handleEmpresaCreada = (data: Empresa) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "empresa:creado",
            data,
            timestamp: new Date(),
          },
        ]);
        const { id, nombre, nit } = data;

        const empresaCreada = {
          id,
          nombre,
          nit,
        };

        setEmpresas((prev) => [...prev, empresaCreada]);
        setEmpresaCreado(empresaCreada);
        addToast({
          title: "Acabas de registrar una nueva Empresa!",
          description: `Has registrado la empresa: "${data.nombre}" con el NIT: "${data.nit}"`,
          color: "success",
        });
      };

      // Manejadores para eventos de conductores - global
      const handleConductorCreadaGlobal = (data: {
        usuarioId: string;
        usuarioNombre: string;
        conductor: Conductor;
      }) => {
        if (data.usuarioId === user.id) return;
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "conductor:creado-global",
            data,
            timestamp: new Date(),
          },
        ]);
        const {
          id,
          nombre,
          apellido,
          numero_identificacion,
          telefono,
          tipo_identificacion,
        } = data.conductor;

        setConductores((prev) => [
          ...prev,
          {
            id,
            nombre,
            apellido,
            numero_identificacion,
            telefono,
            tipo_identificacion,
          },
        ]);
        addToast({
          title: "Se acaba de realizar el registro de un nuevo Conductor!",
          description: `${data.usuarioNombre} ha registrado el conductor: "${data.conductor.nombre} ${data.conductor.apellido}"`,
          color: "success",
        });
      };

      // Manejadores para eventos de conductores
      const handleConductorCreado = (data: Conductor) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "conductor:creado",
            data,
            timestamp: new Date(),
          },
        ]);

        const {
          id,
          nombre,
          apellido,
          numero_identificacion,
          telefono,
          tipo_identificacion,
        } = data;

        const conductorCreado = {
          id,
          nombre,
          apellido,
          numero_identificacion,
          telefono,
          tipo_identificacion,
        };

        setConductores((prev) => [...prev, conductorCreado]);
        setConductorCreado(conductorCreado);

        addToast({
          title: "Se acaba de realizar el registro de un nuevo Conductor!",
          description: `Se ha registrado el conductor: "${data.nombre} ${data.apellido}"`,
          color: "success",
        });
      };

      // Manejadores para eventos de vehiculos
      const handleVehiculoCreado = (data: Vehiculo) => {
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "vehiculo:creado",
            data,
            timestamp: new Date(),
          },
        ]);

        const { id, placa, marca, clase_vehiculo, linea, modelo, color } = data;

        const vehiculoCreado = {
          id,
          placa,
          marca,
          clase_vehiculo,
          linea,
          modelo,
          color,
        };

        setVehiculos((prev) => [...prev, vehiculoCreado]);

        setVehiculoCreado(vehiculoCreado);

        addToast({
          title: "Se acaba de realizar el registro de un nuevo Vehículo!",
          description: `Se ha registrado el vehículo: "${data.placa} - ${data.marca} - ${data.modelo}"`,
          color: "success",
        });
      };

      const handleVehiculoCreadaGlobal = (data: {
        usuarioId: string;
        usuarioNombre: string;
        vehiculo: Vehiculo;
      }) => {
        if (data.usuarioId === user.id) return;
        setSocketEventLogs((prev) => [
          ...prev,
          {
            eventName: "vehiculo:creado-global",
            data,
            timestamp: new Date(),
          },
        ]);
        const { id, placa, marca, clase_vehiculo, linea, modelo, color } =
          data.vehiculo;

        setVehiculos((prev) => [
          ...prev,
          { id, placa, marca, clase_vehiculo, linea, modelo, color },
        ]);
        addToast({
          title: "Se acaba de realizar el registro de una nueva vehiculo!",
          description: `${data.usuarioNombre} ha registrado la vehiculo: "${data.vehiculo.placa} - ${data.vehiculo.marca} - ${data.vehiculo.modelo}"`,
          color: "success",
        });
      };

      const handleLiquidacionError = (data: LiquidacionErrorEvent) => {
        // Verificar si el error corresponde a la liquidación actual
        if (data.id) {
          addToast({
            title: "Error en la liquidación",
            description: data.error,
            color: "danger",
          });
        }
      };

      // Registrar manejadores de eventos de conexión
      socketService.on("connect", handleConnect);
      socketService.on("disconnect", handleDisconnect);

      // Registrar manejadores de eventos de servicios
      socketService.on("servicio:creado", handleServicioCreado);
      socketService.on("servicio:actualizado", handleServicioActualizado);
      socketService.on("servicio:asignado", handleServicioAsignado);
      socketService.on("servicio:desasignado", handleServicioDesasignado);
      socketService.on("servicio:eliminado", handleServicioEliminado);
      socketService.on(
        "servicio:estado-actualizado",
        handleServicioEstadoActualizado,
      );
      socketService.on(
        "servicio:numero-planilla-actualizado",
        handlePlanillaAsignada,
      );
      socketService.on(
        "liquidacion:estado-aprobado",
        handleLiquidacionAprobada,
      );
      socketService.on(
        "liquidacion:estado-rechazada",
        handleLiquidacionRechazada,
      );
      socketService.on(
        "liquidacion:estado-regresa-liquidado",
        handleLiquidacionRegresaLiquidado,
      );
      socketService.on("empresa:creado-global", handleEmpresaCreadaGlobal);
      socketService.on("empresa:creado", handleEmpresaCreada);
      socketService.on("conductor:creado-global", handleConductorCreadaGlobal);
      socketService.on("conductor:creado", handleConductorCreado);
      socketService.on("vehiculo:creado-global", handleVehiculoCreadaGlobal);
      socketService.on("vehiculo:creado", handleVehiculoCreado);
      socketService.on("liquidacion:error", handleLiquidacionError);

      return () => {
        // Limpiar al desmontar
        socketService.off("connect");
        socketService.off("disconnect");

        // Limpiar manejadores de eventos de servicios
        socketService.off("servicio:creado");
        socketService.off("servicio:actualizado");
        socketService.off("servicio:asignado");
        socketService.off("servicio:desasignado");
        socketService.off("servicio:eliminado");
        socketService.off("servicio:estado-actualizado");
        socketService.off("servicio:numero-planilla-actualizado");
        socketService.off("liquidacion:estado-aprobado");
        socketService.off("liquidacion:estado-rechazada");
        socketService.off("liquidacion:estado-regresa-liquidado");
        socketService.off("empresa:creado-global");
        socketService.off("empresa:creado");
        socketService.off("conductor:creado-global");
        socketService.off("conductor:creado");
        socketService.off("vehiculo:creado-global");
        socketService.off("vehiculo:creado");
        socketService.off("liquidacion:error");
      };
    }
  }, [user?.id, selectedServicio, clearSelectedServicio]);

  // Función para limpiar el registro de eventos de socket
  const clearSocketEventLogs = useCallback(() => {
    setSocketEventLogs([]);
  }, []);

  // Valor del contexto
  const value: ServiceContextType = {
    servicios,
    liquidaciones,
    servicio,
    servicioTicket,
    servicioPlanilla,
    vehiculoCreado,
    empresaCreado,
    conductorCreado,
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
    servicioWithRoutes,
    setServicioWithRoutes,
    selectServicio,
    setLiquidaciones,
    clearSelectedServicio,
    setSelectedServicio,

    // Modals state
    modalForm,
    modalTicket,
    modalPlanilla,
    modalLiquidar,
    servicioEditar,

    // handles Modal
    handleModalForm,
    handleModalTicket,
    handleModalPlanilla,
    handleModalLiquidar,
    actualizarServicio,
    actualizarEstadoServicio,
    asignarPlanilla,

    // Socket properties
    socketConnected,
    socketEventLogs,
    clearSocketEventLogs,
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
