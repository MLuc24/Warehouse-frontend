import React from 'react';

export interface ActionButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  iconOnly?: boolean;
  className?: string;
}

/**
 * ActionButton - Reusable action button component
 * Can be used for table actions, form actions, etc.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  loading = false,
  tooltip,
  iconOnly = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    xs: iconOnly ? 'p-1' : 'px-2 py-1 text-xs',
    sm: iconOnly ? 'p-1.5' : 'px-3 py-1.5 text-sm',
    md: iconOnly ? 'p-2' : 'px-4 py-2 text-sm',
    lg: iconOnly ? 'p-3' : 'px-6 py-3 text-base'
  };

  const iconSizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };

  const buttonContent = (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={tooltip}
      type="button"
    >
      {loading ? (
        <svg className={`animate-spin ${iconSizeClasses[size]} ${label && !iconOnly ? 'mr-2' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className={`${iconSizeClasses[size]} ${label && !iconOnly ? 'mr-2' : ''}`}>
          {icon}
        </span>
      ) : null}
      {!iconOnly && label && (
        <span>{label}</span>
      )}
    </button>
  );

  return buttonContent;
};

// Predefined common action buttons
export const EditButton: React.FC<Omit<ActionButtonProps, 'icon' | 'label' | 'variant'> & { label?: string }> = ({ 
  label = 'Sửa',
  ...props 
}) => (
  <ActionButton
    icon={
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    }
    label={label}
    variant="secondary"
    {...props}
  />
);

export const DeleteButton: React.FC<Omit<ActionButtonProps, 'icon' | 'label' | 'variant'> & { label?: string }> = ({ 
  label = 'Xóa',
  ...props 
}) => (
  <ActionButton
    icon={
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    }
    label={label}
    variant="danger"
    {...props}
  />
);

export const ViewButton: React.FC<Omit<ActionButtonProps, 'icon' | 'label' | 'variant'> & { label?: string }> = ({ 
  label = 'Xem',
  ...props 
}) => (
  <ActionButton
    icon={
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    }
    label={label}
    variant="ghost"
    {...props}
  />
);

export const AddButton: React.FC<Omit<ActionButtonProps, 'icon' | 'label' | 'variant'> & { label?: string }> = ({ 
  label = 'Thêm mới',
  ...props 
}) => (
  <ActionButton
    icon={
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    }
    label={label}
    variant="primary"
    {...props}
  />
);

export default ActionButton;
