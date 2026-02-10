import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useQueuedCreateFeedback } from '../../hooks/useQueuedMutations';
import { useOfflineDrafts } from '../../hooks/useOfflineDrafts';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FEEDBACK_CATEGORIES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'ux', label: 'UX Feedback' },
  { value: 'other', label: 'Other' },
];

export default function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { identity } = useInternetIdentity();
  const { draft, saveDraft, clearDraft } = useOfflineDrafts('feedback-form');
  const createFeedback = useQueuedCreateFeedback();

  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contact, setContact] = useState<string>('');

  // Restore draft on mount
  useEffect(() => {
    if (draft) {
      setCategory(draft.category || '');
      setDescription(draft.description || '');
      setContact(draft.contact || '');
    }
  }, [draft]);

  // Save draft when form changes
  useEffect(() => {
    if (category || description || contact) {
      saveDraft({ category, description, contact });
    }
  }, [category, description, contact, saveDraft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Please provide feedback details');
      return;
    }

    if (!identity) {
      toast.error('Please log in to submit feedback');
      return;
    }

    const userId = identity.getPrincipal().toString();
    const feedbackMessage = `[${category || 'General'}] ${description}${contact ? `\n\nContact: ${contact}` : ''}`;

    try {
      await createFeedback.mutateAsync({ userId, message: feedbackMessage });
      
      // Clear form and draft on success
      setCategory('');
      setDescription('');
      setContact('');
      clearDraft();
      onOpenChange(false);
      
      toast.success('Feedback submitted successfully! Thank you for helping us improve.');
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info('You are offline. Your feedback will be submitted when you reconnect.');
        // Keep the form open so user can see the queued message
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts, reporting bugs, or suggesting new features.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Tell us what's on your mind..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact (optional)</Label>
            <Input
              id="contact"
              type="text"
              placeholder="Email or other contact info"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Provide contact info if you'd like us to follow up with you.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFeedback.isPending || !description.trim()}>
              {createFeedback.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
