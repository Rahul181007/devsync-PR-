import React from "react";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  emptyText?: string;
  getRowId?: (row: T) => string;
  onRowClick?: (row: T) => void;

  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Table<T>({
  data,
  columns,
  title,
  emptyText = "No data found",
  getRowId,
  onRowClick,
  page,
  totalPages,
  onPageChange,
}: TableProps<T>) {
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${getAlignClass(
                    col.align
                  )}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={getRowId ? getRowId(row) : i}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-gray-50 transition ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className={`px-6 py-4 text-sm text-gray-700 ${getAlignClass(
                        col.align
                      )}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? (row[col.accessor] as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {page &&
        totalPages &&
        onPageChange &&
        totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      page === p
                        ? "bg-blue-50 text-blue-600 border-blue-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
}