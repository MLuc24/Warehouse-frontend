import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Notification - Reusable notification component with fixed positioning and auto-close
 */
export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification with animation
    setIsVisible(true);

    // Auto close after duration
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for animation to complete before calling onClose
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-md w-full transform transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`p-4 rounded-lg shadow-lg border ${
        type === 'success' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success'
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
            >
              <span className="sr-only">Đóng</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                type === 'success' ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{
                width: '100%',
                animation: `progressShrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      {/* Inline CSS for progress bar animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progressShrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </div>
  );
};

export default Notification;
