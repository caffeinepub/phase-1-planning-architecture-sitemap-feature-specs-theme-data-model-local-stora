import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Star } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import CreateTestimonyDialog from '../components/testimonies/CreateTestimonyDialog';
import TestimonyMediaCard from '../components/testimonies/TestimonyMediaCard';
import { useListTestimonies } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Testimony } from '../backend';

export default function Testimonies() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: testimonies = [], isLoading, error } = useListTestimonies();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <PageLayout
      title="Customer Testimonies"
      description="Read what our customers have to say about their experience with Arcane Artifacts"
    >
      <FadeInSection>
        <div className="section-spacing space-y-8">
          {/* Header with CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-cinzel font-bold mb-2">Customer Testimonies</h1>
              <p className="text-muted-foreground">
                Hear from our satisfied customers about their mystical experiences
              </p>
            </div>
            {isAuthenticated && (
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Share Your Story
              </Button>
            )}
          </div>

          {/* Testimonies Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading testimonies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load testimonies</p>
            </div>
          ) : testimonies.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Testimonies Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your experience with Arcane Artifacts
                </p>
                {isAuthenticated && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    Share Your Story
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonies.map((testimony) => {
                return (
                  <Card key={testimony.id.toString()} className="overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{testimony.author}</h3>
                          {testimony.starRating && renderStars(testimony.starRating)}
                        </div>
                        {!testimony.approved && (
                          <Badge variant="secondary" className="text-xs">
                            Awaiting Admin Verification
                          </Badge>
                        )}
                      </div>

                      {/* Short Review */}
                      {testimony.shortReview && (
                        <p className="text-sm font-medium italic text-muted-foreground">
                          "{testimony.shortReview}"
                        </p>
                      )}

                      {/* Full Content */}
                      <p className="text-sm leading-relaxed">{testimony.content}</p>

                      {/* Media Gallery */}
                      {(testimony.photo || testimony.video) && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {testimony.photo && (
                            <TestimonyMediaCard
                              mediaUrl={testimony.photo.getDirectURL()}
                              description={testimony.content}
                              isVideo={false}
                            />
                          )}
                          {testimony.video && (
                            <TestimonyMediaCard
                              mediaUrl={testimony.video.getDirectURL()}
                              description={testimony.content}
                              isVideo={true}
                            />
                          )}
                        </div>
                      )}

                      {/* Rating Badge */}
                      {testimony.rating && (
                        <Badge variant="outline" className="text-xs">
                          Rating: {testimony.rating.toString()}/5
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Login CTA for guests */}
          {!isAuthenticated && (
            <Card className="bg-accent/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Want to share your experience?</h3>
                <p className="text-muted-foreground mb-4">
                  Log in to submit your testimony and help others discover the magic of Arcane Artifacts
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </FadeInSection>

      {/* Create Testimony Dialog */}
      <CreateTestimonyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </PageLayout>
  );
}
