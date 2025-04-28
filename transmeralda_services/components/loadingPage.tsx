"use client";

import React, { ReactNode } from "react";

const LoadingPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center">
        {/* Círculo animado con pulso */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-r-2 border-transparent border-opacity-50 animate-pulse" />
        </div>

        {/* Texto animado con fade-in */}
        <div className="mt-6 opacity-0 animate-fadeIn">
          <p className="text-emerald-600">{children}</p>
          <div className="flex justify-center mt-1">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" />
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mx-1 animate-bounce" />
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
