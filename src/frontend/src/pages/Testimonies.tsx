import { useState } from 'react';
import { useGetAllApprovedTestimonies } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ErrorState from '../components/system/ErrorState';
import StarRating from '../components/testimonies/StarRating';
import CreateTestimonyDialog from '../components/testimonies/CreateTestimonyDialog';

export default function TestimoniesPage() {
  const { data: testimonies = [], isLoading, error, refetch } = useGetAllApprovedTestimonies();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  if (error) {
    return (
      <PageLayout title="Testimonies" description="What our customers say">
        <ErrorState
          title="Failed to load testimonies"
          description={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Customer Testimonies"
      description="Hear from our satisfied customers and their experiences"
    >
      <FadeInSection>
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            {testimonies.length} {testimonies.length === 1 ? 'testimony' : 'testimonies'}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Testimony
          </Button>
        </div>
      </FadeInSection>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : testimonies.length === 0 ? (
        <FadeInSection>
          <Card className="border-border/40">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No testimonies available yet.</p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Be the First to Share
              </Button>
            </CardContent>
          </Card>
        </FadeInSection>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            {testimonies.map((testimony, index) => (
              <FadeInSection key={Number(testimony.id)} delay={index * 50}>
                <Card className="border-border/40 hover:border-arcane-gold/30 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg">{testimony.author}</CardTitle>
                      {testimony.rating !== undefined && testimony.rating !== null && (
                        <StarRating rating={Number(testimony.rating)} />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">{testimony.content}</p>
                    {testimony.photo && (
                      <div className="mb-2">
                        <img
                          src={testimony.photo.getDirectURL()}
                          alt="Customer photo"
                          className="max-w-md rounded-md"
                        />
                      </div>
                    )}
                    {testimony.video && (
                      <div className="mb-2">
                        <video
                          src={testimony.video.getDirectURL()}
                          controls
                          className="max-w-md rounded-md"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </ScrollArea>
      )}

      <CreateTestimonyDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </PageLayout>
  );
}
