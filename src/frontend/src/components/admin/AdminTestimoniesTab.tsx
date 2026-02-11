import { useState } from 'react';
import { useListTestimonies, useApproveTestimony } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Search, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Testimony } from '../../backend';

export default function AdminTestimoniesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: testimonies = [], isLoading, error } = useListTestimonies();
  const approveMutation = useApproveTestimony();

  const handleApprove = async (id: bigint) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success('Testimony approved successfully');
    } catch (error: any) {
      console.error('Failed to approve testimony:', error);
      toast.error(error.message || 'Failed to approve testimony');
    }
  };

  const filteredTestimonies = testimonies.filter((testimony) => {
    const query = searchQuery.toLowerCase();
    return (
      testimony.author.toLowerCase().includes(query) ||
      testimony.content.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return <div className="p-6">Loading testimonies...</div>;
  }

  if (error) {
    return <div className="p-6 text-destructive">Error loading testimonies: {String(error)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Testimonies</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search testimonies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTestimonies.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No testimonies found
            </CardContent>
          </Card>
        ) : (
          filteredTestimonies.map((testimony) => (
            <Card key={testimony.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{testimony.author}</CardTitle>
                    {testimony.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">Rating: {testimony.rating.toString()}/5</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={testimony.approved ? 'default' : 'secondary'}>
                    {testimony.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{testimony.content}</p>

                {testimony.shortReview && (
                  <div className="text-sm text-muted-foreground italic">
                    Short review: {testimony.shortReview}
                  </div>
                )}

                {testimony.starRating && (
                  <div className="text-sm text-muted-foreground">
                    Star rating: {testimony.starRating}/5.0
                  </div>
                )}

                {/* Media indicators */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {testimony.photo && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>1 photo</span>
                    </div>
                  )}
                  {testimony.video && (
                    <div className="flex items-center gap-1">
                      <VideoIcon className="h-4 w-4" />
                      <span>1 video</span>
                    </div>
                  )}
                </div>

                {/* Media preview */}
                {(testimony.photo || testimony.video) && (
                  <div className="flex gap-2">
                    {testimony.photo && (
                      <img
                        src={testimony.photo.getDirectURL()}
                        alt="Testimony photo"
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    {testimony.video && (
                      <video
                        src={testimony.video.getDirectURL()}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                  </div>
                )}

                {!testimony.approved && (
                  <Button
                    onClick={() => handleApprove(testimony.id)}
                    disabled={approveMutation.isPending}
                    size="sm"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
