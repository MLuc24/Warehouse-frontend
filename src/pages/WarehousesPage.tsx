import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { WarehouseManagement } from '@/components/warehouses';
import { Notification } from '@/components/common';

export const WarehousesPage: React.FC = () => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Handle notification from child component
  const handleNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <Layout>
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Warehouse Management Component */}
      <WarehouseManagement onNotification={handleNotification} />
    </Layout>
  );
};

export default WarehousesPage;
