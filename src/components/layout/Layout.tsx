import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
  showProductTabs?: boolean; // Thêm prop để hiển thị product tabs
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  headerContent, 
  showProductTabs = false 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showProductTabs={showProductTabs}
        >
          {headerContent}
        </Header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
