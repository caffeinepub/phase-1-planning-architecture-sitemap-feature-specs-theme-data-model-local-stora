import { useState } from 'react';
import { useListRequests, useGetRequestDetail } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Search, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import ErrorState from '../system/ErrorState';
import AdminRequestDetailModal from './AdminRequestDetailModal';
import type { RequestDetail } from '../../types/phase5b';

export default function AdminRequestsTab() {
  const { data: requests = [], isLoading, error, refetch } = useListRequests();
  const getRequestDetail = useGetRequestDetail();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filteredRequests = requests.filter((req) =>
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = async (requestId: bigint) => {
    setLoadingDetail(true);
    try {
      const detail = await getRequestDetail.mutateAsync(requestId);
      setSelectedRequest(detail);
      setDetailModalOpen(true);
    } catch (error: any) {
      console.error('Failed to load request details:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusLabel = (status: any): string => {
    if (typeof status === 'object' && status.__kind__) {
      return status.__kind__;
    }
    return String(status);
  };

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

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No requests match your search' : 'No custom requests submitted yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredRequests.map((request) => (
          <Card key={request.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">Request #{request.id.toString()}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {request.name} ({request.email})
                  </p>
                </div>
                <Badge variant={getStatusLabel(request.status) === 'approved' ? 'default' : getStatusLabel(request.status) === 'declined' ? 'destructive' : 'secondary'}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm line-clamp-2">{request.description}</p>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>Pricing: {typeof request.pricingPreference === 'object' && request.pricingPreference.__kind__ === 'flexible' ? 'Flexible' : 'Range'}</span>
                </div>
                {request.attachmentCount > 0n && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{request.attachmentCount.toString()} attachment{request.attachmentCount !== 1n ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleViewDetails(request.id)}
                disabled={loadingDetail}
                variant="outline"
                size="sm"
              >
                {loadingDetail ? 'Loading...' : 'View Details'}
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <AdminRequestDetailModal
        request={selectedRequest}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        isLoading={loadingDetail}
      />
    </div>
  );
}
