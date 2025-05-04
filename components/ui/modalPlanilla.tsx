import React from "react";
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { useState, useEffect } from 'react';
import { useService } from "@/context/serviceContext";
import { ArrowRight, Hash } from "lucide-react";
import { addToast } from "@heroui/toast";
import { formatCurrency, formatearFecha } from "@/helpers";
import RouteAndDetails from "./routeAndDetails";

export default function ModalPlanilla() {
  const { servicioPlanilla, modalPlanilla, handleModalPlanilla, asignarPlanilla } = useService();

  // Obtener el servicio real del contexto
  const servicio = servicioPlanilla?.servicio;

  // Estado para el valor de la planilla y errores
  const [planillaValue, setPlanillaValue] = useState('TM-');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si ya existe un número de planilla (modo edición)
  const isEditing = servicio?.numero_planilla ? true : false;

  // Actualizar el estado inicial cuando cambia el servicio
  useEffect(() => {
    if (servicio && servicio.numero_planilla) {
      setPlanillaValue(servicio.numero_planilla);
    } else {
      setPlanillaValue('TM-');
    }
  }, [servicio]);

  const handlePlanillaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Si el usuario borró el prefijo TM-, restaurarlo
    if (!value.startsWith('TM-')) {
      value = 'TM-' + value.replace('TM-', '');
    }

    // Asegurar que solo haya dígitos después del prefijo TM-
    const regex = /^TM-\d{0,5}$/;
    if (regex.test(value) || value === 'TM-') {
      setPlanillaValue(value);
      setError('');
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Posicionar cursor después del prefijo TM-
    const input = e.target as HTMLInputElement;
    if (input.value === 'TM-') {
      setTimeout(() => {
        if (input.selectionStart !== null && input.selectionEnd !== null) {
          input.selectionStart = input.selectionEnd = 3;
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevenir borrar el prefijo TM-
    const input = e.target as HTMLInputElement;
    if (e.key === 'Backspace' &&
      input.selectionStart !== null &&
      input.selectionEnd !== null &&
      input.selectionStart <= 3 &&
      input.selectionEnd <= 3) {
      e.preventDefault();
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que se haya ingresado algo más que solo el prefijo
    if (planillaValue === 'TM-' || planillaValue.length <= 3) {
      setError('Por favor, ingresa un número de planilla válido');
      return;
    }

    setLoading(true);

    try {

      if (servicio?.id) {
        // Llamar a la función del contexto para agregar/actualizar la planilla
        await asignarPlanilla(servicio.id, planillaValue);
      }
      // Si todo sale bien, cerrar el modal
      handleModalPlanilla();
    } catch (error) {
      // Manejar errores
      console.error(
        isEditing
          ? "Error al actualizar el número de planilla:"
          : "Error al asignar número de planilla al servicio:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Error desconocido al actualizar el número de planilla"
            : "Error desconocido al asignar número de planilla al servicio",
      );

      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al procesar el servicio",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Si no hay servicio, mostrar mensaje o regresar null
  if (!servicio) {
    return (
      <Modal
        isOpen={modalPlanilla}
        size={"4xl"}
        onClose={() => handleModalPlanilla()}
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
        isOpen={modalPlanilla}
        radius="sm"
        size={"5xl"}
        onClose={() => {
          handleModalPlanilla();
        }}
      >
        <ModalContent>
          {() => (
            <form onSubmit={handleSubmit}>
              <ModalHeader>
                {isEditing ?
                  'Actualizar número de planilla' :
                  'Asignar número de planilla'
                }
              </ModalHeader>
              <ModalBody>
                <div className="relative">
                  <h1 className="text-xl">Servicio</h1>

                  {/* Ruta */}
                  <RouteAndDetails servicio={servicio} />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="planilla">Número planilla</label>
                  <div className="relative shadow-sm rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      className="border-1 text-gray-800 pl-10 pr-10 block w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-5 appearance-none outline-emerald-600"
                      id="planilla"
                      type="text"
                      placeholder="Ingresa el número de la planilla"
                      value={planillaValue}
                      onChange={handlePlanillaChange}
                      onFocus={handleFocus}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                    onClick={() => handleModalPlanilla()}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:bg-emerald-300"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : isEditing
                      ? "Actualizar planilla"
                      : "Registrar planilla"}
                  </button>
                </div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}