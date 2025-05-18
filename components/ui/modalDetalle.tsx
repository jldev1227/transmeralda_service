import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import {
    UserIcon,
    Phone,
    Mail,
    Calendar,
    Truck,
    Heart,
    IdCard,
    ShieldCheck,
    Edit,
    Download,
} from "lucide-react";
import Image from "next/image";

import {
    Servicio,
} from "@/context/serviceContext";
import EnhancedMapComponent from "../enhancedMapComponent";

interface ModalDetalleConductorProps {
    isOpen: boolean;
    onClose: () => void;
    servicio: Servicio | null;
    onEdit?: () => void;
}

const ModalDetalleServicio: React.FC<ModalDetalleConductorProps> = ({
    isOpen,
    onClose,
    servicio,
    onEdit,
}) => {
    if (!servicio) return null;


    // Función para formatear fecha YYYY-MM-DD a formato legible
    const formatearFecha = (fecha?: string) => {
        if (!fecha) return "No especificada";

        return new Date(fecha).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Función para formatear valores monetarios
    const formatearDinero = (valor?: number) => {
        if (!valor && valor !== 0) return "No especificado";

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor);
    };

    const serviceTypeTextMap: Record<string, string> = {
        herramienta: "Cargado con herramienta",
        personal: "Deplazamineto de personal",
        vehiculo: "Posicionar vehiculo",
    };

    const getServiceTypeText = (tipo: string): string => {
        return serviceTypeTextMap[tipo] || tipo;
    };

    return (
        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onClose}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <UserIcon className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-semibold">Detalle del Servicio</h3>
                            </div>
                            <Badge className={`px-3 py-1`}>
                                {servicio.estado}
                            </Badge>
                        </ModalHeader>

                        <ModalBody>
                            <EnhancedMapComponent
                                getServiceTypeText={getServiceTypeText}
                                selectedServicio={servicio}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <div className="flex space-x-2">
                                <Button
                                    color="primary"
                                    radius="sm"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cerrar
                                </Button>

                                {/* Botón para descargar información (opcional) */}
                                <Button
                                    color="secondary"
                                    radius="sm"
                                    startContent={<Download className="h-4 w-4" />}
                                    variant="flat"
                                    onPress={() => {
                                        // Lógica para descargar información del servicio (PDF, CSV, etc.)
                                        alert(
                                            "Funcionalidad para descargar información del servicio",
                                        );
                                    }}
                                >
                                    Descargar Info
                                </Button>

                                {/* Botón de editar (opcional) */}
                                {onEdit && (
                                    <Button
                                        color="primary"
                                        radius="sm"
                                        startContent={<Edit className="h-4 w-4" />}
                                        variant="solid"
                                        onPress={onEdit}
                                    >
                                        Editar Servicio
                                    </Button>
                                )}
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalDetalleServicio;
