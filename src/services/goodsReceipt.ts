import { apiService } from './api'
import type { 
  GoodsReceipt, 
  CreateGoodsReceiptDto, 
  UpdateGoodsReceiptDto, 
  GoodsReceiptFilterDto, 
  PagedGoodsReceiptResult,
  CanDeleteResult,
  WorkflowStatus,
  ApprovalDto,
  SupplierConfirmationDto,
  CompleteReceiptDto
} from '@/types/goodsReceipt'

class GoodsReceiptService {
  private readonly basePath = '/goodsreceipt'

  // Lấy danh sách phiếu nhập với pagination và filter
  async getGoodsReceipts(filters?: GoodsReceiptFilterDto): Promise<PagedGoodsReceiptResult> {
    const params = new URLSearchParams()
    
    if (filters?.receiptNumber) params.append('receiptNumber', filters.receiptNumber)
    if (filters?.supplierId) params.append('supplierId', filters.supplierId.toString())
    if (filters?.supplierName) params.append('supplierName', filters.supplierName)
    if (filters?.fromDate) params.append('fromDate', filters.fromDate)
    if (filters?.toDate) params.append('toDate', filters.toDate)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString())
    if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString())
    if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())

    const queryString = params.toString()
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    const response = await apiService.get<PagedGoodsReceiptResult>(url)
    return response
  }

  // Lấy chi tiết phiếu nhập theo ID
  async getGoodsReceiptById(id: number): Promise<GoodsReceipt> {
    const response = await apiService.get<GoodsReceipt>(`${this.basePath}/${id}`)
    return response
  }

  // Lấy chi tiết phiếu nhập theo số phiếu
  async getGoodsReceiptByNumber(receiptNumber: string): Promise<GoodsReceipt> {
    const response = await apiService.get<GoodsReceipt>(`${this.basePath}/by-number/${receiptNumber}`)
    return response
  }

  // Tạo phiếu nhập mới
  async createGoodsReceipt(data: CreateGoodsReceiptDto): Promise<GoodsReceipt> {
    const response = await apiService.post<GoodsReceipt>(this.basePath, data)
    return response
  }

  // Cập nhật phiếu nhập
  async updateGoodsReceipt(id: number, data: UpdateGoodsReceiptDto): Promise<GoodsReceipt> {
    const response = await apiService.put<GoodsReceipt>(`${this.basePath}/${id}`, data)
    return response
  }

  // Xóa phiếu nhập
  async deleteGoodsReceipt(id: number): Promise<void> {
    await apiService.delete(`${this.basePath}/${id}`)
  }

  // Lấy phiếu nhập theo nhà cung cấp
  async getGoodsReceiptsBySupplier(supplierId: number): Promise<GoodsReceipt[]> {
    const response = await apiService.get<GoodsReceipt[]>(`${this.basePath}/by-supplier/${supplierId}`)
    return response
  }

  // Kiểm tra có thể xóa phiếu nhập không
  async canDeleteGoodsReceipt(id: number): Promise<CanDeleteResult> {
    const response = await apiService.get<CanDeleteResult>(`${this.basePath}/${id}/can-delete`)
    return response
  }

  // === WORKFLOW METHODS ===

  // Lấy trạng thái workflow
  async getWorkflowStatus(id: number): Promise<WorkflowStatus> {
    const response = await apiService.get<WorkflowStatus>(`${this.basePath}/${id}/workflow-status`)
    return response
  }

  // Admin/Manager phê duyệt hoặc từ chối
  async approveOrReject(data: ApprovalDto): Promise<void> {
    await apiService.post(`${this.basePath}/${data.goodsReceiptId}/approve-reject`, data)
  }

  // Nhà cung cấp xác nhận (qua API call trực tiếp)
  async supplierConfirm(data: SupplierConfirmationDto): Promise<void> {
    await apiService.post(`${this.basePath}/supplier-confirm`, data)
  }

  // Hoàn thành phiếu nhập - nhập kho
  async completeReceipt(id: number, data: CompleteReceiptDto): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/complete`, data)
  }

  // Gửi lại email xác nhận cho nhà cung cấp
  async resendSupplierEmail(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/resend-supplier-email`)
  }

  // Hủy phiếu nhập
  async cancelReceipt(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/cancel`)
  }

  // Gửi lại phiếu nhập để phê duyệt (sau khi bị từ chối)
  async resubmitReceipt(id: number): Promise<void> {
    await apiService.post(`${this.basePath}/${id}/resubmit`)
  }
}

export const goodsReceiptService = new GoodsReceiptService()
