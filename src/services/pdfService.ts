import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { GoodsReceipt } from '@/types'

class PDFService {
  private loadFont() {
    // You can load custom Vietnamese fonts here if needed
    // For now, we'll use default fonts that support Unicode
  }

  async generateGoodsReceiptPDF(goodsReceipt: GoodsReceipt): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    this.loadFont()

    // Set font to support Vietnamese characters
    pdf.setFont('helvetica')
    
    // Company header
    pdf.setFontSize(16)
    pdf.setTextColor(40, 40, 40)
    pdf.text('CÔNG TY QUẢN LÝ KHO HÀNG', 105, 20, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.text('PHIẾU NHẬP KHO', 105, 30, { align: 'center' })
    
    // Receipt basic info
    pdf.setFontSize(12)
    pdf.text(`Số phiếu: ${goodsReceipt.receiptNumber || 'Chưa có'}`, 20, 50)
    
    const receiptDate = goodsReceipt.receiptDate 
      ? new Date(goodsReceipt.receiptDate).toLocaleDateString('vi-VN')
      : 'Chưa có'
    pdf.text(`Ngày tạo: ${receiptDate}`, 20, 60)
    
    pdf.text(`Nhà cung cấp: ${goodsReceipt.supplierName || ''}`, 20, 70)
    pdf.text(`Trạng thái: ${this.getStatusText(goodsReceipt.status || '')}`, 20, 80)
    
    if (goodsReceipt.notes) {
      pdf.text(`Ghi chú: ${goodsReceipt.notes}`, 20, 90)
    }

    // Product table
    const tableColumns = [
      'STT',
      'Tên sản phẩm', 
      'SKU',
      'Số lượng',
      'Đơn vị',
      'Đơn giá',
      'Thành tiền'
    ]

    const tableRows = goodsReceipt.details?.map((item, index) => [
      (index + 1).toString(),
      item.productName || '',
      item.productSku || '',
      item.quantity?.toString() || '0',
      item.unit || '',
      item.unitPrice ? `${item.unitPrice.toLocaleString('vi-VN')} đ` : '0 đ',
      item.subtotal ? `${item.subtotal.toLocaleString('vi-VN')} đ` : '0 đ'
    ]) || []

    autoTable(pdf, {
      head: [tableColumns],
      body: tableRows,
      startY: 100,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 }, // STT
        1: { cellWidth: 50 }, // Tên sản phẩm
        2: { cellWidth: 25 }, // SKU
        3: { halign: 'center', cellWidth: 20 }, // Số lượng
        4: { halign: 'center', cellWidth: 20 }, // Đơn vị
        5: { halign: 'right', cellWidth: 25 }, // Đơn giá
        6: { halign: 'right', cellWidth: 30 } // Thành tiền
      },
      margin: { left: 15, right: 15 }
    })

    // Total amount
    const finalY = (pdf as any).lastAutoTable.finalY + 10 // eslint-disable-line @typescript-eslint/no-explicit-any
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Tổng tiền: ${goodsReceipt.totalAmount?.toLocaleString('vi-VN') || '0'} đ`, 140, finalY, { align: 'right' })

    // Footer with signatures
    const signatureY = finalY + 30
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    
    pdf.text('Người tạo phiếu', 40, signatureY, { align: 'center' })
    pdf.text('Phụ trách kho', 105, signatureY, { align: 'center' })
    pdf.text('Giám đốc', 170, signatureY, { align: 'center' })
    
    pdf.text(`(${goodsReceipt.createdByUserName || ''})`, 40, signatureY + 20, { align: 'center' })
    
    // Date and time
    pdf.setFontSize(9)
    pdf.text(`Xuất lúc: ${new Date().toLocaleString('vi-VN')}`, 15, 280)

    return pdf.output('blob')
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'Draft': 'Nháp',
      'Pending': 'Chờ xác nhận NCC',
      'AwaitingApproval': 'Chờ phê duyệt',
      'SupplierConfirmed': 'NCC đã xác nhận',
      'Rejected': 'Bị từ chối',
      'Cancelled': 'Đã hủy',
      'Completed': 'Hoàn thành'
    }
    return statusMap[status] || status
  }

  async downloadPDF(goodsReceipt: GoodsReceipt): Promise<void> {
    try {
      const pdfBlob = await this.generateGoodsReceiptPDF(goodsReceipt)
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `phieu-nhap-${goodsReceipt.receiptNumber || goodsReceipt.goodsReceiptId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      throw error
    }
  }

  // Method to get PDF for email attachment (returns base64)
  async generatePDFForEmail(goodsReceipt: GoodsReceipt): Promise<string> {
    try {
      const pdfBlob = await this.generateGoodsReceiptPDF(goodsReceipt)
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(pdfBlob)
      })
    } catch (error) {
      console.error('Error generating PDF for email:', error)
      throw error
    }
  }
}

export const pdfService = new PDFService()
