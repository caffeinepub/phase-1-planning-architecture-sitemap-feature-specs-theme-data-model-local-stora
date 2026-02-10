import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, Target } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';

export default function About() {
  return (
    <PageLayout
      title="About The Creator of Side Quests"
      description="Built from curiosity, chaos, and creativity. Discover the story, mission, and vision behind The Creator of Side Quests."
    >
      {/* Intro Section */}
      <FadeInSection>
        <section className="section-spacing">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">Built from curiosity, chaos, and creativity ✨</h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
              <p>
                I'm Joseph Fitchpatrick—most call me Joe in real life, and I go by Willow online. I'm a multi-disciplinary creative, writer, organizer, and content creator with years of hands-on experience across art, digital media, and practical craftsmanship. I specialize in turning chaotic energy, obsessive focus, and hyperfixations into tangible results that are as beautiful as they are functional.
              </p>
              
              <p>
                What started as hobbies, experiments, and curiosity has grown into a dream job fueled by ADHD energy, OCD attention to detail, and autistic neurodivergent creativity. My brain doesn't move in straight lines, and neither does my work—but that's exactly how I bring something special to every project. Every side quest I take on is approached with patience, passion, and integrity.
              </p>
              
              <p>
                I focus on creative problem-solving, digital-first services, custom small-batch projects, and ADHD-friendly workflows. I believe creativity should be accessible, ethical, and human—not intimidating or gatekept. Whether it's a digital design, handmade craft, organizational system, or a one-of-a-kind idea, I approach every task with empathy, energy, and care.
              </p>
              
              <p className="text-sm text-muted-foreground">
                I do not claim professional licensing in regulated fields. Everything offered falls within legal, unregulated creative services in Kentucky, with the exception of my CNA work, which is licensed and regulated.
              </p>
              
              <p className="text-lg font-semibold text-primary">
                Side quests accepted, main quests optional. Your ideas are welcome here, no matter how chaotic or magical they may be. If you can dream it, I'll do my best to make it real. 🌪️💜
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Mission & Vision Cards */}
      <FadeInSection delay={100}>
        <section className="section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/40 hover:border-primary/30 transition-all hover-lift">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Mission Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">
                  The Creator of Side Quests exists to transform messy ideas, odd jobs, and creative sparks into meaningful, tangible results. We provide accessible, flexible, and human-centered services that blend hands-on craftsmanship, digital expertise, and organizational wizardry. Our goal is to empower individuals, creators, and small businesses to see their visions brought to life with care, curiosity, and a touch of chaos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:border-primary/30 transition-all hover-lift">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Vision Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">
                  To be the go-to creative hub where imagination meets action, where every dream—no matter how unusual or complex—can be realized. We envision a world where creativity is inclusive, playful, ethical, and full of possibility; a space where neurodivergent thinking, obsessive attention to detail, and diverse perspectives fuel innovation and inspiration for all.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>

      {/* Values Section */}
      <FadeInSection delay={200}>
        <section className="section-spacing">
          <h2 className="section-title">Core Values</h2>
          <Card className="border-border/40">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-primary">Accessibility</h3>
                  <p className="text-muted-foreground">
                    Creativity should be accessible to everyone. We break down barriers and make creative services approachable, human, and never gatekept.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-primary">Neurodivergent Excellence</h3>
                  <p className="text-muted-foreground">
                    ADHD energy, OCD precision, and autistic creativity aren't limitations—they're superpowers that fuel innovation and unique perspectives.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-primary">Empathy & Care</h3>
                  <p className="text-muted-foreground">
                    Every project is approached with patience, understanding, and genuine care for the people and ideas behind it.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-primary">Ethical Creativity</h3>
                  <p className="text-muted-foreground">
                    We believe in honest, transparent, and ethical creative work that respects boundaries, licenses, and human dignity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
