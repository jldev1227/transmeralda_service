// client-layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/components/ui/navbar";
import DynamicTitle from "@/components/ui/dynamicTitle";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [is404Page, setIs404Page] = useState(false);

  // Verificar si el contenido renderizado es la página 404
  useEffect(() => {
    // Buscar elementos específicos que solo existen en tu página 404
    // Por ejemplo, si tu página 404 tiene un elemento con id="not-found-page"
    const is404 = document.getElementById("not-found-page") !== null;

    setIs404Page(is404);
  }, [pathname]);

  return (
    <div className="relative flex flex-col h-screen">
      <DynamicTitle />
      {!is404Page && <Navbar />}
      <main className="bg-gray-50 flex-grow">{children}</main>
      {/* Footer - solo se muestra si NO es la página 404 */}
      {!is404Page && (
        <footer className="bg-white border-t border-gray-200 py-4 mt-10">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Sistema de Gestión de servicios.
              Todos los derechos reservados.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
