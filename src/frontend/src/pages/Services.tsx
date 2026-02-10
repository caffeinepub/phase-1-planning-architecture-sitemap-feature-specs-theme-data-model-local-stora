import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ServiceDetailsAccordion from '../components/services/ServiceDetailsAccordion';
import PortfolioWidgetSection from '../components/portfolio/PortfolioWidgetSection';
import TestimoniesWidgetSection from '../components/testimonies/TestimoniesWidgetSection';

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

      {/* Portfolio Widget */}
      <PortfolioWidgetSection />

      {/* Testimonies Widget */}
      <TestimoniesWidgetSection />

      <FadeInSection delay={100}>
        <section className="section-spacing">
          <div className="bg-accent/20 border border-arcane-gold/30 rounded-lg p-8 text-center">
            <h2 className="font-display text-2xl font-bold mb-4">Need a Custom Service?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team can provide specialized services tailored to your unique needs. Contact us to discuss your requirements and receive a personalized quote.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
            >
              Contact Us
            </a>
          </div>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
