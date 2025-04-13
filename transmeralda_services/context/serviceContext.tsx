"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import socketService from "@/services/socketService";

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
  servicios: []
  // Nuevas propiedades para Socket.IO
  socketConnected?: boolean;
  socketEventLogs?: SocketEventLog[];
  clearSocketEventLogs?: () => void;
}

// Props para el provider
interface ServicesProviderContext {
  children: ReactNode;
}

// Crear el contexto
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);


const serviciosDefault = [
  {
    "id": "srv-zsszv9qak",
    "origen_id": "05004",
    "destino_id": "05002",
    "origen_especifico": "ABRIAQUÍ, ANTIOQUIA - Terminal de transporte",
    "destino_especifico": "ABEJORRAL, ANTIOQUIA - Centro comercial",
    "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "vehiculo_id": 3,
    "cliente_id": 13,
    "estado": "PROGRAMADO",
    "tipo_servicio": "MENSAJERÍA",
    "fecha_inicio": "2025-04-03T08:23:41.333Z",
    "fecha_fin": "2025-04-04T06:23:41.333Z",
    "distancia_km": 31,
    "valor": 4110047,
    "observaciones": null,
    "createdAt": "2025-04-12T22:13:28.890Z",
    "updatedAt": "2025-04-12T22:13:28.890Z"
  },
  {
    "id": "srv-3tpux8r78",
    "origen_id": "05004",
    "destino_id": "05030",
    "origen_especifico": "ABRIAQUÍ, ANTIOQUIA - Zona industrial",
    "destino_especifico": "AMAGÁ, ANTIOQUIA - Parque empresarial",
    "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "vehiculo_id": 4,
    "cliente_id": 13,
    "estado": "COMPLETADO",
    "tipo_servicio": "TRANSPORTE_PERSONAL",
    "fecha_inicio": "2025-04-27T22:44:26.173Z",
    "fecha_fin": "2025-04-28T07:44:26.173Z",
    "distancia_km": 316,
    "valor": 1618902,
    "observaciones": "Servicio con paradas intermedias",
    "createdAt": "2025-04-12T22:13:28.890Z",
    "updatedAt": "2025-04-12T22:13:28.890Z"
  },
  {
    "id": "srv-1rfhmi2wq",
    "origen_id": "05001",
    "destino_id": "05021",
    "origen_especifico": "MEDELLÍN, ANTIOQUIA - Terminal de transporte",
    "destino_especifico": "ALEJANDRÍA, ANTIOQUIA - Parque empresarial",
    "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "vehiculo_id": 3,
    "cliente_id": 11,
    "estado": "EN_CURSO",
    "tipo_servicio": "TRANSPORTE_PERSONAL",
    "fecha_inicio": "2025-01-23T07:08:46.532Z",
    "fecha_fin": "2025-01-23T11:08:46.532Z",
    "distancia_km": 47,
    "valor": 3171705,
    "observaciones": null,
    "createdAt": "2025-04-12T22:13:28.890Z",
    "updatedAt": "2025-04-12T22:13:28.890Z"
  },
  {
    "id": "srv-jgn8kml5o",
    "origen_id": "05030",
    "destino_id": "05001",
    "origen_especifico": "AMAGÁ, ANTIOQUIA - Terminal de transporte",
    "destino_especifico": "MEDELLÍN, ANTIOQUIA - Parque empresarial",
    "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "vehiculo_id": 3,
    "cliente_id": 11,
    "estado": "PROGRAMADO",
    "tipo_servicio": "TRASLADO_AEROPUERTO",
    "fecha_inicio": "2025-04-06T11:42:24.827Z",
    "fecha_fin": "2025-04-06T23:42:24.827Z",
    "distancia_km": 41,
    "valor": 1565263,
    "observaciones": null,
    "createdAt": "2025-04-12T22:13:28.890Z",
    "updatedAt": "2025-04-12T22:13:28.890Z"
  },
  {
    "id": "srv-k6dhm9djm",
    "origen_id": "05002",
    "destino_id": "05001",
    "origen_especifico": "ABEJORRAL, ANTIOQUIA - Zona industrial",
    "destino_especifico": "MEDELLÍN, ANTIOQUIA - Centro comercial",
    "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "vehiculo_id": 3,
    "cliente_id": 13,
    "estado": "PROGRAMADO",
    "tipo_servicio": "MENSAJERÍA",
    "fecha_inicio": "2025-04-13T15:56:34.363Z",
    "fecha_fin": "2025-04-14T09:56:34.363Z",
    "distancia_km": 395,
    "valor": 797406,
    "observaciones": "Servicio con paradas intermedias",
    "createdAt": "2025-04-12T22:13:28.890Z",
    "updatedAt": "2025-04-12T22:13:28.890Z"
  },
  {
    "id": "srv-k6dhm9djm",
    "origen_id": "05002",
    "destino_id": "05001",
    "origen_especifico": "ABEJORRAL, ANTIOQUIA - Zona industrial",
    "destino_especifico": "MEDELLÍN, ANTIOQUIA - Centro comercial",
    "conductor_id": "5e846d84-c6a6-4e25-96d1-88c3dbf7307e",
    "vehiculo_id": 3,
    "cliente_id": 13,
    "estado": "CANCELADO",
    "tipo_servicio": "MENSAJERÍA",
    "fecha_inicio": "2025-04-13T15:56:34.363Z",
    "fecha_fin": "2025-04-14T09:56:34.363Z",
    "distancia_km": 395,
    "valor": 797406,
    "observaciones": "Servicio con paradas intermedias",
    "createdAt": "2025-04-12T22:13:28.890Z",
    "updatedAt": "2025-04-12T22:13:28.890Z"
  }
]

// Proveedor del contexto
export const ServicesProvider: React.FC<ServicesProviderContext> = ({ children }) => {
  const [servicios, setServicios] = useState(serviciosDefault)
  // Valor del contexto
  const value: ServiceContextType = {
    servicios
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