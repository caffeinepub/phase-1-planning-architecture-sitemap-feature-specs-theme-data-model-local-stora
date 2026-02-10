import { useState } from 'react';
import { useListTestimonies } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import TestimonyMediaCard from '../components/testimonies/TestimonyMediaCard';
import CreateTestimonyDialog from '../components/testimonies/CreateTestimonyDialog';
import ErrorState from '../components/system/ErrorState';

export default function Testimonies() {
  const { data: testimonies = [], isLoading, error, refetch } = useListTestimonies();
  const { identity } = useInternetIdentity();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filter to only show approved testimonies
  const approvedTestimonies = testimonies.filter(t => t.approved);

  if (isLoading) {
    return (
      <PageLayout title="Customer Testimonies" description="See what our customers are saying">
        <FadeInSection>
          <section className="section-spacing">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Customer Testimonies" description="See what our customers are saying">
        <FadeInSection>
          <section className="section-spacing">
            <ErrorState
              title="Failed to load testimonies"
              onRetry={refetch}
            />
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Customer Testimonies"
      description="Real experiences from our valued customers"
    >
      <FadeInSection>
        <section className="section-spacing">
          {/* Call to Action Section */}
          <div className="mb-12 space-y-6">
            <Card className="bg-accent/20 border-arcane-gold/30">
              <CardContent className="p-8 text-center space-y-4">
                <MessageSquare className="h-12 w-12 mx-auto text-primary" />
                <h2 className="font-display text-2xl font-bold">Share Your Experience</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Have you worked with us? We'd love to hear about your experience! Share photos and videos of your projects.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  {identity ? (
                    <Button onClick={() => setShowCreateDialog(true)} size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit a Testimony
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please log in to submit a testimony
                    </p>
                  )}
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/submit-request">
                      Request Custom Work
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonies Grid */}
          {approvedTestimonies.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">
                  No testimonies yet. Be the first to share your experience!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {approvedTestimonies.map((testimony) => {
                const allMedia = [
                  ...testimony.photos.map(p => ({ ...p, isVideo: false })),
                  ...testimony.videos.map(v => ({ ...v, isVideo: true })),
                ];

                return allMedia.map((media, index) => (
                  <TestimonyMediaCard
                    key={`${testimony.id}-${index}`}
                    mediaUrl={media.blob.getDirectURL()}
                    description={media.description}
                    isVideo={media.isVideo}
                  />
                ));
              })}
            </div>
          )}
        </section>
      </FadeInSection>

      <CreateTestimonyDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </PageLayout>
  );
}
