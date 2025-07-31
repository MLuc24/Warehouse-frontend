import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { GenericForm } from './GenericForm';
import type { FormField } from './GenericForm';

interface GenericInlineEditProps<T> {
  item: T;
  title: string;
  titleIcon: React.ReactNode;
  fields: FormField[];
  onSave: (data: Partial<T>) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  onReactivate?: (id: number | string) => Promise<void>;
  onCancel: () => void;
  getItemId: (item: T) => number | string;
  canEdit?: boolean;
  canDelete?: boolean;
  isReadOnly?: boolean;
  isActive?: (item: T) => boolean;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  reactivateButtonText?: string;
}

/**
 * Generic Inline Edit Component
 * Reusable inline editing functionality for any entity
 */
export const GenericInlineEdit = <T,>({
  item,
  title,
  titleIcon,
  fields,
  onSave,
  onDelete,
  onReactivate,
  onCancel,
  getItemId,
  canEdit = true,
  canDelete = true,
  isReadOnly = false,
  isActive = () => true,
  deleteConfirmTitle = "Xác nhận xóa",
  deleteConfirmMessage = "Bạn có chắc chắn muốn xóa mục này?",
  reactivateButtonText = "Kích hoạt lại"
}: GenericInlineEditProps<T>) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert item to form data
  const getInitialData = (): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    fields.forEach(field => {
      data[field.name] = (item as Record<string, unknown>)[field.name];
    });
    return data;
  };

  // Handle save
  const handleSave = async (formData: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      await onSave(formData as Partial<T>);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(getItemId(item));
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reactivate
  const handleReactivate = async () => {
    if (!onReactivate) return;
    
    setIsSubmitting(true);
    try {
      await onReactivate(getItemId(item));
    } catch (error) {
      console.error('Error reactivating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{deleteConfirmTitle}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">{deleteConfirmMessage}</p>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xóa...
                  </div>
                ) : (
                  'Xóa'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <GenericForm
        title={title}
        titleIcon={titleIcon}
        fields={fields.map(field => ({
          ...field,
          disabled: field.disabled || isReadOnly || !canEdit
        }))}
        initialData={getInitialData()}
        onSave={handleSave}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitButtonText={isReadOnly ? "Đóng" : "Lưu thay đổi"}
        cancelButtonText="Hủy"
      />

      {/* Action Buttons */}
      {!isReadOnly && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {/* Left side - Reactivate button (if item is inactive) */}
            <div>
              {onReactivate && !isActive(item) && (
                <Button
                  onClick={handleReactivate}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang kích hoạt...
                    </div>
                  ) : (
                    reactivateButtonText
                  )}
                </Button>
              )}
            </div>

            {/* Right side - Delete button */}
            <div>
              {canDelete && (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericInlineEdit;
