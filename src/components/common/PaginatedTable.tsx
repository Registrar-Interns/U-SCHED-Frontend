import { useState, useMemo, JSX } from "react";
import { MagnifyingGlassIcon } from "../../icons";

interface FilterOption {
  value: string;
  label: string;
}

interface ColumnFilter {
  column: string;
  options: FilterOption[];
}

interface PaginatedTableProps<T extends Record<string, unknown>> {
  columns: string[];
  data: T[];
  renderCell?: (row: T, column: string) => JSX.Element | string;
  renderActions?: (row: T) => JSX.Element;
  filters?: ColumnFilter[];
}

export default function PaginatedTable<T extends Record<string, unknown>>({
  columns,
  data,
  renderCell,
  renderActions,
  filters = [],
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // First apply search term filter
      const matchesSearch = searchTerm === "" || 
        Object.entries(row).some(([, value]) => {
          // Skip objects when filtering (like the originalUser we added)
          if (typeof value === 'object' && value !== null) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });

      if (!matchesSearch) return false;

      // Then apply column-specific filters
      return Object.entries(activeFilters).every(([column, filterValue]) => {
        if (filterValue === "all") return true;
        return String(row[column]) === filterValue;
      });
    });
  }, [data, searchTerm, activeFilters]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Ensure currentPage is valid after filtering changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleFilterChange = (column: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Function to render pagination numbers
  const renderPaginationNumbers = () => {
    if (totalPages <= 5) {
      // Show all page numbers if there are 5 or fewer
      return [...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ));
    } else {
      // For more complex pagination display with ellipsis
      const pageNumbers = [];
      
      // Always show first page
      if (currentPage > 1) {
        pageNumbers.push(
          <button
            key="first"
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentPage(1)}
          >
            1
          </button>
        );
      }
      
      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        pageNumbers.push(<span key="ellipsis1" className="px-2">...</span>);
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 border rounded ${currentPage === i ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
      
      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        pageNumbers.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      
      // Always show last page
      if (currentPage < totalPages) {
        pageNumbers.push(
          <button
            key="last"
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
      
      return pageNumbers;
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm appearance-none w-14"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 50].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>

          {filters.map((filter) => (
            <div key={filter.column} className="flex items-center">
              <span className="mr-2 text-sm text-gray-700">{filter.column.replace("_filter", "")}:</span>
              <select
                className="border border-gray-300 rounded-lg p-2 text-sm w-32"
                value={activeFilters[filter.column] || "all"}
                onChange={(e) => handleFilterChange(filter.column, e.target.value)}
              >
                <option value="all">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="relative mt-4 md:mt-0">
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 pl-10 text-sm w-64"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-100 dark:border-white/[0.05]">
              {columns.map((col, index) => (
                <th key={index} className="px-5 py-3 font-medium text-gray-500 text-start">
                  {col}
                </th>
              ))}
              {renderActions && <th className="px-5 py-3 font-medium text-gray-500 text-start">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {selectedData.length > 0 ? (
              selectedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-5 py-4 text-start">
                      {renderCell ? renderCell(row, col) : String(row[col] || "N/A")}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-5 py-4 text-start">{renderActions(row)}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-4">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        {totalPages > 0 && (
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {renderPaginationNumbers()}
            <button
              className={`px-3 py-1 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}