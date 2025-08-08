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
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {canEdit && (
        <button
          onClick={handleEdit}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Chỉnh sửa</span>
        </button>
      )}
      
      {isInactive ? (
        // Show reactivate option for inactive customers
        canReactivate && (
          <button
            onClick={handleReactivate}
            className="w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kích hoạt lại</span>
          </button>
        )
      ) : (
        // Show delete option for active customers
        canDelete && (
          <button
            onClick={handleDelete}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        )
      )}
    </div>
  );
};

export default ContextMenu;
