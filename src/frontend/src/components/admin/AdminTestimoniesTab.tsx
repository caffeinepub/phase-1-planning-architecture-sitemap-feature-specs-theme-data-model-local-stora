import { useState } from 'react';
import { useGetAllTestimonies, useRemoveTestimony } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import ErrorState from '../system/ErrorState';
import StarRating from '../testimonies/StarRating';
import type { Testimony } from '../../backend';

export default function AdminTestimoniesTab() {
  const { data: testimonies = [], isLoading, error, refetch } = useGetAllTestimonies();
  const removeTestimonyMutation = useRemoveTestimony();
  const [testimonyToRemove, setTestimonyToRemove] = useState<Testimony | null>(null);

  const handleRemove = async () => {
    if (!testimonyToRemove) return;

    try {
      await removeTestimonyMutation.mutateAsync(testimonyToRemove.id);
      toast.success('Testimony removed successfully');
      setTestimonyToRemove(null);
    } catch (error) {
      console.error('Failed to remove testimony:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove testimony');
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load testimonies"
        description={error instanceof Error ? error.message : 'An error occurred'}
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  const approvedTestimonies = testimonies.filter((t) => t.approved);
  const pendingTestimonies = testimonies.filter((t) => !t.approved);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Pending Review ({pendingTestimonies.length})
        </h3>
        {pendingTestimonies.length === 0 ? (
          <Card className="border-border/40">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No pending testimonies</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingTestimonies.map((testimony) => (
              <Card key={Number(testimony.id)} className="border-border/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{testimony.author}</CardTitle>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          Pending
                        </Badge>
                      </div>
                      {testimony.rating !== undefined && testimony.rating !== null && (
                        <StarRating rating={Number(testimony.rating)} />
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setTestimonyToRemove(testimony)}
                      disabled={removeTestimonyMutation.isPending}
                    >
                      {removeTestimonyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{testimony.content}</p>
                  {testimony.photo && (
                    <div className="mb-2">
                      <img
                        src={testimony.photo.getDirectURL()}
                        alt="Testimony photo"
                        className="max-w-xs rounded-md"
                      />
                    </div>
                  )}
                  {testimony.video && (
                    <div className="mb-2">
                      <video
                        src={testimony.video.getDirectURL()}
                        controls
                        className="max-w-xs rounded-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Approved Testimonies ({approvedTestimonies.length})
        </h3>
        {approvedTestimonies.length === 0 ? (
          <Card className="border-border/40">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No approved testimonies</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedTestimonies.map((testimony) => (
              <Card key={Number(testimony.id)} className="border-border/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{testimony.author}</CardTitle>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                          Approved
                        </Badge>
                      </div>
                      {testimony.rating !== undefined && testimony.rating !== null && (
                        <StarRating rating={Number(testimony.rating)} />
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setTestimonyToRemove(testimony)}
                      disabled={removeTestimonyMutation.isPending}
                    >
                      {removeTestimonyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{testimony.content}</p>
                  {testimony.photo && (
                    <div className="mb-2">
                      <img
                        src={testimony.photo.getDirectURL()}
                        alt="Testimony photo"
                        className="max-w-xs rounded-md"
                      />
                    </div>
                  )}
                  {testimony.video && (
                    <div className="mb-2">
                      <video
                        src={testimony.video.getDirectURL()}
                        controls
                        className="max-w-xs rounded-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!testimonyToRemove} onOpenChange={(open) => !open && setTestimonyToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Testimony</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this testimony? This will hide it from public view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
