import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import TestimoniesIntro from '../components/intro/TestimoniesIntro';

// TODO: Backend methods not yet implemented
// import { useListTestimonies } from '../hooks/useQueries';

export default function Testimonies() {
  return (
    <PageLayout
      title="Testimonies"
      description="What our customers say"
    >
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <TestimoniesIntro />
        </section>
      </FadeInSection>

      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Customer Testimonies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  This feature requires backend implementation. Coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
