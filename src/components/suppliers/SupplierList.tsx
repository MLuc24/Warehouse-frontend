import React, { useState, useMemo } from 'react';
import { GenericList, ExportButtons } from '@/components/common';
import { useSupplierExport } from '@/hooks';
import type { Supplier } from '@/types';

type StatusFilter = 'all' | 'Active' | 'Expired';
type DateSort = 'newest' | 'oldest';

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
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // Permission props
  permissions?: {
    suppliers: {
      canCreate: boolean;
    };
  };
}

/**
 * Enhanced Supplier List Component using GenericList
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
  onClearSearch,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  // Permission props
  permissions
}) => {
  // State for filtering and sorting
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateSort, setDateSort] = useState<DateSort>('newest');

  // Filter and sort suppliers based on current filters
  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = [...suppliers];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }

    // Apply date sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      
      if (dateSort === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  }, [suppliers, statusFilter, dateSort]);

  // Export functionality
  const { exportOptions, canExport } = useSupplierExport({
    suppliers: filteredAndSortedSuppliers,
    title: 'Danh sách nhà cung cấp',
    filename: 'danh-sach-nha-cung-cap'
  });

  // Handle column header click
  const handleColumnHeaderClick = (column: { key: string; label: string }) => {
    if (column.key === 'status') {
      // Toggle status filter
      const nextStatus = statusFilter === 'all' ? 'Active' : statusFilter === 'Active' ? 'Expired' : 'all';
      setStatusFilter(nextStatus);
    } else if (column.key === 'createdAt') {
      // Toggle date sort
      const nextSort = dateSort === 'newest' ? 'oldest' : 'newest';
      setDateSort(nextSort);
    }
  };

  // Define table columns
  const columns = [
    {
      key: 'supplier',
      label: 'Tên nhà cung cấp',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      render: (supplier: Supplier) => (
        <div className="flex items-center whitespace-nowrap">
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
      )
    },
    {
      key: 'email',
      label: 'Email',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      ),
      render: (supplier: Supplier) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {supplier.email || (
            <span className="text-gray-400 italic">Chưa có email</span>
          )}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      render: (supplier: Supplier) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {supplier.phoneNumber || (
            <span className="text-gray-400 italic">Chưa có SĐT</span>
          )}
        </div>
      )
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      render: (supplier: Supplier) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {supplier.address || (
            <span className="text-gray-400 italic">Chưa có địa chỉ</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      filterable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      render: (supplier: Supplier) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
          supplier.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {supplier.status === 'Active' ? 'Hoạt động' : 'Hết hạn'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      sortable: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      render: (supplier: Supplier) => (
        <div className="text-sm text-gray-900 whitespace-nowrap">
          {supplier.createdAt 
            ? new Date(supplier.createdAt).toLocaleDateString('vi-VN')
            : (
              <span className="text-gray-400 italic">N/A</span>
            )
          }
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <ExportButtons 
          exportOptions={exportOptions}
          disabled={!canExport || loading}
        />
      </div>
      
      <GenericList<Supplier>
        // Data props
        items={filteredAndSortedSuppliers}
        selectedItem={selectedSupplier}
        onSelectItem={onSelectSupplier}
        loading={loading}
        
        // Header props
        title="Danh sách nhà cung cấp"
        totalCount={suppliers.length}
        headerIcon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        onShowCreate={onShowCreate}
        createButtonText="Thêm"
        
        // Search props
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
        
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        
        // Table props
        columns={columns}
        getItemKey={(supplier) => supplier.supplierId}
        isItemSelected={(supplier, selected) => selected?.supplierId === supplier.supplierId}      // Column interactions
      onColumnHeaderClick={handleColumnHeaderClick}
      
      // Permission props
      permissions={{
        canCreate: permissions?.suppliers.canCreate ?? false
      }}
      
      // Empty state props
      emptyStateIcon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      emptyStateMessage="Không có nhà cung cấp nào"
      emptySearchMessage={(term) => `Không tìm thấy nhà cung cấp nào với từ khóa "${term}"`}
      emptyFilterMessage={(filter) => `Không có nhà cung cấp nào ${filter === 'Active' ? 'đang hoạt động' : 'hết hạn'}`}
    />
    </div>
  );
};

export default SupplierList;
