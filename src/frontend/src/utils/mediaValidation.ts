export interface MediaValidationResult {
  valid: boolean;
  error?: string;
}

export const MAX_FILE_SIZE = 800 * 1024 * 1024; // 800 MB
export const MAX_VIDEO_DURATION = 5 * 60; // 5 minutes in seconds
export const MAX_DESCRIPTION_LENGTH = 1500;

export function validateFileSize(file: File): MediaValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 800 MB limit. Current size: ${formatFileSize(file.size)}`,
    };
  }
  return { valid: true };
}

export function validateDescriptionLength(description: string): MediaValidationResult {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `Description exceeds ${MAX_DESCRIPTION_LENGTH} characters. Current: ${description.length}`,
    };
  }
  return { valid: true };
}

export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

export async function validateVideoDuration(file: File): Promise<MediaValidationResult> {
  try {
    const duration = await getVideoDuration(file);
    if (duration > MAX_VIDEO_DURATION) {
      return {
        valid: false,
        error: `Video duration exceeds 5 minutes. Current: ${formatDuration(duration)}`,
      };
    }
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to read video duration',
    };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
