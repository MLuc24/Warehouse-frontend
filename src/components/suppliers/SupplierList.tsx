import React from 'react';
import type { Supplier } from '@/types';

interface SupplierListProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSelectSupplier: (supplier: Supplier) => void;
  loading: boolean;
}

/**
 * Supplier List Component
 * Shows list of suppliers with click to select functionality
 */
export const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  selectedSupplier,
  onSelectSupplier,
  loading
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Danh sách nhà cung cấp
        </h3>
        <p className="text-sm text-gray-600">
          Click vào nhà cung cấp để chỉnh sửa thông tin
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên nhà cung cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Không có nhà cung cấp nào
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.supplierId}
                  onClick={() => onSelectSupplier(supplier)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedSupplier?.supplierId === supplier.supplierId
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {supplier.supplierName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.phoneNumber || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.address || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.createdAt 
                        ? new Date(supplier.createdAt).toLocaleDateString('vi-VN')
                        : 'N/A'
                      }
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
