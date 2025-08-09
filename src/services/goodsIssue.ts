import { apiService } from './api'
import type { 
  GoodsIssue, 
  CreateUpdateGoodsIssueDto, 
  GoodsIssueFilterDto, 
  GoodsIssuePagedResult
} from '@/types/goodsIssue'

class GoodsIssueService {
  private readonly basePath = '/GoodsIssue'

  // Lấy danh sách phiếu xuất với pagination và filter
  async getGoodsIssues(filters?: GoodsIssueFilterDto): Promise<GoodsIssuePagedResult<GoodsIssue>> {
    const params = new URLSearchParams()
    
    if (filters?.issueNumber) params.append('issueNumber', filters.issueNumber)
    if (filters?.customerId) params.append('customerId', filters.customerId.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.issueDateFrom) params.append('issueDateFrom', filters.issueDateFrom)
    if (filters?.issueDateTo) params.append('issueDateTo', filters.issueDateTo)
    if (filters?.requestedDeliveryDateFrom) params.append('requestedDeliveryDateFrom', filters.requestedDeliveryDateFrom)
    if (filters?.requestedDeliveryDateTo) params.append('requestedDeliveryDateTo', filters.requestedDeliveryDateTo)
    if (filters?.createdByUserId) params.append('createdByUserId', filters.createdByUserId.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    const response = await apiService.get<GoodsIssuePagedResult<GoodsIssue>>(url)
    return response
  }

  // Lấy chi tiết phiếu xuất theo ID
  async getGoodsIssueById(id: number): Promise<GoodsIssue> {
    const response = await apiService.get<GoodsIssue>(`${this.basePath}/${id}`)
    return response
  }

  // Lấy chi tiết phiếu xuất theo số phiếu
  async getGoodsIssueByNumber(issueNumber: string): Promise<GoodsIssue> {
    const response = await apiService.get<GoodsIssue>(`${this.basePath}/by-number/${issueNumber}`)
    return response
  }

  // Tạo phiếu xuất mới
  async createGoodsIssue(data: CreateUpdateGoodsIssueDto): Promise<GoodsIssue> {
    const response = await apiService.post<GoodsIssue>(this.basePath, data)
    return response
  }

  // Cập nhật phiếu xuất
  async updateGoodsIssue(id: number, data: CreateUpdateGoodsIssueDto): Promise<GoodsIssue> {
    const response = await apiService.put<GoodsIssue>(`${this.basePath}/${id}`, data)
    return response
  }

  // Xóa phiếu xuất
  async deleteGoodsIssue(id: number): Promise<void> {
    await apiService.delete(`${this.basePath}/${id}`)
  }

  // Kiểm tra có thể xóa phiếu xuất không
  async canDeleteGoodsIssue(id: number): Promise<{ canDelete: boolean; reason?: string }> {
    const response = await apiService.get<{ canDelete: boolean; reason?: string }>(`${this.basePath}/${id}/can-delete`)
    return response
  }

  // === WORKFLOW OPERATIONS ===

  // Gửi phê duyệt - This endpoint doesn't exist in backend, removing
  // async submitForApproval(id: number, data: GoodsIssueWorkflowStatusDto): Promise<void> {
  //   await apiService.post(`${this.basePath}/${id}/submit-approval`, data)
  // }

  // Phê duyệt phiếu xuất
  async approveGoodsIssue(id: number, notes?: string): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/approve-reject`, {
      goodsIssueId: id,
      action: 'Approve',
      notes
    })
  }

  // Từ chối phê duyệt
  async rejectGoodsIssue(id: number, notes?: string): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/approve-reject`, {
      goodsIssueId: id,
      action: 'Reject',
      notes
    })
  }

  // Chuẩn bị hàng
  async prepareGoodsIssue(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/start-preparing`, {})
  }

  // Đánh dấu sẵn sàng giao hàng - This endpoint doesn't exist in backend, removing
  // async markReadyForDelivery(id: number, data: GoodsIssueWorkflowStatusDto): Promise<void> {
  //   await apiService.post(`${this.basePath}/${id}/ready-delivery`, data)
  // }

  // Bắt đầu giao hàng - This endpoint doesn't exist in backend, removing  
  // async startDelivery(id: number, data: GoodsIssueDeliveryDto): Promise<void> {
  //   await apiService.post(`${this.basePath}/${id}/start-delivery`, data)
  // }

  // Xác nhận đã giao hàng
  async confirmDelivery(id: number, deliveryAddress?: string, notes?: string): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/mark-delivered`, {
      goodsIssueId: id,
      deliveryAddress,
      notes
    })
  }

  // Hoàn thành phiếu xuất
  async completeGoodsIssue(id: number, notes?: string): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/complete`, {
      goodsIssueId: id,
      notes
    })
  }

  // Hủy phiếu xuất
  async cancelGoodsIssue(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/cancel`, {})
  }

  // Gửi lại phê duyệt (sau khi bị từ chối)
  async resubmitGoodsIssue(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/resubmit`, {})
  }

  // === EXPORT/IMPORT OPERATIONS ===

  // Xuất PDF phiếu xuất
  async exportGoodsIssuePDF(id: number): Promise<Blob> {
    const response = await apiService.downloadBlob(`${this.basePath}/${id}/export-pdf`)
    return response
  }

  // Gửi email phiếu xuất
  async sendGoodsIssueEmail(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/send-email`, {})
  }
}

export const goodsIssueService = new GoodsIssueService()
export default goodsIssueService
