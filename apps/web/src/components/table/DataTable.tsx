import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
  _create?: () => void;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export function DataTable<T>({
  data,
  columns,
  _create,
  pageSize = 10,
  loading,
  emptyMessage = "No items found.",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: null, direction: null });

  const handleSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (columnKey: keyof T) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    } else if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 text-blue-600" />;
    }
    
    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
  };

  const filteredData = data.filter((item: any) =>
    Object.values(item).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

    // Convert to strings for comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    // Try to parse as numbers if possible
    const aNum = Number(aValue);
    const bNum = Number(bValue);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // String comparison
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const totalItems = sortedData.length;

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <div className="flex mb-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded p-2 w-full max-w-xs"
        />
        {_create && (
          <button
            className="bg-green-700 hover:bg-green-600 text-white rounded px-4 py-2"
            onClick={_create}>
            Tambahkan
          </button>
        )}
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="p-3 border-b">
                  {col.sortable !== false ? (
                    <button
                      className="flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-700 p-1 rounded transition-colors w-full text-left"
                      onClick={() => handleSort(col.accessorKey)}
                    >
                      <span>{col.header}</span>
                      {getSortIcon(col.accessorKey)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-3 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
            {sortedData
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((item, rowIdx) => (
                <tr key={rowIdx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-3">
                      {col.cell ? col.cell(item) : (item[col.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50">
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
