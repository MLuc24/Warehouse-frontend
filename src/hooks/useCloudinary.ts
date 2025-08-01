import { useState, useCallback } from 'react';
import { cloudinaryService } from '@/services/cloudinary';
import type { CloudinaryUploadResponse, UploadOptions } from '@/services/cloudinary';

/**
 * Upload State Interface
 */
interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

/**
 * useCloudinary Hook
 * Custom hook for Cloudinary image operations
 */
export const useCloudinary = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });

  /**
   * Upload single image to Cloudinary
   */
  const uploadImage = useCallback(async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResponse | null> => {
    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      // Validate file
      const validation = cloudinaryService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setUploadState(prev => ({ ...prev, progress: 25 }));

      const result = await cloudinaryService.uploadImage(file, options);
      
      setUploadState(prev => ({ ...prev, progress: 100 }));
      
      // Reset state after successful upload
      setTimeout(() => {
        setUploadState({ isUploading: false, progress: 0, error: null });
      }, 500);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({ isUploading: false, progress: 0, error: errorMessage });
      return null;
    }
  }, []);

  /**
   * Upload image from URL to Cloudinary
   */
  const uploadImageFromUrl = useCallback(async (
    imageUrl: string, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResponse | null> => {
    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      // Validate URL
      if (!cloudinaryService.isValidImageUrl(imageUrl)) {
        throw new Error('URL không hợp lệ hoặc không phải là hình ảnh');
      }

      setUploadState(prev => ({ ...prev, progress: 25 }));

      const result = await cloudinaryService.uploadImageFromUrl(imageUrl, options);
      
      setUploadState(prev => ({ ...prev, progress: 100 }));
      
      // Reset state after successful upload
      setTimeout(() => {
        setUploadState({ isUploading: false, progress: 0, error: null });
      }, 500);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload from URL failed';
      setUploadState({ isUploading: false, progress: 0, error: errorMessage });
      return null;
    }
  }, []);

  /**
   * Upload multiple images to Cloudinary
   */
  const uploadMultipleImages = useCallback(async (
    files: File[], 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResponse[]> => {
    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      // Validate all files first
      for (const file of files) {
        const validation = cloudinaryService.validateFile(file);
        if (!validation.isValid) {
          throw new Error(`${file.name}: ${validation.error}`);
        }
      }

      setUploadState(prev => ({ ...prev, progress: 25 }));

      const results = await cloudinaryService.uploadMultipleImages(files, options);
      
      setUploadState(prev => ({ ...prev, progress: 100 }));
      
      // Reset state after successful upload
      setTimeout(() => {
        setUploadState({ isUploading: false, progress: 0, error: null });
      }, 500);

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({ isUploading: false, progress: 0, error: errorMessage });
      return [];
    }
  }, []);

  /**
   * Delete image from Cloudinary
   */
  const deleteImage = useCallback(async (publicId: string): Promise<boolean> => {
    try {
      await cloudinaryService.deleteImage(publicId);
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      return false;
    }
  }, []);

  /**
   * Generate optimized image URL
   */
  const generateImageUrl = useCallback((
    publicId: string, 
    transformations: Record<string, string | number> = {}
  ): string => {
    return cloudinaryService.generateImageUrl(publicId, transformations);
  }, []);

  /**
   * Check if URL is from Cloudinary
   */
  const isCloudinaryUrl = useCallback((url: string): boolean => {
    return cloudinaryService.isCloudinaryUrl(url);
  }, []);

  /**
   * Extract public ID from Cloudinary URL
   */
  const extractPublicId = useCallback((url: string): string | null => {
    return cloudinaryService.extractPublicId(url);
  }, []);

  /**
   * Clear upload error
   */
  const clearError = useCallback(() => {
    setUploadState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset upload state
   */
  const resetUploadState = useCallback(() => {
    setUploadState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    // State
    isUploading: uploadState.isUploading,
    uploadProgress: uploadState.progress,
    uploadError: uploadState.error,
    
    // Actions
    uploadImage,
    uploadImageFromUrl,
    uploadMultipleImages,
    deleteImage,
    generateImageUrl,
    isCloudinaryUrl,
    extractPublicId,
    clearError,
    resetUploadState
  };
};
