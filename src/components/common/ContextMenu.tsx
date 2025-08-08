import React, { useRef, useEffect } from 'react';
import { Edit, Trash2, RotateCcw } from 'lucide-react';

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReactivate?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canReactivate?: boolean;
  isInactive?: boolean; // To determine if item is inactive/deleted
}

/**
 * Context Menu Component
 * Shows options when right-clicking on table rows
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  position,
  onClose,
  onEdit,
  onDelete,
  onReactivate,
  canEdit = true,
  canDelete = true,
  canReactivate = true,
  isInactive = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const handleReactivate = () => {
    if (onReactivate) {
      onReactivate();
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-xl py-2 min-w-[160px] animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {canEdit && (
        <button
          onClick={handleEdit}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-3 transition-all duration-150 group rounded-lg mx-1"
        >
          <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
          <span className="font-medium">Chỉnh sửa</span>
        </button>
      )}
      
      {isInactive ? (
        // Show reactivate option for inactive customers
        canReactivate && (
          <button
            onClick={handleReactivate}
            className="w-full px-4 py-2.5 text-left text-sm text-green-600 hover:bg-green-50 hover:text-green-700 flex items-center space-x-3 transition-all duration-150 group rounded-lg mx-1"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span className="font-medium">Kích hoạt lại</span>
          </button>
        )
      ) : (
        // Show delete option for active customers
        canDelete && (
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-all duration-150 group rounded-lg mx-1"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
            <span className="font-medium">Xóa</span>
          </button>
        )
      )}
    </div>
  );
};

export default ContextMenu;
