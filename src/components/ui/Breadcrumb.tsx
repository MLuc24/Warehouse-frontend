import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  className = ''
}) => {
  const defaultSeparator = (
    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === items.length - 1;
    const itemClasses = `${
      item.current || isLast
        ? 'text-gray-500 cursor-default'
        : 'text-blue-600 hover:text-blue-800 cursor-pointer'
    } text-sm font-medium`;

    const content = (
      <span className={itemClasses}>
        {item.label}
      </span>
    );

    if (item.href && !item.current && !isLast) {
      return (
        <a href={item.href} key={index}>
          {content}
        </a>
      );
    }

    if (item.onClick && !item.current && !isLast) {
      return (
        <button onClick={item.onClick} key={index} type="button">
          {content}
        </button>
      );
    }

    return <span key={index}>{content}</span>;
  };

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="flex items-center mx-2">
                {separator || defaultSeparator}
              </span>
            )}
            {renderItem(item, index)}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
