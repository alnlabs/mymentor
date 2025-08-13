import React, { useState } from "react";
import { Edit, Trash2, Eye, Copy } from "lucide-react";
import { Button } from "./Button";

interface AdvancedListViewProps<T> {
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  idField?: keyof T;
  className?: string;
  renderItem: (item: T) => React.ReactNode;
}

export function AdvancedListView<T>({
  data,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onBulkDelete,
  idField = "id" as keyof T,
  className = "",
  renderItem,
}: AdvancedListViewProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [globalFilter, setGlobalFilter] = useState("");

  // Simple filtering
  const filteredData = data.filter((item) => {
    if (!globalFilter) return true;
    const searchStr = globalFilter.toLowerCase();
    const itemStr = JSON.stringify(item).toLowerCase();
    return itemStr.includes(searchStr);
  });

  const hasSelectedItems = selectedItems.size > 0;

  const handleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = filteredData.map((item) => String(item[idField]));
      setSelectedItems(new Set(allIds));
    }
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelectedItems) {
      const selectedIds = Array.from(selectedItems);
      onBulkDelete(selectedIds);
      setSelectedItems(new Set());
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* List Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Global Search */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search all items..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bulk Actions */}
        {hasSelectedItems && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedItems.size} selected
            </span>
            {onBulkDelete && (
              <Button
                onClick={handleBulkDelete}
                variant="danger"
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

      {/* Select All */}
      {filteredData.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={
              selectedItems.size === filteredData.length &&
              filteredData.length > 0
            }
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Select All</span>
        </div>
      )}

      {/* List Items */}
      <div className="space-y-3">
        {filteredData.map((item) => {
          const itemId = String(item[idField]);
          const isSelected = selectedItems.has(itemId);

          return (
            <div
              key={itemId}
              className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
            >
              {/* Selection Checkbox and Actions */}
              <div className="flex items-start justify-between mb-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectItem(itemId)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {onView && (
                    <Button
                      onClick={() => onView(item)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      onClick={() => onEdit(item)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button
                      onClick={() => onDuplicate(item)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      onClick={() => onDelete(item)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Custom Item Content */}
              <div className="space-y-3">{renderItem(item)}</div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="text-gray-400 mb-2">No data found</div>
          <div className="text-sm text-gray-500">
            {globalFilter
              ? "Try adjusting your search terms."
              : "No records available."}
          </div>
        </div>
      )}

      {/* List Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {filteredData.length} of {data.length} results
        </div>
      </div>
    </div>
  );
}
