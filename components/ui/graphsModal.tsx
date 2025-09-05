"use client";

import type {
  EstadisticaServicio,
  EstadisticaMunicipio,
  EstadisticaConductor,
  EstadisticaVehiculo,
  EstadisticaRuta,
  EstadisticaEmpresa,
  TendenciaTemporal,
  DatosGraficos,
  EstadoServicio,
} from "@/types/servicios";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  ChartPieIcon,
  TrendingUp,
  BarChart3,
  Activity,
  MapPin,
  User,
  Car,
  Calendar,
  Route,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Legend } from "recharts";

import { ServicioConRelaciones, useService } from "@/context/serviceContext";
import { getStatusText } from "@/utils/indext";

// Dynamic imports para evitar problemas de SSR
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false },
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);

const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false },
);
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});

// ==================== TIPOS Y CONSTANTES ====================

type TabKey =
  | "estados"
  | "municipios"
  | "conductores"
  | "vehiculos"
  | "rutas"
  | "tendencias";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: JSX.Element;
}

interface StatsCard {
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
  valueColor: string;
}

// Colores para los estados
const statusColors: Record<EstadoServicio, string> = {
  solicitado: "#6a7282",
  realizado: "#155dfc",
  en_curso: "#00bc7d",
  planilla_asignada: "#ad46ff",
  planificado: "#FF9800",
  cancelado: "#F44336",
  liquidado: "#9C27B0",
};

// ==================== COMPONENTE PRINCIPAL ====================

const EnhancedGraphsModal: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { servicios } = useService();
  const [activeTab, setActiveTab] = useState<TabKey>("estados");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ==================== PROCESAMIENTO DE DATOS ====================

  const chartsData = useMemo<DatosGraficos>(() => {
    if (!servicios || !Array.isArray(servicios) || servicios.length === 0) {
      return {
        estados: [],
        municipios: [],
        conductores: [],
        vehiculos: [],
        rutas: [],
        empresas: [],
        tendencias: [],
      };
    }

    try {
      // 1. Servicios por estado
      const estadosMap = new Map<
        string,
        { cantidad: number; valor: number; estado: EstadoServicio }
      >();

      servicios.forEach((servicio: ServicioConRelaciones) => {
        const estado = servicio?.estado || "solicitado";
        const estadoText = getStatusText ? getStatusText(estado) : estado;
        const valor = parseFloat(String(servicio?.valor || 0));

        const existing = estadosMap.get(estadoText);

        if (existing) {
          existing.cantidad += 1;
          existing.valor += valor;
        } else {
          estadosMap.set(estadoText, {
            cantidad: 1,
            valor,
            estado,
          });
        }
      });

      const estadosData: EstadisticaServicio[] = Array.from(
        estadosMap.entries(),
      ).map(([estadoText, data]) => ({
        estado: estadoText,
        cantidad: data.cantidad,
        valor: data.valor,
        color: statusColors[data.estado] || "#3388ff",
      }));

      // 2. Servicios por municipio de origen
      const municipiosMap = new Map<
        string,
        { servicios: number; valor_total: number; nombre_completo: string }
      >();

      servicios.forEach((servicio: ServicioConRelaciones) => {
        const municipio = servicio?.origen?.nombre_municipio || "Sin municipio";
        const departamento = servicio?.origen?.nombre_departamento || "";
        const key = `${municipio}${departamento ? ` (${departamento})` : ""}`;
        const valor = parseFloat(String(servicio?.valor || 0));

        const existing = municipiosMap.get(key);

        if (existing) {
          existing.servicios += 1;
          existing.valor_total += valor;
        } else {
          municipiosMap.set(key, {
            servicios: 1,
            valor_total: valor,
            nombre_completo: key,
          });
        }
      });

      const municipiosData: EstadisticaMunicipio[] = Array.from(
        municipiosMap.entries(),
      )
        .map(([key, data]) => ({
          municipio: key.length > 20 ? key.substring(0, 20) + "..." : key,
          municipio_completo: data.nombre_completo,
          servicios: data.servicios,
          valor_total: data.valor_total,
        }))
        .sort((a, b) => b.servicios - a.servicios)
        .slice(0, 10);

      // 3. Conductores más activos
      const conductoresMap = new Map<
        string,
        {
          servicios: number;
          realizados: number;
          valor_total: number;
          nombre_completo: string;
          identificacion?: string;
        }
      >();

      servicios
        .filter((s: ServicioConRelaciones) => s?.conductor?.nombre)
        .forEach((servicio: ServicioConRelaciones) => {
          const conductor =
            `${servicio.conductor!.nombre} ${servicio.conductor!.apellido || ""}`.trim();
          const valor = parseFloat(String(servicio?.valor || 0));

          const existing = conductoresMap.get(conductor);

          if (existing) {
            existing.servicios += 1;
            existing.realizados += servicio.estado === "realizado" ? 1 : 0;
            existing.valor_total += valor;
          } else {
            conductoresMap.set(conductor, {
              servicios: 1,
              realizados: servicio.estado === "realizado" ? 1 : 0,
              valor_total: valor,
              nombre_completo: conductor,
              identificacion: servicio.conductor!.numero_identificacion,
            });
          }
        });

      const conductoresData: EstadisticaConductor[] = Array.from(
        conductoresMap.entries(),
      )
        .map(([conductor, data]) => ({
          conductor:
            conductor.length > 25
              ? conductor.substring(0, 25) + "..."
              : conductor,
          conductor_completo: data.nombre_completo,
          servicios: data.servicios,
          realizados: data.realizados,
          valor_total: data.valor_total,
          identificacion: data.identificacion,
          eficiencia:
            data.servicios > 0 ? (data.realizados / data.servicios) * 100 : 0,
        }))
        .sort((a, b) => b.servicios - a.servicios)
        .slice(0, 10);

      // 4. Vehículos más utilizados
      const vehiculosMap = new Map<
        string,
        {
          servicios: number;
          valor_total: number;
          vehiculo_completo: string;
          placa: string;
          marca?: string;
          modelo?: string;
        }
      >();

      servicios
        .filter((s: ServicioConRelaciones) => s?.vehiculo?.placa)
        .forEach((servicio: ServicioConRelaciones) => {
          const vehiculo =
            `${servicio.vehiculo!.placa} - ${servicio.vehiculo!.marca || ""} ${servicio.vehiculo!.modelo || ""}`.trim();
          const valor = parseFloat(String(servicio?.valor || 0));

          const existing = vehiculosMap.get(vehiculo);

          if (existing) {
            existing.servicios += 1;
            existing.valor_total += valor;
          } else {
            vehiculosMap.set(vehiculo, {
              servicios: 1,
              valor_total: valor,
              vehiculo_completo: vehiculo,
              placa: servicio.vehiculo!.placa,
              marca: servicio.vehiculo!.marca,
              modelo: servicio.vehiculo!.modelo,
            });
          }
        });

      const vehiculosData: EstadisticaVehiculo[] = Array.from(
        vehiculosMap.entries(),
      )
        .map(([vehiculo, data]) => ({
          vehiculo:
            vehiculo.length > 25 ? vehiculo.substring(0, 25) + "..." : vehiculo,
          vehiculo_completo: data.vehiculo_completo,
          servicios: data.servicios,
          valor_total: data.valor_total,
          placa: data.placa,
          marca: data.marca,
          modelo: data.modelo,
        }))
        .sort((a, b) => b.servicios - a.servicios)
        .slice(0, 10);

      // 5. Rutas más frecuentes
      const rutasMap = new Map<
        string,
        { frecuencia: number; valor_total: number; ruta_completa: string }
      >();

      servicios.forEach((servicio: ServicioConRelaciones) => {
        const origen = servicio?.origen?.nombre_municipio || "Sin origen";
        const destino = servicio?.destino?.nombre_municipio || "Sin destino";
        const ruta = `${origen} → ${destino}`;
        const valor = parseFloat(String(servicio?.valor || 0));

        const existing = rutasMap.get(ruta);

        if (existing) {
          existing.frecuencia += 1;
          existing.valor_total += valor;
        } else {
          rutasMap.set(ruta, {
            frecuencia: 1,
            valor_total: valor,
            ruta_completa: ruta,
          });
        }
      });

      const rutasData: EstadisticaRuta[] = Array.from(rutasMap.entries())
        .map(([ruta, data]) => ({
          ruta: ruta.length > 30 ? ruta.substring(0, 30) + "..." : ruta,
          ruta_completa: data.ruta_completa,
          frecuencia: data.frecuencia,
          valor_promedio:
            data.frecuencia > 0 ? data.valor_total / data.frecuencia : 0,
        }))
        .sort((a, b) => b.frecuencia - a.frecuencia)
        .slice(0, 10);

      // 7. Rendimiento por empresa
      const empresasMap = new Map<
        string,
        {
          total: number;
          solicitados: number;
          planificados: number;
          en_cursos: number;
          realizados: number;
          cancelados: number;
          valor_total: number;
          empresa_completa: string;
        }
      >();

      servicios.forEach((servicio: ServicioConRelaciones) => {
        const empresa = servicio?.cliente?.nombre || "Sin empresa";
        const valor = parseFloat(String(servicio?.valor || 0));

        const existing = empresasMap.get(empresa);

        if (existing) {
          existing.total += 1;
          existing.solicitados += servicio.estado === "solicitado" ? 1 : 0;
          existing.planificados += servicio.estado === "planificado" ? 1 : 0;
          existing.en_cursos += servicio.estado === "en_curso" ? 1 : 0;
          existing.cancelados += servicio.estado === "cancelado" ? 1 : 0;
          existing.realizados += servicio.estado === "realizado" ? 1 : 0;
          existing.valor_total += valor;
        } else {
          empresasMap.set(empresa, {
            total: 1,
            solicitados: servicio.estado === "solicitado" ? 1 : 0,
            planificados: servicio.estado === "planificado" ? 1 : 0,
            en_cursos: servicio.estado === "en_curso" ? 1 : 0,
            cancelados: servicio.estado === "cancelado" ? 1 : 0,
            realizados: servicio.estado === "realizado" ? 1 : 0,
            valor_total: valor,
            empresa_completa: empresa,
          });
        }
      });

      const empresasData: EstadisticaEmpresa[] = Array.from(
        empresasMap.entries(),
      )
        .map(([empresa, data]) => ({
          empresa:
            empresa.length > 20 ? empresa.substring(0, 20) + "..." : empresa,
          empresa_completa: data.empresa_completa,
          total: data.total,
          realizados: data.realizados,
          cancelados: data.cancelados,
          valor_total: data.valor_total,
          eficiencia: data.total > 0 ? (data.realizados / data.total) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);

      // 8. Tendencias temporales (últimos 30 días)
      const tendenciasData: TendenciaTemporal[] = Array.from(
        { length: 30 },
        (_, i) => {
          const date = new Date();

          date.setDate(date.getDate() - (29 - i));
          const dateString = date.toISOString().split("T")[0];

          const serviciosDelDia = servicios.filter(
            (servicio: ServicioConRelaciones) => {
              if (!servicio?.fecha_solicitud) return false;
              const servicioDate = new Date(servicio.fecha_solicitud)
                .toISOString()
                .split("T")[0];

              return servicioDate === dateString;
            },
          );

          return {
            fecha: date.toLocaleDateString("es-ES", {
              month: "short",
              day: "numeric",
            }),
            fecha_completa: date.toLocaleDateString("es-ES"),
            solicitados: serviciosDelDia.length,
            realizados: serviciosDelDia.filter(
              (s: ServicioConRelaciones) => s?.estado === "realizado",
            ).length,
            valor_total: serviciosDelDia.reduce(
              (sum, s: ServicioConRelaciones) =>
                sum + parseFloat(String(s?.valor || 0)),
              0,
            ),
          };
        },
      );

      return {
        estados: estadosData,
        municipios: municipiosData,
        conductores: conductoresData,
        vehiculos: vehiculosData,
        rutas: rutasData,
        empresas: empresasData,
        tendencias: tendenciasData,
      };
    } catch (error) {
      console.error("Error procesando datos de charts:", error);

      return {
        estados: [],
        municipios: [],
        conductores: [],
        vehiculos: [],
        rutas: [],
        empresas: [],
        tendencias: [],
      };
    }
  }, [servicios]);

  // ==================== ESTADÍSTICAS GENERALES ====================

  interface GeneralStats {
    total: number;
    valorTotal: number;
    valorPromedio: number;
    conductoresUnicos: number;
    vehiculosUnicos: number;
    municipiosUnicos: number;
    empresasUnicas: number;
    enCurso: number;
    realizados: number;
    eficiencia: number;
  }

  const stats = useMemo<GeneralStats>(() => {
    if (!servicios || !Array.isArray(servicios)) {
      return {
        total: 0,
        valorTotal: 0,
        valorPromedio: 0,
        conductoresUnicos: 0,
        vehiculosUnicos: 0,
        municipiosUnicos: 0,
        empresasUnicas: 0,
        enCurso: 0,
        realizados: 0,
        eficiencia: 0,
      };
    }

    const total = servicios.length;
    const valorTotal = servicios.reduce(
      (sum, s: ServicioConRelaciones) =>
        sum + parseFloat(String(s?.valor || 0)),
      0,
    );
    const valorPromedio = total > 0 ? valorTotal / total : 0;

    const conductoresUnicos = new Set(
      servicios
        .filter((s: ServicioConRelaciones) => s?.conductor?.id)
        .map((s) => s.conductor!.id),
    ).size;

    const vehiculosUnicos = new Set(
      servicios
        .filter((s: ServicioConRelaciones) => s?.vehiculo?.id)
        .map((s) => s.vehiculo!.id),
    ).size;

    const municipiosSet = new Set([
      ...servicios
        .filter((s: ServicioConRelaciones) => s?.origen?.id)
        .map((s) => s.origen.id),
      ...servicios
        .filter((s: ServicioConRelaciones) => s?.destino?.id)
        .map((s) => s.destino.id),
    ]);
    const municipiosUnicos = municipiosSet.size;

    const empresasUnicas = new Set(
      servicios
        .filter((s: ServicioConRelaciones) => s?.cliente?.id)
        .map((s) => s.cliente.id),
    ).size;

    const enCurso = servicios.filter(
      (s: ServicioConRelaciones) => s?.estado === "en_curso",
    ).length;
    const realizados = servicios.filter(
      (s: ServicioConRelaciones) => s?.estado === "realizado",
    ).length;
    const eficiencia = total > 0 ? (realizados / total) * 100 : 0;

    return {
      total,
      valorTotal,
      valorPromedio,
      conductoresUnicos,
      vehiculosUnicos,
      municipiosUnicos,
      empresasUnicas,
      enCurso,
      realizados,
      eficiencia,
    };
  }, [servicios]);

  // ==================== CONFIGURACIÓN DE PESTAÑAS ====================

  const tabs: TabConfig[] = [
    {
      key: "estados",
      label: "Estados",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      key: "municipios",
      label: "Municipios",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      key: "conductores",
      label: "Conductores",
      icon: <User className="w-4 h-4" />,
    },
    { key: "vehiculos", label: "Vehículos", icon: <Car className="w-4 h-4" /> },
    { key: "rutas", label: "Rutas", icon: <Route className="w-4 h-4" /> },
    {
      key: "tendencias",
      label: "Tendencias",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  // ==================== UTILIDADES ====================

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatsCards = (): StatsCard[] => [
    {
      label: "Total Servicios",
      value: stats.total,
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
      valueColor: "text-blue-800",
    },
    {
      label: "Eficiencia",
      value: `${stats.eficiencia.toFixed(1)}%`,
      bgColor: "from-orange-50 to-orange-100",
      textColor: "text-orange-600",
      valueColor: "text-orange-800",
    },
    {
      label: "Conductores",
      value: stats.conductoresUnicos,
      bgColor: "from-indigo-50 to-indigo-100",
      textColor: "text-indigo-600",
      valueColor: "text-indigo-800",
    },
  ];

  // ==================== RENDERIZADO DE GRÁFICOS ====================

  const renderChart = (): JSX.Element => {
    if (!isMounted) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando gráfico...</div>
        </div>
      );
    }

    const activeData = chartsData[activeTab];

    if (!activeData || activeData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">
            No hay datos disponibles para mostrar
          </div>
        </div>
      );
    }

    try {
      switch (activeTab) {
        case "estados":
          return (
            <ResponsiveContainer height={350} width="100%">
              <BarChart data={chartsData.estados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => value} />
                <Legend />
                <Bar dataKey="cantidad" fill="#00bc7d" name="Servicios" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "municipios":
          return (
            <ResponsiveContainer height={350} width="100%">
              <BarChart data={chartsData.municipios} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={{ fontSize: 12 }} type="number" />
                <YAxis
                  dataKey="municipio"
                  tick={{ fontSize: 10 }}
                  type="category"
                  width={120}
                />
                <Tooltip
                  formatter={(
                    value: any,
                    name: string | number,
                    props: any,
                  ) => [
                    name === "servicios"
                      ? value
                      : formatCurrency(Number(value)),
                    name === "servicios" ? "Servicios" : "",
                    props.payload?.municipio_completo,
                  ]}
                />
                <Legend />
                <Bar dataKey="servicios" fill="#00bc7d" name="Servicios" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "conductores":
          return (
            <ResponsiveContainer height={350} width="100%">
              <BarChart data={chartsData.conductores} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={{ fontSize: 12 }} type="number" />
                <YAxis
                  dataKey="conductor"
                  tick={{ fontSize: 10 }}
                  type="category"
                  width={140}
                />
                <Tooltip
                  formatter={(
                    value: any,
                    name: string | number,
                    props: any,
                  ) => [
                    value,
                    name === "servicios" ? "Total Servicios" : "Realizados",
                    `${props.payload?.conductor_completo} (${props.payload?.identificacion || "Sin ID"})`,
                  ]}
                />
                <Legend />
                <Bar dataKey="servicios" fill="#155dfc" name="Total" />
                <Bar dataKey="realizados" fill="#00bc7d" name="Realizados" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "vehiculos":
          return (
            <ResponsiveContainer height={350} width="100%">
              <BarChart data={chartsData.vehiculos} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={{ fontSize: 12 }} type="number" />
                <YAxis
                  dataKey="vehiculo"
                  tick={{ fontSize: 10 }}
                  type="category"
                  width={140}
                />
                <Tooltip
                  formatter={(
                    value: any,
                    name: string | number,
                    props: any,
                  ) => [
                    name === "servicios"
                      ? value
                      : formatCurrency(Number(value)),
                    name === "servicios" ? "Servicios" : "",
                    props.payload?.vehiculo_completo,
                  ]}
                />
                <Legend />
                <Bar dataKey="servicios" fill="#ad46ff" name="Servicios" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "rutas":
          return (
            <ResponsiveContainer height={350} width="100%">
              <BarChart data={chartsData.rutas} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={{ fontSize: 12 }} type="number" />
                <YAxis
                  dataKey="ruta"
                  tick={{ fontSize: 10 }}
                  type="category"
                  width={160}
                />
                <Tooltip
                  formatter={(
                    value: any,
                    name: string | number,
                    props: any,
                  ) => [
                    name === "frecuencia"
                      ? value
                      : formatCurrency(Number(value)),
                    name === "frecuencia" ? "Frecuencia" : "",
                    props.payload?.ruta_completa,
                  ]}
                />
                <Legend />
                <Bar dataKey="frecuencia" fill="#FF9800" name="Frecuencia" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "tendencias":
          return (
            <ResponsiveContainer height={350} width="100%">
              <LineChart data={chartsData.tendencias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} yAxisId="left" />
                <YAxis
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  yAxisId="right"
                />
                <Tooltip
                  formatter={(value: any, name: string | number) => [
                    name === "valor_total"
                      ? formatCurrency(Number(value))
                      : value,
                    name === "solicitados"
                      ? "Solicitados"
                      : name === "realizados"
                        ? "Realizados"
                        : "",
                  ]}
                />
                <Legend />
                <Line
                  dataKey="solicitados"
                  name="Solicitados"
                  stroke="#155dfc"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="left"
                />
                <Line
                  dataKey="realizados"
                  name="Realizados"
                  stroke="#00bc7d"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="left"
                />
              </LineChart>
            </ResponsiveContainer>
          );

        default:
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">
                Selecciona una pestaña para ver el gráfico
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error("Error renderizando gráfico:", error);

      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error al cargar el gráfico</div>
        </div>
      );
    }
  };

  // ==================== INSIGHTS DINÁMICOS ====================

  const renderInsights = (): JSX.Element => {
    const getInsightContent = (): JSX.Element => {
      switch (activeTab) {
        case "estados":
          return (
            <div>
              <p>
                • Distribución de {stats.total} servicios por estado actual.
              </p>
              <p>
                • Eficiencia operacional del {stats.eficiencia.toFixed(1)}%
                (servicios realizados vs total).
              </p>
            </div>
          );
        case "municipios":
          return (
            <div>
              <p>
                • Cobertura geográfica: {stats.municipiosUnicos} municipios
                únicos atendidos.
              </p>
              <p>• Top municipios generadores de servicios (origen).</p>
              <p>• Análisis de demanda por ubicación geográfica.</p>
            </div>
          );
        case "conductores":
          return (
            <div>
              <p>
                • {stats.conductoresUnicos} conductores activos en el sistema.
              </p>
              <p>• Ranking de productividad por conductor.</p>
              <p>• Comparativa entre servicios asignados vs realizados.</p>
            </div>
          );
        case "vehiculos":
          return (
            <div>
              <p>• {stats.vehiculosUnicos} vehículos registrados y activos.</p>
              <p>• Utilización y rendimiento por vehículo.</p>
              <p>• Optimización de flota basada en demanda.</p>
            </div>
          );
        case "rutas":
          return (
            <div>
              <p>• Análisis de rutas más frecuentes y rentables.</p>
              <p>• Identificación de corredores de alta demanda.</p>
              <p>• Oportunidades de optimización logística.</p>
            </div>
          );
        case "tendencias":
          return (
            <div>
              <p>• Evolución temporal de la demanda de servicios.</p>
              <p>• Tendencias de crecimiento en los últimos 30 días.</p>
              <p>• Patrones estacionales y proyecciones.</p>
            </div>
          );
        default:
          return <div>Selecciona una pestaña para ver los insights.</div>;
      }
    };

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Insights y Resumen
        </h4>
        <div className="text-sm text-gray-600 space-y-2">
          {getInsightContent()}
        </div>
      </div>
    );
  };

  // ==================== MÉTRICAS DESTACADAS ====================

  const renderHighlightMetrics = (): JSX.Element | null => {
    const getHighlightContent = (): JSX.Element | null => {
      switch (activeTab) {
        case "conductores":
          if (chartsData.conductores.length > 0) {
            const topConductor = chartsData.conductores[0];

            return (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Top Conductor
                </h4>
                <p className="text-sm text-blue-700">
                  <strong>{topConductor.conductor_completo}</strong> lidera con{" "}
                  <span className="font-semibold">
                    {topConductor.servicios} servicios
                  </span>{" "}
                  realizados y una efectividad del{" "}
                  <span className="font-semibold">
                    {topConductor.eficiencia.toFixed(1)}%
                  </span>
                </p>
              </div>
            );
          }
          break;

        case "vehiculos":
          if (chartsData.vehiculos.length > 0) {
            const topVehiculo = chartsData.vehiculos[0];

            return (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Vehículo Más Utilizado
                </h4>
                <p className="text-sm text-purple-700">
                  <strong>{topVehiculo.placa}</strong> ({topVehiculo.marca}{" "}
                  {topVehiculo.modelo}) con{" "}
                  <span className="font-semibold">
                    {topVehiculo.servicios} servicios
                  </span>{" "}
                  realizados
                </p>
              </div>
            );
          }
          break;

        case "rutas":
          if (chartsData.rutas.length > 0) {
            const topRuta = chartsData.rutas[0];

            return (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Ruta Más Frecuente
                </h4>
                <p className="text-sm text-orange-700">
                  <strong>{topRuta.ruta_completa}</strong> con{" "}
                  <span className="font-semibold">
                    {topRuta.frecuencia} viajes
                  </span>{" "}
                </p>
              </div>
            );
          }
          break;

        case "municipios":
          if (chartsData.municipios.length > 0) {
            const topMunicipio = chartsData.municipios[0];

            return (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Municipio Líder
                </h4>
                <p className="text-sm text-green-700">
                  <strong>{topMunicipio.municipio_completo}</strong> genera{" "}
                  <span className="font-semibold">
                    {topMunicipio.servicios} servicios
                  </span>{" "}
                </p>
              </div>
            );
          }
          break;

        default:
          return null;
      }

      return null;
    };

    return getHighlightContent();
  };

  // ==================== RENDERIZADO PRINCIPAL ====================

  if (!isMounted) {
    return (
      <Button
        disabled
        fullWidth
        color="default"
        radius="sm"
        startContent={<ChartPieIcon className="w-5 h-5" />}
        variant="flat"
      >
        Cargando...
      </Button>
    );
  }

  return (
    <>
      <Button
        fullWidth
        color="success"
        radius="sm"
        startContent={<ChartPieIcon className="w-5 h-5" />}
        variant="flat"
        onPress={onOpen}
      >
        Ver Estadísticas Completas
      </Button>

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ChartPieIcon className="w-6 h-6 text-emerald-600" />
                  <span>Dashboard de Estadísticas de Servicios</span>
                </div>
                <p className="text-sm text-gray-500 font-normal">
                  Análisis completo del rendimiento y métricas operacionales
                </p>
              </ModalHeader>

              <ModalBody>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                  {getStatsCards().map((card: StatsCard, index: number) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-r ${card.bgColor} p-3 rounded-lg`}
                    >
                      <div className={`text-xs font-medium ${card.textColor}`}>
                        {card.label}
                      </div>
                      <div className={`text-lg font-bold ${card.valueColor}`}>
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap border-b border-gray-200 mb-4 gap-1">
                  {tabs.map((tab: TabConfig) => (
                    <button
                      key={tab.key}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.key
                          ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Chart Content */}
                <div className="min-h-[380px]">{renderChart()}</div>

                {/* Insights */}
                {renderInsights()}

                {/* Highlight Metrics */}
                {renderHighlightMetrics()}
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  startContent={<TrendingUp className="w-4 h-4" />}
                  variant="flat"
                >
                  Exportar Reporte
                </Button>
                <Button
                  color="success"
                  startContent={<Calendar className="w-4 h-4" />}
                  variant="flat"
                >
                  Programar Reporte
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EnhancedGraphsModal;
