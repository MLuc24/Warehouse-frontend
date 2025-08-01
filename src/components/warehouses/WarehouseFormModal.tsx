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
 * Warehouse Form Modal - Create/Update warehouse using GenericModal
 * Distinguished from inline edit by "FormModal" suffix
 */
export const WarehouseFormModal: React.FC<WarehouseFormModalProps> = ({
  isOpen,
  onClose,
  warehouse,
  onSubmit,
  loading = false
}) => {
  const title = warehouse ? 'Chỉnh sửa kho hàng' : 'Thêm kho hàng mới';

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
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
