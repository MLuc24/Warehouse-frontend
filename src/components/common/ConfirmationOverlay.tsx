import React from 'react';
import { Button } from '@/components/ui';

interface ConfirmationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  icon?: React.ReactNode;
}

/**
 * ConfirmationOverlay - Reusable confirmation dialog
 * Can be used for delete, deactivate, archive, or any confirmation action
 */
export const ConfirmationOverlay: React.FC<ConfirmationOverlayProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  message,
  itemName,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  confirmVariant = 'danger',
  icon
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  // Default icons based on variant
  const defaultIcons = {
    danger: (
      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    warning: (
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    primary: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const iconBgColors = {
    danger: 'bg-gradient-to-br from-red-50 to-red-100',
    warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100'
  };

  const buttonColors = {
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:ring-yellow-500 shadow-lg hover:shadow-xl',
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl'
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full ${iconBgColors[confirmVariant]} mb-6 ring-4 ring-white shadow-lg`}>
            {icon || defaultIcons[confirmVariant]}
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 id="confirmation-title" className="text-xl font-semibold text-gray-900 mb-3">
              {title}
            </h3>
            <div id="confirmation-description" className="text-gray-600 mb-6">
              <p className="mb-3 leading-relaxed">{message}</p>
              {itemName && (
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-300">
                  <p className="font-medium text-gray-800">
                    Mục: <span className="font-bold text-gray-900">{itemName}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </Button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-6 py-2.5 text-white rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center transform hover:-translate-y-0.5 ${buttonColors[confirmVariant]}`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Đang xử lý...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationOverlay;
