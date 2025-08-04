import React from 'react';
import { GenericStats } from '@/components/common';

interface SupplierStatsProps {
  totalCount: number;
  currentCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Enhanced Supplier Statistics Component using GenericStats
 * Displays supplier statistics and pagination info
 */
export const SupplierStats: React.FC<SupplierStatsProps> = ({
  totalCount,
  currentCount,
  currentPage,
  totalPages
}) => {
  // Define stats data
  const statsData = [
    {
      label: 'Tổng nhà cung cấp',
      value: totalCount,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'blue' as const
    },
    {
      label: 'Hiện tại',
      value: currentCount,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green' as const
    },
    {
      label: 'Trang',
      value: `${currentPage}/${totalPages}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'purple' as const
    }
  ];

  return (
    <GenericStats
      stats={statsData}
      columns={3}
    />
  );
};

export default SupplierStats;
