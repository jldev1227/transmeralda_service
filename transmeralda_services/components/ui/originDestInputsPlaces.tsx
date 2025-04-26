import React from 'react';
import { GooglePlacesInput } from './googlePlacesInput';
import { useGooglePlacesSearch } from '@/hooks/useGooglePlacesSearch';

interface SearchInputsPlacesProps {
  onOriginChange?: (value: string, coords?: { lat: number; lng: number }) => void;
  onDestinationChange?: (value: string, coords?: { lat: number; lng: number }) => void;
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
        label="Origen específico del Trayecto"
        placeholder="Escribe un origen específico"
        value={origin.value}
        isLoading={origin.isLoading}
        showPredictions={origin.showPredictions}
        predictions={origin.predictions}
        onInputChange={origin.handleInputChange}
        onSelectPrediction={origin.selectPrediction}
        onFocus={() => origin.value.length >= 3 && origin.setShowPredictions(true)}
        onBlur={() => origin.setShowPredictions(false)}
      />

      <GooglePlacesInput
        label="Destino específico del Trayecto"
        placeholder="Escribe un destino específico"
        value={destination.value}
        isLoading={destination.isLoading}
        showPredictions={destination.showPredictions}
        predictions={destination.predictions}
        onInputChange={destination.handleInputChange}
        onSelectPrediction={destination.selectPrediction}
        onFocus={() => destination.value.length >= 3 && destination.setShowPredictions(true)}
        onBlur={() => destination.setShowPredictions(false)}
      />
    </div>
  );
}