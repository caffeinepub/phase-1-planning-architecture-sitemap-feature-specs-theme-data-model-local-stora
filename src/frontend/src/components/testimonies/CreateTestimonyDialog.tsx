import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useCreateTestimony } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import TestimonyMediaPicker, { TestimonyMediaItem } from './TestimonyMediaPicker';
import { toast } from 'sonner';
import type { Testimony } from '../../types/phase5a';

interface CreateTestimonyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTestimonyDialog({ open, onOpenChange }: CreateTestimonyDialogProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const createTestimony = useCreateTestimony();

  const [photos, setPhotos] = useState<TestimonyMediaItem[]>([]);
  const [videos, setVideos] = useState<TestimonyMediaItem[]>([]);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setPhotos([]);
      setVideos([]);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('You must be logged in to submit a testimony');
      return;
    }

    if (photos.length === 0 && videos.length === 0) {
      toast.error('Please add at least one photo or video');
      return;
    }

    // Validate all media has descriptions
    const allMedia = [...photos, ...videos];
    const missingDescriptions = allMedia.some(m => !m.description.trim());
    if (missingDescriptions) {
      toast.error('Please add descriptions to all media items');
      return;
    }

    try {
      const testimonyData: Testimony = {
        id: 0n, // Will be set by backend
        submittedBy: identity.getPrincipal(),
        photos: photos.map(p => ({
          blob: p.blob,
          description: p.description.trim(),
        })),
        videos: videos.map(v => ({
          blob: v.blob,
          description: v.description.trim(),
        })),
        approved: false,
      };

      await createTestimony.mutateAsync(testimonyData);
      toast.success('Testimony submitted successfully! It will appear after admin approval.');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to submit testimony:', error);
      toast.error(error.message || 'Failed to submit testimony. This feature will be available once the backend is updated.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Testimony</DialogTitle>
          <DialogDescription>
            Share your experience with photos and videos. All submissions require admin approval before appearing publicly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TestimonyMediaPicker
            photos={photos}
            videos={videos}
            onPhotosChange={setPhotos}
            onVideosChange={setVideos}
            disabled={createTestimony.isPending}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createTestimony.isPending || (photos.length === 0 && videos.length === 0)}
              className="flex-1"
            >
              {createTestimony.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Testimony'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTestimony.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
