import React from 'react';
import { GenericStats } from '@/components/common';

interface ProductStatsProps {
  totalCount: number;
  currentCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Enhanced Product Statistics Component using GenericStats
 * Displays product statistics and pagination info
 */
export const ProductStatsComponent: React.FC<ProductStatsProps> = ({
  totalCount,
  currentCount,
  currentPage,
  totalPages
}) => {
  // Define stats data
  const statsData = [
    {
      label: 'Tổng sản phẩm',
      value: totalCount,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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

// Also export as ProductStats for backward compatibility
export const ProductStats = ProductStatsComponent;
