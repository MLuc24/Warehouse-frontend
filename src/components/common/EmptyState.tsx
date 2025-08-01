import React from 'react';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * EmptyState - Reusable empty state component
 * Can be used for empty lists, search results, etc.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionVariant = 'primary',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-8 w-8',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      container: 'py-12',
      icon: 'h-12 w-12',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'py-16',
      icon: 'h-16 w-16',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  };

  const defaultIcon = (
    <svg className={`${sizeClasses[size].icon} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size].container} ${className}`}>
      <div className={`flex flex-col items-center ${sizeClasses[size].spacing}`}>
        {/* Icon */}
        <div className="flex-shrink-0">
          {icon || defaultIcon}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`font-semibold text-gray-900 ${sizeClasses[size].title}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-gray-500 max-w-md ${sizeClasses[size].description}`}>
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {actionText && onAction && (
          <Button
            variant={actionVariant}
            onClick={onAction}
            className="mt-2"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

// Predefined common empty states
export const NoDataFound: React.FC<Omit<EmptyStateProps, 'icon' | 'title'> & { entityName?: string }> = ({ 
  entityName = 'dữ liệu', 
  ...props 
}) => (
  <EmptyState
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
    title={`Không có ${entityName}`}
    {...props}
  />
);

export const NoSearchResults: React.FC<Omit<EmptyStateProps, 'icon' | 'title'> & { searchTerm?: string }> = ({ 
  searchTerm,
  ...props 
}) => (
  <EmptyState
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    title="Không tìm thấy kết quả"
    description={searchTerm ? `Không có kết quả nào cho "${searchTerm}"` : 'Thử tìm kiếm với từ khóa khác'}
    {...props}
  />
);

export const CreateFirstItem: React.FC<Omit<EmptyStateProps, 'icon' | 'title'> & { itemName: string }> = ({ 
  itemName,
  ...props 
}) => (
  <EmptyState
    icon={
      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    }
    title={`Chưa có ${itemName} nào`}
    description={`Bắt đầu bằng cách tạo ${itemName} đầu tiên của bạn`}
    {...props}
  />
);

export default EmptyState;
