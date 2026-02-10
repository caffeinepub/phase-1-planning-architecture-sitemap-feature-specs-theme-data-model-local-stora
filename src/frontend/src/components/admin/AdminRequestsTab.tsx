import { useListRequests } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import ErrorState from '../system/ErrorState';

export default function AdminRequestsTab() {
  const { data: requests = [], isLoading, error, refetch } = useListRequests();

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
    return <ErrorState title="Failed to load requests" onRetry={refetch} />;
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No requests submitted yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const photoCount = request.media.filter(m => m.mediaType === 'photo').length;
        const videoCount = request.media.filter(m => m.mediaType === 'video').length;
        const pricingText = request.pricingPreference.__kind__ === 'flexible' 
          ? 'Flexible' 
          : request.pricingPreference.value;

        return (
          <Card key={request.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Request #{request.id.toString()}</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{request.name}</span>
                    <span>•</span>
                    <span>{request.email}</span>
                  </div>
                </div>
                <Badge variant="outline">{pricingText}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description:</p>
                <p className="text-sm line-clamp-3">{request.description}</p>
              </div>

              {request.media.length > 0 && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {photoCount > 0 && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>{photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {videoCount > 0 && (
                    <div className="flex items-center gap-1">
                      <VideoIcon className="h-4 w-4" />
                      <span>{videoCount} video{videoCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Submitted by: {request.submittedBy.toString()}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
