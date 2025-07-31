import React from 'react';
import { Button, Input } from '@/components/ui';
import type { Supplier } from '@/types';

interface SupplierListProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSelectSupplier: (supplier: Supplier) => void;
  onShowCreate?: () => void;
  loading: boolean;
  // Search props
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
}

/**
 * Supplier List Component
 * Shows list of suppliers with click to select functionality
 */
export const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  selectedSupplier,
  onSelectSupplier,
  onShowCreate,
  loading,
  // Search props
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchTermChange(value);
    // Tìm kiếm real-time khi nhập
    onSearch(value);
  };
  return (
    <div className="w-full">
      {/* Header với Search Bar tích hợp */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Danh sách nhà cung cấp
            </h3>
            <div className="text-sm text-gray-500">
              {suppliers.length} nhà cung cấp
            </div>
          </div>
          {onShowCreate && (
            <Button
              onClick={onShowCreate}
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md lg:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm nhà cung cấp
            </Button>
          )}
        </div>
        
        {/* Search Bar tích hợp */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          {searchTerm && (
            <Button 
              onClick={onClearSearch}
              variant="outline"
              disabled={loading}
              className="sm:w-auto"
            >
              ✕ Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Table với styling cải tiến */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Tên nhà cung cấp
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Số điện thoại
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Địa chỉ
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ngày tạo
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">Không có nhà cung cấp nào</p>
                    <p className="text-gray-400 text-sm mt-1">Hãy thêm nhà cung cấp đầu tiên của bạn</p>
                  </div>
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, index) => (
                <tr
                  key={supplier.supplierId}
                  onClick={() => onSelectSupplier(supplier)}
                  className={`cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ${
                    selectedSupplier?.supplierId === supplier.supplierId
                      ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                      : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {supplier.supplierName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {supplier.supplierName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {supplier.supplierId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.email || (
                        <span className="text-gray-400 italic">Chưa có email</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.phoneNumber || (
                        <span className="text-gray-400 italic">Chưa có SĐT</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {supplier.address || (
                        <span className="text-gray-400 italic">Chưa có địa chỉ</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.createdAt 
                        ? new Date(supplier.createdAt).toLocaleDateString('vi-VN')
                        : (
                          <span className="text-gray-400 italic">N/A</span>
                        )
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
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
