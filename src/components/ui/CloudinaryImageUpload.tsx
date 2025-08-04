import React, { useState, useCallback } from 'react';
import { Upload, X, Eye, Link, AlertCircle, CheckCircle } from 'lucide-react';
import { useCloudinary } from '@/hooks/useCloudinary';

interface CloudinaryImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  productName?: string; // For contextual tagging
  hidePreview?: boolean; // Hide preview section
}

/**
 * Cloudinary Image Upload Component
 * Specialized component for product image uploads using Cloudinary
 */
export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  value = '',
  onChange,
  disabled = false,
  placeholder = 'Nhập URL hình ảnh hoặc tải ảnh lên Cloudinary',
  className = '',
  productName = '',
  hidePreview = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'url' | 'upload'>('upload');
  const [dragOver, setDragOver] = useState(false);

  // Cloudinary hook
  const { 
    uploadImage, 
    uploadImageFromUrl,
    isUploading, 
    uploadProgress, 
    uploadError: cloudinaryError,
    clearError,
    isCloudinaryUrl
  } = useCloudinary();

  // Sync error state
  const displayError = uploadError || cloudinaryError;

  // Handle URL input change and upload to Cloudinary
  const handleUrlChange = useCallback(async (url: string) => {
    setUploadError('');
    clearError();
    
    if (!url.trim()) {
      onChange('');
      setPreviewUrl('');
      return;
    }

    // If it's already a Cloudinary URL, use it directly
    if (isCloudinaryUrl(url)) {
      onChange(url);
      setPreviewUrl(url);
      return;
    }

    // Otherwise, upload the image from URL to Cloudinary
    try {
      const result = await uploadImageFromUrl(url, {
        folder: 'warehouse_products',
        tags: productName ? [productName] : ['product']
        // Remove problematic transformations
      });

      if (result) {
        onChange(result.secure_url);
        setPreviewUrl(result.secure_url);
      } else {
        setUploadError('Không thể tải ảnh từ URL này');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải ảnh từ URL';
      let friendlyMessage = errorMessage;
      
      // Make error messages more user-friendly
      if (errorMessage.includes('timeout')) {
        friendlyMessage = 'Kết nối mạng chậm hoặc không ổn định. Vui lòng thử lại.';
      } else if (errorMessage.includes('Failed to fetch')) {
        friendlyMessage = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else if (errorMessage.includes('invalid') || errorMessage.includes('Invalid')) {
        friendlyMessage = 'URL ảnh không hợp lệ. Vui lòng kiểm tra lại đường dẫn.';
      }
      
      setUploadError(friendlyMessage);
    }
  }, [onChange, clearError, isCloudinaryUrl, uploadImageFromUrl, productName]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError('');
    clearError();

    try {
      const tags = ['product-image'];
      if (productName) {
        tags.push(productName.toLowerCase().replace(/\s+/g, '-'));
      }

      const result = await uploadImage(file, {
        folder: 'warehouse_products',
        tags
        // Remove transformations to avoid errors
      });

      if (result) {
        // Use the original secure_url from Cloudinary directly
        setPreviewUrl(result.secure_url);
        onChange(result.secure_url);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      let friendlyMessage = errorMessage;
      
      // Make error messages more user-friendly
      if (errorMessage.includes('timeout')) {
        friendlyMessage = 'Upload bị timeout. Hãy thử ảnh nhỏ hơn hoặc kiểm tra kết nối mạng.';
      } else if (errorMessage.includes('Failed to fetch')) {
        friendlyMessage = 'Không thể kết nối tới dịch vụ upload. Vui lòng thử lại sau.';
      } else if (errorMessage.includes('file too large') || errorMessage.includes('size')) {
        friendlyMessage = 'File ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.';
      } else if (errorMessage.includes('Invalid')) {
        friendlyMessage = 'File không phải là ảnh hợp lệ. Vui lòng chọn file JPG, PNG hoặc WebP.';
      }
      
      setUploadError(friendlyMessage);
    }
  }, [uploadImage, onChange, clearError, productName]);

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
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file && !disabled) {
      handleFileUpload(file);
    }
  }, [handleFileUpload, disabled]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  // Clear image
  const handleClear = useCallback(() => {
    onChange('');
    setPreviewUrl('');
    setUploadError('');
    clearError();
  }, [onChange, clearError]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Method Selector */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setInputMethod('upload')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
            inputMethod === 'upload'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          <Upload className="w-3 h-3 inline mr-1" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setInputMethod('url')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
            inputMethod === 'url'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          <Link className="w-3 h-3 inline mr-1" />
          URL
        </button>
      </div>

      {/* URL Input */}
      {inputMethod === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isUploading}
              className={`w-full px-3 py-2 border-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 placeholder:text-gray-400 text-sm ${
                isUploading
                  ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                  : 'border-gray-200 bg-gray-50/50 focus:border-green-400 focus:ring-green-100 focus:bg-white hover:border-gray-300 hover:bg-white'
              }`}
            />
            {isUploading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700">Đang tải ảnh lên Cloudinary...</p>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            {isUploading 
              ? 'Ảnh từ URL sẽ được tải lên Cloudinary và tối ưu hóa tự động'
              : 'Nhập URL hình ảnh. Ảnh sẽ được tự động tải lên Cloudinary để tối ưu hóa.'
            }
          </p>
        </div>
      )}

      {/* File Upload */}
      {inputMethod === 'upload' && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            disabled
              ? 'border-gray-200 bg-gray-50'
              : dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-100/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
            id="cloudinary-file-input"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Đang tải ảnh lên Cloudinary...</p>
                {uploadProgress > 0 && (
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Ảnh sẽ được tối ưu hóa tự động cho web
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div>
                <label 
                  htmlFor="cloudinary-file-input"
                  className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                >
                  Chọn file từ máy tính
                </label>
                <span className="text-sm text-gray-500 block mt-1">
                  hoặc kéo thả ảnh vào đây
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Tối đa 10MB • Hỗ trợ: JPG, PNG, GIF, WebP</p>
                <p className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Tự động tối ưu hóa và nén ảnh
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {displayError}
          </p>
        </div>
      )}

      {/* Preview Section */}
      {previewUrl && !hidePreview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Xem trước:</span>
            <div className="flex space-x-2">
              {isCloudinaryUrl(previewUrl) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Cloudinary
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Xem ảnh lớn"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                title="Xóa ảnh"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="inline-block bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs max-h-32 object-contain"
              onError={(e) => {
                console.error('Image load error:', previewUrl);
                setUploadError('Không thể hiển thị ảnh. URL có thể không hợp lệ.');
                // Hide broken image
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* Simple action buttons when preview is hidden but image exists */}
      {previewUrl && hidePreview && (
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            title="Xem ảnh lớn"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
            title="Xóa ảnh"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={() => setShowPreviewModal(false)}
        >
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
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryImageUpload;
