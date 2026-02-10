import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Loader2 } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { validateFileSize, isVideoFile, isImageFile, formatFileSize } from '../../utils/mediaValidation';
import { toast } from 'sonner';

export interface RequestMediaItem {
  file: File;
  blob: ExternalBlob;
  preview: string;
  isVideo: boolean;
  uploadProgress: number;
}

interface RequestMediaPickerProps {
  media: RequestMediaItem[];
  onChange: (media: RequestMediaItem[]) => void;
  disabled?: boolean;
}

export default function RequestMediaPicker({ media, onChange, disabled }: RequestMediaPickerProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    const newMedia: RequestMediaItem[] = [];

    for (const file of files) {
      // Validate file type
      if (!isImageFile(file) && !isVideoFile(file)) {
        toast.error(`${file.name}: Only images and videos are allowed`);
        continue;
      }

      // Validate file size
      const sizeValidation = validateFileSize(file);
      if (!sizeValidation.valid) {
        toast.error(`${file.name}: ${sizeValidation.error}`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          // Update progress for this specific file
          const index = newMedia.findIndex(m => m.file === file);
          if (index !== -1) {
            newMedia[index].uploadProgress = percentage;
            onChange([...media, ...newMedia]);
          }
        });

        const preview = URL.createObjectURL(file);

        newMedia.push({
          file,
          blob,
          preview,
          isVideo: isVideoFile(file),
          uploadProgress: 0,
        });
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
        console.error(error);
      }
    }

    onChange([...media, ...newMedia]);
    setUploading(false);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const item = media[index];
    URL.revokeObjectURL(item.preview);
    onChange(media.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          id="request-media-input"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || uploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('request-media-input')?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add Media (Optional)
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Images and videos accepted. Max 800 MB per file.
        </p>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 z-10"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {item.isVideo ? (
                  <video
                    src={item.preview}
                    className="w-full h-32 object-cover rounded"
                    controls
                  />
                ) : (
                  <img
                    src={item.preview}
                    alt={`Media ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </p>
                
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
      )}
    </div>
  );
}
