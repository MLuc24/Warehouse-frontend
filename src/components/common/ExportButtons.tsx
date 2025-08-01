import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { ExportService, type ExportOptions } from '@/utils';

interface ExportButtonsProps {
  exportOptions: ExportOptions;
  className?: string;
  disabled?: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  exportOptions,
  className = '',
  disabled = false
}) => {
  const handleExportPDF = () => {
    if (disabled) return;
    ExportService.exportToPDF(exportOptions);
  };

  const handleExportExcel = () => {
    if (disabled) return;
    ExportService.exportToExcel(exportOptions);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="group">
        <button
          disabled={disabled}
          className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Download size={16} />
          Xuất
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1" role="menu">
            <button
              onClick={handleExportPDF}
              disabled={disabled}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              <FileText size={16} className="text-red-600" />
              Xuất PDF
            </button>
            <button
              onClick={handleExportExcel}
              disabled={disabled}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              <Table size={16} className="text-green-600" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportButtons;
