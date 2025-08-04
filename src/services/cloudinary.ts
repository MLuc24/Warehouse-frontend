import { cloudinaryConfig, validateCloudinaryConfig } from '@/config/cloudinary';

/**
 * Cloudinary Upload Response Interface
 */
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  folder?: string;
}

/**
 * Upload Options Interface
 */
export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: Record<string, string | number>;
  tags?: string[];
  context?: Record<string, string | number>;
}

/**
 * Create a fetch request with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number }) => {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - Please check your internet connection and try again');
    }
    throw error;
  }
};

/**
 * Retry logic for network requests
 */
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff delay
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Upload attempt ${attempt} failed, retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

/**
 * Cloudinary Service Class
 * Xử lý upload ảnh và quản lý ảnh thông qua Cloudinary
 */
export class CloudinaryService {
  private static instance: CloudinaryService;
  private config = cloudinaryConfig;

  private constructor() {
    if (!validateCloudinaryConfig()) {
      console.warn('Cloudinary configuration is incomplete. Some features may not work.');
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload file to Cloudinary
   * @param file - File to upload
   * @param options - Upload options
   * @returns Promise with upload response
   */
  async uploadImage(file: File, options: UploadOptions = {}): Promise<CloudinaryUploadResponse> {
    if (!validateCloudinaryConfig()) {
      throw new Error('Cloudinary configuration is incomplete');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    // Use primary preset, with fallbacks
    const uploadPresets = ['warehouse_products', 'warehouse_upload', 'ml_default'];
    const currentPreset = this.config.uploadPreset || uploadPresets[0];
    formData.append('upload_preset', currentPreset);
    
    console.log('Using upload preset:', currentPreset);
    
    // Add optional parameters
    if (options.folder || this.config.folder) {
      formData.append('folder', options.folder || this.config.folder!);
    }
    
    if (options.resourceType) {
      formData.append('resource_type', options.resourceType);
    }
    
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }
    
    if (options.context) {
      formData.append('context', JSON.stringify(options.context));
    }

    // Add transformations
    if (options.transformation) {
      const transformationString = Object.entries(options.transformation)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      formData.append('transformation', transformationString);
    }

    console.log('Uploading to Cloudinary:', {
      cloudName: this.config.cloudName,
      uploadPreset: this.config.uploadPreset,
      folder: options.folder || this.config.folder,
      fileSize: file.size,
      fileType: file.type
    });

    try {
      return await retryRequest(async () => {
        const response = await fetchWithTimeout(
          `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
            timeout: 60000, // 60 seconds timeout for file uploads
          }
        );

        console.log('Cloudinary response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Cloudinary error response:', errorText);
          
          let error;
          try {
            error = JSON.parse(errorText);
          } catch {
            error = { error: { message: errorText } };
          }
          
          // Handle specific error cases
          if (errorText.includes('Invalid upload preset')) {
            throw new Error('Upload preset không hợp lệ. Vui lòng liên hệ quản trị viên.');
          } else if (errorText.includes('Invalid cloud name')) {
            throw new Error('Cấu hình Cloudinary không hợp lệ.');
          } else if (errorText.includes('Request Entity Too Large')) {
            throw new Error('File quá lớn. Vui lòng chọn ảnh nhỏ hơn.');
          }
          
          throw new Error(error.error?.message || `Upload failed with status ${response.status}`);
        }

        const result: CloudinaryUploadResponse = await response.json();
        console.log('Cloudinary upload success:', result.public_id);
        return result;
      }, 3); // Retry up to 3 times
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  /**
   * Upload image from URL to Cloudinary
   * @param imageUrl - URL of the image to upload
   * @param options - Upload options
   * @returns Promise with upload response
   */
  async uploadImageFromUrl(imageUrl: string, options: UploadOptions = {}): Promise<CloudinaryUploadResponse> {
    if (!validateCloudinaryConfig()) {
      throw new Error('Cloudinary configuration is incomplete');
    }

    if (!imageUrl || !this.isValidImageUrl(imageUrl)) {
      throw new Error('Invalid image URL provided');
    }

    const formData = new FormData();
    formData.append('file', imageUrl);
    
    // Use primary preset, with fallbacks
    const uploadPresets = ['warehouse_products', 'warehouse_upload', 'ml_default'];
    const currentPreset = this.config.uploadPreset || uploadPresets[0];
    formData.append('upload_preset', currentPreset);
    
    console.log('Using upload preset for URL:', currentPreset);
    
    // Add optional parameters
    if (options.folder || this.config.folder) {
      formData.append('folder', options.folder || this.config.folder!);
    }
    
    if (options.resourceType) {
      formData.append('resource_type', options.resourceType);
    }
    
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }
    
    if (options.context) {
      formData.append('context', JSON.stringify(options.context));
    }

    // Add transformations for optimization
    if (options.transformation) {
      const transformationString = Object.entries(options.transformation)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      formData.append('transformation', transformationString);
    }

    try {
      return await retryRequest(async () => {
        const response = await fetchWithTimeout(
          `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
            timeout: 45000, // 45 seconds timeout for URL uploads
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Cloudinary URL upload error response:', errorText);
          
          let error;
          try {
            error = JSON.parse(errorText);
          } catch {
            error = { error: { message: errorText } };
          }
          
          // Handle specific error cases
          if (errorText.includes('Invalid upload preset')) {
            throw new Error('Upload preset không hợp lệ. Vui lòng liên hệ quản trị viên.');
          } else if (errorText.includes('Invalid image URL')) {
            throw new Error('URL ảnh không hợp lệ hoặc không thể truy cập.');
          }
          
          throw new Error(error.error?.message || `URL upload failed with status ${response.status}`);
        }

        const result: CloudinaryUploadResponse = await response.json();
        return result;
      }, 2); // Retry up to 2 times for URL uploads
    } catch (error) {
      console.error('Cloudinary URL upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'URL upload failed');
    }
  }

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param options - Upload options
   * @returns Promise with array of upload responses
   */
  async uploadMultipleImages(
    files: File[], 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - Public ID of the image to delete
   * @returns Promise with deletion result
   */
  async deleteImage(publicId: string): Promise<{ result: string }> {
    if (!validateCloudinaryConfig()) {
      throw new Error('Cloudinary configuration is incomplete');
    }

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', this.config.apiKey);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Delete failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(error instanceof Error ? error.message : 'Delete failed');
    }
  }

  /**
   * Generate optimized image URL
   * @param publicId - Public ID of the image
   * @param transformations - Image transformations
   * @returns Optimized image URL
   */
  generateImageUrl(
    publicId: string, 
    transformations: Record<string, string | number> = {}
  ): string {
    if (!publicId || !this.config.cloudName) {
      return '';
    }

    // If publicId already contains the full URL, return as is
    if (publicId.startsWith('http')) {
      return publicId;
    }

    if (Object.keys(transformations).length === 0) {
      // No transformations, return simple URL
      return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${publicId}`;
    }

    const transformString = Object.entries(transformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');

    return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${transformString}/${publicId}`;
  }

  /**
   * Validate image URL
   * @param url - Image URL to validate
   * @returns Boolean indicating if URL is valid Cloudinary URL
   */
  isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
  }

  /**
   * Validate if URL is a valid image URL
   * @param url - URL to validate
   * @returns Boolean indicating if URL is valid image URL
   */
  isValidImageUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Check for common image extensions
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
      const pathname = parsedUrl.pathname.toLowerCase();
      
      // Check if URL has image extension or is from known image hosting services
      return imageExtensions.test(pathname) || 
             this.isCloudinaryUrl(url) ||
             url.includes('imgur.com') ||
             url.includes('unsplash.com') ||
             url.includes('pexels.com') ||
             url.includes('pixabay.com') ||
             // Accept URLs without extensions if they're from trusted sources
             parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns Public ID or null if not found
   */
  extractPublicId(url: string): string | null {
    if (!this.isCloudinaryUrl(url)) {
      return null;
    }

    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.([^.]+)$/);
    return matches ? matches[1] : null;
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   * @param maxSize - Maximum file size in MB
   * @param allowedTypes - Allowed file types
   * @returns Validation result
   */
  validateFile(
    file: File,
    maxSize = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  ): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { isValid: false, error: `File size exceeds ${maxSize}MB limit` };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    return { isValid: true };
  }
}

// Export singleton instance
export const cloudinaryService = CloudinaryService.getInstance();
