import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WelcomePage, AuthenticatedHomePage, Layout } from '@/components/layout';
import { AuthModals } from '@/components/auth/AuthModals';
import { useState } from 'react';

export const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialModal, setInitialModal] = useState<'login' | 'register'>('login');

  const handleOpenAuthModal = (type: 'login' | 'register' = 'login') => {
    setInitialModal(type);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Layout>
          <AuthenticatedHomePage />
        </Layout>
      ) : (
        <WelcomePage onOpenAuth={handleOpenAuthModal} />
      )}
      
      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialModal={initialModal}
      />
    </>
  );
};

export default HomePage;
