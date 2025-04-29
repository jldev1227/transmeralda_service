import React from "react";

import { GooglePlacesInput } from "./googlePlacesInput";

import { useGooglePlacesSearch } from "@/hooks/useGooglePlacesSearch";

interface SearchInputsPlacesProps {
  onOriginChange?: (
    value: string,
    coords?: { lat: number; lng: number },
  ) => void;
  onDestinationChange?: (
    value: string,
    coords?: { lat: number; lng: number },
  ) => void;
  initialOrigin?: string;
  initialDestination?: string;
}

export default function SearchInputsPlaces({
  onOriginChange,
  onDestinationChange,
  initialOrigin = "",
  initialDestination = "",
}: SearchInputsPlacesProps) {
  const origin = useGooglePlacesSearch(onOriginChange);
  const destination = useGooglePlacesSearch(onDestinationChange);

  // Inicializar valores si existen
  React.useEffect(() => {
    if (initialOrigin) origin.setValue(initialOrigin);
    if (initialDestination) destination.setValue(initialDestination);
  }, [initialOrigin, initialDestination]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GooglePlacesInput
        isLoading={origin.isLoading}
        label="Origen específico del Trayecto"
        placeholder="Escribe un origen específico"
        predictions={origin.predictions}
        showPredictions={origin.showPredictions}
        value={origin.value}
        onBlur={() => origin.setShowPredictions(false)}
        onFocus={() =>
          origin.value.length >= 3 && origin.setShowPredictions(true)
        }
        onInputChange={origin.handleInputChange}
        onSelectPrediction={origin.selectPrediction}
      />

      <GooglePlacesInput
        isLoading={destination.isLoading}
        label="Destino específico del Trayecto"
        placeholder="Escribe un destino específico"
        predictions={destination.predictions}
        showPredictions={destination.showPredictions}
        value={destination.value}
        onBlur={() => destination.setShowPredictions(false)}
        onFocus={() =>
          destination.value.length >= 3 && destination.setShowPredictions(true)
        }
        onInputChange={destination.handleInputChange}
        onSelectPrediction={destination.selectPrediction}
      />
    </div> 
  );
}
