import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red';
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  color = 'blue',
  className = ''
}) => {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'h-7 w-14',
      thumb: 'h-6 w-6',
      translate: 'translate-x-7'
    }
  };

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600'
  };

  const switchClasses = `
    relative inline-flex items-center ${sizes[size].switch} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
    ${checked ? colors[color] : 'bg-gray-200'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const thumbClasses = `
    inline-block ${sizes[size].thumb} transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
    ${checked ? sizes[size].translate : 'translate-x-0'}
  `;

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        className={switchClasses}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
      >
        <span className={thumbClasses} />
      </button>
      {label && (
        <span className={`ml-3 text-sm font-medium text-gray-900 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Switch;
