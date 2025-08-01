import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  thickness?: 'thin' | 'medium' | 'thick';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  children,
  variant = 'solid',
  color = 'gray',
  thickness = 'thin'
}) => {
  const colorClasses = {
    gray: 'border-gray-200',
    blue: 'border-blue-200',
    green: 'border-green-200', 
    red: 'border-red-200',
    yellow: 'border-yellow-200',
    purple: 'border-purple-200',
    indigo: 'border-indigo-200'
  };

  const thicknessClasses = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4'
  };

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  };

  if (orientation === 'vertical') {
    const verticalClasses = `
      inline-block border-l h-full ${colorClasses[color]} ${variantClasses[variant]}
      ${thickness === 'thin' ? 'border-l' : thickness === 'medium' ? 'border-l-2' : 'border-l-4'}
      ${className}
    `;
    
    return <div className={verticalClasses.trim()} />;
  }

  // Horizontal divider
  if (children) {
    return (
      <div className={`relative flex items-center ${className}`}>
        <div className={`flex-grow ${thicknessClasses[thickness]} ${colorClasses[color]} ${variantClasses[variant]}`} />
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500 font-medium">
            {children}
          </span>
        </div>
        <div className={`flex-grow ${thicknessClasses[thickness]} ${colorClasses[color]} ${variantClasses[variant]}`} />
      </div>
    );
  }

  return (
    <div className={`${thicknessClasses[thickness]} ${colorClasses[color]} ${variantClasses[variant]} ${className}`} />
  );
};

export default Divider;
