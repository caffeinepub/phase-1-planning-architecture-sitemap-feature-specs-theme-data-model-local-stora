import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Paperclip, FileText } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import type { MessageAttachment } from '../../types/phase5b';

const MAX_FILE_SIZE = 800 * 1024 * 1024; // 800 MB in bytes

interface AttachmentWithProgress {
  file: File;
  blob: ExternalBlob | null;
  progress: number;
  error: string | null;
}

interface MessageAttachmentPickerProps {
  attachments: MessageAttachment[];
  onChange: (attachments: MessageAttachment[]) => void;
  disabled?: boolean;
}

export default function MessageAttachmentPicker({
  attachments,
  onChange,
  disabled = false,
}: MessageAttachmentPickerProps) {
  const [uploading, setUploading] = useState<AttachmentWithProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`The following files exceed the 800 MB limit and cannot be attached:\n${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join('\n')}`);
      
      // Filter out oversized files
      const validFiles = files.filter(f => f.size <= MAX_FILE_SIZE);
      if (validFiles.length === 0) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    const validFiles = files.filter(f => f.size <= MAX_FILE_SIZE);

    // Initialize upload tracking
    const newUploading: AttachmentWithProgress[] = validFiles.map(file => ({
      file,
      blob: null,
      progress: 0,
      error: null,
    }));

    setUploading(prev => [...prev, ...newUploading]);

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploading(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(u => u.file === file);
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], progress: percentage };
            }
            return updated;
          });
        });

        // Wait for upload to complete (progress reaches 100)
        await new Promise<void>((resolve) => {
          const checkProgress = setInterval(() => {
            setUploading(prev => {
              const item = prev.find(u => u.file === file);
              if (item && item.progress >= 100) {
                clearInterval(checkProgress);
                resolve();
              }
              return prev;
            });
          }, 100);
        });

        // Add to attachments
        const newAttachment: MessageAttachment = {
          blob,
          filename: file.name,
        };

        onChange([...attachments, newAttachment]);

        // Remove from uploading
        setUploading(prev => prev.filter(u => u.file !== file));
      } catch (error) {
        console.error('Upload error:', error);
        setUploading(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(u => u.file === file);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], error: 'Upload failed' };
          }
          return updated;
        });
      }
    }

    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  const removeUploadingItem = (file: File) => {
    setUploading(prev => prev.filter(u => u.file !== file));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading.length > 0}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Attach Files
        </Button>
        <span className="text-xs text-muted-foreground">
          Max 800 MB per file
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Uploading files */}
      {uploading.map((item, idx) => (
        <Card key={`uploading-${idx}`} className="border-dashed">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(item.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                {item.error ? (
                  <p className="text-xs text-destructive mt-1">{item.error}</p>
                ) : (
                  <Progress value={item.progress} className="h-1 mt-2" />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeUploadingItem(item.file)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Uploaded attachments */}
      {attachments.map((attachment, idx) => (
        <Card key={`attachment-${idx}`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.filename}</p>
                <p className="text-xs text-muted-foreground">Ready to send</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(idx)}
                disabled={disabled}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
