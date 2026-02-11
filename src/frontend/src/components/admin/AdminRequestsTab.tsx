import { useState, useEffect } from 'react';
import { useListAllRequests, useGetRequestById } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Paperclip } from 'lucide-react';
import ErrorState from '../system/ErrorState';
import AdminRequestDetailModal from './AdminRequestDetailModal';
import type { RequestDetail } from '../../types/phase5b';

export default function AdminRequestsTab() {
  const { data: requests = [], isLoading, error, refetch } = useListAllRequests();
  const [selectedRequestId, setSelectedRequestId] = useState<bigint | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const getRequestDetail = useGetRequestById();

  // Fetch request detail when selectedRequestId changes
  useEffect(() => {
    if (selectedRequestId !== null) {
      getRequestDetail.mutateAsync(selectedRequestId)
        .then(detail => setSelectedRequest(detail))
        .catch(err => {
          console.error('Failed to fetch request detail:', err);
          setSelectedRequest(null);
        });
    } else {
      setSelectedRequest(null);
    }
  }, [selectedRequestId]);

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

          const attachmentCount = Number(request.attachmentCount);

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
              <CardContent className="space-y-3">
                <p className="text-sm line-clamp-2">{request.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {attachmentCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>{attachmentCount} attachment{attachmentCount !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRequestId(request.id)}
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
        request={selectedRequest}
        open={selectedRequestId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRequestId(null);
            setSelectedRequest(null);
          }
        }}
      />
    </>
  );
}
