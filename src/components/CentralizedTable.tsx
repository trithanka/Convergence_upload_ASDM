import React from "react";
import { Column } from "react-table";

interface CentralizedTableProps {
  columns: Column<any>[];
  data?: any[];
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  hideRowsPerPage?: boolean; // Add this new prop
}

const CentralizedTable: React.FC<CentralizedTableProps> = ({
  columns = [],
  data = [],
  pageSize = 25,
  currentPage = 1,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  hideRowsPerPage = false, // Add default value
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <p className="font-bold"></p>
      </div>
      <div className="bg-white overflow-auto border rounded-lg max-h-80 custom-scrollbar">
        <table className="text-xs text-left text-gray-950 border-collapse w-full">
          <thead className="bg-gray-300 uppercase text-xs sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-center">SL No</th>
              {columns.map((column) => (
                <th
                  key={column.accessor as string}
                  className="px-4 py-2 border border-gray-300 text-center"
                >
                  {typeof column.Header === "string" || typeof column.Header === "number"
                    ? column.Header
                    : React.isValidElement(column.Header)
                      ? column.Header
                      : typeof column.Header === "function"
                        ? React.createElement(column.Header)
                        : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4 text-sm">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-3 text-center whitespace-nowrap border border-gray-300">
                    {(currentPage - 1) * pageSize + rowIndex + 1}
                  </td>
                  {columns.map((column) => (
                  <td
                  key={column.accessor as string}
                  className="px-6 py-3 text-center whitespace-nowrap border border-gray-300"
                >
                  {column.accessor
                    ? ("Cell" in column && typeof column.Cell === "function"
                        ? (column.Cell as any)({
                            value: row[column.accessor as string],
                            row, // ✅ Pass the full row object
                          })
                        : row[column.accessor as string] || " ")
                    : " "}
                </td>
                
                  ))}
                </tr>
              ))
            )}
          </tbody>


        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-2 px-4 py-2 rounded-lg border-t">
        {!hideRowsPerPage && (
          <div className="flex items-center mb-2 md:mb-0 space-x-2">
            <label htmlFor="rowsPerPage" className="text-xs font-medium">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="block w-20 px-2 py-1 text-xs border rounded bg-white focus:ring focus:ring-blue-200 focus:outline-none"
            >
              {[5, 10, 15, 20, 25, 30].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onPageChange?.(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            &laquo; First
          </button>
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Previous
          </button>
          <span className="text-xs font-medium">
            Page <span className="text-blue-500">{currentPage}</span> of
            <span className="text-blue-500"> {totalPages}</span>
          </span>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Next
          </button>
          <button
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Last &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CentralizedTable;
