import React from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  error,
  description,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const labelSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const checkboxClasses = `
    ${sizes[size]} text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${error ? 'border-red-300' : ''}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={checkboxClasses}
          />
        </div>
        {label && (
          <div className="ml-3">
            <label className={`font-medium text-gray-900 ${labelSizes[size]} ${disabled ? 'opacity-50' : ''}`}>
              {label}
            </label>
            {description && (
              <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 ml-8">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;
