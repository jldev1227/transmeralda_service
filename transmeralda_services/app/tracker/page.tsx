"use client"

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix para el icono de Leaflet
// En un proyecto real, deberías importar estas imágenes correctamente
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Interfaces
interface Vehicle {
    id: number;
    nm: string;
    pos?: {
        x: number; // longitud
        y: number; // latitud
        s: number; // velocidad
        c: number; // rumbo
        t: number; // timestamp
    };
    mileage?: number;
}

interface WialonResponse {
    eid: string; // Token de sesión
    [key: string]: any;
}

interface VehiclePosition {
    item: {
        pos: {
            x: number;
            y: number;
            s: number;
            c: number;
            t: number;
        };
        lmsg: {
            p: {
                mileage: number;
                [key: string]: any;
            };
            [key: string]: any;
        };
        [key: string]: any;
    };
    [key: string]: any;
}

// Componente para centrar el mapa en los vehículos
const MapUpdater: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
    const map = useMap();

    useEffect(() => {
        if (vehicles.length > 0) {
            const bounds = L.latLngBounds(vehicles.filter(v => v.pos).map(v => [v.pos!.y, v.pos!.x]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [vehicles, map]);

    return null;
};

const WialonVehicleTracker: React.FC = () => {
    // El token de inicio de sesión lo pasarías como variable de entorno o prop
    const [token] = useState<string>("00d90c3f86ef574df0f12b5f400c7a33AAA96DFD8739493724497F05A8DED1147F41AC86");
    const [sessionId, setSessionId] = useState<string>("0426cbafae4f9e5d640485ba20af7140");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

    const baseUrl = "/api/wialon-proxy";

    // Iniciar sesión y obtener el token de sesión (eid/sid)
    useEffect(() => {
        // Iniciar sesión y obtener el token de sesión (eid/sid)
        const login = async () => {
            try {
                setLoading(true);
                const response = await axios.post(baseUrl, {
                    svc: 'token/login',
                    params: { token }
                });

                if (response.data && response.data.eid) {
                    setSessionId(response.data.eid);
                } else {
                    throw new Error('Error al iniciar sesión: No se pudo obtener el token de sesión');
                }
            } catch (err) {
                setError(`Error al iniciar sesión: ${err instanceof Error ? err.message : 'Error desconocido'}`);
            } finally {
                setLoading(false);
            }
        };

        if (token && !sessionId) {
            login();
        }
    }, [token, sessionId]);

    // Obtener la lista de vehículos
    useEffect(() => {
        const fetchVehicles = async () => {
            if (!sessionId) return;

            console.log(sessionId)
            try {
                setLoading(true);
                const response = await axios.post(baseUrl, {
                    svc: 'core/search_items',
                    params: {
                        spec: {
                            itemsType: 'avl_unit',
                            propName: 'sys_name',
                            propValueMask: '*',
                            sortType: 'sys_name'
                        },
                        force: 1,
                        flags: 1,
                        from: 0,
                        to: 0
                    },
                    sid: sessionId
                });

                if (response.data && response.data.items) {
                    setVehicles(response.data.items);
                } else {
                    throw new Error('No se pudieron obtener los vehículos');
                }
            } catch (err) {
                setError(`Error al obtener vehículos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchVehicles();
        }
    }, [sessionId]);

// Obtener la posición de cada vehículo
useEffect(() => {
    const fetchVehiclePositions = async () => {
        if (!sessionId || vehicles.length === 0) return;

        const updatedVehicles = [...vehicles];

        console.log(updatedVehicles);

        for (const vehicle of updatedVehicles) {
            try {
                const response = await axios.post(baseUrl, {
                    svc: 'core/search_item',
                    params: {
                        id: vehicle.id,
                        flags: 1025
                    },
                    sid: sessionId
                });

                console.log(response);

                if (response.data && response.data.item) {
                    const { pos, lmsg } = response.data.item;
                    vehicle.pos = pos;
                    vehicle.mileage = lmsg?.p?.mileage ? lmsg.p.mileage / 1000 : undefined; // Convertir a km
                }
            } catch (err) {
                console.error(`Error al obtener posición del vehículo ${vehicle.nm}:`, err);
            }
        }

        setVehicles(updatedVehicles);
    };

    if (sessionId && vehicles.length > 0) {
        fetchVehiclePositions();

        // Configurar actualización periódica
        const interval = setInterval(fetchVehiclePositions, 30000); // Actualizar cada 30 segundos
        return () => clearInterval(interval);
    }
}, [sessionId, vehicles.length]);

// Refresca la posición de un vehículo específico cuando se selecciona
useEffect(() => {
    const fetchSelectedVehiclePosition = async () => {
        if (!sessionId || selectedVehicle === null) return;

        try {
            const response = await axios.post(baseUrl, {
                svc: 'core/search_item',
                params: {
                    id: selectedVehicle,
                    flags: 1025
                },
                sid: sessionId
            });

            if (response.data && response.data.item) {
                const { pos, lmsg } = response.data.item;
                const vehicleIndex = vehicles.findIndex(v => v.id === selectedVehicle);

                if (vehicleIndex !== -1) {
                    const updatedVehicles = [...vehicles];
                    updatedVehicles[vehicleIndex] = {
                        ...updatedVehicles[vehicleIndex],
                        pos,
                        mileage: lmsg?.p?.mileage ? lmsg.p.mileage / 1000 : undefined
                    };
                    setVehicles(updatedVehicles);
                }
            }
        } catch (err) {
            console.error(`Error al obtener posición del vehículo seleccionado:`, err);
        }
    };

    if (selectedVehicle !== null) {
        fetchSelectedVehiclePosition();

        // Actualizar la posición del vehículo seleccionado cada 5 segundos
        const interval = setInterval(fetchSelectedVehiclePosition, 5000);
        return () => clearInterval(interval);
    }
}, [sessionId, selectedVehicle, vehicles]);

    if (loading && vehicles.length === 0) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="wialon-tracker">
            <div className="vehicle-list">
                <h2>Vehículos ({vehicles.length})</h2>
                <ul>
                    {vehicles.map(vehicle => (
                        <li
                            key={vehicle.id}
                            className={selectedVehicle === vehicle.id ? 'selected' : ''}
                            onClick={() => setSelectedVehicle(vehicle.id)}
                        >
                            <strong>{vehicle.nm}</strong>
                            {vehicle.pos && (
                                <div>
                                    <div>Velocidad: {vehicle.pos.s} km/h</div>
                                    {vehicle.mileage !== undefined && <div>Kilometraje: {vehicle.mileage.toFixed(1)} km</div>}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="map-container">
                <MapContainer
                    center={[4.6097, -74.0817]} // Bogotá, Colombia como centro por defecto
                    zoom={6}
                    style={{ height: '600px', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {vehicles
                        .filter(vehicle => vehicle.pos)
                        .map(vehicle => (
                            <Marker
                                key={vehicle.id}
                                position={[vehicle.pos!.y, vehicle.pos!.x]}
                                eventHandlers={{
                                    click: () => setSelectedVehicle(vehicle.id)
                                }}
                            >
                                <Popup>
                                    <div>
                                        <h3>{vehicle.nm}</h3>
                                        <p>Velocidad: {vehicle.pos!.s} km/h</p>
                                        <p>Dirección: {vehicle.pos!.c}°</p>
                                        {vehicle.mileage !== undefined && <p>Kilometraje: {vehicle.mileage.toFixed(1)} km</p>}
                                        <p>Última actualización: {new Date(vehicle.pos!.t * 1000).toLocaleString()}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    }

                    <MapUpdater vehicles={vehicles} />
                </MapContainer>
            </div>

            <style jsx>{`
        .wialon-tracker {
          display: flex;
          height: 600px;
        }
        
        .vehicle-list {
          width: 300px;
          overflow-y: auto;
          padding: 10px;
          border-right: 1px solid #ccc;
        }
        
        .vehicle-list ul {
          list-style: none;
          padding: 0;
        }
        
        .vehicle-list li {
          padding: 10px;
          margin-bottom: 5px;
          border: 1px solid #eee;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .vehicle-list li.selected {
          background-color: #f0f8ff;
          border-color: #007bff;
        }
        
        .map-container {
          flex-grow: 1;
        }
      `}</style>
        </div>
    );
};

export default WialonVehicleTracker;