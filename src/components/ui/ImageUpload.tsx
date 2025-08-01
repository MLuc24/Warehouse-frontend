import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Eye, Link, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxSize?: number; // Max file size in MB
  acceptedTypes?: string[];
  showPreview?: boolean;
  className?: string;
}

/**
 * Enhanced Image Upload Component
 * Supports both file upload and URL input with preview functionality
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  disabled = false,
  placeholder = 'Nhập URL hình ảnh hoặc tải ảnh lên',
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true,
  className = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL input change
  const handleUrlChange = useCallback((url: string) => {
    setUploadError('');
    onChange(url);
    setPreviewUrl(url);
  }, [onChange]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError('');

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setUploadError(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File quá lớn. Kích thước tối đa: ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for preview (in real app, you would upload to server)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        setPreviewUrl(base64Url);
        onChange(base64Url);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Không thể đọc file. Vui lòng thử lại.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // TODO: In production, replace with actual file upload to server
      // const formData = new FormData();
      // formData.append('image', file);
      // const response = await uploadImageToServer(formData);
      // const imageUrl = response.data.url;
      // setPreviewUrl(imageUrl);
      // onChange(imageUrl);

    } catch {
      setUploadError('Tải ảnh lên thất bại. Vui lòng thử lại.');
      setIsUploading(false);
    }
  }, [acceptedTypes, maxSize, onChange]);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Clear image
  const handleClear = useCallback(() => {
    onChange('');
    setPreviewUrl('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // Open file picker
  const handleOpenFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Method Selector */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setInputMethod('url')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
            inputMethod === 'url'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          <Link className="w-3 h-3 inline mr-1" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setInputMethod('upload')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
            inputMethod === 'upload'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          <Upload className="w-3 h-3 inline mr-1" />
          Tải lên
        </button>
      </div>

      {/* URL Input */}
      {inputMethod === 'url' && (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 placeholder:text-gray-400 text-sm border-gray-200 bg-gray-50/50 focus:border-green-400 focus:ring-green-100 focus:bg-white hover:border-gray-300 hover:bg-white"
          />
          <p className="text-xs text-gray-500">
            Hỗ trợ URL dài. Nhập đường dẫn trực tiếp đến hình ảnh.
          </p>
        </div>
      )}

      {/* File Upload */}
      {inputMethod === 'upload' && (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
            disabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-100/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="text-sm text-gray-600">Đang tải ảnh...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <button
                  type="button"
                  onClick={handleOpenFilePicker}
                  disabled={disabled}
                  className="text-sm font-medium text-green-600 hover:text-green-700 underline"
                >
                  Chọn file
                </button>
                <span className="text-sm text-gray-500"> hoặc kéo thả vào đây</span>
              </div>
              <p className="text-xs text-gray-500">
                Tối đa {maxSize}MB. Hỗ trợ: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-xs text-red-700 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {uploadError}
          </p>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && previewUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Xem trước:</span>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Xem ảnh lớn"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                title="Xóa ảnh"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => {
                setUploadError('Không thể hiển thị ảnh. Vui lòng kiểm tra URL hoặc file.');
              }}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowPreviewModal(false)}>
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={previewUrl}
              alt="Full Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
