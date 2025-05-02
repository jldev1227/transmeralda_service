import React from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/modal";

import { useService } from "@/context/serviceContext";
import { Building, Building2 } from "lucide-react";

export default function ModalLiquidacion() {
    const { servicioLiquidar, modalLiquidacion, handleModalLiquidacion } =
        useService();

    // Obtener el servicio real del contexto
    const servicio = servicioLiquidar?.servicio;

    // Función para formatear valores
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Si no hay servicio, mostrar mensaje o regresar null
    if (!servicio) {
        return (
            <Modal
                isOpen={modalLiquidacion}
                size={"4xl"}
                onClose={() => handleModalLiquidacion()}
            >
                <ModalContent className="p-6 bg-transparent shadow-none">
                    {() => (
                        <ModalBody className="p-6 bg-white">
                            <p className="text-center text-gray-500">
                                No hay información del servicio disponible
                            </p>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        );
    }

    return (
        <>
            <Modal
                isOpen={modalLiquidacion}
                radius="sm"
                size={"5xl"}
                onClose={() => {
                    handleModalLiquidacion();
                }}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>Liquidando servicio #{servicio?.id}</ModalHeader>
                            <ModalBody>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1"
                                        htmlFor="operadora">Operadora</label>
                                    <div className="relative shadow-sm rounded-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-5 appearance-none outline-emerald-600"
                                            id="operadora"
                                            type="text"
                                            placeholder="Ingresa el nombre de la operadora"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1"
                                        htmlFor="operadora">Operadora</label>
                                    <div className="relative shadow-sm rounded-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-5 appearance-none outline-emerald-600"
                                            id="operadora"
                                            type="text"
                                            placeholder="Ingresa el nombre de la operadora"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1"
                                        htmlFor="operadora">Operadora</label>
                                    <div className="relative shadow-sm rounded-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-5 appearance-none outline-emerald-600"
                                            id="operadora"
                                            type="text"
                                            placeholder="Ingresa el nombre de la operadora"
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
