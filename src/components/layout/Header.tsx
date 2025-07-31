import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { AuthModals } from '@/components/auth/AuthModals';

type AuthModalType = 'login' | 'register' | 'forgot-password' | 'verification' | 'complete-registration' | 'reset-password' | null

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialModal, setInitialModal] = useState<AuthModalType>('login');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenAuthModal = (modal: AuthModalType = 'login') => {
    setInitialModal(modal);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    // Không reset initialModal ở đây để có thể mở lại modal
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center">
                {/* Logo/Icon */}
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3zm0 0L5.25 21M19.5 3l-.75 18M9 21V9l3-3 3 3v12M12 9v12" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Warehouse Management
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      Xin chào, <span className="font-medium">{user.fullName || user.username}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAuthModal('register')}
                  >
                    Đăng ký
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenAuthModal('login')}
                  >
                    Đăng nhập
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialModal={initialModal}
      />
    </>
  );
};
