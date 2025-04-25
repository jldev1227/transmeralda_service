"use client";

// components/SearchInputsPlaces.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { LocationMarkerIcon } from "@/app/agregar/page";

interface AWSPlace {
  Label: string;
  Geometry: {
    Point: [number, number]; // [longitude, latitude]
  };
  Country: string;
  Region: string;
  SubRegion?: string;
  Municipality?: string;
  Neighborhood?: string;
  Street?: string;
  PostalCode?: string;
  AddressNumber?: string;
}

interface AWSSearchResult {
  Place: AWSPlace;
  PlaceId: string;
}

interface SearchInputsPlacesProps {
  onOriginChange?: (value: string, coords?: { lat: number, lng: number }) => void;
  onDestinationChange?: (value: string, coords?: { lat: number, lng: number }) => void;
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
  const [originPredictions, setOriginPredictions] = useState<AWSSearchResult[]>([]);
  const [destPredictions, setDestPredictions] = useState<AWSSearchResult[]>([]);

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

  // Referencias para detectar clics fuera
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

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

  // Función para obtener predicciones de Amazon Location Service
  const fetchAWSPredictions = async (input: string, isOrigin: boolean) => {
    if (input.length < 3) {
      isOrigin ? setOriginPredictions([]) : setDestPredictions([]);
      return;
    }

    isOrigin ? setLoadingOrigin(true) : setLoadingDest(true);

    try {
      // Llamar a la API de Amazon Location Service a través de tu endpoint
      const response = await axios.get(
        `/api/aws/location/search?text=${encodeURIComponent(input)}&country=MX`
      );

      if (response.data && response.data.Results) {
        isOrigin
          ? setOriginPredictions(response.data.Results)
          : setDestPredictions(response.data.Results);
      }
    } catch (error) {
      console.error("Error fetching AWS Location predictions:", error);
    } finally {
      isOrigin ? setLoadingOrigin(false) : setLoadingDest(false);
    }
  };

  // Aplicar debounce
  const debouncedFetchOrigin = useRef(
    debounce((value: string) => fetchAWSPredictions(value, true), 300)
  ).current;
  const debouncedFetchDest = useRef(
    debounce((value: string) => fetchAWSPredictions(value, false), 300)
  ).current;

  // Función para obtener el texto principal y secundario para mostrar
  const getDisplayText = (result: AWSSearchResult) => {
    // Ahora result.Place contiene la información de dirección
    const place = result.Place;
    const label = place.Label;

    // Para Amazon Location, podemos dividir la etiqueta por comas
    // La primera parte suele ser el nombre principal
    const parts = label.split(',');
    const mainText = parts[0].trim();

    // El resto es la información secundaria
    const secondaryText = parts.slice(1).join(',').trim();

    return { mainText, secondaryText };
  };

  // Función para seleccionar una predicción
  const selectPrediction = (result: AWSSearchResult, isOrigin: boolean) => {
    const place = result.Place;
    const address = place.Label;
    const placeId = result.PlaceId;
    const coordinates = {
      lat: place.Geometry.Point[1],
      lng: place.Geometry.Point[0]
    }; // [lon, lat] -> {lat, lng}

    if (isOrigin) {
      setOriginSpecific(address);
      setOriginPlaceId(placeId);
      setShowOriginPredictions(false);
      setOriginCoordinates(coordinates);

      if (onOriginChange) {
        onOriginChange(address, coordinates);
      }

      console.log("Origin coordinates:", coordinates);
    } else {
      setDestSpecific(address);
      setDestPlaceId(placeId);
      setShowDestPredictions(false);
      setDestCoordinates(coordinates);

      if (onDestinationChange) {
        onDestinationChange(address, coordinates);
      }
      
      console.log("Destination coordinates:", coordinates);
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
            className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-4 appearance-none outline-emerald-600"
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
            {originPredictions.map((result) => {
              const { mainText, secondaryText } = getDisplayText(result);
              return (
                <div
                  key={result.PlaceId}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => selectPrediction(result, true)}
                >
                  <div className="font-medium">{mainText}</div>
                  <div className="text-xs text-gray-500">{secondaryText}</div>
                </div>
              );
            })}
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
            className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-4 appearance-none outline-emerald-600"
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
            {destPredictions.map((result) => {
              const { mainText, secondaryText } = getDisplayText(result);
              return (
                <div
                  key={result.PlaceId}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => selectPrediction(result, false)}
                >
                  <div className="font-medium">{mainText}</div>
                  <div className="text-xs text-gray-500">{secondaryText}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}