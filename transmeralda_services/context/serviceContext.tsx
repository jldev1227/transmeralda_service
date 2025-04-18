"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  servicios: [];
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


// Proveedor del contexto
export const ServicesProvider: React.FC<ServicesProviderContext> = ({
  children,
}) => {
  const [servicios, setServicios] = useState([]);
  // Valor del contexto
  const value: ServiceContextType = {
    servicios,
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
