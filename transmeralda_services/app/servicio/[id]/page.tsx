"use client"

import React, { useState, useEffect, useCallback } from 'react';
import OptimizedMapComponent from '@/components/optimizedMapComponent';
import { useParams } from 'next/navigation';
import { useService } from '@/context/serviceContext';

// Componente padre que gestiona la obtención de datos del servicio
const ServicioDetailView = ({ servicioId }: { servicioId: string }) => {

  const WIALON_API_TOKEN = process.env.NEXT_PUBLIC_WIALON_API_TOKEN || '';

  const params = useParams<{ id: string }>()
  const { obtenerServicio } = useService()
  const [token] = useState(WIALON_API_TOKEN);
  const [loading, setLoading] = useState(true);
  const [servicioWithRoutes, setServicioWithRoutes] = useState(null);
  const [vehicleTracking, setVehicleTracking] = useState(null);
  const [trackingError, setTrackingError] = useState(null);
  const [wialonVehicles, setWialonVehicles] = useState<WialonVehicle[]>([]);
  const [isLoadingWialon, setIsLoadingWialon] = useState(false);


  // Función para obtener datos del servicio
  const fetchServicioData = async (id: string) => {
    setLoading(true);
    try {
      // Aquí iría tu lógica para obtener los datos
      await obtenerServicio(id);
      fetchRouteGeometry()
      setLoading(false);
    } catch (error) {
      console.error('Error fetching servicio:', error);
      setLoading(false);
    }
  };

  // Función para llamar a la API de Wialon
  const callWialonApi = useCallback(
    async (sessionIdOrToken: string, service: string, params: any) => {
      const isLoginCall = service === "token/login";
      const payload = {
        token: isLoginCall ? null : sessionIdOrToken,
        service,
        params,
      };

      if (isLoginCall) {
        payload.params = { ...params, token: sessionIdOrToken };
      }

      try {
        const response = await axios.post("/api/wialon-api", payload);
        if (response.data && response.data.error) {
          throw new Error(
            `Error Wialon API (${response.data.error}): ${response.data.reason || service}`,
          );
        }
        return response.data;
      } catch (err) {
        console.error(`Error llamando a ${service} via /api/wialon-api:`, err);
        throw err;
      }
    },
    [],
  );

  const fetchRouteGeometry = async () => {
    setLoading(true);
    try {
      if (!servicio) {
        setLoading(false);
        return;
      }
      const origenCoords = [servicio.origen.latitud, servicio.origen.longitud]
      const destinoCoords = [servicio.destino.latitud, servicio.destino.longitud]

      try {
        // Intentar obtener la geometría real de la ruta desde OSRM
        // Usando la IP local del servidor OSRM
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origenCoords[1]},${origenCoords[0]};${destinoCoords[1]},${destinoCoords[0]}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          throw new Error("Error al obtener la ruta");
        }

        const data = await response.json();

        if (
          data.code !== "Ok" ||
          !data.routes ||
          data.routes.length === 0
        ) {
          throw new Error("No se encontró una ruta");
        }

        // Extraer la geometría de la ruta y convertirla al formato [lat, lng]
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        setServicioWithRoutes({
          ...servicio,
          origenCoords,
          destinoCoords,
          geometry: coordinates,
          routeDistance: (route.distance / 1000).toFixed(1),
          routeDuration: Math.round(route.duration / 60),
        });
      } catch (error) {
        console.warn("Error al obtener ruta detallada:", error.message);

        // Si hay un error, usar línea recta entre origen y destino
        setServicioWithRoutes({
          ...servicio,
          origenCoords,
          destinoCoords,
          geometry: [origenCoords, destinoCoords],
          routeDistance: servicio.distancia_km,
          routeDuration: null,
        });
      }
    } catch (error) {
      console.error("Error al procesar el servicio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Inicializar y obtener datos de Wialon
  useEffect(() => {
    let isMounted = true;
    setIsLoadingWialon(true);

    const initWialon = async () => {
      if (!token || !servicioWithRoutes || servicioWithRoutes.estado !== 'en curso') {
        setIsLoadingWialon(false);
        return;
      }

      try {
        // 1. Login a Wialon
        const loginData = await callWialonApi(token, "token/login", {});
        if (!loginData?.eid) {
          throw new Error("Login fallido: No se obtuvo Session ID");
        }

        if (!isMounted) return;
        const sid = loginData.eid;

        // 2. Obtener lista de vehículos
        const vehiclesData = await callWialonApi(
          sid,
          "core/search_items",
          {
            spec: {
              itemsType: "avl_unit",
              propName: "sys_name",
              propValueMask: "*",
              sortType: "sys_name",
            },
            force: 1,
            flags: 1,
            from: 0,
            to: 1000,
          },
        );

        if (!isMounted) return;

        if (!vehiclesData?.items || !Array.isArray(vehiclesData.items)) {
          throw new Error("No se pudieron obtener los vehículos");
        }

        const vehicles: WialonVehicle[] = vehiclesData.items;
        setWialonVehicles(vehicles);

        // 3. Buscar vehículo por placa
        if (servicioWithRoutes.vehiculo_id && servicioWithRoutes.vehiculo.placa) {
          const placa = servicioWithRoutes.vehiculo.placa;
          const foundVehicle = vehicles.find(v =>
            v.nm.includes(placa) ||
            v.nm.toLowerCase() === placa.toLowerCase()
          );

          if (foundVehicle) {
            // 4. Obtener posición del vehículo
            const vehicleData = await callWialonApi(
              sid,
              "core/search_item",
              {
                id: foundVehicle.id,
                flags: 1025
              }
            );

            if (!isMounted) return;

            if (vehicleData?.item?.pos) {
              const { pos } = vehicleData.item;
              setVehicleTracking({
                id: foundVehicle.id,
                name: foundVehicle.nm,
                position: pos,
                lastUpdate: new Date(pos.t * 1000)
              });
            } else {
              setTrackingError("El vehículo no está transmitiendo su posición");
            }
          } else {
            setTrackingError(`Vehículo con placa ${placa} no encontrado en la flota de wialon`);
          }
        } else {
          setTrackingError("No hay información de placa del vehículo");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error en la integración con Wialon:", error);
          setTrackingError(error instanceof Error ? error.message : "Error desconocido");
        }
      } finally {
        if (isMounted) {
          setIsLoadingWialon(false);
        }
      }
    };

    if (servicioWithRoutes && servicioWithRoutes.estado === 'en curso') {
      initWialon();
    } else {
      setIsLoadingWialon(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token, callWialonApi, servicioWithRoutes]);

  // // Función para obtener datos de tracking
  // const fetchTrackingData = async (id) => {
  //   try {
  //     // Aquí iría tu lógica para obtener tracking
  //     const response = await fetchTracking(id);
  //     setVehicleTracking(response);
  //     setTrackingError(null);
  //   } catch (error) {
  //     setVehicleTracking(null);
  //     setTrackingError("No se pudo obtener la ubicación del vehículo");
  //   }
  // };

  // Efectos para cargar datos cuando cambia el ID
  useEffect(() => {
    if (params.id) {
      fetchServicioData(params.id);
    }
  }, [params.id]);

  // Efectos para cargar tracking cuando el servicio está en curso
  useEffect(() => {
    if (servicioWithRoutes?.estado === 'en curso') {
      fetchTrackingData(servicioWithRoutes.id);

      // Configurar intervalo para actualizar tracking
      const trackingInterval = setInterval(() => {
        fetchTrackingData(servicioWithRoutes.id);
      }, 30000); // Actualizar cada 30 segundos

      return () => clearInterval(trackingInterval);
    }
  }, [servicioWithRoutes]);

  // Funciones auxiliares que necesita el mapa
  const handleServicioClick = (servicio) => {
    // Acción al hacer click en el servicio
    console.log('Servicio clicked:', servicio);
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'en_curso': case 'en curso': return 'En curso';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  const getServiceTypeText = (tipo) => {
    switch (tipo) {
      case 'carga': return 'Carga';
      case 'pasajeros': return 'Pasajeros';
      default: return tipo;
    }
  };

  const createServiceIcon = (color, type) => {
    // Implementar lógica para crear iconos personalizados
    return L.divIcon({
      className: `service-marker-${type}`,
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${type === 'origin' ? 'A' : 'B'}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const createVehicleIcon = () => {
    // Implementar lógica para crear un icono de vehículo
    return L.divIcon({
      className: 'vehicle-marker',
      html: '<div style="background-color: #2196F3; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;"><i class="fas fa-truck"></i></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="h-screen w-full">
      {servicioWithRoutes && (
        <OptimizedMapComponent
          servicioId={servicioId}
          servicioWithRoutes={servicioWithRoutes}
          vehicleTracking={vehicleTracking}
          trackingError={trackingError}
          handleServicioClick={handleServicioClick}
          getStatusText={getStatusText}
          getServiceTypeText={getServiceTypeText}
          createServiceIcon={createServiceIcon}
          createVehicleIcon={createVehicleIcon}
        />
      )}
    </div>
  );
};

export default ServicioDetailView;