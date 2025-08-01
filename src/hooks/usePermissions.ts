import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { USER_ROLES } from '@/constants';

/**
 * Hook để quản lý permissions dựa trên role của user
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    const userRole = user?.role;

    return {
      // Supplier permissions
      suppliers: {
        canView: userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.EMPLOYEE,
        canCreate: userRole === USER_ROLES.ADMIN,
        canEdit: userRole === USER_ROLES.ADMIN,
        canDelete: userRole === USER_ROLES.ADMIN,
      },
      
      // Product permissions - Tất cả role đều có toàn quyền
      products: {
        canView: userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.EMPLOYEE,
        canCreate: userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.EMPLOYEE,
        canEdit: userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.EMPLOYEE,
        canDelete: userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.EMPLOYEE,
      },

      // General admin functions
      admin: {
        canAccessAll: userRole === USER_ROLES.ADMIN,
      },

      // Check if user is read-only (can only view)
      isReadOnly: userRole === USER_ROLES.MANAGER || userRole === USER_ROLES.EMPLOYEE,
      
      // Check if user has full access
      isAdmin: userRole === USER_ROLES.ADMIN,
    };
  }, [user?.role]);

  return permissions;
};
