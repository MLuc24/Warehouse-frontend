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
  getAdditionalInfo?: (item: T) => Array<{label: string, value: string | number}>; // Additional info display
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
  reactivateButtonText = "Kích hoạt lại",
  getAdditionalInfo
}: GenericInlineEditProps<T>) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track editing mode

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
      setIsEditing(false); // Exit editing mode after successful save
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // If in editing mode, this becomes a save action handled by form
      return;
    } else {
      // Enter editing mode
      setIsEditing(true);
    }
  };

  // Handle cancel - exit editing mode
  const handleCancel = () => {
    setIsEditing(false);
    onCancel();
  };

  // Custom action buttons renderer
  const renderCustomActionButtons = (formHandleSave: () => Promise<void>, _formOnCancel: () => void, formIsSubmitting: boolean) => (
    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        {/* Left side - Delete/Reactivate button (aligned) */}
        <div className="flex items-center">
          {/* Show reactivate button for inactive items */}
          {onReactivate && !isActive(item) ? (
            <Button
              onClick={handleReactivate}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Đang kích hoạt...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {reactivateButtonText}
                </div>
              )}
            </Button>
          ) : (
            /* Show delete button only for active items */
            canDelete && isActive(item) && (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </div>
              </Button>
            )
          )}
        </div>

        {/* Spacer to push Cancel/Save buttons to the right */}
        <div className="flex-1"></div>

        {/* Right side - Cancel and Edit/Save buttons */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCancel}
            variant="secondary"
            disabled={formIsSubmitting}
            className="px-4 py-2 font-semibold border-2 hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            Hủy
          </Button>
          
          {/* Edit/Save button with dynamic behavior */}
          {!isEditing ? (
            /* Show Edit/Change button when not in editing mode */
            <Button
              onClick={handleEditToggle}
              disabled={formIsSubmitting || !canEdit}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
            >
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Thay đổi
              </div>
            </Button>
          ) : (
            /* Show Save button when in editing mode */
            <Button
              onClick={formHandleSave}
              disabled={formIsSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
            >
              {formIsSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lưu
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

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
    <div className="w-full mx-auto">
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{deleteConfirmTitle}</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{deleteConfirmMessage}</p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="secondary"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 font-medium"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xóa...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-3">
          {/* Enhanced GenericForm */}
          <GenericForm
            title={title}
            titleIcon={titleIcon}
            fields={fields.map(field => ({
              ...field,
              disabled: field.disabled || isReadOnly || !canEdit || !isEditing // Disable fields when not in editing mode
            }))}
            initialData={getInitialData()}
            onSave={handleSave}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitButtonText={isReadOnly ? "Đóng" : "Lưu"}
            cancelButtonText="Hủy"
            layout="double" // Use double column with smart wide field handling
            showActionButtons={false} // Hide default action buttons
            showFullTitle={false} // Only show name, not full title
            customActionButtons={isReadOnly ? undefined : renderCustomActionButtons} // Use custom action buttons for edit mode
            headerImageUrl={(item as Record<string, unknown>).imageUrl as string || ''} // Pass image URL to show in header
          />
        </div>

        {/* Enhanced Additional Info Section - Between form fields and action buttons */}
        {getAdditionalInfo && (
          <div className="mx-3 mb-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-5 h-5 bg-white bg-opacity-20 rounded flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-white">Thông tin chi tiết</h4>
              </div>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getAdditionalInfo(item).map((info, index) => (
                  <div key={index} className="bg-white rounded p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {info.label}
                        </dt>
                        <dd className="text-xs font-semibold text-gray-900 break-words">
                          {info.value}
                        </dd>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericInlineEdit;
