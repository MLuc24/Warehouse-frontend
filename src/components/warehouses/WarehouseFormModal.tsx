import React from 'react';
import { GenericModal } from '@/components/common';
import { WarehouseForm } from '../forms/WarehouseForm';
import type { Warehouse, WarehouseFormData } from '@/types';

interface WarehouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse | null;
  onSubmit: (data: WarehouseFormData) => Promise<{ success: boolean; message: string }>;
  loading?: boolean;
}

/**
 * WarehouseFormModal - Enhanced modal for warehouse CRUD operations
 */
export const WarehouseFormModal: React.FC<WarehouseFormModalProps> = ({
  isOpen,
  onClose,
  warehouse,
  onSubmit,
  loading = false
}) => {
  const title = warehouse ? 'Chỉnh sửa kho hàng' : 'Thêm kho hàng mới';
  
  // Icon for warehouse operations
  const warehouseIcon = (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  );
  
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      icon={warehouseIcon}
      variant={warehouse ? 'info' : 'success'}
    >
      <WarehouseForm
        warehouse={warehouse}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </GenericModal>
  );
};

export default WarehouseFormModal;
