import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';
import { Layout, PublicLayout, WelcomePage } from '@/components/layout';
import { AuthModals } from '@/components/auth/AuthModals';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { SuppliersPage } from '@/pages/SuppliersPage';
import { AuthTestPage } from '@/pages/AuthTestPage';
import { ROUTES } from '@/constants';

// Public Route Component - cho user chưa login
const PublicRoute: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <PublicLayout>
        <WelcomePage onOpenAuth={handleOpenAuthModal} />
      </PublicLayout>
      
      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialModal="login"
      />
    </>
  );
};

// Protected Route Component - cho user đã login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PublicRoute />;
  }

  return <Layout>{children}</Layout>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path={ROUTES.DASHBOARD} 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.PRODUCTS.LIST} 
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.SUPPLIERS.LIST} 
        element={
          <ProtectedRoute>
            <SuppliersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/auth-test" 
        element={
          <ProtectedRoute>
            <AuthTestPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="*" 
        element={<Navigate to={ROUTES.DASHBOARD} replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
