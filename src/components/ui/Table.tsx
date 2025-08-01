import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  variant?: 'simple' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  variant = 'simple',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variantClasses = {
    simple: 'border-collapse',
    striped: 'border-collapse [&_tbody_tr:nth-child(odd)]:bg-gray-50',
    bordered: 'border-collapse border border-gray-300'
  };

  return (
    <div className="overflow-x-auto">
      <table 
        className={`min-w-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  };

  return (
    <th
      className={`px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <td
      className={`px-4 py-3 border-b border-gray-200 ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  variant?: 'default' | 'hover';
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: '',
    hover: 'hover:bg-gray-50 transition-colors duration-150'
  };

  return (
    <tr className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </tr>
  );
};

export default Table;
