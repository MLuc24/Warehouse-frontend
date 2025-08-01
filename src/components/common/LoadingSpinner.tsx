import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  message?: string;
  center?: boolean;
  fullScreen?: boolean;
  overlay?: boolean;
}

/**
 * LoadingSpinner - Reusable loading indicator
 * Can be used for inline loading, overlay loading, or full screen loading
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  message,
  center = false,
  fullScreen = false,
  overlay = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const messageSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const SpinnerIcon = () => (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const SpinnerContent = () => (
    <div className={`flex items-center ${message ? 'space-x-3' : ''}`}>
      <SpinnerIcon />
      {message && (
        <span className={`${messageSizeClasses[size]} ${colorClasses[color]} font-medium`}>
          {message}
        </span>
      )}
    </div>
  );

  // Full screen loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerIcon />
          {message && (
            <p className={`${messageSizeClasses[size]} text-gray-600 font-medium`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Overlay loading
  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
        <div className="flex flex-col items-center space-y-2">
          <SpinnerIcon />
          {message && (
            <p className={`${messageSizeClasses[size]} text-gray-600 font-medium`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Centered loading
  if (center) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        <SpinnerContent />
      </div>
    );
  }

  // Inline loading
  return <SpinnerContent />;
};

export default LoadingSpinner;
