import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick?: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
      <div className="px-6">
        <div className="flex h-16 justify-between items-center">
          {/* Left side - Menu button for mobile */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Center content - can be passed as children */}
          <div className="flex-1 flex justify-center">
            {children}
          </div>

          {/* Right side - empty for now */}
          <div className="flex items-center">
            {/* Empty space for balance */}
          </div>
        </div>
      </div>
    </header>
  );
};
