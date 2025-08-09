import type { GoodsIssueStatus } from '@/types'

export interface StatusConfig {
  label: string
  className: string
  dot: string
  bgColor: string
  textColor: string
}

export const getGoodsIssueStatusConfig = (status?: GoodsIssueStatus): StatusConfig => {
  console.log('getGoodsIssueStatusConfig - status received:', status, typeof status)
  
  const statusMap: Record<GoodsIssueStatus, StatusConfig> = {
    'Draft': { 
      label: 'Nháp', 
      className: 'bg-gray-100 text-gray-700 border border-gray-300',
      dot: 'bg-gray-400',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    },
    'AwaitingApproval': { 
      label: 'Chờ phê duyệt', 
      className: 'bg-orange-50 text-orange-700 border border-orange-200',
      dot: 'bg-orange-400',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    'Approved': { 
      label: 'Đã phê duyệt', 
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-400',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    'Preparing': { 
      label: 'Đang chuẩn bị', 
      className: 'bg-purple-50 text-purple-700 border border-purple-200',
      dot: 'bg-purple-400',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800'
    },
    'Delivered': { 
      label: 'Đã giao hàng', 
      className: 'bg-teal-50 text-teal-700 border border-teal-200',
      dot: 'bg-teal-400',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-800'
    },
    'Completed': { 
      label: 'Hoàn thành', 
      className: 'bg-green-50 text-green-700 border border-green-200',
      dot: 'bg-green-400',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    'Cancelled': { 
      label: 'Đã hủy', 
      className: 'bg-red-50 text-red-700 border border-red-200',
      dot: 'bg-red-400',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    },
    'Rejected': { 
      label: 'Bị từ chối', 
      className: 'bg-red-50 text-red-700 border border-red-200',
      dot: 'bg-red-400',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }
  }

  // Provide explicit fallback to ensure we never return undefined
  const safeStatus = status || 'Draft'
  const config = statusMap[safeStatus]
  
  // Extra safety check - return Draft config if somehow the status doesn't exist
  if (!config) {
    return statusMap['Draft']
  }
  
  return config
}

export const getGoodsIssueStatusBadgeProps = (status?: GoodsIssueStatus) => {
  const config = getGoodsIssueStatusConfig(status)
  
  return {
    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`,
    dotClassName: `w-1.5 h-1.5 rounded-full ${config.dot}`,
    label: config.label
  }
}

// Helper function to safely get badge props from any status string
export const getGoodsIssueStatusBadgePropsFromString = (status?: string) => {
  console.log('getGoodsIssueStatusBadgePropsFromString - status received:', status, typeof status)
  
  if (!status) {
    console.log('getGoodsIssueStatusBadgePropsFromString - no status, returning Draft')
    return getGoodsIssueStatusBadgeProps('Draft')
  }
  
  // Check if status is a valid GoodsIssueStatus
  const validStatuses: GoodsIssueStatus[] = [
    'Draft', 'AwaitingApproval', 'Approved', 'Preparing', 
    'Delivered', 'Completed', 'Cancelled', 'Rejected'
  ]
  
  if (validStatuses.includes(status as GoodsIssueStatus)) {
    return getGoodsIssueStatusBadgeProps(status as GoodsIssueStatus)
  }
  
  // Default to Draft if status is not recognized
  return getGoodsIssueStatusBadgeProps('Draft')
}

export const getGoodsIssueStatusLabel = (status?: GoodsIssueStatus): string => {
  const config = getGoodsIssueStatusConfig(status)
  return config.label
}
