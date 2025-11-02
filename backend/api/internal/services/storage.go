package services

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"path/filepath"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

type StorageService struct {
	client      *storage.Client
	ctx         context.Context
	bucketName  string
	audioBucket string
	imageBucket string
}

type UploadResult struct {
	URL      string `json:"url"`
	FileName string `json:"file_name"`
	Size     int64  `json:"size"`
	MimeType string `json:"mime_type"`
}

func NewStorageService(ctx context.Context, bucketName, audioBucket, imageBucket string) (*StorageService, error) {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create storage client: %v", err)
	}

	return &StorageService{
		client:      client,
		ctx:         ctx,
		bucketName:  bucketName,
		audioBucket: audioBucket,
		imageBucket: imageBucket,
	}, nil
}

func (s *StorageService) Close() error {
	return s.client.Close()
}

// UploadAudio uploads audio files to the audio bucket
func (s *StorageService) UploadAudio(file multipart.File, header *multipart.FileHeader, userID string) (*UploadResult, error) {
	return s.uploadFile(file, header, s.audioBucket, "audio", userID)
}

// UploadImage uploads image files to the image bucket
func (s *StorageService) UploadImage(file multipart.File, header *multipart.FileHeader, userID string) (*UploadResult, error) {
	return s.uploadFile(file, header, s.imageBucket, "images", userID)
}

// UploadFile uploads any file to the general bucket
func (s *StorageService) UploadFile(file multipart.File, header *multipart.FileHeader, userID string) (*UploadResult, error) {
	return s.uploadFile(file, header, s.bucketName, "files", userID)
}

func (s *StorageService) uploadFile(file multipart.File, header *multipart.FileHeader, bucketName, folder, userID string) (*UploadResult, error) {
	defer file.Close()

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	fileName := fmt.Sprintf("%s/%s/%s%s", folder, userID, uuid.New().String(), ext)

	// Get bucket handle
	bucket := s.client.Bucket(bucketName)

	// Create object handle
	obj := bucket.Object(fileName)

	// Create writer with metadata
	writer := obj.NewWriter(s.ctx)
	writer.ContentType = header.Header.Get("Content-Type")
	writer.Metadata = map[string]string{
		"original-name": header.Filename,
		"uploaded-by":   userID,
		"uploaded-at":   time.Now().UTC().Format(time.RFC3339),
	}

	// Copy file content
	size, err := io.Copy(writer, file)
	if err != nil {
		return nil, fmt.Errorf("failed to upload file: %v", err)
	}

	// Close writer
	if err := writer.Close(); err != nil {
		return nil, fmt.Errorf("failed to close writer: %v", err)
	}

	// Make object public
	if err := obj.ACL().Set(s.ctx, storage.AllUsers, storage.RoleReader); err != nil {
		return nil, fmt.Errorf("failed to set ACL: %v", err)
	}

	// Generate public URL
	publicURL := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, fileName)

	return &UploadResult{
		URL:      publicURL,
		FileName: fileName,
		Size:     size,
		MimeType: header.Header.Get("Content-Type"),
	}, nil
}

// DeleteFile deletes a file from storage
func (s *StorageService) DeleteFile(fileName, bucketName string) error {
	if bucketName == "" {
		bucketName = s.bucketName
	}

	bucket := s.client.Bucket(bucketName)
	obj := bucket.Object(fileName)

	if err := obj.Delete(s.ctx); err != nil {
		return fmt.Errorf("failed to delete file: %v", err)
	}

	return nil
}

// GetFileURL generates a signed URL for private file access
func (s *StorageService) GetFileURL(fileName, bucketName string, expiry time.Duration) (string, error) {
	if bucketName == "" {
		bucketName = s.bucketName
	}

	opts := &storage.SignedURLOptions{
		Scheme:  storage.SigningSchemeV4,
		Method:  "GET",
		Expires: time.Now().Add(expiry),
	}

	url, err := storage.SignedURL(bucketName, fileName, opts)
	if err != nil {
		return "", fmt.Errorf("failed to generate signed URL: %v", err)
	}

	return url, nil
}

// ListFiles lists files in a bucket with pagination
func (s *StorageService) ListFiles(bucketName, prefix string, maxResults int) ([]*storage.ObjectAttrs, error) {
	if bucketName == "" {
		bucketName = s.bucketName
	}

	bucket := s.client.Bucket(bucketName)
	query := &storage.Query{
		Prefix:    prefix,
		Delimiter: "/",
		Versions:  false,
	}

	var objects []*storage.ObjectAttrs
	it := bucket.Objects(s.ctx, query)

	count := 0
	for {
		if maxResults > 0 && count >= maxResults {
			break
		}
		obj, err := it.Next()
		if err == storage.ErrObjectNotExist {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("failed to list objects: %v", err)
		}
		objects = append(objects, obj)
		count++
	}

	return objects, nil
}

// GetFileMetadata returns metadata for a specific file
func (s *StorageService) GetFileMetadata(fileName, bucketName string) (*storage.ObjectAttrs, error) {
	if bucketName == "" {
		bucketName = s.bucketName
	}

	bucket := s.client.Bucket(bucketName)
	obj := bucket.Object(fileName)

	attrs, err := obj.Attrs(s.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get object attributes: %v", err)
	}

	return attrs, nil
}

// DownloadFile downloads a file from storage
func (s *StorageService) DownloadFile(fileName, bucketName string) ([]byte, error) {
	if bucketName == "" {
		bucketName = s.bucketName
	}

	bucket := s.client.Bucket(bucketName)
	obj := bucket.Object(fileName)

	reader, err := obj.NewReader(s.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create reader: %v", err)
	}
	defer reader.Close()

	data, err := io.ReadAll(reader)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	return data, nil
}

// ValidateFileType checks if the uploaded file type is allowed
func (s *StorageService) ValidateFileType(fileName string, allowedTypes []string) bool {
	ext := strings.ToLower(filepath.Ext(fileName))

	for _, allowedType := range allowedTypes {
		if strings.Contains(allowedType, ext[1:]) { // Remove the dot from extension
			return true
		}
	}

	return false
}

// GetFileExtensionFromMimeType returns file extension based on MIME type
func (s *StorageService) GetFileExtensionFromMimeType(mimeType string) string {
	mimeToExt := map[string]string{
		"audio/mpeg": ".mp3",
		"audio/wav":  ".wav",
		"audio/mp4":  ".m4a",
		"image/jpeg": ".jpg",
		"image/png":  ".png",
		"image/webp": ".webp",
		"image/gif":  ".gif",
		"video/mp4":  ".mp4",
		"video/webm": ".webm",
	}

	if ext, exists := mimeToExt[mimeType]; exists {
		return ext
	}

	return ".bin" // Default binary extension
}

// GenerateUploadURL generates a signed URL for direct client uploads
func (s *StorageService) GenerateUploadURL(fileName, bucketName, contentType string, expiry time.Duration) (string, error) {
	if bucketName == "" {
		bucketName = s.bucketName
	}

	opts := &storage.SignedURLOptions{
		Scheme:      storage.SigningSchemeV4,
		Method:      "PUT",
		Expires:     time.Now().Add(expiry),
		ContentType: contentType,
	}

	url, err := storage.SignedURL(bucketName, fileName, opts)
	if err != nil {
		return "", fmt.Errorf("failed to generate upload URL: %v", err)
	}

	return url, nil
}

// ExtractFileNameFromURL extracts the file name from a Google Cloud Storage URL
func (s *StorageService) ExtractFileNameFromURL(fileURL string) (string, error) {
	parsedURL, err := url.Parse(fileURL)
	if err != nil {
		return "", err
	}

	// Remove leading slash and decode
	fileName := strings.TrimPrefix(parsedURL.Path, "/")

	// For Google Cloud Storage URLs, remove the bucket name
	parts := strings.SplitN(fileName, "/", 2)
	if len(parts) > 1 {
		return parts[1], nil
	}

	return fileName, nil
}
