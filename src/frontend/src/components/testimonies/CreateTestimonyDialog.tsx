import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitTestimony } from '../../hooks/useQueries';
import TestimonyMediaPicker, { type TestimonyMediaItem } from './TestimonyMediaPicker';

interface CreateTestimonyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTestimonyDialog({ open, onOpenChange }: CreateTestimonyDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [photos, setPhotos] = useState<TestimonyMediaItem[]>([]);
  const [videos, setVideos] = useState<TestimonyMediaItem[]>([]);

  const submitTestimony = useSubmitTestimony();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    if (photos.length === 0 && videos.length === 0) {
      toast.error('Please add at least one photo or video');
      return;
    }

    try {
      const testimonyData = {
        rating,
        photos: photos.map(p => ({ blob: p.blob, description: p.description })),
        videos: videos.map(v => ({ blob: v.blob, description: v.description })),
      };

      await submitTestimony.mutateAsync(testimonyData);
      toast.success('Testimony submitted! It will appear after admin approval.');
      
      // Reset form
      setRating(0);
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
            Share your experience with photos, videos, and a star rating. Your testimony will be reviewed before appearing publicly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Star Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-arcane-gold text-arcane-gold'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating} {rating === 1 ? 'star' : 'stars'} selected
              </p>
            )}
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
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={submitTestimony.isPending || rating === 0 || (photos.length === 0 && videos.length === 0)}
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
            Your testimony will be reviewed by an administrator before appearing publicly.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
