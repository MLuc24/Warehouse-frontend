import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Notification } from '@/components/common';
import { WarehouseManagement } from '@/components/warehouses';

export const WarehousesPage: React.FC = () => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Handle notification from child component
  const handleNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Notification */}
          {notification && (
            <div className="fixed top-4 right-4 z-50">
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            </div>
          )}

          {/* Main Warehouse Management Component */}
          <WarehouseManagement onNotification={handleNotification} />
        </div>
      </div>
    </Layout>
  );
};

export default WarehousesPage;
