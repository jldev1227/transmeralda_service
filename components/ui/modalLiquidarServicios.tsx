import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { format } from "date-fns";
import { addToast } from "@heroui/toast";
import { ServicioConRelaciones, useService } from "@/context/serviceContext";
import { SearchIcon, SortAscIcon, SortDescIcon, XIcon, CheckIcon } from "lucide-react";

// Importaciones de dnd-kit
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
    DragOverEvent
} from "@dnd-kit/core";

// Tipos

interface ServicioItemProps {
    servicio: ServicioConRelaciones;
    isSelected: boolean;
    onClick: () => void;
    isDragging?: boolean;
}

// Componente de servicio arrastrable con memoización
const ServicioItem = React.memo(({ servicio, isSelected, onClick, isDragging }: ServicioItemProps) => {
    // Asegurarse de que id nunca sea undefined
    const itemId = servicio.id || `fallback-${Math.random().toString(36).substr(2, 9)}`;
    const id = isSelected ? `seleccionado-${itemId}` : itemId;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id, // Ahora id siempre será un valor no nulo
        data: { servicio, isSelected }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1 : 'auto'
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-3 mb-2 rounded-md bg-white border transition-shadow ${isDragging ? "opacity-40" : "hover:shadow-md"
                } cursor-grab`}
        >
            <div className="flex justify-between">
                <div className="font-medium">
                    {servicio.origen_especifico} → {servicio.destino_especifico}
                </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Planilla:</span> {servicio.numero_planilla}
            </div>
            <div className="text-sm text-gray-500">
                <span className="font-medium">Cliente:</span> {servicio.cliente?.Nombre}
            </div>
            <div className="text-sm text-gray-500">
                <span className="font-medium">Fecha:</span> {format(new Date(servicio.fecha_realizacion || servicio.createdAt), "dd/MM/yyyy")}
            </div>
            {isSelected && (
                <div className="mt-2">
                    <button
                        onClick={onClick}
                        type="button"
                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors flex items-center"
                    >
                        <XIcon className="h-3 w-3 mr-1" /> Quitar
                    </button>
                </div>
            )}
        </div>
    );
});

ServicioItem.displayName = 'ServicioItem';

// Componente contenedor optimizado
const ServiciosContainer = React.memo(({
    id,
    children,
    onDragEnter,
    className = ""
}: {
    id: string;
    children: React.ReactNode;
    onDragEnter?: () => void;
    className?: string;
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
            className={`bg-gray-50 border rounded-md p-2 overflow-y-auto flex-1 min-h-[300px] ${isOver ? "ring-2 ring-blue-400" : ""
                } ${className}`}
        >
            {children}
        </div>
    );
});

ServiciosContainer.displayName = 'ServiciosContainer';

export default function ModalLiquidarServicios() {
    const { servicios, modalLiquidar, handleModalLiquidar } = useService();

    // Estados para el formulario y los servicios
    const [serviciosRealizados, setServiciosRealizados] = useState<ServicioConRelaciones[]>([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioConRelaciones[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "fecha_realizacion", direction: "desc" });
    const [consecutivoLiquidacion, setConsecutivoLiquidacion] = useState("");
    const [fechaLiquidacion, setFechaLiquidacion] = useState(format(new Date(), "yyyy-MM-dd"));
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedServicio, setDraggedServicio] = useState<ServicioConRelaciones | null>(null);

    // Sensores para dnd-kit optimizados
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Distancia mínima para activar el arrastre
            },
        }),
        useSensor(KeyboardSensor, {
            // Más sensible con el teclado
            keyboardCodes: {
                start: ['Space', 'Enter'],
                cancel: ['Escape'],
                end: ['Space', 'Enter'],
            }
        })
    );

    // Filtrar servicios realizados con número de planilla (memoizado)
    useEffect(() => {
        if (servicios && servicios.length > 0) {
            // Crear un conjunto con los IDs de los servicios seleccionados para búsqueda rápida
            const serviciosSeleccionadosIds = new Set(
                serviciosSeleccionados.map(servicio => servicio.id)
            );

            const filtrados = servicios.filter(
                (servicio) =>
                    // Verificar estado y número de planilla
                    servicio.estado === "planilla_asignada" &&
                    servicio.numero_planilla &&
                    servicio.numero_planilla.trim() !== "" &&
                    // Verificar que no esté ya en los seleccionados
                    !serviciosSeleccionadosIds.has(servicio.id)
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
            if (typeof valueA === 'object' && typeof valueB === 'object') {
                // Si es un objeto relacionado como Municipio, Cliente, etc.
                const nameA = (valueA as any)?.nombre || '';
                const nameB = (valueB as any)?.nombre || '';
                return sortConfig.direction === "asc"
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            }

            // Para strings, usar localeCompare
            if (typeof valueA === 'string' && typeof valueB === 'string') {
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
        return serviciosSeleccionados.map(s => s.id);
    }, [serviciosSeleccionados]);

    // Manejo del DnD (usando useCallback para optimizar)
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id.toString());

        // Extraer información del elemento arrastrado
        const { servicio } = active.data.current || {};
        if (servicio) {
            setDraggedServicio(servicio);
        }
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over) {
            const activeIdStr = active.id.toString();
            const overIdStr = over.id.toString();

            // Si el elemento arrastrado viene de serviciosRealizados
            if (!activeIdStr.startsWith('seleccionado-')) {
                // Y estamos soltando en el contenedor de seleccionados
                if (overIdStr === 'serviciosSeleccionados' || overIdStr.startsWith('seleccionado-')) {
                    const servicio = serviciosOrdenados.find(s => s.id === activeIdStr);
                    if (servicio && !serviciosSeleccionadosIds.includes(servicio.id)) {
                        setServiciosSeleccionados(prev => [...prev, servicio]);
                    }
                }
            }
            // Si el elemento arrastrado viene de serviciosSeleccionados
            else if (activeIdStr.startsWith('seleccionado-')) {
                const servicioId = activeIdStr.replace('seleccionado-', '');
                // Y estamos soltando en el contenedor de realizados
                if (overIdStr === 'serviciosRealizados' || !overIdStr.startsWith('seleccionado-')) {
                    setServiciosSeleccionados(prev => prev.filter(s => s.id !== servicioId));
                }
            }
        }

        // Limpiar estados
        setActiveId(null);
        setDraggedServicio(null);
    }, [serviciosOrdenados, serviciosSeleccionadosIds]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeIdStr = active.id.toString();
        const overIdStr = over.id.toString();

        // Si estamos arrastrando desde la lista de realizados a la de seleccionados
        if (!activeIdStr.startsWith('seleccionado-') && overIdStr === 'serviciosSeleccionados') {
            // No hacemos nada aquí - solo resaltamos visualmente
            // El efecto visual está gestionado por el componente ServiciosContainer
        }
    }, []);

    // Callback cuando un elemento entra en la zona de destino
    const handleDragEnterSeleccionados = useCallback(() => {
        if (draggedServicio && !serviciosSeleccionadosIds.includes(draggedServicio.id)) {
            // Solo actualizamos visualmente - la transferencia real ocurre en handleDragEnd
            // Esta lógica se puede ajustar según necesidad
        }
    }, [draggedServicio, serviciosSeleccionadosIds]);

    // Eliminar un servicio de los seleccionados (useCallback)
    const quitarServicio = useCallback((id: string) => {
        setServiciosSeleccionados(prev => prev.filter(s => s.id !== id));
    }, []);

    // Añadir servicio a seleccionados (useCallback)
    const agregarServicio = useCallback((servicio: ServicioConRelaciones) => {
        if (!serviciosSeleccionadosIds.includes(servicio.id)) {
            setServiciosSeleccionados(prev => [...prev, servicio]);
        }
    }, [serviciosSeleccionadosIds]);

    // Cambiar el criterio de ordenación (useCallback)
    const requestSort = useCallback((key: string) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
        }));
    }, []);

    // Manejar reset del formulario (useCallback)
    const handleReset = useCallback(() => {
        setServiciosSeleccionados([]);
        setConsecutivoLiquidacion("");
    }, []);

    // Calcular valor total (memoizado)
    const valorTotal = useMemo(() => {
        return serviciosSeleccionados.reduce((sum, servicio) => sum + servicio.valor, 0);
    }, [serviciosSeleccionados]);

    // Manejar envío del formulario (useCallback)
    const handleSubmit = useCallback(() => {
        if (serviciosSeleccionados.length === 0) {
            addToast({
                title: "Error",
                description: "Debe seleccionar al menos un servicio para liquidar",
                color: "danger",
            });
            return;
        }

        if (!consecutivoLiquidacion || !fechaLiquidacion) {
            addToast({
                title: "Error",
                description: "Complete todos los campos del formulario",
                color: "danger",
            });
            return;
        }

        // Aquí iría la lógica para procesar la liquidación
        const datosLiquidacion = {
            consecutivo: consecutivoLiquidacion,
            fecha: fechaLiquidacion,
            servicios: serviciosSeleccionados.map(s => s.id)
        };

        console.log("Datos para liquidación:", datosLiquidacion);

        addToast({
            title: "Éxito",
            description: `${serviciosSeleccionados.length} servicios liquidados correctamente`,
            color: "success",
        });

        handleReset();
        handleModalLiquidar();
    }, [serviciosSeleccionados, consecutivoLiquidacion, fechaLiquidacion, handleReset, handleModalLiquidar]);

    // Obtener el elemento activo para mostrar en el overlay (memoizado)
    const activeItem = useMemo(() => {
        if (activeId && draggedServicio) {
            const isSelected = activeId.startsWith('seleccionado-');
            return { ...draggedServicio, isSelected };
        }
        return null;
    }, [activeId, draggedServicio]);

    return (
        <Modal
            isOpen={modalLiquidar}
            size={"full"}
            onClose={handleModalLiquidar}
        >
            <ModalContent className="p-6 overflow-scroll">
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 border-b pb-4">
                            <h2 className="text-xl font-bold">Liquidación de Servicios</h2>
                            <p className="text-sm text-gray-500">
                                Arrastre los servicios realizados al panel de servicios seleccionados para incluirlos en la liquidación
                            </p>
                        </ModalHeader>
                        <ModalBody className="my-4">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Panel izquierdo: Listado de servicios realizados */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Listado de servicios realizados</h3>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => requestSort("fecha_realizacion")}
                                                    className="flex items-center"
                                                >
                                                    {sortConfig.key === "fecha_realizacion" && sortConfig.direction === "asc"
                                                        ? <SortAscIcon className="h-4 w-4 mr-1" />
                                                        : <SortDescIcon className="h-4 w-4 mr-1" />
                                                    }
                                                    Fecha
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => requestSort("valor")}
                                                    className="flex items-center"
                                                >
                                                    {sortConfig.key === "valor" && sortConfig.direction === "asc"
                                                        ? <SortAscIcon className="h-4 w-4 mr-1" />
                                                        : <SortDescIcon className="h-4 w-4 mr-1" />
                                                    }
                                                    Valor
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex space-x-2">
                                            <div className="flex-1 relative">
                                                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    className="pl-9"
                                                    type="text"
                                                    placeholder="Buscar por origen, destino, planilla o cliente..."
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
                                                        servicio={servicio}
                                                        isSelected={false}
                                                        onClick={() => agregarServicio(servicio)}
                                                        isDragging={activeId === servicio.id}
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
                                                    <label className="block text-sm font-medium mb-1">
                                                        Consecutivo de liquidación
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={consecutivoLiquidacion}
                                                        onChange={(e) => setConsecutivoLiquidacion(e.target.value)}
                                                        placeholder="Ingrese el consecutivo"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Fecha de liquidación
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        value={fechaLiquidacion}
                                                        onChange={(e) => setFechaLiquidacion(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </form>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Servicios seleccionados</h3>
                                            <ServiciosContainer
                                                id="serviciosSeleccionados"
                                                onDragEnter={handleDragEnterSeleccionados}
                                                className="transition-all duration-200"
                                            >
                                                {serviciosSeleccionados.length > 0 ? (
                                                    serviciosSeleccionados.map((servicio) => (
                                                        <ServicioItem
                                                            key={`seleccionado-${servicio.id}`}
                                                            servicio={servicio}
                                                            isSelected={true}
                                                            onClick={() => quitarServicio(servicio.id ?? '')}
                                                            isDragging={activeId === `seleccionado-${servicio.id}`}
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
                                                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTotal)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Overlay para el elemento que se está arrastrando */}
                                <DragOverlay>
                                    {activeItem ? (
                                        <div className="p-3 rounded-md bg-white border shadow-lg">
                                            <div className="flex justify-between">
                                                <div className="font-medium">
                                                    {activeItem.origen_especifico} → {activeItem.destino_especifico}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-medium">Planilla:</span> {activeItem.numero_planilla}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">Cliente:</span> {activeItem.cliente?.Nombre}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">Fecha:</span> {format(new Date(activeItem.fecha_realizacion || activeItem.createdAt), "dd/MM/yyyy")}
                                            </div>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </ModalBody>
                        <ModalFooter className="border-t pt-4 flex justify-end space-x-3">
                            <Button radius="sm" variant="light" color="primary" onPress={handleReset}>
                                Limpiar selección
                            </Button>
                            <Button radius="sm" variant="light" color="danger" onPress={handleModalLiquidar}>
                                Cancelar
                            </Button>
                            <Button radius="sm" className="bg-emerald-600 text-white" onPress={handleSubmit} disabled={serviciosSeleccionados.length === 0}>
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Liquidar servicios
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}