"use client"

import React, { useState, useEffect } from 'react';
import { Servicio, VehicleTracking } from '@/context/serviceContext';
import { formatDistanceToNow, format, differenceInMinutes, differenceInHours, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ServiceDetailPanelProps {
  servicioWithRoutes: Servicio;
  vehicleTracking: VehicleTracking | null;
  isLoadingRoute: boolean;
}

const ServiceDetailPanel = ({ 
  servicioWithRoutes, 
  vehicleTracking, 
  isLoadingRoute 
}: ServiceDetailPanelProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState<{hours: number, minutes: number}>({ hours: 0, minutes: 0 });
  const [kmRecorridos, setKmRecorridos] = useState<number>(0);
  
  // Formatear fecha y hora
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };
  
  const formatTime = (dateString: string) => {
    if (!dateString) return 'No disponible';
    return format(new Date(dateString), 'HH:mm');
  };
  
  // Actualizar hora actual cada minuto para cálculos de tiempo en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // actualiza cada minuto
    
    return () => clearInterval(timer);
  }, []);
  
  // Calcular tiempo transcurrido desde el inicio del servicio
  useEffect(() => {
    if (!servicioWithRoutes) return;
    
    // Definir hourOut como las 6 AM de la fecha de inicio
    const fechaInicio = new Date(servicioWithRoutes.fecha_inicio);
    const hourOut = new Date(fechaInicio);
    hourOut.setHours(6, 0, 0, 0); // 6:00 AM
    
    // Si el servicio está en curso, calcular tiempo transcurrido
    if (servicioWithRoutes.estado === 'en curso') {
      const totalMinutes = differenceInMinutes(currentTime, hourOut);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      setElapsedTime({ hours, minutes });
      
      // Calcular kilómetros recorridos (estimación basada en la distancia total y tiempo transcurrido)
      if (servicioWithRoutes.routeDistance && servicioWithRoutes.routeDuration) {
        const totalDistance = parseFloat(servicioWithRoutes.routeDistance);
        const totalDuration = servicioWithRoutes.routeDuration; // en minutos
        
        // Estimación simple: distancia proporcional al tiempo transcurrido
        // con un factor de corrección para evitar sobreestimaciones
        const factor = Math.min(totalMinutes / totalDuration, 1);
        const distanciaRecorrida = totalDistance * factor;
        
        setKmRecorridos(Math.round(distanciaRecorrida * 10) / 10); // Redondear a 1 decimal
      }
    }
  }, [servicioWithRoutes, currentTime]);
  
  // Estado para controlar la expansión de las secciones
  const [expandedSections, setExpandedSections] = useState({
    servicio: true,
    vehiculo: true,
    conductor: true,
    cliente: true
  });
  
  // Función para alternar la expansión de una sección
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  if (!servicioWithRoutes) {
    return <div className="h-screen bg-white p-4">Cargando información...</div>;
  }
  
  // Determinar el color del estado
  const getStatusColor = () => {
    switch (servicioWithRoutes.estado) {
      case 'completado': return 'bg-green-500';
      case 'en curso': return 'bg-blue-500';
      case 'planificado': return 'bg-yellow-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Obtener texto del tipo de servicio
  const getTipoServicioText = () => {
    switch (servicioWithRoutes.tipo_servicio) {
      case 'carga': return 'Carga';
      case 'pasajeros': return 'Pasajeros';
      case 'herramienta': return 'Transporte de herramientas';
      default: return servicioWithRoutes.tipo_servicio;
    }
  };
  
  return (
    <div className="bg-white shadow-lg">
      {/* Cabecera con ID y estado */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Servicio #{servicioWithRoutes.id.substring(0, 8)}</h2>
            <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${getStatusColor()}`}>
              {servicioWithRoutes.estado.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Creado: {format(new Date(servicioWithRoutes.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
      </div>
      
      {/* Panel de información principal */}
      <div className="px-4 py-3">
        {/* Sección de datos del servicio */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('servicio')}
          >
            <h3 className="text-md font-semibold text-gray-700">Información del servicio</h3>
            <span>{expandedSections.servicio ? '▼' : '►'}</span>
          </div>
          
          {expandedSections.servicio && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <p className="text-xs text-gray-500">Tipo de servicio</p>
                  <p className="text-sm font-medium">{getTipoServicioText()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha programada</p>
                  <p className="text-sm font-medium">{formatDate(servicioWithRoutes.fecha_inicio)}</p>
                </div>
              </div>
              
              <div className="mb-2">
                <p className="text-xs text-gray-500">Origen</p>
                <p className="text-sm font-medium">{servicioWithRoutes.origen?.nombre_municipio}, {servicioWithRoutes.origen?.nombre_departamento}</p>
                <p className="text-xs text-gray-600">{servicioWithRoutes.origen_especifico}</p>
              </div>
              
              <div className="mb-2">
                <p className="text-xs text-gray-500">Destino</p>
                <p className="text-sm font-medium">{servicioWithRoutes.destino?.nombre_municipio}, {servicioWithRoutes.destino?.nombre_departamento}</p>
                <p className="text-xs text-gray-600">{servicioWithRoutes.destino_especifico}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Distancia total</p>
                  <p className="text-sm font-medium">{servicioWithRoutes.routeDistance} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duración estimada</p>
                  <p className="text-sm font-medium">
                    {Math.floor(servicioWithRoutes.routeDuration / 60)}h {servicioWithRoutes.routeDuration % 60}m
                  </p>
                </div>
              </div>
              
              {servicioWithRoutes.observaciones && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Observaciones</p>
                  <p className="text-sm">{servicioWithRoutes.observaciones}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Información de progreso (Solo para servicios en curso) */}
        {servicioWithRoutes.estado === 'en curso' && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Progreso del servicio</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <p className="text-xs text-blue-700">Tiempo transcurrido</p>
                <p className="text-sm font-medium text-blue-900">
                  {elapsedTime.hours}h {elapsedTime.minutes}m
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Distancia recorrida (est.)</p>
                <p className="text-sm font-medium text-blue-900">{kmRecorridos} km</p>
              </div>
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min((kmRecorridos / parseFloat(servicioWithRoutes.routeDistance)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {Math.round((kmRecorridos / parseFloat(servicioWithRoutes.routeDistance)) * 100)}% completado
            </p>
          </div>
        )}
        
        {/* Sección de vehículo */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('vehiculo')}
          >
            <h3 className="text-md font-semibold text-gray-700">Vehículo</h3>
            <span>{expandedSections.vehiculo ? '▼' : '►'}</span>
          </div>
          
          {expandedSections.vehiculo && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Placa</p>
                  <p className="text-sm font-medium">{servicioWithRoutes.vehiculo?.placa || 'No asignado'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Modelo</p>
                  <p className="text-sm font-medium">{servicioWithRoutes.vehiculo?.modelo || 'N/A'}</p>
                </div>
              </div>
              
              {vehicleTracking && (
                <div className="mt-3 bg-green-50 p-2 rounded-md">
                  <p className="text-xs font-medium text-green-800">Seguimiento en tiempo real</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-green-700">Velocidad</p>
                      <p className="text-sm font-medium text-green-900">
                        {vehicleTracking.position?.s || 0} km/h
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Última actualización</p>
                      <p className="text-xs font-medium text-green-900">
                        {format(vehicleTracking.lastUpdate, 'HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Sección de conductor */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('conductor')}
          >
            <h3 className="text-md font-semibold text-gray-700">Conductor</h3>
            <span>{expandedSections.conductor ? '▼' : '►'}</span>
          </div>
          
          {expandedSections.conductor && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200">
              <p className="text-xs text-gray-500">Nombre</p>
              <p className="text-sm font-medium">{servicioWithRoutes.conductor?.nombre || 'No asignado'}</p>
              <p className="text-xs text-gray-500 mt-2">ID</p>
              <p className="text-sm font-medium">{servicioWithRoutes.conductor_id || 'N/A'}</p>
            </div>
          )}
        </div>
        
        {/* Sección de cliente */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('cliente')}
          >
            <h3 className="text-md font-semibold text-gray-700">Cliente</h3>
            <span>{expandedSections.cliente ? '▼' : '►'}</span>
          </div>
          
          {expandedSections.cliente && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200">
              <p className="text-xs text-gray-500">Nombre</p>
              <p className="text-sm font-medium">{servicioWithRoutes.cliente?.Nombre || 'No disponible'}</p>
              
              {servicioWithRoutes.cliente?.NIT && (
                <>
                  <p className="text-xs text-gray-500 mt-2">NIT</p>
                  <p className="text-sm font-medium">{servicioWithRoutes.cliente.NIT}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPanel;