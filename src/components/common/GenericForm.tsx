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
  layout = 'double'
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
    const baseInputClasses = `w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
      hasError 
        ? 'border-red-300 bg-red-50 focus:border-red-400' 
        : 'border-gray-300 bg-white focus:border-green-400 hover:border-gray-400'
    }`;

    const renderInput = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              value={String(formData[field.name] || '')}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder}
              disabled={field.disabled || isSubmitting}
              rows={field.rows || 4}
            />
          );
        
        case 'select':
          return (
            <select
              value={String(formData[field.name] || '')}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClasses}
              disabled={field.disabled || isSubmitting}
            >
              <option value="">Chọn {field.label.toLowerCase()}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        
        case 'checkbox':
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={Boolean(formData[field.name])}
                onChange={(e) => handleInputChange(field, e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                disabled={field.disabled || isSubmitting}
              />
              <label className="ml-2 text-sm text-gray-700">{field.label}</label>
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
      <div key={field.name} className="space-y-2">
        {field.type !== 'checkbox' && (
          <label className="block text-sm font-semibold text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {renderInput()}
        
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}
        
        {hasError && (
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
            <div className="w-6 h-6 text-white">
              {titleIcon}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-8">
        <div className={layout === 'double' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-6'}>
          {fields.map(renderField)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
          className="px-6 py-3 font-medium"
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </div>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </div>
  );
};

export default GenericForm;
