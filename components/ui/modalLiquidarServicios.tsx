import React, { useState, useEffect } from "react";
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
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Componente de servicio arrastrable
function ServicioItem({ servicio, isSelected, onClick }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: isSelected ? `seleccionado-${servicio.id}` : servicio.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 mb-2 rounded-md bg-white border hover:shadow-md cursor-grab"
        >
            <div className="flex justify-between">
                <div className="font-medium">
                    {servicio.origen_especifico} → {servicio.destino_especifico}
                </div>
                <div className="text-sm font-semibold">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Planilla:</span> {servicio.numero_planilla}
            </div>
            <div className="text-sm text-gray-500">
                <span className="font-medium">Cliente:</span> {servicio.cliente?.Nombre}
            </div>
            {!isSelected && (
                <div className="text-sm text-gray-500">
                    <span className="font-medium">Fecha:</span> {format(new Date(servicio.fecha_realizacion || servicio.createdAt), "dd/MM/yyyy")}
                </div>
            )}
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
}

// Componente para los servicios seleccionados
function ServicioSeleccionado({ servicio, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `seleccionado-${servicio.id}`,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 mb-2 rounded-md bg-white border hover:shadow-md cursor-grab"
        >
            <div className="flex justify-between">
                <div className="font-medium">
                    {servicio.origen?.nombre} → {servicio.destino?.nombre}
                </div>
                <button
                    onClick={() => onRemove(servicio.id)}
                    type="button"
                    className="text-red-500 hover:text-red-700"
                >
                    <XIcon className="h-4 w-4" />
                </button>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Planilla:</span> {servicio.numero_planilla}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <div>
                    <span className="font-medium">Cliente:</span> {servicio.cliente?.nombre}
                </div>
                <div className="font-semibold">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                </div>
            </div>
        </div>
    );
}

export default function ModalLiquidarServicios() {
    const { servicios, modalLiquidar, handleModalLiquidar } = useService();

    // Estados para el formulario y los servicios
    const [serviciosRealizados, setServiciosRealizados] = useState<ServicioConRelaciones>([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "fecha_realizacion", direction: "desc" });
    const [consecutivoLiquidacion, setConsecutivoLiquidacion] = useState("");
    const [fechaLiquidacion, setFechaLiquidacion] = useState(format(new Date(), "yyyy-MM-dd"));
    const [activeId, setActiveId] = useState(null);

    // Sensores para dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Filtrar servicios realizados con número de planilla
    useEffect(() => {
        if (servicios && servicios.length > 0) {
            console.log(servicios)
            const filtrados = servicios.filter(
                (servicio) =>
                    servicio.estado === "planilla_asignada" &&
                    servicio.numero_planilla &&
                    servicio.numero_planilla.trim() !== ""
            );
            setServiciosRealizados(filtrados);
        }
    }, [servicios]);

    // Aplicar búsqueda y filtros a los servicios
    const serviciosFiltrados = serviciosRealizados.filter((servicio) => {
        // Filtrar por término de búsqueda
        const searchMatch =
            searchTerm === "" ||
            servicio.origen?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servicio.destino?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servicio.numero_planilla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servicio.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());

        return searchMatch;
    });

    // Ordenar servicios
    const serviciosOrdenados = [...serviciosFiltrados].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Obtener IDs para SortableContext
    const serviciosIds = serviciosOrdenados.map(servicio => servicio.id);
    const seleccionadosIds = serviciosSeleccionados.map(servicio => `seleccionado-${servicio.id}`);

    // Manejo del DnD
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        // Si el destino es diferente del origen, manejar la transferencia
        if (active.id !== over.id) {
            // Si estamos arrastrando un elemento de la lista principal
            if (!active.id.toString().startsWith('seleccionado-')) {
                // Verificar si estamos soltando sobre un elemento de la lista de seleccionados
                if (over.id.toString().startsWith('seleccionado-')) {
                    // Encontrar el servicio
                    const servicio = serviciosOrdenados.find(s => s.id === active.id);
                    if (servicio && !serviciosSeleccionados.some(s => s.id === servicio.id)) {
                        setServiciosSeleccionados(prev => [...prev, servicio]);
                    }
                }
            } else if (active.id.toString().startsWith('seleccionado-')) {
                // Si estamos reordenando dentro de la lista de seleccionados
                if (over.id.toString().startsWith('seleccionado-')) {
                    setServiciosSeleccionados(items => {
                        const oldIndex = items.findIndex(
                            item => `seleccionado-${item.id}` === active.id
                        );
                        const newIndex = items.findIndex(
                            item => `seleccionado-${item.id}` === over.id
                        );
                        return arrayMove(items, oldIndex, newIndex);
                    });
                } else {
                    // Si estamos quitando un elemento de la lista de seleccionados
                    const servicioId = active.id.toString().replace('seleccionado-', '');
                    setServiciosSeleccionados(prev => prev.filter(s => s.id !== servicioId));
                }
            }
        }

        setActiveId(null);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;

        if (!over) return;

        // Si se está arrastrando desde la lista principal a la de seleccionados
        if (!active.id.toString().startsWith('seleccionado-') &&
            over.id.toString().startsWith('seleccionado-')) {
            // Encontrar el servicio
            const servicio = serviciosOrdenados.find(s => s.id === active.id);
            if (servicio && !serviciosSeleccionados.some(s => s.id === servicio.id)) {
                // Añadir a seleccionados
                // Nota: No hacemos el cambio aquí, solo en dragEnd para evitar problemas
            }
        }
    };

    // Eliminar un servicio de los seleccionados
    const quitarServicio = (id) => {
        setServiciosSeleccionados(prev => prev.filter(s => s.id !== id));
    };

    // Cambiar el criterio de ordenación
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Manejar reset del formulario
    const handleReset = () => {
        setServiciosSeleccionados([]);
        setConsecutivoLiquidacion("");
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (serviciosSeleccionados.length === 0) {
            // Mostrar notificación usando el sistema de toast
            addToast({
                title: "Error",
                description: "Debe seleccionar al menos un servicio para liquidar",
                type: "error",
            });
            return;
        }

        if (!consecutivoLiquidacion || !fechaLiquidacion) {
            // Validación de campos requeridos
            addToast({
                title: "Error",
                description: "Complete todos los campos del formulario",
                type: "error",
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
        // Llamar a la función que procesa la liquidación

        // Notificar éxito
        addToast({
            title: "Éxito",
            description: `${serviciosSeleccionados.length} servicios liquidados correctamente`,
            type: "success",
        });

        // Luego reset y cerrar modal
        handleReset();
        handleModalLiquidar();
    };

    // Obtener el elemento activo para mostrar en el overlay
    const getActiveItem = () => {
        if (!activeId) return null;

        if (activeId.toString().startsWith('seleccionado-')) {
            const servicioId = activeId.toString().replace('seleccionado-', '');
            const servicio = serviciosSeleccionados.find(s => s.id === servicioId);
            if (servicio) {
                return { ...servicio, isSelected: true };
            }
        } else {
            const servicio = serviciosOrdenados.find(s => s.id === activeId);
            if (servicio) {
                return { ...servicio, isSelected: false };
            }
        }
        return null;
    };

    const activeItem = getActiveItem();

    // Añadir servicio a seleccionados
    const agregarServicio = (servicio) => {
        if (!serviciosSeleccionados.some(s => s.id === servicio.id)) {
            setServiciosSeleccionados(prev => [...prev, servicio]);
        }
    };

    return (
        <Modal
            isOpen={modalLiquidar}
            size={"full"}
            onClose={handleModalLiquidar}
        >
            <ModalContent className="p-6">
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
                                                    onClick={() => requestSort("fecha_realizacion")}
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
                                                    onClick={() => requestSort("valor")}
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

                                        <div className="bg-gray-50 border rounded-md p-2 overflow-y-auto flex-1 min-h-[400px]">
                                            <SortableContext
                                                items={serviciosIds}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {serviciosOrdenados.length > 0 ? (
                                                    serviciosOrdenados.map((servicio) => (
                                                        <ServicioItem
                                                            key={servicio.id}
                                                            servicio={servicio}
                                                            isSelected={false}
                                                            onClick={() => agregarServicio(servicio)}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="text-center p-4 text-gray-500">
                                                        No hay servicios realizados disponibles
                                                    </div>
                                                )}
                                            </SortableContext>
                                        </div>
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
                                            <div className="bg-gray-50 border rounded-md p-2 overflow-y-auto flex-1 min-h-[300px]">
                                                <SortableContext
                                                    items={seleccionadosIds}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {serviciosSeleccionados.length > 0 ? (
                                                        serviciosSeleccionados.map((servicio) => (
                                                            <ServicioItem
                                                                key={`seleccionado-${servicio.id}`}
                                                                servicio={servicio}
                                                                isSelected={true}
                                                                onClick={() => quitarServicio(servicio.id)}
                                                            />
                                                        ))
                                                    ) : (
                                                        <div className="text-center p-4 text-gray-500">
                                                            Arrastre servicios aquí para incluirlos en la liquidación
                                                        </div>
                                                    )}
                                                </SortableContext>
                                            </div>

                                            {serviciosSeleccionados.length > 0 && (
                                                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                                                    <div className="flex justify-between font-medium">
                                                        <span>Total servicios:</span>
                                                        <span>{serviciosSeleccionados.length}</span>
                                                    </div>
                                                    <div className="flex justify-between font-semibold text-lg mt-1">
                                                        <span>Valor total:</span>
                                                        <span>
                                                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                                                                serviciosSeleccionados.reduce((sum, servicio) => sum + servicio.valor, 0)
                                                            )}
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
                                                    {activeItem.origen?.nombre} → {activeItem.destino?.nombre}
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(activeItem.valor)}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-medium">Planilla:</span> {activeItem.numero_planilla}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">Cliente:</span> {activeItem.cliente?.nombre}
                                            </div>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </ModalBody>
                        <ModalFooter className="border-t pt-4 flex justify-end space-x-3">
                            <Button variant="light" onClick={handleReset}>
                                Limpiar selección
                            </Button>
                            <Button variant="light" onClick={handleModalLiquidar}>
                                Cancelar
                            </Button>
                            <Button color="primary" onClick={handleSubmit} disabled={serviciosSeleccionados.length === 0}>
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