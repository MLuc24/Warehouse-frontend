import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { AuthModals } from '@/components/auth/AuthModals';

export const Header: React.FC = () => {
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAuthModal}
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialModal="login"
      />
    </>
  );
};
