import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Spinner } from '@/components/ui';

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: (permissions: ReturnType<typeof usePermissions>) => boolean;
  fallbackMessage?: string;
}

/**
 * Component bảo vệ route dựa trên permissions
 * Sử dụng usePermissions hook để kiểm tra quyền truy cập
 */
export const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  fallbackMessage = "Bạn không có quyền truy cập vào trang này."
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const permissions = usePermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600">
            Vui lòng đăng nhập để truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  // Kiểm tra permissions
  const hasPermission = requiredPermission(permissions);

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg 
              className="mx-auto h-16 w-16 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            {fallbackMessage}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
