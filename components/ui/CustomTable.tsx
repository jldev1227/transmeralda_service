import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

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
  // Manejar cambio de ordenamiento
  const handleSort = (column: string) => {
    if (!onSortChange || !columns.find(col => col.key === column)?.allowsSorting) return;

    let direction: "ascending" | "descending" = "ascending";
    
    if (sortDescriptor?.column === column) {
      direction = sortDescriptor.direction === "ascending" ? "descending" : "ascending";
    }
    
    onSortChange({ column, direction });
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.allowsSorting ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                onClick={() => column.allowsSorting && handleSort(column.key)}
              >
                <div className="flex flex-row items-center space-x-1">
                  <span>{column.label}</span>
                  {column.allowsSorting && sortDescriptor?.column === column.key && (
                    sortDescriptor.direction === "ascending" ? (
                      <ArrowUpIcon className="h-4 w-4 ml-2" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-2" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap">
                {loadingContent || (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                )}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {emptyContent}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                    {column.renderCell ? column.renderCell(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;