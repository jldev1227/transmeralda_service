import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import {
  UserIcon,
  ClipboardListIcon,
  HistoryIcon,
  SearchIcon,
  InfoIcon,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  DollarSignIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  X,
  ChevronUpIcon,
  ChevronDownIcon,
  BracketsIcon,
} from "lucide-react";

import CustomTable from "./CustomTable";

import { apiClient } from "@/config/apiClient";
import { ServicioConRelaciones } from "@/context/serviceContext";
import { formatearFecha } from "@/helpers";

// Definición del tipo para los registros históricos
interface HistoricoServicio {
  id: string;
  servicio_id: string;
  usuario_id: string;
  campo_modificado: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  tipo_operacion: "creacion" | "actualizacion" | "eliminacion";
  fecha_modificacion: string;
  ip_usuario?: string;
  navegador_usuario?: string;
  detalles?: any;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: string;
  };
}

interface ModalHistorialServicioProps {
  isOpen: boolean;
  onClose: () => void;
  servicioId: string | null;
}

const ModalHistorialServicio: React.FC<ModalHistorialServicioProps> = ({
  isOpen,
  onClose,
  servicioId,
}) => {
  const [historico, setHistorico] = useState<HistoricoServicio[]>([]);
  const [servicio, setServicio] = useState<ServicioConRelaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [expandedValues, setExpandedValues] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  // Cargar datos del historial cuando cambia el ID
  useEffect(() => {
    const fetchHistorial = async () => {
      if (!servicioId) return;

      setLoading(true);
      setError(null);

      try {
        // Obtener información del servicio
        const servicioResponse = await apiClient.get<{
          success: boolean;
          data: ServicioConRelaciones;
        }>(`/api/servicios/${servicioId}`);

        if (servicioResponse.data.success) {
          setServicio(servicioResponse.data.data);
        }

        // Obtener historial del servicio
        const historicoResponse = await apiClient.get<{
          success: boolean;
          data: HistoricoServicio[];
          total: number;
        }>(`/api/servicios-historico/servicio/${servicioId}`);

        if (historicoResponse.data.success) {
          // Ordenar por fecha más reciente primero
          const historicoOrdenado = historicoResponse.data.data.sort(
            (a, b) =>
              new Date(b.fecha_modificacion).getTime() -
              new Date(a.fecha_modificacion).getTime(),
          );

          setHistorico(historicoOrdenado);
        } else {
          throw new Error("No se pudo obtener el historial del servicio");
        }
      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError(
          "Error al cargar el historial del servicio. Por favor, intenta nuevamente.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && servicioId) {
      fetchHistorial();
    } else {
      // Limpiar datos cuando se cierra el modal
      setHistorico([]);
      setServicio(null);
      setSearchTerm("");
      setFiltroTipo(null);
    }
  }, [isOpen, servicioId]);

  // Filtrar registros históricos
  const historicoFiltrado = useMemo(() => {
    return historico.filter((registro) => {
      const matchesSearch =
        searchTerm === "" ||
        getCampoLegible(registro.campo_modificado)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registro.usuario.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registro.usuario.apellido
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (registro.valor_anterior &&
          registro.valor_anterior
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (registro.valor_nuevo &&
          registro.valor_nuevo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesTipo =
        filtroTipo === null || registro.tipo_operacion === filtroTipo;

      return matchesSearch && matchesTipo;
    });
  }, [historico, searchTerm, filtroTipo]);

  // Renderizar chip para el tipo de operación
  const renderTipoOperacionChip = (tipo: string) => {
    const configs = {
      creacion: {
        color: "success" as const,
        icon: CheckCircleIcon,
        label: "Creación",
      },
      actualizacion: {
        color: "warning" as const,
        icon: AlertTriangleIcon,
        label: "Actualización",
      },
      eliminacion: {
        color: "danger" as const,
        icon: XCircleIcon,
        label: "Eliminación",
      },
    };

    const config = configs[tipo as keyof typeof configs] || {
      color: "default" as const,
      icon: InfoIcon,
      label: tipo,
    };

    return (
      <Chip
        color={config.color}
        size="sm"
        startContent={<config.icon className="h-3 w-3" />}
        variant="flat"
      >
        {config.label}
      </Chip>
    );
  };

  // Función para obtener un valor legible del campo modificado con iconos
  const getCampoLegible = (campo: string): string => {
    const camposLegibles: Record<string, string> = {
      creacion_servicio: "Creación de servicio",
      eliminacion_servicio: "Eliminación de servicio",
      estado: "Estado",
      origen_id: "Origen",
      destino_id: "Destino",
      origen_especifico: "Origen específico",
      destino_especifico: "Destino específico",
      conductor_id: "Conductor",
      vehiculo_id: "Vehículo",
      cliente_id: "Cliente",
      proposito_servicio: "Propósito del servicio",
      fecha_solicitud: "Fecha de solicitud",
      fecha_realizacion: "Fecha de realización",
      fecha_finalizacion: "Fecha de finalización",
      valor: "Valor",
      numero_planilla: "Número de planilla",
      observaciones: "Observaciones",
    };

    return camposLegibles[campo] || campo;
  };

  // Función para obtener el icono del campo
  const getCampoIcon = (campo: string) => {
    const iconos: Record<string, React.ComponentType<any>> = {
      estado: ClipboardListIcon,
      origen_id: MapPinIcon,
      destino_id: MapPinIcon,
      origen_especifico: MapPinIcon,
      destino_especifico: MapPinIcon,
      conductor_id: UserIcon,
      vehiculo_id: TruckIcon,
      fecha_solicitud: CalendarIcon,
      fecha_realizacion: CalendarIcon,
      fecha_finalizacion: CalendarIcon,
      valor: DollarSignIcon,
      observaciones: FileTextIcon,
    };

    const IconComponent = iconos[campo] || InfoIcon;

    return <IconComponent className="h-4 w-4" />;
  };

  // ✅ Función helper para detectar y formatear JSON
  const esJSON = (valor: string): boolean => {
    try {
      JSON.parse(valor);

      return valor.trim().startsWith("{") || valor.trim().startsWith("[");
    } catch {
      return false;
    }
  };

  const formatearJSON = (
    jsonString: string,
    colapsado: boolean = false,
  ): string => {
    try {
      const obj = JSON.parse(jsonString);

      if (colapsado) {
        // Versión resumida del JSON
        const campos = Object.keys(obj);
        const camposImportantes = campos.filter(
          (campo) =>
            !["createdAt", "updatedAt", "id"].includes(campo) &&
            obj[campo] !== null &&
            obj[campo] !== "",
        );

        const resumen = camposImportantes.slice(0, 3).map((campo) => {
          let valor = obj[campo];

          if (typeof valor === "string" && valor.length > 30) {
            valor = valor.substring(0, 27) + "...";
          }

          return `${campo}: ${valor}`;
        });

        return (
          resumen.join("\n") +
          (camposImportantes.length > 3
            ? `\n... +${camposImportantes.length - 3} campos más`
            : "")
        );
      }

      // Versión completa formateada
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonString;
    }
  };

  const formatearValor = (
    valor: string | null,
    campo: string,
    showComplete: boolean = false,
  ): string => {
    if (!valor) return "Sin valor";

    // ✅ Manejo especial para creación de servicio
    if (campo === "creacion_servicio") {
      try {
        const obj = JSON.parse(valor);

        // Solo mostrar fecha de creación
        if (obj.createdAt) {
          return `Servicio creado el ${formatearFecha(obj.createdAt, true, false, false)}`;
        } else if (obj.fecha_solicitud) {
          return `Servicio creado el ${formatearFecha(obj.fecha_solicitud, true, false, false)}`;
        }

        return "Servicio creado";
      } catch {
        return "Servicio creado";
      }
    }

    // ✅ Detectar si es JSON (pero no para creación de servicio)
    if (esJSON(valor)) {
      return formatearJSON(valor, !showComplete);
    }

    // Formatear fechas
    if (campo.includes("fecha")) {
      try {
        return formatearFecha(valor, true, false, false);
      } catch {
        return valor;
      }
    }

    // Formatear valores monetarios
    if (campo === "valor") {
      try {
        const num = parseFloat(valor);

        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(num);
      } catch {
        return valor;
      }
    }

    // Para otros valores
    if (showComplete) {
      return valor;
    }

    return valor.length > 100 ? valor.substring(0, 100) + "..." : valor;
  };

  // ✅ Componente ValorExpandible con manejo especial para creación
  const ValorExpandible = ({
    valor,
    campo,
    recordId,
    className = "",
  }: {
    valor: string | null;
    campo: string;
    recordId: string;
    className?: string;
  }) => {
    const valorOriginal = valor || "";

    // ✅ Manejo especial para creación de servicio
    if (campo === "creacion_servicio") {
      const valorFormateado = formatearValor(valorOriginal, campo, true);

      return (
        <div className={`${className} max-w-xs`}>
          <div className="flex items-center gap-2 p-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-700 font-medium">
              {valorFormateado}
            </span>
          </div>
        </div>
      );
    }

    const esObjetoJSON = esJSON(valorOriginal);
    const valorFormateado = formatearValor(valorOriginal, campo, false); // Colapsado
    const valorCompleto = formatearValor(valorOriginal, campo, true); // Expandido

    // Para JSON, consideramos "largo" si tiene más de 3 campos principales
    const esMuyLargo = esObjetoJSON
      ? valorOriginal.length > 200 ||
        (valorOriginal.match(/,/g) || []).length > 3
      : valorFormateado.length > 80;

    const isExpanded = expandedValues.has(`${recordId}-${campo}`);

    const toggleExpanded = () => {
      const key = `${recordId}-${campo}`;
      const newSet = new Set(expandedValues);

      if (isExpanded) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      setExpandedValues(newSet);
    };

    // ✅ Renderizado especial para JSON
    if (esObjetoJSON) {
      return (
        <div className="space-y-2 max-w-sm">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-xs text-blue-600 font-medium">
              Objeto JSON
            </span>
          </div>

          <div className={`${className} bg-gray-50 border rounded p-2`}>
            <pre
              className={`text-xs font-mono leading-relaxed transition-all duration-200 ${
                isExpanded ? "max-h-none" : "max-h-16 overflow-hidden"
              }`}
            >
              {isExpanded ? valorCompleto : valorFormateado}
            </pre>
          </div>

          {esMuyLargo && (
            <Button
              className="text-xs h-6 px-2 min-w-0"
              color="primary"
              size="sm"
              variant="flat"
              onPress={toggleExpanded}
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="w-3 h-3 mr-1" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDownIcon className="w-3 h-3 mr-1" />
                  Ver JSON completo
                </>
              )}
            </Button>
          )}
        </div>
      );
    }

    // ✅ Función para dividir texto en líneas más cortas
    const dividirTextoEnLineas = (
      texto: string,
      maxLength: number = 40,
    ): string => {
      if (texto.length <= maxLength) return texto;

      const palabras = texto.split(" ");
      const lineas: string[] = [];
      let lineaActual = "";

      palabras.forEach((palabra) => {
        if ((lineaActual + palabra).length <= maxLength) {
          lineaActual += (lineaActual ? " " : "") + palabra;
        } else {
          if (lineaActual) {
            lineas.push(lineaActual);
            lineaActual = palabra;
          } else {
            // Palabra muy larga, cortarla
            lineas.push(palabra.substring(0, maxLength));
            lineaActual = palabra.substring(maxLength);
          }
        }
      });

      if (lineaActual) {
        lineas.push(lineaActual);
      }

      return lineas.join("\n");
    };

    // ✅ Mostrar solo las primeras 2-3 líneas cuando está colapsado
    const getTextoMostrado = () => {
      if (!isExpanded && esMuyLargo) {
        const lineas = dividirTextoEnLineas(valorFormateado, 40).split("\n");
        const primerasLineas = lineas.slice(0, 2); // Solo 2 líneas

        return primerasLineas.join("\n") + (lineas.length > 2 ? "..." : "");
      }

      return dividirTextoEnLineas(
        isExpanded ? valorCompleto : valorFormateado,
        40,
      );
    };

    // ✅ Renderizado normal para texto
    if (!esMuyLargo) {
      return (
        <div className={`${className} max-w-xs`}>
          <pre className="whitespace-pre-wrap text-xs font-sans break-words leading-relaxed">
            {dividirTextoEnLineas(valorFormateado, 40)}
          </pre>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-w-xs">
        <div
          className={`${className} transition-all duration-200 ${
            isExpanded ? "max-h-none" : "max-h-16 overflow-hidden"
          }`}
        >
          <pre className="whitespace-pre-wrap text-xs font-sans break-words leading-relaxed">
            {getTextoMostrado()}
          </pre>

          {/* Gradiente de fade para indicar que hay más contenido */}
          {!isExpanded && esMuyLargo && (
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        <Button
          className="text-xs h-auto py-1 px-2 min-w-0"
          color="primary"
          size="sm"
          variant="light"
          onPress={toggleExpanded}
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="w-3 h-3 mr-1" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-3 h-3 mr-1" />
              Ver más
            </>
          )}
        </Button>
      </div>
    );
  };

  // ✅ JSONViewer también con manejo especial para creación
  const JSONViewer = ({
    jsonString,
    recordId,
  }: {
    jsonString: string;
    recordId: string;
    className?: string;
  }) => {
    // ✅ Si es para creación de servicio, no mostrar el JSONViewer
    if (recordId.includes("creacion")) {
      return null; // El ValorExpandible ya maneja este caso
    }

    try {
      const obj = JSON.parse(jsonString);
      const campos = Object.keys(obj);
      const camposImportantes = campos.filter(
        (campo) =>
          !["createdAt", "updatedAt", "id"].includes(campo) &&
          obj[campo] !== null &&
          obj[campo] !== "",
      );

      const resumenCampos = camposImportantes.slice(0, 4).map((campo) => ({
        nombre: campo,
        valor: obj[campo],
        tipo: typeof obj[campo],
      }));

      return (
        <div className="space-y-2 max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-xs text-blue-600 font-medium">
                Objeto JSON ({campos.length} campos)
              </span>
            </div>
          </div>

          {!isExpanded ? (
            // Vista resumida
            <div className="bg-blue-50 border border-blue-200 rounded p-2 space-y-1">
              {resumenCampos.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-blue-700 font-medium min-w-0 flex-shrink-0">
                    {item.nombre}:
                  </span>
                  <span className="text-gray-700 break-words flex-1">
                    {typeof item.valor === "string" && item.valor.length > 25
                      ? `${item.valor.substring(0, 25)}...`
                      : String(item.valor)}
                  </span>
                </div>
              ))}
              {camposImportantes.length > 4 && (
                <div className="text-xs text-blue-600 italic">
                  ... +{camposImportantes.length - 4} campos más
                </div>
              )}
            </div>
          ) : (
            // Vista completa
            <div className="bg-gray-50 border rounded p-2">
              <pre className="text-xs font-mono leading-relaxed max-h-64 overflow-y-auto">
                {JSON.stringify(obj, null, 2)}
              </pre>
            </div>
          )}

          <Button
            className="text-xs h-6 px-2 min-w-0"
            color="primary"
            size="sm"
            variant="flat"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="w-3 h-3 mr-1" />
                Ver resumen
              </>
            ) : (
              <>
                <BracketsIcon className="w-3 h-3 mr-1" />
                Ver JSON completo
              </>
            )}
          </Button>
        </div>
      );
    } catch {
      return (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          JSON inválido
        </div>
      );
    }
  };

  // Estadísticas del historial
  const estadisticas = useMemo(() => {
    const tipos = historico.reduce(
      (acc, registro) => {
        acc[registro.tipo_operacion] = (acc[registro.tipo_operacion] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    const usuarios = new Set(historico.map((r) => r.usuario.id)).size;

    return { tipos, usuarios };
  }, [historico]);

  return (
    <Modal
      hideCloseButton
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-emerald-900 to-emerald-900/10 backdrop-opacity-90",
        base: "max-w-7xl max-h-[95vh]",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      onClose={onClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-3 pb-2">
              <div className="flex justify-between items-start w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HistoryIcon className="h-6 w-6 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Historial de Servicio
                    </h2>
                  </div>

                  {servicio && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Ruta:</span>
                          <span className="font-medium truncate">
                            {servicio.origen_especifico} →{" "}
                            {servicio.destino_especifico}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Fecha:</span>
                          <span className="font-medium">
                            {formatearFecha(
                              servicio.fecha_solicitud,
                              false,
                              false,
                              false,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClipboardListIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Estado:</span>
                          <Chip
                            color={
                              servicio.estado === "realizado"
                                ? "primary"
                                : servicio.estado === "cancelado"
                                  ? "danger"
                                  : servicio.estado === "en_curso"
                                    ? "success"
                                    : servicio.estado === "planificado"
                                      ? "warning"
                                      : servicio.estado === "planilla_asignada"
                                        ? "secondary"
                                        : "default"
                            }
                            size="sm"
                            variant="flat"
                          >
                            {servicio.estado.charAt(0).toUpperCase() +
                              servicio.estado.slice(1).replace("_", " ")}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Chip color="primary" size="sm" variant="flat">
                    Registros
                  </Chip>
                </div>
              </div>

              {/* Estadísticas rápidas */}
              {!loading && historico.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {Object.entries(estadisticas.tipos).map(
                    ([tipo, cantidad]) => (
                      <div
                        key={tipo}
                        className="flex items-center gap-1 text-xs"
                      >
                        {renderTipoOperacionChip(tipo)}
                        <span className="text-gray-500">({cantidad})</span>
                      </div>
                    ),
                  )}
                  <div className="flex items-center gap-1 text-xs">
                    <UserIcon className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">
                      {estadisticas.usuarios} usuarios
                    </span>
                  </div>
                </div>
              )}
            </ModalHeader>

            <ModalBody className="px-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <Spinner color="success" size="lg" />
                    <p className="mt-4 text-gray-600">Cargando historial...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 text-lg font-medium mb-2">
                    Error al cargar el historial
                  </p>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : historico.length > 0 ? (
                <div className="space-y-6">
                  {/* Tabla de historial */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <CustomTable
                      className="rounded-lg"
                      columns={[
                        {
                          key: "fecha",
                          label: "FECHA Y TIPO",
                          renderCell: (item: HistoricoServicio) => (
                            <div className="space-y-1">
                              <div className="font-semibold text-sm">
                                {formatearFecha(
                                  item.fecha_modificacion,
                                  true,
                                  false,
                                  false,
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  item.fecha_modificacion,
                                ).toLocaleTimeString("es-CO")}
                              </div>
                              {renderTipoOperacionChip(item.tipo_operacion)}
                            </div>
                          ),
                        },
                        {
                          key: "campo",
                          label: "CAMPO MODIFICADO",
                          renderCell: (item: HistoricoServicio) => (
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center gap-2">
                                {getCampoIcon(item.campo_modificado)}
                                <span className="font-medium text-sm break-words">
                                  {getCampoLegible(item.campo_modificado)}
                                </span>
                              </div>

                              {item.tipo_operacion === "actualizacion" && (
                                <div className="space-y-3 text-xs">
                                  <div className="space-y-1">
                                    <span className="text-red-600 font-medium text-xs">
                                      Anterior:
                                    </span>
                                    <div className="bg-red-50 px-2 py-1 rounded border-l-2 border-red-200">
                                      {/* ✅ Para creación de servicio, solo usar ValorExpandible */}
                                      {item.campo_modificado ===
                                        "creacion_servicio" ||
                                      !esJSON(item.valor_anterior || "") ? (
                                        <ValorExpandible
                                          campo={item.campo_modificado}
                                          className="text-red-700"
                                          recordId={`${item.id}-anterior`}
                                          valor={item.valor_anterior}
                                        />
                                      ) : (
                                        <JSONViewer
                                          className="text-red-700"
                                          jsonString={item.valor_anterior || ""}
                                          recordId={`${item.id}-anterior`}
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-emerald-600 font-medium text-xs">
                                      Nuevo:
                                    </span>
                                    <div className="bg-emerald-50 px-2 py-1 rounded border-l-2 border-emerald-200">
                                      {/* ✅ Para creación de servicio, solo usar ValorExpandible */}
                                      {item.campo_modificado ===
                                        "creacion_servicio" ||
                                      !esJSON(item.valor_nuevo || "") ? (
                                        <ValorExpandible
                                          campo={item.campo_modificado}
                                          className="text-emerald-700"
                                          recordId={`${item.id}-nuevo`}
                                          valor={item.valor_nuevo}
                                        />
                                      ) : (
                                        <JSONViewer
                                          className="text-emerald-700"
                                          jsonString={item.valor_nuevo || ""}
                                          recordId={`${item.id}-nuevo`}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {item.tipo_operacion === "creacion" && (
                                <div className="text-xs">
                                  <div className="space-y-1">
                                    <span className="text-emerald-600 font-medium text-xs">
                                      Valor inicial:
                                    </span>
                                    <div className="bg-emerald-50 px-2 py-1 rounded border-l-2 border-emerald-200">
                                      {/* ✅ Para creación de servicio, siempre usar ValorExpandible */}
                                      <ValorExpandible
                                        campo={item.campo_modificado}
                                        className="text-emerald-700"
                                        recordId={`${item.id}-creacion`}
                                        valor={item.valor_nuevo}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ),
                        },
                        {
                          key: "usuario",
                          label: "USUARIO",
                          renderCell: (item: HistoricoServicio) => (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-sm">
                                  {item.usuario.nombre} {item.usuario.apellido}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.usuario.role}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.usuario.email}
                              </div>
                            </div>
                          ),
                        },
                      ]}
                      data={historicoFiltrado}
                      emptyContent={
                        <div className="text-center py-12">
                          <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 text-lg font-medium mb-2">
                            No se encontraron registros
                          </p>
                          <p className="text-gray-500">
                            {searchTerm || filtroTipo
                              ? "Intenta ajustar los filtros de búsqueda"
                              : "No hay registros históricos disponibles"}
                          </p>
                        </div>
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium mb-2">
                    Sin historial disponible
                  </p>
                  <p className="text-gray-500">
                    No hay registros históricos para este servicio
                  </p>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-gray-200">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-500">
                  {!loading && historico.length > 0 && (
                    <span>
                      {historicoFiltrado.length} registro
                      {historicoFiltrado.length !== 1 ? "s" : ""} mostrado
                      {historicoFiltrado.length !== 1 ? "s" : ""}
                      {historicoFiltrado.length !== historico.length &&
                        ` de ${historico.length} total`}
                    </span>
                  )}
                </div>
                <Button
                  color="primary"
                  startContent={<X className="h-4 w-4" />}
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalHistorialServicio;
