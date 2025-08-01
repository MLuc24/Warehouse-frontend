import React, { useState } from 'react';
import { Button } from '@/components/ui';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'url';
  placeholder?: string;
  required?: boolean;
  validation?: (value: unknown) => string | null;
  options?: { label: string; value: string | number }[]; // For select fields
  rows?: number; // For textarea
  disabled?: boolean;
  description?: string;
}

interface GenericFormProps {
  title: string;
  description?: string;
  titleIcon: React.ReactNode;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  layout?: 'single' | 'double'; // single column or double column
  showActionButtons?: boolean; // Control whether to show action buttons
  showFullTitle?: boolean; // Control whether to show full title or just name
  customActionButtons?: (handleSave: () => Promise<void>, onCancel: () => void, isSubmitting: boolean) => React.ReactNode; // Custom action buttons
}

/**
 * Generic Form Component
 * Reusable form component with validation and styling
 */
export const GenericForm: React.FC<GenericFormProps> = ({
  title,
  description,
  titleIcon,
  fields,
  initialData = {},
  onSave,
  onCancel,
  isSubmitting,
  submitButtonText = "Lưu",
  cancelButtonText = "Hủy",
  layout = 'double',
  showActionButtons = true,
  showFullTitle = true,
  customActionButtons
}) => {
  // Initialize form data
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    fields.forEach(field => {
      initial[field.name] = initialData[field.name] || (field.type === 'checkbox' ? false : '');
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.name];
      
      // Required field validation
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!value) {
            newErrors[field.name] = `${field.label} là bắt buộc`;
          }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = `${field.label} là bắt buộc`;
        }
      }

      // Custom validation
      if (field.validation && value) {
        const validationError = field.validation(value);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: FormField, value: unknown) => {
    setFormData(prev => ({ ...prev, [field.name]: value }));
    
    // Clear error for this field
    if (errors[field.name]) {
      setErrors(prev => ({ ...prev, [field.name]: '' }));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    await onSave(formData);
  };

  // Render form field
  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    const baseInputClasses = `w-full px-3 py-2 border-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 placeholder:text-gray-400 text-sm ${
      hasError 
        ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100' 
        : 'border-gray-200 bg-gray-50/50 focus:border-green-400 focus:ring-green-100 focus:bg-white hover:border-gray-300 hover:bg-white'
    }`;

    // Special handling for wide fields (textarea, address, description)
    const isWideField = field.type === 'textarea' || 
                       field.name.toLowerCase().includes('address') || 
                       field.name.toLowerCase().includes('địa chỉ') ||
                       field.name.toLowerCase().includes('description') ||
                       field.name.toLowerCase().includes('mô tả');

    const renderInput = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              value={String(formData[field.name] || '')}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`${baseInputClasses} resize-none`}
              placeholder={field.placeholder}
              disabled={field.disabled || isSubmitting}
              rows={field.rows || 2}
            />
          );
        
        case 'select':
          return (
            <div className="relative">
              <select
                value={String(formData[field.name] || '')}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={`${baseInputClasses} appearance-none pr-8`}
                disabled={field.disabled || isSubmitting}
              >
                <option value="">Chọn {field.label.toLowerCase()}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          );
        
        case 'checkbox':
          return (
            <div className="flex items-center p-2 bg-gray-50/50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
              <input
                type="checkbox"
                checked={Boolean(formData[field.name])}
                onChange={(e) => handleInputChange(field, e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 focus:ring-2 border-gray-300 rounded"
                disabled={field.disabled || isSubmitting}
              />
              <label className="ml-2 text-sm font-semibold text-gray-700">{field.label}</label>
            </div>
          );
        
        default:
          return (
            <input
              type={field.type}
              value={String(formData[field.name] || '')}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder}
              disabled={field.disabled || isSubmitting}
            />
          );
      }
    };

    return (
      <div 
        key={field.name} 
        className={`space-y-1 ${isWideField && layout === 'double' ? 'lg:col-span-2' : ''}`}
      >
        {field.type !== 'checkbox' && (
          <label className="block text-xs font-bold text-gray-800">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {renderInput()}
        
        {field.description && (
          <p className="text-xs text-gray-500 italic">{field.description}</p>
        )}
        
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded p-1 mt-1">
            <p className="text-xs text-red-700 flex items-center">
              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors[field.name]}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Modern Card Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <div className="w-5 h-5 text-white">
                {titleIcon}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {showFullTitle ? title : title.split(' ').slice(-1).join(' ')}
              </h3>
              {description && (
                <p className="text-green-100 leading-relaxed text-sm">{description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Form Content */}
        <div className="p-4">
          <div className={layout === 'double' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
            {fields.map(renderField)}
          </div>
        </div>

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex justify-end space-x-2">
              <Button
                onClick={onCancel}
                variant="secondary"
                disabled={isSubmitting}
                className="px-6 py-2 font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg text-sm"
              >
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {cancelButtonText}
                </div>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-lg transform hover:scale-105 text-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Đang lưu...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {submitButtonText}
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Custom Action Buttons */}
        {customActionButtons && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            {customActionButtons(handleSave, onCancel, isSubmitting)}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericForm;
