import { useListTestimonies } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import ErrorState from '../system/ErrorState';

export default function AdminTestimoniesTab() {
  const { data: testimonies = [], isLoading, error, refetch } = useListTestimonies();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load testimonies" onRetry={refetch} />;
  }

  if (testimonies.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No testimonies submitted yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {testimonies.map((testimony) => (
        <Card key={testimony.id.toString()}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">Testimony #{testimony.id.toString()}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Submitted by: {testimony.submittedBy.toString()}
                </p>
              </div>
              <Badge variant={testimony.approved ? 'default' : 'secondary'}>
                {testimony.approved ? 'Approved' : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 text-sm text-muted-foreground">
              {testimony.photos.length > 0 && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>{testimony.photos.length} photo{testimony.photos.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {testimony.videos.length > 0 && (
                <div className="flex items-center gap-1">
                  <VideoIcon className="h-4 w-4" />
                  <span>{testimony.videos.length} video{testimony.videos.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Preview first media item */}
            {(testimony.photos.length > 0 || testimony.videos.length > 0) && (
              <div className="grid grid-cols-3 gap-2">
                {testimony.photos.slice(0, 3).map((photo, index) => (
                  <img
                    key={`photo-${index}`}
                    src={photo.blob.getDirectURL()}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
                {testimony.videos.slice(0, 3 - testimony.photos.length).map((video, index) => (
                  <video
                    key={`video-${index}`}
                    src={video.blob.getDirectURL()}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
