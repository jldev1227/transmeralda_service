import React, { useEffect, useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import { useService } from "@/context/serviceContext";

export type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export interface Column {
  key: string;
  label: string;
  allowsSorting?: boolean;
  renderCell?: (item: any) => React.ReactNode;
}

interface RowAnimationState {
  [key: string]: {
    isNew: boolean;
    isUpdated: boolean;
    eventType: string; // Añadir el tipo de evento
    timestamp: number;
  };
}

interface CustomTableProps {
  columns: Column[];
  data: any[];
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  emptyContent?: React.ReactNode;
  loadingContent?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  onRowClick?: (item: any) => void;
  selectedItems?: any[];
  onSelectionChange?: (item: any) => void;
  getItemId?: (item: any) => string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  sortDescriptor,
  onSortChange,
  emptyContent = "No hay datos disponibles",
  loadingContent,
  isLoading = false,
  className = "",
  onRowClick,
}) => {
  const { socketEventLogs } = useService();

  const [rowAnimations, setRowAnimations] = useState<RowAnimationState>({});

  // Manejar cambio de ordenamiento
  const handleSort = (column: string) => {
    console.log(column)
    if (
      !onSortChange ||
      !columns.find((col) => col.key === column)?.allowsSorting
    )
      return;

    let direction: "ascending" | "descending" = "ascending";

    if (sortDescriptor?.column === column) {
      direction =
        sortDescriptor.direction === "ascending" ? "descending" : "ascending";
    }

    onSortChange({ column, direction });
  };

  // Actualiza el useEffect donde procesas los eventos de socket
  useEffect(() => {
    if (!socketEventLogs || socketEventLogs.length === 0) return;

    // Obtener el evento más reciente
    const latestEvents = [...socketEventLogs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5); // Solo procesar los 5 eventos más recientes

    const now = Date.now();
    const newAnimations: RowAnimationState = { ...rowAnimations };

    latestEvents.forEach((event) => {
      // Obtener ID del conductor según el tipo de evento
      let conductorId = "";

      if (event.data.conductor) {
        conductorId = event.data.conductor.id;
      } else if (event.data.id) {
        conductorId = event.data.id;
      }

      if (!conductorId) return;

      if (event.eventName === "conductor:creado") {
        newAnimations[conductorId] = {
          isNew: true,
          isUpdated: false,
          eventType: event.eventName,
          timestamp: now,
        };
      } else {
        // Para cualquier otro evento, marcar como actualizado
        newAnimations[conductorId] = {
          isNew: false,
          isUpdated: true,
          eventType: event.eventName,
          timestamp: now,
        };
      }

      // Scroll al conductor si es nuevo
      if (event.eventName === "conductor:creado") {
        setTimeout(() => {
          const row = document.getElementById(`conductor-row-${conductorId}`);

          if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    });

    setRowAnimations(newAnimations);

    // Limpiar animaciones después de 5 segundos
    const timer = setTimeout(() => {
      setRowAnimations((prev) => {
        const updated: RowAnimationState = {};

        // Solo mantener animaciones que sean más recientes que 5 segundos
        Object.entries(prev).forEach(([id, state]) => {
          if (now - state.timestamp < 5000) {
            updated[id] = state;
          }
        });

        return updated;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [socketEventLogs]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.allowsSorting ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                scope="col"
                onClick={() => column.allowsSorting && handleSort(column.key)}
              >
                <div className="flex flex-row items-center space-x-1">
                  <span>{column.label}</span>
                  {column.allowsSorting &&
                    sortDescriptor?.column === column.key &&
                    (sortDescriptor.direction === "ascending" ? (
                      <ArrowUpIcon className="h-4 w-4 ml-2" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-2" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td
                className="px-6 py-4 whitespace-nowrap"
                colSpan={columns.length}
              >
                {loadingContent}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                className="px-6 py-4 whitespace-nowrap"
                colSpan={columns.length}
              >
                {emptyContent}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => {
              const conductorId = item.id || "";
              const animation = rowAnimations[conductorId];
              const isNew = animation?.isNew || false;
              const isUpdated = animation?.isUpdated || false;

              return (
                <tr
                  key={rowIndex}
                  className={`
                    hover:bg-gray-50 transition-colors cursor-pointer
                    ${isNew ? "animate-pulse bg-success-50 border-l-2 border-success-400" : ""}
                    ${isUpdated ? "animate-pulse bg-primary-50 border-l-2 border-primary-400" : ""}
                  `}
                  id={`servicio-${item.id}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, columIndex) => (
                    <td
                      key={columIndex}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.renderCell
                        ? column.renderCell(item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
