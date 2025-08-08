import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { GoodsReceipt } from '@/types'

// Font data for Vietnamese support (simplified version)
const vietnameseCharMap: Record<string, string> = {
  'ă': 'a',
  'â': 'a', 
  'á': 'a',
  'à': 'a',
  'ả': 'a',
  'ã': 'a',
  'ạ': 'a',
  'ấ': 'a',
  'ầ': 'a',
  'ẩ': 'a',
  'ẫ': 'a',
  'ậ': 'a',
  'ắ': 'a',
  'ằ': 'a',
  'ẳ': 'a',
  'ẵ': 'a',
  'ặ': 'a',
  'đ': 'd',
  'é': 'e',
  'è': 'e',
  'ẻ': 'e',
  'ẽ': 'e',
  'ẹ': 'e',
  'ê': 'e',
  'ế': 'e',
  'ề': 'e',
  'ể': 'e',
  'ễ': 'e',
  'ệ': 'e',
  'í': 'i',
  'ì': 'i',
  'ỉ': 'i',
  'ĩ': 'i',
  'ị': 'i',
  'ó': 'o',
  'ò': 'o',
  'ỏ': 'o',
  'õ': 'o',
  'ọ': 'o',
  'ô': 'o',
  'ố': 'o',
  'ồ': 'o',
  'ổ': 'o',
  'ỗ': 'o',
  'ộ': 'o',
  'ơ': 'o',
  'ớ': 'o',
  'ờ': 'o',
  'ở': 'o',
  'ỡ': 'o',
  'ợ': 'o',
  'ú': 'u',
  'ù': 'u',
  'ủ': 'u',
  'ũ': 'u',
  'ụ': 'u',
  'ư': 'u',
  'ứ': 'u',
  'ừ': 'u',
  'ử': 'u',
  'ữ': 'u',
  'ự': 'u',
  'ý': 'y',
  'ỳ': 'y',
  'ỷ': 'y',
  'ỹ': 'y',
  'ỵ': 'y',
  // Uppercase versions
  'Ă': 'A',
  'Â': 'A',
  'Á': 'A',
  'À': 'A',
  'Ả': 'A',
  'Ã': 'A',
  'Ạ': 'A',
  'Ấ': 'A',
  'Ầ': 'A',
  'Ẩ': 'A',
  'Ẫ': 'A',
  'Ậ': 'A',
  'Ắ': 'A',
  'Ằ': 'A',
  'Ẳ': 'A',
  'Ẵ': 'A',
  'Ặ': 'A',
  'Đ': 'D',
  'É': 'E',
  'È': 'E',
  'Ẻ': 'E',
  'Ẽ': 'E',
  'Ẹ': 'E',
  'Ê': 'E',
  'Ế': 'E',
  'Ề': 'E',
  'Ể': 'E',
  'Ễ': 'E',
  'Ệ': 'E',
  'Í': 'I',
  'Ì': 'I',
  'Ỉ': 'I',
  'Ĩ': 'I',
  'Ị': 'I',
  'Ó': 'O',
  'Ò': 'O',
  'Ỏ': 'O',
  'Õ': 'O',
  'Ọ': 'O',
  'Ô': 'O',
  'Ố': 'O',
  'Ồ': 'O',
  'Ổ': 'O',
  'Ỗ': 'O',
  'Ộ': 'O',
  'Ơ': 'O',
  'Ớ': 'O',
  'Ờ': 'O',
  'Ở': 'O',
  'Ỡ': 'O',
  'Ợ': 'O',
  'Ú': 'U',
  'Ù': 'U',
  'Ủ': 'U',
  'Ũ': 'U',
  'Ụ': 'U',
  'Ư': 'U',
  'Ứ': 'U',
  'Ừ': 'U',
  'Ử': 'U',
  'Ữ': 'U',
  'Ự': 'U',
  'Ý': 'Y',
  'Ỳ': 'Y',
  'Ỷ': 'Y',
  'Ỹ': 'Y',
  'Ỵ': 'Y'
}

class PDFService {
  private loadFont() {
    // You can load custom Vietnamese fonts here if needed
    // For now, we'll use default fonts that support Unicode
  }

  // Convert Vietnamese text to ASCII for PDF compatibility
  private convertVietnameseText(text: string): string {
    return text.split('').map(char => vietnameseCharMap[char] || char).join('')
  }

  async generateGoodsReceiptPDF(goodsReceipt: GoodsReceipt): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    this.loadFont()

    // Set font
    pdf.setFont('helvetica')
    
    // Company header
    pdf.setFontSize(16)
    pdf.setTextColor(40, 40, 40)
    pdf.text(this.convertVietnameseText('CÔNG TY QUẢN LÝ KHO HÀNG'), 105, 20, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.text(this.convertVietnameseText('PHIẾU NHẬP KHO'), 105, 30, { align: 'center' })
    
    // Receipt basic info
    pdf.setFontSize(12)
    pdf.text(`${this.convertVietnameseText('Số phiếu')}: ${goodsReceipt.receiptNumber || this.convertVietnameseText('Chưa có')}`, 20, 50)
    
    const receiptDate = goodsReceipt.receiptDate 
      ? new Date(goodsReceipt.receiptDate).toLocaleDateString('vi-VN')
      : this.convertVietnameseText('Chưa có')
    pdf.text(`${this.convertVietnameseText('Ngày tạo')}: ${receiptDate}`, 20, 60)
    
    pdf.text(`${this.convertVietnameseText('Nhà cung cấp')}: ${goodsReceipt.supplierName || ''}`, 20, 70)
    pdf.text(`${this.convertVietnameseText('Trạng thái')}: ${this.getStatusTextSimplified(goodsReceipt.status || '')}`, 20, 80)
    
    if (goodsReceipt.notes) {
      pdf.text(`${this.convertVietnameseText('Ghi chú')}: ${goodsReceipt.notes}`, 20, 90)
    }

    // Product table
    const tableColumns = [
      'STT',
      this.convertVietnameseText('Tên sản phẩm'), 
      'SKU',
      this.convertVietnameseText('Số lượng'),
      this.convertVietnameseText('Đơn vị'),
      this.convertVietnameseText('Đơn giá'),
      this.convertVietnameseText('Thành tiền')
    ]

    const tableRows = goodsReceipt.details?.map((item, index) => [
      (index + 1).toString(),
      item.productName || '',
      item.productSku || '',
      item.quantity?.toString() || '0',
      item.unit || '',
      item.unitPrice ? `${item.unitPrice.toLocaleString('vi-VN')} ${this.convertVietnameseText('đ')}` : `0 ${this.convertVietnameseText('đ')}`,
      item.subtotal ? `${item.subtotal.toLocaleString('vi-VN')} ${this.convertVietnameseText('đ')}` : `0 ${this.convertVietnameseText('đ')}`
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
    pdf.text(`${this.convertVietnameseText('Tổng tiền')}: ${goodsReceipt.totalAmount?.toLocaleString('vi-VN') || '0'} ${this.convertVietnameseText('đ')}`, 140, finalY, { align: 'right' })

    // Footer with signatures
    const signatureY = finalY + 30
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    
    pdf.text(this.convertVietnameseText('Người tạo phiếu'), 40, signatureY, { align: 'center' })
    pdf.text(this.convertVietnameseText('Phụ trách kho'), 105, signatureY, { align: 'center' })
    pdf.text(this.convertVietnameseText('Giám đốc'), 170, signatureY, { align: 'center' })
    
    pdf.text(`(${goodsReceipt.createdByUserName || ''})`, 40, signatureY + 20, { align: 'center' })
    
    // Date and time
    pdf.setFontSize(9)
    pdf.text(`${this.convertVietnameseText('Xuất lúc')}: ${new Date().toLocaleString('vi-VN')}`, 15, 280)

    return pdf.output('blob')
  }

  private getStatusTextSimplified(status: string): string {
    const statusMap: Record<string, string> = {
      'Draft': this.convertVietnameseText('Nháp'),
      'Pending': this.convertVietnameseText('Chờ xác nhận NCC'),
      'AwaitingApproval': this.convertVietnameseText('Chờ phê duyệt'),
      'SupplierConfirmed': this.convertVietnameseText('NCC đã xác nhận'),
      'Rejected': this.convertVietnameseText('Bị từ chối'),
      'Cancelled': this.convertVietnameseText('Đã hủy'),
      'Completed': this.convertVietnameseText('Hoàn thành')
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
