import React from 'react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { Button, Badge } from '@/components/ui';
import type { Warehouse } from '@/types';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
  onCreateNew?: () => void;
  loading?: boolean;
}

/**
 * WarehouseTable - Clean table component for warehouses
 */
export const WarehouseTable: React.FC<WarehouseTableProps> = ({
  warehouses,
  onEdit,
  onDelete,
  onCreateNew,
  loading = false
}) => {
  if (loading) {
    return <LoadingSpinner center message="Đang tải danh sách kho..." />;
  }

  if (warehouses.length === 0) {
    return (
      <EmptyState
        title="Chưa có kho hàng nào"
        description="Bắt đầu bằng cách tạo kho hàng đầu tiên của bạn"
        actionText="Tạo kho mới"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kho hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa chỉ & Liên hệ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {warehouses.map((warehouse) => (
            <tr key={warehouse.warehouseId} className="hover:bg-gray-50 transition-colors">
              {/* Warehouse Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {warehouse.warehouseName}
                    </div>
                  </div>
                </div>
              </td>

              {/* Address & Contact */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{warehouse.address}</div>
                {warehouse.contactPhone && (
                  <div className="text-sm text-gray-500">{warehouse.contactPhone}</div>
                )}
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={warehouse.totalInventoryItems > 0 ? 'success' : 'secondary'}
                  size="sm"
                >
                  {warehouse.totalInventoryItems} sản phẩm
                </Badge>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {warehouse.createdAt ? new Date(warehouse.createdAt).toLocaleDateString('vi-VN') : '-'}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                    onClick={() => onEdit(warehouse)}
                    iconOnly
                    size="sm"
                    variant="secondary"
                  />
                  <Button
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                    onClick={() => onDelete(warehouse)}
                    iconOnly
                    size="sm"
                    variant="danger"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseTable;
