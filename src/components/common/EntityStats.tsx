import React from 'react';
import { GenericStats } from './GenericStats';

interface EntityStatsData {
  total: number;
  current: number;
  active?: number;
  inactive?: number;
  currentPage: number;
  totalPages: number;
}

interface EntityStatsProps {
  data: EntityStatsData;
  entityName: string;
  entityIcon?: React.ReactNode;
  showActiveInactive?: boolean;
  columns?: 3 | 4;
  customStats?: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
    description?: string;
  }>;
}

/**
 * EntityStats - Reusable statistics component for any entity
 * Can be used for Products, Suppliers, Warehouses, etc.
 */
export const EntityStats: React.FC<EntityStatsProps> = ({
  data,
  entityName,
  entityIcon,
  showActiveInactive = false,
  columns = 3,
  customStats
}) => {
  // Default icons
  const defaultEntityIcon = entityIcon || (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  const activeIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const inactiveIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const pageIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  // Build default stats
  const defaultStats: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  }> = [
    {
      label: `Tổng ${entityName.toLowerCase()}`,
      value: data.total,
      icon: defaultEntityIcon,
      color: 'blue' as const
    },
    {
      label: 'Hiện tại',
      value: data.current,
      icon: activeIcon,
      color: 'green' as const
    }
  ];

  // Add active/inactive stats if requested
  if (showActiveInactive && (data.active !== undefined || data.inactive !== undefined)) {
    if (data.active !== undefined) {
      defaultStats.push({
        label: 'Đang hoạt động',
        value: data.active,
        icon: activeIcon,
        color: 'green' as const
      });
    }
    if (data.inactive !== undefined) {
      defaultStats.push({
        label: 'Ngừng hoạt động',
        value: data.inactive,
        icon: inactiveIcon,
        color: 'red' as const
      });
    }
  }

  // Add pagination info
  defaultStats.push({
    label: 'Trang',
    value: `${data.currentPage}/${data.totalPages}`,
    icon: pageIcon,
    color: 'purple' as const
  });

  // Use custom stats if provided, otherwise use default
  const statsData = customStats || defaultStats;

  return (
    <GenericStats
      stats={statsData}
      columns={columns}
    />
  );
};

export default EntityStats;
