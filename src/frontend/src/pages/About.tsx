import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scroll, Users, Target } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import TeamSection from '../components/about/TeamSection';
import TimelineSection from '../components/about/TimelineSection';

export default function About() {
  return (
    <PageLayout
      title="About Arcane Artifacts"
      description="Discover our story, mission, and the dedicated team behind the world's premier mystical artifact collection."
    >
      {/* Mission Section */}
      <FadeInSection>
        <section className="section-spacing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/40 hover:border-arcane-gold/30 transition-all hover-lift">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                  <Scroll className="h-6 w-6 text-arcane-gold" />
                </div>
                <CardTitle>Our Story</CardTitle>
                <CardDescription>
                  Founded over two centuries ago, Arcane Artifacts began as a small guild of collectors dedicated to preserving mystical heritage. Today, we are the world's most trusted source for authentic magical artifacts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 hover:border-arcane-gold/30 transition-all hover-lift">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-arcane-gold" />
                </div>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>
                  We strive to connect collectors with authentic mystical artifacts while preserving the rich history and lore of each piece. Every transaction supports ongoing research and preservation efforts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 hover:border-arcane-gold/30 transition-all hover-lift">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-arcane-gold" />
                </div>
                <CardTitle>Our Community</CardTitle>
                <CardDescription>
                  Join thousands of collectors, scholars, and enthusiasts who share a passion for the mystical and the extraordinary. Together, we preserve the magic of the past for future generations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </FadeInSection>

      {/* Values Section */}
      <FadeInSection delay={100}>
        <section className="section-spacing">
          <h2 className="section-title">Our Values</h2>
          <Card className="border-border/40">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-arcane-gold">Authenticity</h3>
                  <p className="text-muted-foreground">
                    Every artifact undergoes rigorous authentication by our team of experts. We guarantee the provenance and magical integrity of each item in our collection.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-arcane-gold">Preservation</h3>
                  <p className="text-muted-foreground">
                    We are committed to preserving mystical heritage for future generations through proper care, documentation, and ethical acquisition practices.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-arcane-gold">Education</h3>
                  <p className="text-muted-foreground">
                    We believe in sharing knowledge about the history, lore, and significance of mystical artifacts with collectors and the broader community.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-arcane-gold">Innovation</h3>
                  <p className="text-muted-foreground">
                    By leveraging blockchain technology, we bring transparency and security to the artifact market while honoring traditional practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>

      {/* Timeline */}
      <FadeInSection delay={200}>
        <TimelineSection />
      </FadeInSection>

      {/* Team */}
      <FadeInSection delay={300}>
        <TeamSection />
      </FadeInSection>
    </PageLayout>
  );
}
