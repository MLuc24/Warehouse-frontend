import React from 'react';
import { Button } from '@/components/ui';

interface DeleteConfirmationOverlayProps {
  item: {
    id: number;
    name: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  message?: string;
  itemType?: string;
}

/**
 * Delete Confirmation Overlay Component
 * Atomic level: Organism - overlay for delete confirmation
 * Can be used for any item type (supplier, product, etc.)
 */
export const DeleteConfirmationOverlay: React.FC<DeleteConfirmationOverlayProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = 'Chuyển sang hết hạn',
  itemType = 'mục'
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn chuyển {itemType}{' '}
              <span className="font-medium text-gray-900">"{item.name}"</span>{' '}
              sang trạng thái <span className="font-medium text-red-600">"Hết hạn"</span>?{' '}
              Nhà cung cấp này sẽ không hiển thị trong danh sách chọn khi thêm sản phẩm.
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang chuyển...</span>
                </div>
              ) : (
                'Chuyển sang hết hạn'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationOverlay;
