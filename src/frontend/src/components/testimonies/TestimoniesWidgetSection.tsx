import { Link } from '@tanstack/react-router';
import { useGetAllApprovedTestimonies } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import FadeInSection from '../effects/FadeInSection';
import StarRating from '../testimonies/StarRating';

export default function TestimoniesWidgetSection() {
  const { data: testimonies = [], isLoading } = useGetAllApprovedTestimonies();
  
  const previewTestimonies = testimonies.slice(0, 3);

  if (isLoading) {
    return null;
  }

  if (testimonies.length === 0) {
    return null;
  }

  return (
    <FadeInSection>
      <section className="section-spacing">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title text-left mb-2">Customer Testimonies</h2>
            <p className="text-muted-foreground max-w-2xl">
              Hear what our satisfied customers have to say
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {previewTestimonies.map((testimony) => (
            <Card
              key={Number(testimony.id)}
              className="border-border/40 hover:border-arcane-gold/30 transition-all hover-lift"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <MessageCircle className="h-5 w-5 text-arcane-gold flex-shrink-0" />
                  {testimony.rating !== undefined && testimony.rating !== null && (
                    <StarRating rating={Number(testimony.rating)} />
                  )}
                </div>
                <CardTitle className="text-lg">{testimony.author}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {testimony.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/testimonies">
            <Button size="lg" className="gap-2">
              Read All Testimonies
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </FadeInSection>
  );
}
