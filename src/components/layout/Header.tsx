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
            {/* Left side - empty or can add breadcrumbs later */}
            <div className="flex items-center">
              {/* Space for breadcrumbs or other navigation elements */}
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
