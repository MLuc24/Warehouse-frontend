// Export reusable common components  
export { DeleteConfirmModal } from './DeleteConfirmModal';
export { Pagination } from './Pagination';
export { ExportButtons } from './ExportButtons';
export { Notification } from './Notification';
export { ContextMenu } from './ContextMenu';

// Generic Modal Components (for create/update forms)
export { GenericModal } from './GenericModal';

// Enhanced Common Components (Tuần 10)
export { ErrorBoundary } from './ErrorBoundary';
export { Skeleton, TableSkeleton, CardSkeleton, FormSkeleton, ChartSkeleton } from './Skeleton';
export { GenericList } from './GenericList';
export { GenericStats } from './GenericStats';

// Unified Generic Component
export { GenericInline } from './GenericInline';

// Permission-based access control
export { PermissionProtectedRoute } from './PermissionProtectedRoute';

// New Reusable Components
export { default as EntityStats } from './EntityStats';
export { default as ConfirmationOverlay } from './ConfirmationOverlay';
export { default as EmptyState, NoDataFound, NoSearchResults, CreateFirstItem } from './EmptyState';

// Export types
export type { FormField, GenericInlineProps } from './GenericInline';
