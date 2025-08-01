import React, { useState, useMemo } from 'react';
import { useWarehouses, useWarehouseActions } from '@/hooks/useWarehouse';
import { WarehouseTable } from './WarehouseTable';
import { WarehouseFormModal } from './WarehouseFormModal';
import { SearchAndFilter } from './SearchAndFilter';
import { ConfirmationOverlay, EntityStats } from '@/components/common';
import { Button } from '@/components/ui';
import type { Warehouse, WarehouseFormData } from '@/types';

interface WarehouseManagementProps {
  onNotification?: (message: string, type: 'success' | 'error') => void;
}

/**
 * WarehouseManagement - Main warehouse management component
 * Handles all warehouse-related operations and state management
 */
export const WarehouseManagement: React.FC<WarehouseManagementProps> = ({
  onNotification
}) => {
  const { warehouses, loading, error, refetch } = useWarehouses();
  const { createWarehouse, updateWarehouse, deleteWarehouse, loading: actionLoading } = useWarehouseActions();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hasInventory: 'all' as 'all' | 'with-items' | 'empty',
    sortBy: 'name' as 'name' | 'createdAt' | 'totalItems',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  // Filter and search warehouses
  const filteredWarehouses = useMemo(() => {
    let filtered = warehouses.filter(warehouse =>
      warehouse.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply inventory filter
    if (filters.hasInventory === 'with-items') {
      filtered = filtered.filter(w => w.totalInventoryItems > 0);
    } else if (filters.hasInventory === 'empty') {
      filtered = filtered.filter(w => w.totalInventoryItems === 0);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.warehouseName.toLowerCase();
          bValue = b.warehouseName.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case 'totalItems':
          aValue = a.totalInventoryItems;
          bValue = b.totalInventoryItems;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return filtered;
  }, [warehouses, searchTerm, filters]);

  // Helper to show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    onNotification?.(message, type);
  };

  // Handle create new warehouse
  const handleCreateNew = () => {
    setSelectedWarehouse(null);
    setIsFormModalOpen(true);
  };

  // Handle edit warehouse
  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsFormModalOpen(true);
  };

  // Handle delete warehouse
  const handleDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: WarehouseFormData) => {
    try {
      let result;
      if (selectedWarehouse) {
        // Update existing warehouse
        result = await updateWarehouse(selectedWarehouse.warehouseId!, data);
      } else {
        // Create new warehouse
        result = await createWarehouse(data);
      }

      if (result.success) {
        showNotification(result.message, 'success');
        setIsFormModalOpen(false);
        setSelectedWarehouse(null);
        refetch();
      } else {
        showNotification(result.message, 'error');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      showNotification(errorMessage, 'error');
      return { success: false, message: errorMessage };
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedWarehouse) return;

    try {
      const result = await deleteWarehouse(selectedWarehouse.warehouseId!);
      
      if (result.success) {
        showNotification(result.message, 'success');
        setIsDeleteModalOpen(false);
        setSelectedWarehouse(null);
        refetch();
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa kho hàng';
      showNotification(errorMessage, 'error');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedWarehouse(null);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý kho hàng</h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý danh sách các kho hàng trong hệ thống
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              onClick={handleCreateNew}
              size="md"
              variant="primary"
            >
              Thêm kho hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={refetch}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-8">
        <EntityStats
          data={{
            total: warehouses.length,
            current: filteredWarehouses.length,
            active: warehouses.filter(w => w.totalInventoryItems > 0).length,
            inactive: warehouses.filter(w => w.totalInventoryItems === 0).length,
            currentPage: 1,
            totalPages: 1
          }}
          entityName="kho hàng"
          entityIcon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          }
          showActiveInactive={true}
          columns={4}
          customStats={[
            {
              label: 'Tổng sản phẩm',
              value: warehouses.reduce((sum, w) => sum + w.totalInventoryItems, 0).toString(),
              color: 'purple',
              icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )
            }
          ]}
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <SearchAndFilter
          onSearch={(term) => setSearchTerm(term)}
          onFilter={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
          onExport={() => {
            // TODO: Implement export functionality
            showNotification('Tính năng xuất Excel sẽ được triển khai sớm', 'success');
          }}
        />
      </div>

      {/* Warehouse Table */}
      <div className="mb-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách kho hàng</h2>
          </div>
          <div className="p-6">
            <WarehouseTable
              warehouses={filteredWarehouses}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateNew={handleCreateNew}
            />
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <WarehouseFormModal
        isOpen={isFormModalOpen}
        onClose={handleModalClose}
        warehouse={selectedWarehouse}
        onSubmit={handleFormSubmit}
        loading={actionLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmationOverlay
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Xác nhận xóa kho hàng"
        message="Bạn có chắc chắn muốn xóa kho hàng này? Hành động này không thể hoàn tác."
        itemName={selectedWarehouse?.warehouseName}
        confirmText="Xóa kho"
        cancelText="Hủy bỏ"
        confirmVariant="danger"
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        }
      />
    </>
  );
};

export default WarehouseManagement;
