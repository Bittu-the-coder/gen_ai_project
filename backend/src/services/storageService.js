import { getStorage } from 'firebase-admin/storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class StorageService {
  constructor() {
    this.bucket = getStorage().bucket();
  }

  /**
   * Upload file to Firebase Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original filename
   * @param {string} folder - Folder path (e.g., 'products', 'artisans', 'voice')
   * @param {string} contentType - File content type
   * @returns {Promise<{url: string, path: string}>}
   */
  async uploadFile(fileBuffer, fileName, folder, contentType) {
    try {
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const filePath = `${folder}/${uniqueFileName}`;

      const file = this.bucket.file(filePath);

      await file.save(fileBuffer, {
        metadata: {
          contentType: contentType,
          metadata: {
            originalName: fileName,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      // Make file publicly accessible
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filePath}`;

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error('Upload file error:', error);
      throw new Error('File upload failed');
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of {buffer, filename, contentType}
   * @param {string} folder - Folder path
   * @returns {Promise<Array>}
   */
  async uploadMultipleFiles(files, folder) {
    try {
      const uploadPromises = files.map(file =>
        this.uploadFile(file.buffer, file.filename, folder, file.contentType)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload multiple files error:', error);
      throw new Error('Multiple file upload failed');
    }
  }

  /**
   * Delete file from Firebase Storage
   * @param {string} filePath - File path in storage
   * @returns {Promise<void>}
   */
  async deleteFile(filePath) {
    try {
      const file = this.bucket.file(filePath);
      await file.delete();
    } catch (error) {
      console.error('Delete file error:', error);
      throw new Error('File deletion failed');
    }
  }

  /**
   * Delete multiple files
   * @param {Array<string>} filePaths - Array of file paths
   * @returns {Promise<void>}
   */
  async deleteMultipleFiles(filePaths) {
    try {
      const deletePromises = filePaths.map(filePath =>
        this.deleteFile(filePath)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Delete multiple files error:', error);
      throw new Error('Multiple file deletion failed');
    }
  }

  /**
   * Get signed URL for private file access
   * @param {string} filePath - File path in storage
   * @param {number} expiresIn - Expiration time in minutes (default: 60)
   * @returns {Promise<string>}
   */
  async getSignedUrl(filePath, expiresIn = 60) {
    try {
      const file = this.bucket.file(filePath);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresIn * 60 * 1000,
      });

      return url;
    } catch (error) {
      console.error('Get signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Check if file exists
   * @param {string} filePath - File path in storage
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      const file = this.bucket.file(filePath);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      console.error('Check file exists error:', error);
      return false;
    }
  }

  /**
   * Get file metadata
   * @param {string} filePath - File path in storage
   * @returns {Promise<object>}
   */
  async getFileMetadata(filePath) {
    try {
      const file = this.bucket.file(filePath);
      const [metadata] = await file.getMetadata();
      return metadata;
    } catch (error) {
      console.error('Get file metadata error:', error);
      throw new Error('Failed to get file metadata');
    }
  }
}

export default new StorageService();
