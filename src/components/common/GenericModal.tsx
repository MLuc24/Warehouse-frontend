import React, { useEffect } from 'react';

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Generic Modal Component - Reusable modal wrapper
 * Used for create/update forms and other modal content
 * Distinguished from inline components by "Modal" suffix
 */
export const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  icon,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  const variantClasses = {
    default: {
      header: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100',
      titleColor: 'text-gray-900',
      iconColor: 'text-blue-500'
    },
    success: {
      header: 'bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100',
      titleColor: 'text-green-900',
      iconColor: 'text-green-500'
    },
    warning: {
      header: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100',
      titleColor: 'text-yellow-900',
      iconColor: 'text-yellow-500'
    },
    danger: {
      header: 'bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100',
      titleColor: 'text-red-900',
      iconColor: 'text-red-500'
    },
    info: {
      header: 'bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100',
      titleColor: 'text-cyan-900',
      iconColor: 'text-cyan-500'
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header with gradient background */}
          <div className={`px-6 py-4 ${variantClasses[variant].header}`}>
            <div className="flex items-center">
              {/* Icon */}
              {icon && (
                <div className={`mr-3 flex-shrink-0 ${variantClasses[variant].iconColor}`}>
                  {icon}
                </div>
              )}
              
              {/* Title */}
              <h3 
                id="modal-title"
                className={`text-lg font-semibold ${variantClasses[variant].titleColor} flex-grow`}
              >
                {title}
              </h3>
              
              {/* Close button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content with better spacing */}
          <div className="px-6 py-6 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
