import { Link } from '@tanstack/react-router';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ServiceDetailsAccordion from '../components/services/ServiceDetailsAccordion';
import { Button } from '@/components/ui/button';

export default function Services() {
  return (
    <PageLayout
      title="Our Services"
      description="Expert services for collectors, from restoration and appraisal to protective enchantments and consultation."
    >
      <FadeInSection>
        <section className="section-spacing">
          <ServiceDetailsAccordion />
        </section>
      </FadeInSection>

      <FadeInSection delay={100}>
        <section className="section-spacing">
          <div className="bg-accent/20 border border-arcane-gold/30 rounded-lg p-8 text-center">
            <h2 className="font-display text-2xl font-bold mb-4">Need a Custom Service?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team can provide specialized services tailored to your unique needs. Submit a request to discuss your requirements and receive a personalized quote.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link to="/submit-request">
                  Submit a Request
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
