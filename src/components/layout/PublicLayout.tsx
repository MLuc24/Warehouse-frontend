import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { AuthModals } from '@/components/auth/AuthModals';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header cho màn hình public */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">
                      Warehouse
                    </h1>
                    <p className="text-xs text-gray-500 -mt-1">
                      Management System
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation và Auth buttons */}
              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex items-center space-x-6">
                  <a
                    href="#features"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
                  >
                    Tính năng
                  </a>
                  <a
                    href="#about"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
                  >
                    Giới thiệu
                  </a>
                  <a
                    href="#contact"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
                  >
                    Liên hệ
                  </a>
                </nav>

                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 hidden sm:block">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenAuthModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Đăng nhập
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer for public pages */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12"
                    />
                  </svg>
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    Warehouse Management System
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                  Hệ thống quản lý kho hàng hiện đại, giúp doanh nghiệp tối ưu hóa 
                  quy trình vận hành và quản lý tồn kho hiệu quả, đơn giản và chính xác.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Tính năng chính
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-indigo-600 mr-2">•</span>
                    Quản lý sản phẩm
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-600 mr-2">•</span>
                    Quản lý nhà cung cấp
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-600 mr-2">•</span>
                    Nhập/Xuất kho
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-600 mr-2">•</span>
                    Báo cáo thống kê
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-600 mr-2">•</span>
                    Quản lý tồn kho
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Liên hệ hỗ trợ
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <svg className="h-4 w-4 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    support@warehouse-ms.com
                  </p>
                  <p className="flex items-center">
                    <svg className="h-4 w-4 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    1900-xxxx
                  </p>
                  <p className="flex items-start">
                    <svg className="h-4 w-4 text-indigo-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    123 ABC Street, XYZ City
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                © 2025 Warehouse Management System. All rights reserved. Made with ❤️ in Vietnam.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialModal="login"
      />
    </>
  );
};
