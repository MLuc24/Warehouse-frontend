export type GoodsIssueStatus = 
  | 'Draft'
  | 'AwaitingApproval'
  | 'Approved'
  | 'InPreparation'
  | 'ReadyForDelivery'
  | 'InTransit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'

export interface GoodsIssue {
  goodsIssueId: number
  issueNumber: string
  customerId?: number
  customerName?: string
  createdByUserId: number
  createdByUserName: string
  issueDate?: string
  requestedDeliveryDate?: string
  totalAmount?: number
  notes?: string
  status?: GoodsIssueStatus
  
  // Workflow info
  approvedByUserName?: string
  approvedDate?: string
  approvalNotes?: string
  
  preparedByUserName?: string
  preparedDate?: string
  preparationNotes?: string
  
  deliveredByUserName?: string
  deliveredDate?: string
  deliveryNotes?: string
  deliveryAddress?: string
  
  completedByUserName?: string
  completedDate?: string
  
  createdAt: string
  updatedAt: string
  
  details: GoodsIssueDetail[]
}

export interface GoodsIssueDetail {
  productId: number
  productName: string
  productSku?: string
  quantity: number
  unitPrice: number
  subtotal?: number
  unit?: string
  notes?: string
}

export interface GoodsIssueFilterDto {
  issueNumber?: string
  customerId?: number
  status?: GoodsIssueStatus
  issueDateFrom?: string
  issueDateTo?: string
  requestedDeliveryDateFrom?: string
  requestedDeliveryDateTo?: string
  createdByUserId?: number
  page?: number
  pageSize?: number
}

export interface CreateUpdateGoodsIssueDto {
  customerId?: number
  issueDate?: string
  requestedDeliveryDate?: string
  notes?: string
  deliveryAddress?: string
  details: CreateUpdateGoodsIssueDetailDto[]
}

export interface CreateUpdateGoodsIssueDetailDto {
  productId: number
  quantity: number
  unitPrice: number
  notes?: string
}

export interface GoodsIssueWorkflowStatusDto {
  status: GoodsIssueStatus
  notes?: string
}

export interface GoodsIssueApprovalDto {
  notes?: string
}

export interface GoodsIssuePreparationDto {
  notes?: string
}

export interface GoodsIssueDeliveryDto {
  deliveryAddress?: string
  notes?: string
}

export interface GoodsIssuePagedResult<T> {
  items: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
  totalPages: number
}
