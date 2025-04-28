import { Edit } from 'lucide-react';
import { useService } from '@/context/serviceContext';

const ServiciosSlider = ({
    filteredServicios,
    selectedServicio,
    handleSelectServicio,
    getStatusColor,
    getStatusText,
    formatearFecha
}) => {
    const { handleModalAdd } = useService();

    // Función para manejar el evento de edición
    const handleEdit = (e, servicio) => {
        e.stopPropagation(); // Evita que se active también el onClick del contenedor
        
        // No mostrar botón de edición si el servicio está completado o cancelado
        if (servicio.estado === 'realizado' || servicio.estado === 'cancelado') {
            return;
        }
        
        handleModalAdd(servicio); // Abre el modal con el servicio a editar
    };
    
    // Determinar si se debe mostrar el botón de edición
    const shouldShowEditButton = (servicio) => {
        return servicio.estado !== 'realizado' && servicio.estado !== 'cancelado';
    };

    return (
        <div className="servicios-slider-container space-y-3">
            {filteredServicios.map((servicio) => (
                <div
                    key={servicio.id}
                    className="px-1 relative group" 
                    style={{ width: 'auto', minWidth: '280px', maxWidth: '350px' }}
                >
                    <div
                        className={`select-none p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md relative ${selectedServicio?.id === servicio.id
                                ? "border-emerald-500 bg-emerald-50"
                                : ""
                            }`}
                        onClick={() => handleSelectServicio(servicio)}
                    >
                        {/* Botón de edición que aparece al deslizar/hover (solo si no está realizado o cancelado) */}
                        {shouldShowEditButton(servicio) && (
                            <div
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={(e) => handleEdit(e, servicio)}
                            >
                                <Edit size={16} />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                            <div className="overflow-hidden">
                                <div className="font-semibold truncate">
                                    {servicio.origen_especifico}
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                    → {servicio.destino_especifico}
                                </div>
                            </div>
                            <span
                                className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-1 flex-shrink-0"
                                style={{
                                    backgroundColor: `${getStatusColor(servicio.estado)}20`,
                                    color: getStatusColor(servicio.estado),
                                }}
                            >
                                {getStatusText(servicio.estado)}
                            </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                            <div className="truncate">
                                Solicitado: {formatearFecha(servicio.fecha_solicitud)}
                            </div>
                            <div className="truncate">
                                Realización: {formatearFecha(servicio.fecha_realizacion)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiciosSlider;