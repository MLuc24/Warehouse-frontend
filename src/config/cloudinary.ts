/**
 * Cloudinary Configuration
 * Cấu hình kết nối Cloudinary cho việc upload và quản lý ảnh
 */

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  folder?: string;
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  folder: import.meta.env.VITE_CLOUDINARY_FOLDER || 'warehouse-manage'
};

// Validate configuration
export const validateCloudinaryConfig = (): boolean => {
  const required = ['cloudName', 'uploadPreset'];
  return required.every(key => cloudinaryConfig[key as keyof CloudinaryConfig]);
};

// URL transformation options
export const defaultImageTransforms = {
  quality: 'auto',
  format: 'auto',
  crop: 'fill',
  gravity: 'center'
};

// Image sizes for different use cases
export const imageSizes = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 200, height: 200 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 }
};
