import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { CloudinaryImageUpload } from '../ui/CloudinaryImageUpload';
import { getUnitsAsOptions } from '../../constants/units';

// Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'password' | 'select' | 'checkbox' | 'textarea' | 'unit' | 'image' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: (value: unknown) => string | undefined;
  description?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  productName?: string;
}

interface BaseProps {
  fields: FormField[];
  title: string;
  titleIcon?: React.ReactNode;
  description?: string;
  layout?: 'single' | 'double';
  headerImageUrl?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
}

interface CreateProps extends BaseProps {
  mode: 'create';
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

interface EditProps<T> extends BaseProps {
  mode: 'edit';
  item: T;
  getItemId: (item: T) => string | number;
  canEdit?: boolean;
  canDelete?: boolean;
  isReadOnly?: boolean;
  isActive?: (item: T) => boolean;
  onSave: (data: Partial<T>) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
  onReactivate?: (id: string | number) => Promise<void>;
  getAdditionalInfo?: (item: T) => { label: string; value: string }[];
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  reactivateButtonText?: string;
}

export type GenericInlineProps<T> = CreateProps | EditProps<T>;

/**
 * GenericInline - Clean unified component for create/edit forms
 */
export const GenericInline = <T,>(props: GenericInlineProps<T>) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(props.mode === 'create');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');

  // Initialize form data
  const getInitialData = (): Record<string, unknown> => {
    const initial: Record<string, unknown> = {};
    if (props.mode === 'create') {
      props.fields.forEach((field: FormField) => {
        initial[field.name] = props.initialData?.[field.name] || (field.type === 'checkbox' ? false : '');
      });
    } else {
      props.fields.forEach((field: FormField) => {
        initial[field.name] = (props.item as Record<string, unknown>)[field.name];
      });
    }
    return initial;
  };

  const [formData, setFormData] = useState<Record<string, unknown>>(getInitialData);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    props.fields.forEach((field: FormField) => {
      const value = formData[field.name];
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = `${field.label} là bắt buộc`;
      }
      if (field.validation && value) {
        const validationError = field.validation(value);
        if (validationError) newErrors[field.name] = validationError;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (field: FormField, value: unknown) => {
    setFormData(prev => ({ ...prev, [field.name]: value }));
    if (errors[field.name]) setErrors(prev => ({ ...prev, [field.name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSave = async () => {
    setApiError('');
    if (!validateForm()) return;
    try {
      if (props.mode === 'create') {
        await props.onSave(formData);
      } else {
        await props.onSave(formData as Partial<T>);
        setIsEditing(false);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
    }
  };

  const handleCancel = () => {
    if (props.mode === 'edit') {
      setIsEditing(false);
      setFormData(getInitialData());
    }
    setErrors({});
    setApiError('');
    props.onCancel();
  };

  const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    try {
      await props.onDelete(props.getItemId(props.item));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleReactivate = async () => {
    if (props.mode !== 'edit' || !props.onReactivate) return;
    try {
      await props.onReactivate(props.getItemId(props.item));
    } catch (error) {
      console.error('Error reactivating:', error);  
    }
  };

  // Render input field
  const renderInput = (field: FormField) => {
    const isDisabled = field.disabled || props.isSubmitting || 
      (props.mode === 'edit' && (!props.canEdit || !isEditing));
    
    const baseClasses = `w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
      errors[field.name] 
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
        : 'border-gray-200 bg-gray-50 focus:border-green-400 focus:ring-green-100 focus:bg-white hover:border-gray-300'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={String(formData[field.name] || '')}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`${baseClasses} resize-none`}
            placeholder={field.placeholder}
            disabled={isDisabled}
            rows={field.rows || 2}
          />
        );
      
      case 'select':
        return (
          <div className="relative">
            <select
              value={String(formData[field.name] || '')}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`${baseClasses} appearance-none pr-8`}
              disabled={isDisabled}
            >
              {!formData[field.name] && <option value="" disabled>-- Chọn {field.label.toLowerCase()} --</option>}
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );

      case 'unit': {
        const unitOptions = getUnitsAsOptions();
        return (
          <div className="relative">
            <select
              value={String(formData[field.name] || '')}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`${baseClasses} appearance-none pr-8`}
              disabled={isDisabled}
            >
              {!formData[field.name] && <option value="" disabled>-- Chọn đơn vị tính --</option>}
              {unitOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );
      }

      case 'image':
        return (
          <CloudinaryImageUpload
            value={String(formData[field.name] || '')}
            onChange={(value: string) => handleInputChange(field, value)}
            disabled={isDisabled}
            placeholder={field.placeholder}
            productName={field.productName}
            hidePreview={!!props.headerImageUrl}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center p-2 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(formData[field.name])}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              disabled={isDisabled}
            />
            <label className="ml-2 text-sm font-medium text-gray-700">{field.label}</label>
          </div>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={formData[field.name] ? String(formData[field.name]).split('T')[0] : ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            disabled={isDisabled}
            min={new Date().toISOString().split('T')[0]} // Set minimum date to today
          />
        );
      
      default:
        return (
          <input
            type={field.type}
            value={String(formData[field.name] || '')}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            disabled={isDisabled}
          />
        );
    }
  };

  // Render complete field
  const renderField = (field: FormField) => {
    const isWideField = field.type === 'textarea' || field.type === 'image' ||
      field.name.toLowerCase().includes('address') || field.name.toLowerCase().includes('description');

    return (
      <div key={field.name} className={`space-y-1 ${isWideField && props.layout === 'double' ? 'lg:col-span-2' : ''}`}>
        {field.type !== 'checkbox' && (
          <label className="block text-xs font-bold text-gray-800">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {renderInput(field)}
        
        {field.description && <p className="text-xs text-gray-500 italic">{field.description}</p>}
        
        {errors[field.name] && (
          <p className="text-xs text-red-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors[field.name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Delete Modal */}
      {props.mode === 'edit' && showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {props.deleteConfirmTitle || 'Xác nhận xóa'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">{props.deleteConfirmMessage || 'Bạn có chắc chắn muốn xóa?'}</p>
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary" disabled={props.isSubmitting}>
                  Hủy
                </Button>
                <Button onClick={handleDelete} disabled={props.isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  {props.isSubmitting ? 'Đang xóa...' : 'Xóa'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3">
          <div className="flex items-center">
            {props.headerImageUrl ? (
              <div className="h-12 w-12 bg-white/10 rounded-lg overflow-hidden border-2 border-white/20 mr-3">
                <img src={props.headerImageUrl} alt="Header" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <div className="w-5 h-5 text-white">{props.titleIcon}</div>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {props.mode === 'create' ? props.title : props.title.split(' ').pop()}
              </h3>
              {props.description && <p className="text-green-100 text-sm">{props.description}</p>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Lỗi</h4>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className={props.layout === 'double' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
            {props.fields.map(renderField)}
          </div>
        </div>

        {/* Additional Info */}
        {props.mode === 'edit' && props.getAdditionalInfo && (
          <div className="mx-4 mb-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="bg-blue-600 px-3 py-2 text-white text-sm font-semibold">Thông tin chi tiết</div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {props.getAdditionalInfo(props.item).map((info: { label: string; value: string }, index: number) => (
                <div key={index} className="bg-white rounded p-2 border">
                  <dt className="text-xs font-medium text-gray-500 uppercase">{info.label}</dt>
                  <dd className="text-xs font-semibold text-gray-900">{info.value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-gray-50 px-4 py-3 border-t">
          {props.mode === 'create' ? (
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCancel} variant="secondary" disabled={props.isSubmitting}>Hủy</Button>
              <Button onClick={handleSave} disabled={props.isSubmitting} className="bg-green-600 text-white">
                {props.isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          ) : props.isReadOnly ? (
            <div className="flex justify-end">
              <Button onClick={handleCancel} variant="secondary">Đóng</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                {props.onReactivate && props.isActive && !props.isActive(props.item) ? (
                  <Button onClick={handleReactivate} disabled={props.isSubmitting} className="bg-green-600 text-white">
                    {props.isSubmitting ? 'Đang kích hoạt...' : props.reactivateButtonText || 'Kích hoạt lại'}
                  </Button>
                ) : (
                  props.canDelete && props.isActive && props.isActive(props.item) && (
                    <Button onClick={() => setShowDeleteConfirm(true)} disabled={props.isSubmitting} className="bg-red-600 text-white">
                      Xóa
                    </Button>
                  )
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCancel} variant="secondary" disabled={props.isSubmitting}>Hủy</Button>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} disabled={props.isSubmitting || !props.canEdit} className="bg-blue-600 text-white">
                    Thay đổi
                  </Button>
                ) : (
                  <Button onClick={handleSave} disabled={props.isSubmitting} className="bg-green-600 text-white">
                    {props.isSubmitting ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
