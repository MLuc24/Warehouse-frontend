import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { ROUTES } from '@/constants';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const permissions = usePermissions();

  // Không hiển thị sidebar nếu user chưa đăng nhập
  if (!user) {
    return null;
  }

  // Tạo navigation menu dựa trên permissions
  const getNavigationItems = (): NavItem[] => {
    const items: NavItem[] = [];

    // Sản phẩm - tất cả role đều có thể xem
    if (permissions.products.canView) {
      items.push({
        name: 'Sản phẩm',
        href: ROUTES.PRODUCTS.LIST,
        icon: ({ className }) => (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        ),
      });
    }

    // Nhà cung cấp - tất cả role đều có thể xem
    if (permissions.suppliers.canView) {
      items.push({
        name: 'Nhà cung cấp',
        href: ROUTES.SUPPLIERS.LIST,
        icon: ({ className }) => (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m6.75 4.5v-3a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v3m-6 0h6m-6-3h6m3.75-6.75V8.25a1.125 1.125 0 00-1.125-1.125h-3a1.125 1.125 0 00-1.125 1.125v3.75m4.5 0a2.25 2.25 0 104.5 0m-6.75 0a2.25 2.25 0 11-4.5 0m2.25 0V8.25a1.125 1.125 0 011.125-1.125h1.5a1.125 1.125 0 011.125 1.125v8.25" />
          </svg>
        ),
      });
    }

    // Kho hàng - chỉ Admin và Manager
    if (permissions.warehouses.canView) {
      items.push({
        name: 'Kho hàng',
        href: ROUTES.WAREHOUSES.LIST,
        icon: ({ className }) => (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
          </svg>
        ),
      });
    }

    // Nhập kho và Xuất kho - tạm thời giữ cho tất cả user có thể xem (có thể cập nhật sau)
    items.push(
      {
        name: 'Nhập kho',
        href: '/goods-receipt',
        icon: ({ className }) => (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l2.25 2.25L15 10.5" />
          </svg>
        ),
      },
      {
        name: 'Xuất kho',
        href: '/goods-issue',
        icon: ({ className }) => (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
          </svg>
        ),
      }
    );

    return items;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800">
        {/* Logo/Brand */}
        <Link to={ROUTES.HOME} className="flex items-center h-16 flex-shrink-0 px-4 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
          <div className="flex items-center">
            {/* Logo from Header */}
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
              </svg>
            </div>
            <div className="ml-0">
              <h1 className="text-white text-sm font-semibold tracking-tight font-inter">
                Warehouse Management
              </h1>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-white/10 text-white border-r-2 border-purple-400'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${isActive ? 'text-purple-300' : 'text-gray-400 group-hover:text-gray-300'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex-shrink-0 flex border-t border-white/20 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400">
                  {user.role || 'User'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors"
                title="Đăng xuất"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 009.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h6.75"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
