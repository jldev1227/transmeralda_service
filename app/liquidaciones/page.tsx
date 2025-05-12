"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { format } from "date-fns";
import { addToast } from "@heroui/toast";
import {
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  XIcon,
  CheckIcon,
  DollarSignIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  AlertTriangle,
  HomeIcon,
  FileClockIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/loadingPage";

// Importaciones de dnd-kit

import { apiClient } from "@/config/apiClient";
import {
  Cliente,
  ServicioConRelaciones,
  useService,
} from "@/context/serviceContext";

// Tipos e interfaces
interface ServicioItemProps {
  servicio: ServicioConRelaciones;
  isSelected: boolean;
  onClick: () => void;
  isDragging?: boolean;
  onValorChange?: (valor: number) => void;
  position?: number; // Posición del servicio
  onMoveUp?: () => void; // Mover hacia arriba
  onMoveDown?: () => void; // Mover hacia abajo
  isFirst?: boolean; // ¿Es el primer elemento?
  isLast?: boolean; // ¿Es el último elemento?
}

// Componente de servicio arrastrable con memoización
const ServicioItem = React.memo(
  ({
    servicio,
    isSelected,
    onClick,
    isDragging,
    onValorChange,
    position,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
  }: ServicioItemProps) => {
    // Asegurarse de que id nunca sea undefined
    const itemId =
      servicio.id || `fallback-${Math.random().toString(36).substr(2, 9)}`;
    const id = isSelected ? `seleccionado-${itemId}` : itemId;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id, // Ahora id siempre será un valor no nulo
      data: { servicio, isSelected, position },
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          opacity: isDragging ? 0.4 : 1,
          zIndex: isDragging ? 1 : "auto",
          userSelect: "none" as const, // Tipado correcto para React
          WebkitUserSelect: "none" as const,
          MozUserSelect: "none" as const,
          msUserSelect: "none" as const,
        }
      : {
          userSelect: "none" as const,
          WebkitUserSelect: "none" as const,
          MozUserSelect: "none" as const,
          msUserSelect: "none" as const,
        };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        aria-roledescription="draggable item"
        className={`p-3 mb-2 rounded-md bg-white border transition-shadow ${
          isDragging ? "opacity-40" : "hover:shadow-md"
        } cursor-grab touch-manipulation relative`}
        data-position={position}
        role="button"
        tabIndex={0}
      >
        {isSelected && position !== undefined && (
          <div className="absolute -left-2 -top-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {position + 1}
          </div>
        )}
        <div className="flex justify-between">
          <div className="font-medium">
            {servicio.origen_especifico} → {servicio.destino_especifico}
          </div>
          {isSelected && (
            <div className="flex space-x-1">
              <button
                className={`p-1 rounded-full hover:bg-gray-100 ${isFirst ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isFirst}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMoveUp && !isFirst) onMoveUp();
                }}
              >
                <ChevronUpIcon className="h-4 w-4 text-gray-600" />
              </button>
              <button
                className={`p-1 rounded-full hover:bg-gray-100 ${isLast ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLast}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMoveDown && !isLast) onMoveDown();
                }}
              >
                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium">Planilla:</span>{" "}
          {servicio.numero_planilla}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Cliente:</span>{" "}
          {servicio.cliente?.Nombre}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Fecha:</span>{" "}
          {format(
            new Date(servicio.fecha_realizacion || servicio.createdAt),
            "dd/MM/yyyy",
          )}
        </div>

        {isSelected && (
          <>
            <div className="mt-2">
              <label
                className="block text-xs font-medium text-gray-700 mb-1"
                htmlFor="valor"
              >
                Valor a liquidar:
              </label>
              <div className="flex items-center gap-2">
                <Input
                  className="text-sm py-1"
                  id="valor"
                  radius="sm"
                  startContent={
                    <DollarSignIcon className="w-5 h-5 text-gray-400" />
                  }
                  type="text"
                  value={(
                    servicio as ServicioConRelaciones
                  ).valor.toLocaleString("es-CO")}
                  onChange={(e) => {
                    // Limitar a 4 dígitos como máximo
                    const valorNumerico = e.target.value.replace(/[^\d]/g, "");
                    const valorLimitado = valorNumerico.slice(0, 10);
                    const newValor = parseInt(valorLimitado, 10) || 0;

                    if (onValorChange) {
                      onValorChange(newValor);
                    }
                  }}
                />
                <button
                  className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors flex items-center"
                  type="button"
                  onClick={onClick}
                >
                  <XIcon className="h-3 w-3 mr-1" /> Quitar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);

ServicioItem.displayName = "ServicioItem";

// Componente contenedor optimizado
const ServiciosContainer = React.memo(
  ({
    id,
    children,
    onDragEnter,
    className = "",
  }: {
    id: string;
    children: React.ReactNode;
    onDragEnter?: () => void;
    className?: string;
    onReorder?: (sourceIndex: number, destinationIndex: number) => void;
  }) => {
    const { setNodeRef, isOver } = useDroppable({
      id,
    });

    // Llamar a onDragEnter cuando isOver cambia a true
    useEffect(() => {
      if (isOver && onDragEnter) {
        onDragEnter();
      }
    }, [isOver, onDragEnter]);

    return (
      <div
        ref={setNodeRef}
        aria-roledescription="droppable container"
        className={`bg-gray-50 border rounded-md p-2 overflow-y-auto flex-1 min-h-[300px] ${
          isOver ? "ring-2 ring-blue-400" : ""
        } ${className} touch-pan-y`}
        role="region"
      >
        {children}
      </div>
    );
  },
);

ServiciosContainer.displayName = "ServiciosContainer";

function ModalLiquidarServicios() {
  const { servicios } = useService();

  const router = useRouter();

  // Estados para el formulario y los servicios
  const [serviciosRealizados, setServiciosRealizados] = useState<
    ServicioConRelaciones[]
  >([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
    ServicioConRelaciones[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "fecha_realizacion",
    direction: "desc",
  });
  const [consecutivoLiquidacion, setConsecutivoLiquidacion] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [fechaLiquidacion, setFechaLiquidacion] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedServicio, setDraggedServicio] =
    useState<ServicioConRelaciones | null>(null);
  // Estado para la posición del elemento arrastrado dentro de servicios seleccionados
  // Estado para la posición del elemento arrastrado
  const [draggedPosition, setDraggedPosition] = useState<number | null>(null);

  // Sensores para dnd-kit optimizados para mejor soporte en dispositivos móviles
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Configuración optimizada para móviles y tablets
      activationConstraint: {
        delay: 150, // Añade un ligero retraso para distinguir entre toques y arrastres
        tolerance: 8, // Aumenta la tolerancia para dispositivos táctiles
      },
    }),
    useSensor(KeyboardSensor, {
      // Más sensible con el teclado
      keyboardCodes: {
        start: ["Space", "Enter"],
        cancel: ["Escape"],
        end: ["Space", "Enter"],
      },
    }),
  );

  // Filtrar servicios realizados con número de planilla (memoizado)
  useEffect(() => {
    if (servicios && servicios.length > 0) {
      // Crear un conjunto con los IDs de los servicios seleccionados para búsqueda rápida
      const serviciosSeleccionadosIds = new Set(
        serviciosSeleccionados.map((servicio) => servicio.id),
      );

      const filtrados = servicios.filter(
        (servicio) =>
          // Verificar estado y número de planilla
          servicio.estado === "planilla_asignada" &&
          servicio.numero_planilla &&
          servicio.numero_planilla.trim() !== "" &&
          // Verificar que no esté ya en los seleccionados
          !serviciosSeleccionadosIds.has(servicio.id),
      );

      setServiciosRealizados(filtrados);
    }
  }, [servicios, serviciosSeleccionados]); // Incluir serviciosSeleccionados en las dependencias

  // Aplicar búsqueda y filtros a los servicios (memoizado)
  const serviciosFiltrados = useMemo(() => {
    return serviciosRealizados.filter((servicio) => {
      if (searchTerm === "") return true;

      const searchTermLower = searchTerm.toLowerCase();

      return (
        servicio.origen_especifico?.toLowerCase().includes(searchTermLower) ||
        servicio.destino_especifico?.toLowerCase().includes(searchTermLower) ||
        servicio.numero_planilla?.toLowerCase().includes(searchTermLower) ||
        servicio.cliente.Nombre.toLowerCase().includes(searchTermLower)
      );
    });
  }, [serviciosRealizados, searchTerm]);

  // Ordenar servicios (memoizado)
  const serviciosOrdenados = useMemo(() => {
    return [...serviciosFiltrados].sort((a, b) => {
      const valueA = a[sortConfig.key as keyof ServicioConRelaciones];
      const valueB = b[sortConfig.key as keyof ServicioConRelaciones];

      // Manejar casos null/undefined
      if (valueA === null || valueA === undefined) {
        return sortConfig.direction === "asc" ? -1 : 1; // Null primero en asc, último en desc
      }
      if (valueB === null || valueB === undefined) {
        return sortConfig.direction === "asc" ? 1 : -1; // Null último en asc, primero en desc
      }

      // Para fechas, comparar los timestamps
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortConfig.direction === "asc"
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      // Para objetos (como Municipio, Cliente, etc.), usar alguna propiedad para comparar
      if (typeof valueA === "object" && typeof valueB === "object") {
        // Si es un objeto relacionado como Municipio, Cliente, etc.
        const nameA = (valueA as any)?.nombre || "";
        const nameB = (valueB as any)?.nombre || "";

        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      // Para strings, usar localeCompare
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortConfig.direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Para números y otros tipos
      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [serviciosFiltrados, sortConfig]);

  // Array de IDs seleccionados para verificación rápida
  const serviciosSeleccionadosIds = useMemo(() => {
    return serviciosSeleccionados.map((s) => s.id);
  }, [serviciosSeleccionados]);

  // Manejo del DnD (usando useCallback para optimizar)
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id.toString());

    // Extraer información del elemento arrastrado
    const { servicio, position } = active.data.current || {};

    if (servicio) {
      setDraggedServicio(servicio);
    }

    if (position !== undefined) {
      setDraggedPosition(position);
    } else {
      setDraggedPosition(null);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        // Si no hay un "over" destino, simplemente limpiamos el estado
        setActiveId(null);
        setDraggedServicio(null);
        setDraggedPosition(null);

        return;
      }

      const activeIdStr = active.id.toString();
      const overIdStr = over.id.toString();

      // CASO 1: Moviendo desde serviciosRealizados a serviciosSeleccionados
      if (!activeIdStr.startsWith("seleccionado-")) {
        // Solo procesamos si el destino es el contenedor de seleccionados o un elemento dentro de él
        if (
          overIdStr === "serviciosSeleccionados" ||
          overIdStr.startsWith("seleccionado-")
        ) {
          const servicio = serviciosOrdenados.find((s) => s.id === activeIdStr);

          if (!servicio) return;

          // Si es el primer servicio, este define el cliente para la liquidación
          if (serviciosSeleccionadosIds.length === 0) {
            setCliente(servicio.cliente);
          }

          // Verificar que no esté ya en los seleccionados y que pertenezca al mismo cliente
          if (!serviciosSeleccionadosIds.includes(servicio.id)) {
            // Si no hay cliente establecido o el servicio es del mismo cliente
            if (!cliente || servicio.cliente_id === cliente?.id) {
              // Determinar la posición donde insertar el servicio
              let insertPosition = serviciosSeleccionados.length; // Por defecto al final

              // Si arrastramos sobre un servicio específico (no sobre el contenedor), insertamos en esa posición
              if (overIdStr.startsWith("seleccionado-")) {
                const targetId = overIdStr.replace("seleccionado-", "");
                const targetIndex = serviciosSeleccionados.findIndex(
                  (s) => s.id === targetId,
                );

                if (targetIndex !== -1) {
                  insertPosition = targetIndex;
                }
              }

              // Crear copia del servicio para la sección de seleccionados
              const servicioSeleccionado: ServicioConRelaciones = {
                ...servicio,
                valor: servicio.valor,
              };

              // Insertar el servicio en la posición correcta
              setServiciosSeleccionados((prev) => {
                const newServicios = [...prev];

                newServicios.splice(insertPosition, 0, servicioSeleccionado);

                return newServicios;
              });
            } else {
              // Mostrar error si se intenta agregar servicio de diferente cliente
              addToast({
                title: "Error",
                description: `Debe agregar servicios realizados al cliente ${cliente?.Nombre}`,
                color: "danger",
              });
            }
          }
        }
      }
      // CASO 2: Reordenando dentro de serviciosSeleccionados o removiendo
      else if (activeIdStr.startsWith("seleccionado-")) {
        const servicioId = activeIdStr.replace("seleccionado-", "");

        // Reordenando dentro del contenedor de seleccionados
        if (overIdStr.startsWith("seleccionado-") && draggedPosition !== null) {
          const targetId = overIdStr.replace("seleccionado-", "");
          const targetIndex = serviciosSeleccionados.findIndex(
            (s) => s.id === targetId,
          );

          // Solo procesamos si el índice es válido y diferente de la posición original
          if (targetIndex !== -1 && targetIndex !== draggedPosition) {
            setServiciosSeleccionados((prevServicios) => {
              const newServicios = [...prevServicios];
              const [movedItem] = newServicios.splice(draggedPosition, 1);

              // Si estamos arrastrando hacia un índice mayor que el original,
              // ajustamos el índice para tener en cuenta el elemento removido
              const adjustedTargetIndex =
                targetIndex > draggedPosition ? targetIndex - 1 : targetIndex;

              newServicios.splice(adjustedTargetIndex, 0, movedItem);

              return newServicios;
            });
          }
        }
        // Quitar servicio si se arrastra al contenedor de realizados o cualquier otro elemento
        else if (
          overIdStr === "serviciosRealizados" ||
          !overIdStr.startsWith("seleccionado-")
        ) {
          setServiciosSeleccionados((prev) => {
            const newServicios = prev.filter((s) => s.id !== servicioId);

            // Si después de eliminar este servicio no quedan más, resetear el cliente
            if (newServicios.length === 0) {
              setCliente(null);
            }

            return newServicios;
          });
        }
      }

      // Limpiar estados después de procesar
      setActiveId(null);
      setDraggedServicio(null);
      setDraggedPosition(null);
    },
    [
      serviciosOrdenados,
      serviciosSeleccionadosIds,
      draggedPosition,
      cliente,
      serviciosSeleccionados.length,
      addToast,
    ],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();

    // Si estamos arrastrando desde la lista de realizados a la de seleccionados
    if (
      !activeIdStr.startsWith("seleccionado-") &&
      overIdStr === "serviciosSeleccionados"
    ) {
      // No hacemos nada aquí - solo resaltamos visualmente
      // El efecto visual está gestionado por el componente ServiciosContainer
    }
  }, []);

  // Callback cuando un elemento entra en la zona de destino
  const handleDragEnterSeleccionados = useCallback(() => {
    if (
      draggedServicio &&
      !serviciosSeleccionadosIds.includes(draggedServicio.id)
    ) {
      // Solo actualizamos visualmente - la transferencia real ocurre en handleDragEnd
      // Esta lógica se puede ajustar según necesidad
    }
  }, [draggedServicio, serviciosSeleccionadosIds]);

  // Eliminar un servicio de los seleccionados (useCallback)
  const quitarServicio = useCallback((id: string) => {
    setServiciosSeleccionados((prev) => {
      const newServicios = prev.filter((s) => s.id !== id);

      // Si después de eliminar este servicio no quedan más, resetear el cliente
      if (newServicios.length === 0) {
        setCliente(null);
      }

      return newServicios;
    });
  }, []);

  // Añadir servicio a seleccionados (useCallback)
  const agregarServicio = useCallback(
    (servicio: ServicioConRelaciones) => {
      if (!serviciosSeleccionadosIds.includes(servicio.id)) {
        // Si es el primer servicio o no hay cliente establecido,
        // usamos este servicio para definir el cliente
        if (serviciosSeleccionadosIds.length === 0 || !cliente) {
          setCliente(servicio.cliente);
        } else if (cliente && servicio.cliente_id !== cliente.id) {
          // Validamos que el servicio sea del mismo cliente
          addToast({
            title: "Error",
            description: `Debe agregar servicios realizados al cliente ${cliente.Nombre}`,
            color: "danger",
          });

          return;
        }

        const servicioSeleccionado: ServicioConRelaciones = {
          ...servicio,
          valor: servicio.valor,
        };

        setServiciosSeleccionados((prev) => [...prev, servicioSeleccionado]);
      }
    },
    [serviciosSeleccionadosIds, cliente, addToast],
  );

  // Actualizar valor de liquidación de un servicio
  const actualizarValorServicio = useCallback(
    (id: string, nuevoValor: number) => {
      setServiciosSeleccionados((prev) =>
        prev.map((servicio) =>
          servicio.id === id ? { ...servicio, valor: nuevoValor } : servicio,
        ),
      );
    },
    [],
  );

  // Mover un servicio seleccionado hacia arriba en la lista
  const moverServicioArriba = useCallback((index: number) => {
    if (index <= 0) return; // No hacer nada si es el primer elemento
    setServiciosSeleccionados((prev) => {
      const nuevaLista = [...prev];

      // Intercambiar posiciones
      [nuevaLista[index], nuevaLista[index - 1]] = [
        nuevaLista[index - 1],
        nuevaLista[index],
      ];

      return nuevaLista;
    });
  }, []);

  // Mover un servicio seleccionado hacia abajo en la lista
  const moverServicioAbajo = useCallback((index: number) => {
    setServiciosSeleccionados((prev) => {
      if (index >= prev.length - 1) return prev; // No hacer nada si es el último elemento

      const nuevaLista = [...prev];

      // Intercambiar posiciones
      [nuevaLista[index], nuevaLista[index + 1]] = [
        nuevaLista[index + 1],
        nuevaLista[index],
      ];

      return nuevaLista;
    });
  }, []);

  // Cambiar el criterio de ordenación (useCallback)
  const requestSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  // Manejar reset del formulario (useCallback)
  const handleReset = useCallback(() => {
    setServiciosSeleccionados([]);
    setConsecutivoLiquidacion("");
    setCliente(null);
  }, []);

  // Manejar goBack del formulario (useCallback)
  const handleGoBack = useCallback(() => {
    handleReset();

    // Pequeño retraso para asegurar que la limpieza se complete antes redirigir
    setTimeout(() => {
      router.push("/");
    }, 50);
  }, [router]);

  // Calcular valor total (memoizado)
  const valorTotal = useMemo(() => {
    return serviciosSeleccionados.reduce(
      (sum, servicio) => sum + Number(servicio.valor),
      0,
    );
  }, [serviciosSeleccionados]);

  function validarConsecutivo(consecutivo: string): boolean {
    const regex = /^[A-Z]{2,4}-\d{4}$/;

    return regex.test(consecutivo);
  }

  // Manejar envío del formulario (useCallback)
  const handleSubmit = useCallback(async () => {
    try {
      // Validaciones previas
      if (serviciosSeleccionados.length === 0) {
        addToast({
          title: "Error",
          description: "Debe seleccionar al menos un servicio para liquidar",
          color: "danger",
        });

        return;
      }

      if (!validarConsecutivo(consecutivoLiquidacion)) {
        addToast({
          title: "Error",
          description:
            "El consecutivo debe tener formato AA-0000 o AAAA-0000 (letras mayúsculas-números)",
          color: "danger",
        });

        return;
      }

      // Validar valores de los servicios
      for (const servicio of serviciosSeleccionados) {
        if (servicio.valor <= 0) {
          addToast({
            title: "Error",
            description: `El servicio ${servicio.origen_especifico} → ${servicio.destino_especifico} debe tener un valor mayor que cero`,
            color: "danger",
          });

          return;
        }
      }

      // Preparar datos para enviar
      const datosLiquidacion = {
        consecutivo: consecutivoLiquidacion.toUpperCase(),
        fecha_liquidacion: fechaLiquidacion,
        observaciones: "",
        // Asegurarse que todos los valores son números válidos
        servicios: serviciosSeleccionados.map((s, index) => ({
          id: s.id,
          valor: s.valor, // Asegurarse que este es un número
          posicion: index, // Incluimos la posición jerárquica
        })),
      };

      // Enviar petición al backend
      await apiClient.post("/api/liquidaciones_servicios", datosLiquidacion);

      // Mostrar mensaje de éxito
      addToast({
        title: "Éxito",
        description: `Se ha creado la liquidación con ${serviciosSeleccionados.length} servicios correctamente`,
        color: "success",
      });

      // Reiniciar formulario y redirigir al histórico
      handleReset();
    } catch (error: any) {
      console.error("Error al crear liquidación:", error);

      // Manejar errores específicos del backend
      if (error.response && error.response.data) {
        const mensaje =
          error.response.data.error ||
          "Ocurrió un error al procesar la liquidación";

        addToast({
          title: "Error",
          description: mensaje,
          color: "danger",
        });
      } else {
        addToast({
          title: "Error",
          description: "Ocurrió un error al conectar con el servidor",
          color: "danger",
        });
      }
    }
  }, [
    serviciosSeleccionados,
    consecutivoLiquidacion,
    fechaLiquidacion,
    handleReset,
    addToast,
    router,
  ]);

  // Obtener el elemento activo para mostrar en el overlay (memoizado)
  const activeItem = useMemo(() => {
    if (activeId && draggedServicio) {
      const isSelected = activeId.startsWith("seleccionado-");

      return { ...draggedServicio, isSelected };
    }

    return null;
  }, [activeId, draggedServicio]);

  return (
    <div className="2xl:container mx-auto p-10">
      <div className="flex flex-col gap-1 border-b pb-4">
        <div className="flex gap-3 flex-col sm:flex-row w-full items-start md:items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Liquidación de Servicios</h2>
          <Button radius="sm" className="w-full sm:w-auto" as={Link} color="primary" href="/historico">
            <FileClockIcon className="w-6 h-6" />
            Historico
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Arrastre los servicios realizados al panel de servicios seleccionados
          para incluirlos en la liquidación
        </p>
        <p className="text-xs text-blue-600 md:hidden">
          <strong>Nota para dispositivos móviles:</strong> Mantenga pulsado
          brevemente un servicio para comenzar a arrastrarlo
        </p>
      </div>
      <div className="my-4">
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel izquierdo: Listado de servicios realizados */}
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Listado de servicios realizados
                </h3>
                <div className="flex space-x-2">
                  <Button
                    className="flex items-center"
                    size="sm"
                    variant="light"
                    onPress={() => requestSort("fecha_realizacion")}
                  >
                    {sortConfig.key === "fecha_realizacion" &&
                    sortConfig.direction === "asc" ? (
                      <SortAscIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <SortDescIcon className="h-4 w-4 mr-1" />
                    )}
                    Fecha
                  </Button>
                  <Button
                    className="flex items-center"
                    size="sm"
                    variant="light"
                    onPress={() => requestSort("numero_planilla")}
                  >
                    {sortConfig.key === "numero_planilla" &&
                    sortConfig.direction === "asc" ? (
                      <SortAscIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <SortDescIcon className="h-4 w-4 mr-1" />
                    )}
                    Planilla
                  </Button>
                </div>
              </div>

              <div className="mb-4 flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Buscar por origen, destino, planilla o cliente..."
                    radius="sm"
                    startContent={
                      <SearchIcon className="h-4 w-4 text-gray-400" />
                    }
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <ServiciosContainer id="serviciosRealizados">
                {serviciosOrdenados.length > 0 ? (
                  serviciosOrdenados.map((servicio) => (
                    <ServicioItem
                      key={servicio.id}
                      isDragging={activeId === servicio.id}
                      isSelected={false}
                      servicio={servicio}
                      onClick={() => agregarServicio(servicio)}
                    />
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    No hay servicios realizados disponibles
                  </div>
                )}
              </ServiciosContainer>
            </div>

            {/* Panel derecho: Formulario y servicios seleccionados */}
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Formulario</h3>
                <form className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="consecutivo"
                    >
                      Consecutivo de liquidación
                    </label>
                    <Input
                      required
                      id="consecutivo"
                      placeholder="Ingrese el consecutivo"
                      type="text"
                      value={consecutivoLiquidacion}
                      onChange={(e) =>
                        setConsecutivoLiquidacion(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="fecha_liquidado"
                    >
                      Fecha de liquidación
                    </label>
                    <Input
                      required
                      id="fecha_liquidado"
                      type="date"
                      value={fechaLiquidacion}
                      onChange={(e) => setFechaLiquidacion(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Servicios seleccionados
                  </h3>
                  <div>
                    <p className="text-xs text-gray-500">
                      Arrastra los servicios para reordenarlos según el orden
                      deseado
                    </p>
                  </div>
                </div>
                <ServiciosContainer
                  className="transition-all duration-200"
                  id="serviciosSeleccionados"
                  onDragEnter={handleDragEnterSeleccionados}
                >
                  {serviciosSeleccionados.length > 0 ? (
                    serviciosSeleccionados.map((servicio, index) => (
                      <ServicioItem
                        key={`seleccionado-${servicio.id}`}
                        isDragging={activeId === `seleccionado-${servicio.id}`}
                        isFirst={index === 0}
                        isLast={index === serviciosSeleccionados.length - 1}
                        isSelected={true}
                        position={index}
                        servicio={servicio}
                        onClick={() => quitarServicio(servicio.id || "")}
                        onMoveDown={() => moverServicioAbajo(index)}
                        onMoveUp={() => moverServicioArriba(index)}
                        onValorChange={(valor) =>
                          actualizarValorServicio(servicio.id || "", valor)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      Arrastre servicios aquí para incluirlos en la liquidación
                    </div>
                  )}
                </ServiciosContainer>

                {serviciosSeleccionados.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <div className="flex justify-between font-medium">
                      <span>Total servicios:</span>
                      <span>{serviciosSeleccionados.length}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-1">
                      <span>Valor total:</span>
                      <span>
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(valorTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlay para el elemento que se está arrastrando - optimizado para móviles */}
          <DragOverlay
            dropAnimation={{
              duration: 300,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
          >
            {activeItem ? (
              <div
                className="p-3 rounded-md bg-white border shadow-xl scale-105 z-40 transform-gpu relative"
                style={{
                  touchAction: "none",
                  pointerEvents: "none",
                }}
              >
                {activeId?.startsWith("seleccionado-") &&
                  draggedPosition !== null && (
                    <div className="absolute -left-2 -top-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {draggedPosition + 1}
                    </div>
                  )}
                <div className="flex justify-between">
                  <div className="font-medium">
                    {activeItem.origen_especifico} →{" "}
                    {activeItem.destino_especifico}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Planilla:</span>{" "}
                  {activeItem.numero_planilla}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Cliente:</span>{" "}
                  {activeItem.cliente?.Nombre}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Fecha:</span>{" "}
                  {format(
                    new Date(
                      activeItem.fecha_realizacion || activeItem.createdAt,
                    ),
                    "dd/MM/yyyy",
                  )}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <div className="border-t pt-4 flex flex-col sm:flex-row justify-end space-x-3">
        <Button
          color="primary"
          radius="sm"
          variant="light"
          onPress={handleReset}
        >
          Limpiar selección
        </Button>
        <Button
          color="danger"
          radius="sm"
          variant="light"
          onPress={handleGoBack}
        >
          Cancelar
        </Button>
        <Button
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={serviciosSeleccionados.length === 0}
          radius="sm"
          onPress={handleSubmit}
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          Liquidar servicios
        </Button>
      </div>
    </div>
  );
}

// Exportar el componente envuelto con AuthGuard y manejo de errores personalizado
export default function LiquidacionesPage() {
  // Este componente se encarga de verificar los permisos y mostrar el contenido adecuado
  return (
    <PermissionHandler
      errorMessage="Necesitas ser liquidador para acceder a esta sección"
      requiredPermissions={["liquidador", "facturador"]}
    >
      <ModalLiquidarServicios />
    </PermissionHandler>
  );
}

// Componente para manejar permisos en la página y mostrar errores personalizados
function PermissionHandler({
  children,
  requiredPermissions,
  errorMessage,
}: {
  children: React.ReactNode;
  requiredPermissions: string[];
  errorMessage: string;
}) {
  const { user, loading, isAuthenticated } = useAuth();

  // Si está cargando, mostrar loading
  if (loading) {
    return <LoadingPage>Verificando acceso</LoadingPage>;
  }

  // Si no está autenticado, redirigir al login (esto debería ser manejado por el middleware)
  if (!isAuthenticated || !user) {
    // En un entorno de cliente, redirigiría automáticamente
    return <LoadingPage>Redirigiendo al login</LoadingPage>;
  }

  // Verificar permisos
  const hasPermission =
    user.role === "admin" ||
    requiredPermissions.some(
      (permission) =>
        user.role === permission ||
        (user.permisos && user.permisos[permission] === true),
    );

  // Si no tiene permisos, mostrar mensaje de error personalizado
  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4 flex justify-center">
            <AlertTriangle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="flex flex-col space-y-3">
            <Link
              className="flex items-center justify-center w-full py-2 px-4 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors"
              href="/"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene permisos, mostrar el contenido
  return <>{children}</>;
}
