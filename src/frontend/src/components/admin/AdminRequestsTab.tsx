import { useState } from 'react';
import { useListAllRequests, useGetRequestById } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Paperclip } from 'lucide-react';
import ErrorState from '../system/ErrorState';
import AdminRequestDetailModal from './AdminRequestDetailModal';

export default function AdminRequestsTab() {
  const { data: requests = [], isLoading, error, refetch } = useListAllRequests();
  const [selectedRequestId, setSelectedRequestId] = useState<bigint | null>(null);
  const { data: selectedRequest } = useGetRequestById(selectedRequestId);

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
    <>
      <div className="space-y-4">
        {requests.map((request) => {
          const pricingText = request.pricingPreference.__kind__ === 'flexible' 
            ? 'Flexible' 
            : request.pricingPreference.value;

          const statusVariant = 
            request.status.__kind__ === 'approved' ? 'default' :
            request.status.__kind__ === 'declined' ? 'destructive' :
            'outline';

          return (
            <Card key={request.id.toString()} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">Request #{request.id.toString()}</CardTitle>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{request.name}</span>
                      <span>•</span>
                      <span>{request.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={statusVariant}>{request.status.__kind__}</Badge>
                    <Badge variant="outline">{pricingText}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description:</p>
                  <p className="text-sm line-clamp-3">{request.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  {request.attachmentCount > 0n && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                      <span>{request.attachmentCount.toString()} attachment{request.attachmentCount > 1n ? 's' : ''}</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequestId(request.id)}
                    className="ml-auto"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AdminRequestDetailModal
        request={selectedRequest || null}
        open={!!selectedRequestId}
        onOpenChange={(open) => {
          if (!open) setSelectedRequestId(null);
        }}
      />
    </>
  );
}
