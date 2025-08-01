import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui';
import { PermissionProtectedRoute } from '@/components/common';
import { 
  HomePage, 
  ProductsPage, 
  SuppliersPage, 
  WarehousesPage,
  AuthTestPage 
} from '@/pages';
import { ROUTES } from '@/constants';

// Protected Route Component - cho user đã login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <HomePage />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path={ROUTES.HOME} 
        element={<HomePage />} 
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
        path={ROUTES.WAREHOUSES.LIST} 
        element={
          <ProtectedRoute>
            <PermissionProtectedRoute 
              requiredPermission={(permissions) => permissions.warehouses.canView}
              fallbackMessage="Chỉ có Admin và Manager mới có thể truy cập quản lý kho hàng."
            >
              <WarehousesPage />
            </PermissionProtectedRoute>
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
        element={<Navigate to={ROUTES.HOME} replace />} 
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
