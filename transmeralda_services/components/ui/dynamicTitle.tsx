"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { siteConfig } from "@/config/site";

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Mapeo de rutas a nombres descriptivos
    const pathNames: { [key: string]: string } = {
      "/": "Inicio",
    };

    // Obtener el nombre de la página actual
    const pageName = pathNames[pathname] || "Página";

    // Actualizar el título del documento
    document.title = `${siteConfig.name} - ${pageName}`;
  }, [pathname]);

  return null; // Este componente no renderiza nada visualmente
}