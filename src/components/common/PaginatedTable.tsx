import { useState } from "react";
import { MagnifyingGlassIcon } from "../../icons";

interface PaginatedTableProps<T extends Record<string, unknown>> {
  columns: string[];
  data: T[];
}

export default function PaginatedTable<T extends Record<string, unknown>>({
  columns,
  data,
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        {/* Entries Dropdown, Department, and Program Dropdowns */}
        <div className="flex gap-4">
          {/* Entries Dropdown */}
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm appearance-none w-14 "
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>

          {/* Department Dropdown */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm w-48">
            <option>Department</option>
            <option>CCS</option>
            <option>CBAA</option>
            <option>COE</option>
          </select>

          {/* Program Dropdown */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm w-48">
            <option>Program</option>
            <option>BSIT</option>
            <option>BSCS</option>
            <option>BSA</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 pl-10 text-sm w-64"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.length > 0 ? (
              selectedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        {/* Showing X to Y of Z entries */}
        <span className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>

        {/* Pagination Buttons */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
