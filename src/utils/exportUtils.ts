import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  formatter?: (value: unknown) => string;
}

export interface ExportOptions {
  filename: string;
  title: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  showSummary?: boolean;
  summaryData?: Record<string, unknown>;
}

export class ExportService {
  /**
   * Clean Vietnamese characters for PDF export
   */
  private static cleanVietnameseText(text: string): string {
    return text
      .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/đ/g, 'd')
      .replace(/ê/g, 'e').replace(/ô/g, 'o').replace(/ơ/g, 'o')
      .replace(/ư/g, 'u').replace(/ù/g, 'u').replace(/ú/g, 'u')
      .replace(/ủ/g, 'u').replace(/ũ/g, 'u').replace(/ụ/g, 'u')
      .replace(/à/g, 'a').replace(/á/g, 'a').replace(/ả/g, 'a')
      .replace(/ã/g, 'a').replace(/ạ/g, 'a').replace(/è/g, 'e')
      .replace(/é/g, 'e').replace(/ẻ/g, 'e').replace(/ẽ/g, 'e')
      .replace(/ẹ/g, 'e').replace(/ì/g, 'i').replace(/í/g, 'i')
      .replace(/ỉ/g, 'i').replace(/ĩ/g, 'i').replace(/ị/g, 'i')
      .replace(/ò/g, 'o').replace(/ó/g, 'o').replace(/ỏ/g, 'o')
      .replace(/õ/g, 'o').replace(/ọ/g, 'o').replace(/ỳ/g, 'y')
      .replace(/ý/g, 'y').replace(/ỷ/g, 'y').replace(/ỹ/g, 'y')
      .replace(/ỵ/g, 'y')
      // Uppercase versions
      .replace(/Ă/g, 'A').replace(/Â/g, 'A').replace(/Đ/g, 'D')
      .replace(/Ê/g, 'E').replace(/Ô/g, 'O').replace(/Ơ/g, 'O')
      .replace(/Ư/g, 'U').replace(/À/g, 'A').replace(/Á/g, 'A')
      .replace(/Ả/g, 'A').replace(/Ã/g, 'A').replace(/Ạ/g, 'A')
      .replace(/È/g, 'E').replace(/É/g, 'E').replace(/Ẻ/g, 'E')
      .replace(/Ẽ/g, 'E').replace(/Ẹ/g, 'E').replace(/Ì/g, 'I')
      .replace(/Í/g, 'I').replace(/Ỉ/g, 'I').replace(/Ĩ/g, 'I')
      .replace(/Ị/g, 'I').replace(/Ò/g, 'O').replace(/Ó/g, 'O')
      .replace(/Ỏ/g, 'O').replace(/Õ/g, 'O').replace(/Ọ/g, 'O')
      .replace(/Ù/g, 'U').replace(/Ú/g, 'U').replace(/Ủ/g, 'U')
      .replace(/Ũ/g, 'U').replace(/Ụ/g, 'U').replace(/Ỳ/g, 'Y')
      .replace(/Ý/g, 'Y').replace(/Ỷ/g, 'Y').replace(/Ỹ/g, 'Y')
      .replace(/Ỵ/g, 'Y');
  }

  /**
   * Xuất dữ liệu ra file PDF
   */
  static exportToPDF(options: ExportOptions): void {
    const { filename, title, columns, data, showSummary, summaryData } = options;
    
    const doc = new jsPDF();
    let currentY = 10;

    // Tiêu đề chính
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text(this.cleanVietnameseText(title), 105, currentY, { align: 'center' });
    currentY += 10;

    // Ngày xuất
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    const exportDate = new Date().toLocaleDateString('vi-VN');
    doc.text(`Ngay xuat: ${exportDate}`, 105, currentY, { align: 'center' });
    currentY += 15;

    // Tổng quan (nếu có)
    if (showSummary && summaryData) {
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('Tong quan:', 14, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      Object.entries(summaryData).forEach(([key, value]) => {
        const cleanKey = this.cleanVietnameseText(key);
        doc.text(`${cleanKey}: ${value}`, 14, currentY);
        currentY += 6;
      });
      currentY += 10;
    }

    // Chuẩn bị dữ liệu cho bảng
    const tableColumns = columns.map(col => this.cleanVietnameseText(col.header));
    const tableRows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        const formattedValue = col.formatter ? col.formatter(value) : String(value || '');
        return this.cleanVietnameseText(formattedValue);
      })
    );

    // Tạo bảng
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      columnStyles: columns.reduce((acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width };
        }
        return acc;
      }, {} as Record<number, Record<string, unknown>>),
      margin: { top: 10, left: 14, right: 14 },
    });

    // Footer với tổng số bản ghi
    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || currentY + 50;
    doc.setFontSize(10);
    doc.text(`Tong so ban ghi: ${data.length}`, 14, finalY + 10);

    // Lưu file
    doc.save(`${filename}.pdf`);
  }

  /**
   * Xuất dữ liệu ra file Excel
   */
  static exportToExcel(options: ExportOptions): void {
    const { filename, title, columns, data, showSummary, summaryData } = options;

    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();

    // Chuẩn bị dữ liệu
    const worksheetData: unknown[][] = [];

    // Tiêu đề
    worksheetData.push([title]);
    worksheetData.push([`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`]);
    worksheetData.push(['']); // Dòng trống

    // Tổng quan (nếu có)
    if (showSummary && summaryData) {
      worksheetData.push(['Tổng quan:']);
      Object.entries(summaryData).forEach(([key, value]) => {
        worksheetData.push([key, String(value)]);
      });
      worksheetData.push(['']); // Dòng trống
    }

    // Header của bảng dữ liệu
    const headers = columns.map(col => col.header);
    worksheetData.push(headers);

    // Dữ liệu
    data.forEach(item => {
      const row = columns.map(col => {
        const value = item[col.key];
        return col.formatter ? col.formatter(value) : value;
      });
      worksheetData.push(row);
    });

    // Tổng số bản ghi
    worksheetData.push(['']);
    worksheetData.push([`Tổng số bản ghi: ${data.length}`]);

    // Tạo worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Styling cho Excel
    // Không cần sử dụng range variable
    
    // Style cho tiêu đề
    if (worksheet['A1']) {
      worksheet['A1'].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      };
    }

    // Merge cells cho tiêu đề
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } }
    ];

    // Set column widths
    const colWidths = columns.map(col => ({ wch: col.width || 15 }));
    worksheet['!cols'] = colWidths;

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách');

    // Xuất file
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `${filename}.xlsx`);
  }

  /**
   * Format currency cho hiển thị
   */
  static formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  }

  /**
   * Format date cho hiển thị
   */
  static formatDate(value: string | null | undefined): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('vi-VN');
  }

  /**
   * Format boolean cho hiển thị
   */
  static formatStatus(value: boolean | string | null | undefined): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') {
      return value ? 'Kích hoạt' : 'Không kích hoạt';
    }
    if (typeof value === 'string') {
      return value === 'Active' ? 'Hoạt động' : 'Hết hạn';
    }
    return String(value);
  }
}
