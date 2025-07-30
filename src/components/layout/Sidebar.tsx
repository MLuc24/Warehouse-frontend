import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    name: 'Sản phẩm',
    href: ROUTES.PRODUCTS.LIST,
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    name: 'Nhà cung cấp',
    href: ROUTES.SUPPLIERS.LIST,
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m6.75 4.5v-3a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v3m-6 0h6m-6-3h6m3.75-6.75V8.25a1.125 1.125 0 00-1.125-1.125h-3a1.125 1.125 0 00-1.125 1.125v3.75m4.5 0a2.25 2.25 0 104.5 0m-6.75 0a2.25 2.25 0 11-4.5 0m2.25 0V8.25a1.125 1.125 0 011.125-1.125h1.5a1.125 1.125 0 011.125 1.125v8.25" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
