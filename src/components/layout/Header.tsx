import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { AuthModals } from '@/components/auth/AuthModals';

type AuthModalType = 'login' | 'register' | 'forgot-password' | null

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
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  Warehouse Management
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Xin chào, {user.fullName}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
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
