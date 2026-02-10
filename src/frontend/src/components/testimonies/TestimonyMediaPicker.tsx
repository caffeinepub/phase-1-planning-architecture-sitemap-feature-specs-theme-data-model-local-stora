import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, Loader2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import {
  validateFileSize,
  validateDescriptionLength,
  validateVideoDuration,
  isVideoFile,
  isImageFile,
  formatFileSize,
  MAX_DESCRIPTION_LENGTH,
} from '../../utils/mediaValidation';
import { toast } from 'sonner';

export interface TestimonyMediaItem {
  file: File;
  blob: ExternalBlob;
  preview: string;
  description: string;
  isVideo: boolean;
  uploadProgress: number;
}

interface TestimonyMediaPickerProps {
  photos: TestimonyMediaItem[];
  videos: TestimonyMediaItem[];
  onPhotosChange: (photos: TestimonyMediaItem[]) => void;
  onVideosChange: (videos: TestimonyMediaItem[]) => void;
  disabled?: boolean;
}

const MAX_PHOTOS = 5;
const MAX_VIDEOS = 3;

export default function TestimonyMediaPicker({
  photos,
  videos,
  onPhotosChange,
  onVideosChange,
  disabled,
}: TestimonyMediaPickerProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentItems = type === 'photo' ? photos : videos;
    const maxItems = type === 'photo' ? MAX_PHOTOS : MAX_VIDEOS;
    const onChange = type === 'photo' ? onPhotosChange : onVideosChange;

    if (currentItems.length >= maxItems) {
      toast.error(`Maximum ${maxItems} ${type}s allowed`);
      return;
    }

    const availableSlots = maxItems - currentItems.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.warning(`Only ${availableSlots} ${type}(s) can be added`);
    }

    setUploading(true);

    const newMedia: TestimonyMediaItem[] = [];

    for (const file of filesToProcess) {
      // Validate file type
      const isCorrectType = type === 'photo' ? isImageFile(file) : isVideoFile(file);
      if (!isCorrectType) {
        toast.error(`${file.name}: Invalid file type for ${type}`);
        continue;
      }

      // Validate file size
      const sizeValidation = validateFileSize(file);
      if (!sizeValidation.valid) {
        toast.error(`${file.name}: ${sizeValidation.error}`);
        continue;
      }

      // Validate video duration
      if (type === 'video') {
        const durationValidation = await validateVideoDuration(file);
        if (!durationValidation.valid) {
          toast.error(`${file.name}: ${durationValidation.error}`);
          continue;
        }
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          const index = newMedia.findIndex(m => m.file === file);
          if (index !== -1) {
            newMedia[index].uploadProgress = percentage;
            onChange([...currentItems, ...newMedia]);
          }
        });

        const preview = URL.createObjectURL(file);

        newMedia.push({
          file,
          blob,
          preview,
          description: '',
          isVideo: type === 'video',
          uploadProgress: 0,
        });
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
        console.error(error);
      }
    }

    onChange([...currentItems, ...newMedia]);
    setUploading(false);
    e.target.value = '';
  };

  const handleRemove = (index: number, type: 'photo' | 'video') => {
    const items = type === 'photo' ? photos : videos;
    const onChange = type === 'photo' ? onPhotosChange : onVideosChange;
    
    const item = items[index];
    URL.revokeObjectURL(item.preview);
    onChange(items.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string, type: 'photo' | 'video') => {
    const validation = validateDescriptionLength(description);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const items = type === 'photo' ? photos : videos;
    const onChange = type === 'photo' ? onPhotosChange : onVideosChange;
    
    const updated = [...items];
    updated[index].description = description;
    onChange(updated);
  };

  const renderMediaGrid = (items: TestimonyMediaItem[], type: 'photo' | 'video') => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 z-10"
                    onClick={() => handleRemove(index, type)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {item.isVideo ? (
                    <video
                      src={item.preview}
                      className="w-32 h-32 object-cover rounded"
                      controls
                    />
                  ) : (
                    <img
                      src={item.preview}
                      alt={`${type} ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor={`description-${type}-${index}`}>
                    Description ({item.description.length}/{MAX_DESCRIPTION_LENGTH})
                  </Label>
                  <Textarea
                    id={`description-${type}-${index}`}
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value, type)}
                    placeholder="Describe this media..."
                    rows={3}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    disabled={disabled}
                  />
                </div>
              </div>

              {item.uploadProgress > 0 && item.uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${item.uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Photos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Photos ({photos.length}/{MAX_PHOTOS})</Label>
          <div>
            <input
              type="file"
              id="testimony-photo-input"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e, 'photo')}
              disabled={disabled || uploading || photos.length >= MAX_PHOTOS}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('testimony-photo-input')?.click()}
              disabled={disabled || uploading || photos.length >= MAX_PHOTOS}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="mr-2 h-4 w-4" />
              )}
              Add Photos
            </Button>
          </div>
        </div>
        {renderMediaGrid(photos, 'photo')}
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Videos ({videos.length}/{MAX_VIDEOS})</Label>
          <div>
            <input
              type="file"
              id="testimony-video-input"
              className="hidden"
              accept="video/*"
              multiple
              onChange={(e) => handleFileSelect(e, 'video')}
              disabled={disabled || uploading || videos.length >= MAX_VIDEOS}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('testimony-video-input')?.click()}
              disabled={disabled || uploading || videos.length >= MAX_VIDEOS}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <VideoIcon className="mr-2 h-4 w-4" />
              )}
              Add Videos
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Videos must be ≤5 minutes and ≤800 MB
        </p>
        {renderMediaGrid(videos, 'video')}
      </div>
    </div>
  );
}
