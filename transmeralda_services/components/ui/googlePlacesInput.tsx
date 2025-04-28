// components/GooglePlacesInput.tsx
import React, { useRef, useEffect } from "react";

import { LocationMarkerIcon } from "./modalFormServicio";

interface GooglePlacesInputProps {
  label: string;
  placeholder: string;
  value: string;
  isLoading: boolean;
  showPredictions: boolean;
  predictions: Prediction[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectPrediction: (prediction: Prediction) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  label,
  placeholder,
  value,
  isLoading,
  showPredictions,
  predictions,
  onInputChange,
  onSelectPrediction,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  return (
    <div ref={inputRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LocationMarkerIcon />
        </div>
        <input
          className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-5 appearance-none outline-emerald-600"
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={onInputChange}
          onFocus={onFocus}
        />
        {isLoading && (
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

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
              onClick={() => onSelectPrediction(prediction)}
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
  );
};
