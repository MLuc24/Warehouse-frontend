import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CubeIcon, 
  BuildingStorefrontIcon, 
  ChartBarIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { ROUTES } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: (permissions: ReturnType<typeof usePermissions>) => boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const permissions = usePermissions();

  const navigationItems: NavItem[] = [
    {
      name: 'Trang chủ',
      href: ROUTES.HOME,
      icon: HomeIcon,
    },
    {
      name: 'Sản phẩm',
      href: ROUTES.PRODUCTS.LIST,
      icon: CubeIcon,
      permission: (perms) => perms.products.canView,
    },
    {
      name: 'Nhà cung cấp',
      href: ROUTES.SUPPLIERS.LIST,
      icon: BuildingStorefrontIcon,
      permission: (perms) => perms.suppliers.canView,
    },
    {
      name: 'Báo cáo',
      href: '/reports',
      icon: ChartBarIcon,
      permission: (perms) => perms.isAdmin,
    },
    {
      name: 'Cài đặt',
      href: '/settings',
      icon: Cog6ToothIcon,
      permission: (perms) => perms.isAdmin,
    },
  ];

  // Filter items based on permissions
  const visibleItems = navigationItems.filter(item => 
    !item.permission || item.permission(permissions)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-white">Warehouse</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-3 border-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <IconComponent
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* User Info / Footer */}
          <div className="flex-shrink-0 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Warehouse Manager
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {permissions.isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
