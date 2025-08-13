import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "./Button";

interface AdvancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  idField?: keyof T;
  className?: string;
}

export function AdvancedTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onBulkDelete,
  idField = "id" as keyof T,
  className = "",
}: AdvancedTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableSorting: true,
    enableGlobalFilter: true,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelectedRows) {
      const selectedIds = selectedRows.map(
        (row) => row.getValue(idField as string) as string
      );
      onBulkDelete(selectedIds);
      setRowSelection({});
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Global Search */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bulk Actions */}
        {hasSelectedRows && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedRows.length} selected
            </span>
            {onBulkDelete && (
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    row.getIsSelected() ? "bg-blue-50" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No data found</div>
            <div className="text-sm text-gray-500">
              {globalFilter
                ? "Try adjusting your search terms."
                : "No records available."}
            </div>
          </div>
        )}
      </div>

      {/* Table Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {table.getFilteredRowModel().rows.length} of {data.length}{" "}
          results
        </div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Helper function to create checkbox column
export function createCheckboxColumn<T>(): ColumnDef<T, unknown> {
  return {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

// Helper function to create action column
export function createActionColumn<T>(
  onEdit?: (item: T) => void,
  onDelete?: (item: T) => void,
  onView?: (item: T) => void,
  onDuplicate?: (item: T) => void
): ColumnDef<T, unknown> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {onView && (
          <Button
            onClick={() => onView(row.original)}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            onClick={() => onEdit(row.original)}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {onDuplicate && (
          <Button
            onClick={() => onDuplicate(row.original)}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => onDelete(row.original)}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    ),
  };
}
