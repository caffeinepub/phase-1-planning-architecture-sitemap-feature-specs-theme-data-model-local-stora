import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSubmitTestimony } from '../../hooks/useQueries';
import TestimonyMediaPicker, { type TestimonyMediaItem } from './TestimonyMediaPicker';
import HalfStarRatingInput from './HalfStarRatingInput';

interface CreateTestimonyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTestimonyDialog({ open, onOpenChange }: CreateTestimonyDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<TestimonyMediaItem[]>([]);
  const [videos, setVideos] = useState<TestimonyMediaItem[]>([]);

  const submitTestimony = useSubmitTestimony();

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a short review description');
      return;
    }

    if (photos.length === 0 && videos.length === 0) {
      toast.error('Please add at least one photo or video');
      return;
    }

    try {
      const testimonyData = {
        rating,
        description: description.trim(),
        photos: photos.map(p => ({ blob: p.blob, description: p.description })),
        videos: videos.map(v => ({ blob: v.blob, description: v.description })),
      };

      await submitTestimony.mutateAsync(testimonyData);
      toast.success('Testimony submitted! It will appear immediately with "Awaiting Admin Verification" status until approved.');
      
      // Reset form
      setRating(0);
      setDescription('');
      setPhotos([]);
      setVideos([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to submit testimony:', error);
      toast.error(error.message || 'Failed to submit testimony');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Testimony</DialogTitle>
          <DialogDescription>
            Share your experience with a star rating, short review, photos, and videos. Your testimony will appear immediately with "Awaiting Admin Verification" status until approved by an administrator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Star Rating *</Label>
            <HalfStarRatingInput value={rating} onChange={setRating} />
            <p className="text-xs text-muted-foreground">
              Select from 0.5 to 5.0 stars in half-star increments
            </p>
          </div>

          {/* Short Review Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Review Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your experience in a few sentences..."
              rows={4}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          {/* Photos and Videos */}
          <div className="space-y-2">
            <Label>Photos & Videos</Label>
            <TestimonyMediaPicker
              photos={photos}
              videos={videos}
              onPhotosChange={setPhotos}
              onVideosChange={setVideos}
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleSubmit}
              disabled={
                submitTestimony.isPending || 
                rating === 0 || 
                !description.trim() ||
                (photos.length === 0 && videos.length === 0)
              }
              className="flex-1"
            >
              {submitTestimony.isPending ? 'Submitting...' : 'Submit Testimony'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitTestimony.isPending}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your testimony will appear immediately on the public page with "Awaiting Admin Verification" status until an administrator approves it.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
