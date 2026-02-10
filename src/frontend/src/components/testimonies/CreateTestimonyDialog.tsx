import { useState } from 'react';
import { useCreateTestimony } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

interface CreateTestimonyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTestimonyDialog({ open, onOpenChange }: CreateTestimonyDialogProps) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const createTestimonyMutation = useCreateTestimony();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image file must be less than 10MB');
        return;
      }
      setPhotoFile(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video file must be less than 50MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter your review');
      return;
    }

    if (content.length > 800) {
      toast.error('Review must be 800 characters or less');
      return;
    }

    try {
      let photoBlob: ExternalBlob | null = null;
      let videoBlob: ExternalBlob | null = null;

      if (photoFile) {
        const photoBytes = new Uint8Array(await photoFile.arrayBuffer());
        photoBlob = ExternalBlob.fromBytes(photoBytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      if (videoFile) {
        const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
        videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await createTestimonyMutation.mutateAsync({
        author: authorName.trim(),
        content: content.trim(),
        rating: BigInt(rating),
        photo: photoBlob,
        video: videoBlob,
      });

      toast.success('Thank you! Your testimony has been submitted for review.');
      
      setAuthorName('');
      setContent('');
      setRating(5);
      setPhotoFile(null);
      setVideoFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create testimony:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit testimony');
    }
  };

  const remainingChars = 800 - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Share Your Experience</DialogTitle>
            <DialogDescription>
              Tell us about your experience with our products and services. Your testimony will be reviewed before being published.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="author-name">Your Name *</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter your name"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-8 w-8 transition-all ${
                        star <= (hoveredRating || rating)
                          ? 'fill-testimony-star text-testimony-star testimony-star-glow'
                          : 'fill-none text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Review * (max 800 characters)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts and experience..."
                rows={6}
                required
              />
              <p className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars} characters remaining
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo (optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="cursor-pointer"
                />
                {photoFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPhotoFile(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {photoFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {photoFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video (optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="cursor-pointer"
                />
                {videoFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoFile(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {videoFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTestimonyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTestimonyMutation.isPending || isOverLimit || !authorName.trim() || !content.trim()}
            >
              {createTestimonyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Testimony'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
