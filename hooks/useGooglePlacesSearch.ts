// hooks/useGooglePlacesSearch.ts
import { useState, useCallback, useRef } from "react";
import axios from "axios";

import { Prediction } from "@/types";

// Función de debounce personalizada
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const useGooglePlacesSearch = (
  onSelect?: (value: string, coords?: { lat: number; lng: number }) => void,
) => {
  const [value, setValue] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setPredictions([]);

      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/places/autocomplete?input=${encodeURIComponent(input)}`,
      );

      if (response.data.status === "OK") {
        setPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useRef(
    debounce<(input: string) => Promise<void>>(
      (input: string) => fetchPredictions(input),
      300,
    ),
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setValue(newValue);
    if (newValue.length > 0) {
      debouncedFetch(newValue);
      setShowPredictions(true);
    } else {
      setShowPredictions(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await axios.get(
        `/api/places/details?place_id=${placeId}&fields=address_component,formatted_address,geometry,name,place_id`,
      );

      if (response.data.status === "OK" && response.data.result) {
        const details = response.data.result;

        return {
          placeId: details.place_id,
          address: details.formatted_address,
          coordinates: details.geometry?.location || null,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching place details:", error);

      return null;
    }
  };

  const selectPrediction = async (prediction: Prediction) => {
    setValue(prediction.description);
    setShowPredictions(false);

    const details = await getPlaceDetails(prediction.place_id);

    if (details?.coordinates) {
      setCoordinates(details.coordinates);
      onSelect?.(prediction.description, details.coordinates);
    }
  };

  return {
    value,
    setValue,
    predictions,
    isLoading,
    showPredictions,
    setShowPredictions,
    coordinates,
    handleInputChange,
    selectPrediction,
  };
};
