"use client";

// components/SearchInputs.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Para generar sessiontoken

import { LocationMarkerIcon } from "@/app/agregar/page";

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: Array<{
      offset: number;
      length: number;
    }>;
  };
}

interface SearchInputsPlacesProps {
  onOriginChange?: (value: string) => void;
  onDestinationChange?: (value: string) => void;
  initialOrigin?: string;
  initialDestination?: string;
}

export default function SearchInputsPlaces({
  onOriginChange,
  onDestinationChange,
  initialOrigin = "",
  initialDestination = "",
}: SearchInputsPlacesProps) {
  // Estados para valores de entrada
  const [originSpecific, setOriginSpecific] = useState(initialOrigin);
  const [destSpecific, setDestSpecific] = useState(initialDestination);

  // Estados para place_id
  const [originPlaceId, setOriginPlaceId] = useState("");
  const [destPlaceId, setDestPlaceId] = useState("");

  // Estados para predicciones
  const [originPredictions, setOriginPredictions] = useState<Prediction[]>([]);
  const [destPredictions, setDestPredictions] = useState<Prediction[]>([]);

  // Estados para loading
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDest, setLoadingDest] = useState(false);

  // Estados para visibilidad
  const [showOriginPredictions, setShowOriginPredictions] = useState(false);
  const [showDestPredictions, setShowDestPredictions] = useState(false);

  const [originCoordinates, setOriginCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destCoordinates, setDestCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Session token para agrupar solicitudes (mejora facturación)
  const [sessionToken, setSessionToken] = useState("");

  // Referencias para detectar clics fuera
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Generar session token al cargar el componente
  useEffect(() => {
    setSessionToken(uuidv4());
  }, []);

  // Debounce para reducir solicitudes
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args: any[]) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Función para obtener predicciones
  const fetchPredictions = async (input: string, isOrigin: boolean) => {
    if (input.length < 3) {
      isOrigin ? setOriginPredictions([]) : setDestPredictions([]);

      return;
    }

    isOrigin ? setLoadingOrigin(true) : setLoadingDest(true);

    try {
      // Asegúrate de que estás llamando a la ruta correcta
      const response = await axios.get(
        `/api/places/autocomplete?input=${encodeURIComponent(input)}`,
      );

      if (response.data.status === "OK") {
        isOrigin
          ? setOriginPredictions(response.data.predictions)
          : setDestPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      isOrigin ? setLoadingOrigin(false) : setLoadingDest(false);
    }
  };

  // Aplicar debounce
  const debouncedFetchOrigin = useRef(
    debounce((value: string) => fetchPredictions(value, true), 300),
  ).current;
  const debouncedFetchDest = useRef(
    debounce((value: string) => fetchPredictions(value, false), 300),
  ).current;

  // Función para obtener detalles del lugar y extraer coordenadas
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await axios.get(
        `/api/places/details?place_id=${placeId}&fields=address_component,formatted_address,geometry,name,place_id`,
      );

      if (response.data.status === "OK" && response.data.result) {
        const details = response.data.result;

        return {
          placeId: details.place_id,
          name: details.name,
          address: details.formatted_address,
          location: details.geometry?.location || null, // {lat: 123, lng: 456}
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching place details:", error);

      return null;
    }
  };

  // Modificar la función selectPrediction
  const selectPrediction = async (
    prediction: Prediction,
    isOrigin: boolean,
  ) => {
    if (isOrigin) {
      setOriginSpecific(prediction.description);
      setOriginPlaceId(prediction.place_id);
      setShowOriginPredictions(false);

      // Obtener detalles del lugar incluyendo coordenadas
      const details = await getPlaceDetails(prediction.place_id);

      if (details?.location) {
        onOriginChange(details.address);
        console.log("Origin coordinates:", details.location);
      }
    } else {
      setDestSpecific(prediction.description);
      setDestPlaceId(prediction.place_id);
      setShowDestPredictions(false);

      // Obtener detalles del lugar incluyendo coordenadas
      const details = await getPlaceDetails(prediction.place_id);

      if (details?.location) {
        onDestinationChange(details.address);
        setDestCoordinates(details.location);
        console.log("Destination coordinates:", details.location);
      }
    }
  };

  // Manejadores de cambio
  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setOriginSpecific(value);
    if (value.length > 0) {
      debouncedFetchOrigin(value);
      setShowOriginPredictions(true);
    } else {
      setOriginPlaceId("");
      setShowOriginPredictions(false);
    }
  };

  const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDestSpecific(value);
    if (value.length > 0) {
      debouncedFetchDest(value);
      setShowDestPredictions(true);
    } else {
      setDestPlaceId("");
      setShowDestPredictions(false);
    }
  };

  // Cerrar predicciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        originRef.current &&
        !originRef.current.contains(event.target as Node)
      ) {
        setShowOriginPredictions(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestPredictions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div ref={originRef} className="relative">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="origin"
        >
          Origen específico del Trayecto
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LocationMarkerIcon />
          </div>
          <input
            className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-4 appearance-none outline-emerald-600"
            placeholder="Escribe un origen específico"
            type="text"
            value={originSpecific}
            onChange={handleOriginChange}
            onFocus={() =>
              originSpecific.length >= 3 && setShowOriginPredictions(true)
            }
          />
          {loadingOrigin && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Lista de predicciones para origen */}
        {showOriginPredictions && originPredictions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
            {originPredictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={() => selectPrediction(prediction, true)}
              >
                <div className="font-medium">
                  {prediction.structured_formatting.main_text}
                </div>
                <div className="text-xs text-gray-500">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={destRef} className="relative">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="destination"
        >
          Destino específico del Trayecto
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LocationMarkerIcon />
          </div>
          <input
            className="text-gray-800 pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-4 appearance-none outline-emerald-600"
            placeholder="Escribe un destino específico"
            type="text"
            value={destSpecific}
            onChange={handleDestChange}
            onFocus={() =>
              destSpecific.length >= 3 && setShowDestPredictions(true)
            }
          />
          {loadingDest && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Lista de predicciones para destino */}
        {showDestPredictions && destPredictions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
            {destPredictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={() => selectPrediction(prediction, false)}
              >
                <div className="font-medium">
                  {prediction.structured_formatting.main_text}
                </div>
                <div className="text-xs text-gray-500">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
