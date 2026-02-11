import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, Target } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import AboutIntro from '../components/intro/AboutIntro';

export default function About() {
  return (
    <PageLayout
      title="About The Creator of Side Quests"
      description="Forged from curiosity, chaos, and quiet magic. Discover the story, mission, and vision behind The Creator of Side Quests."
    >
      {/* Mystical Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <AboutIntro />
        </section>
      </FadeInSection>

      {/* Creator Bio Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-white/80 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold break-words">
                    About the Creator of Side Quests
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-4 sm:space-y-6 text-foreground/90">
                  <p className="text-base sm:text-lg font-semibold text-primary break-words">
                    Forged from curiosity, chaos, and quiet magic.
                  </p>
                  
                  <p className="break-words overflow-wrap-anywhere">
                    I am Joseph Fitchpatrick—Joe in the waking world, Willow in the digital wilds—a multi-disciplinary creator, writer, organizer, and builder of curious things. My path has never followed a straight road; instead, it winds through art, digital craft, storytelling, and hands-on creation, gathering knowledge like lanterns along the way. From these collected sparks, I shape ideas into works that are both functional and enchanted.
                  </p>
                  
                  <p className="break-words overflow-wrap-anywhere">
                    What began as experiments, hobbies, and late-night bursts of inspiration slowly transformed into a calling. Guided by ADHD momentum, OCD precision, and the expansive perspective of autistic creativity, my work thrives where structure meets beautiful chaos. My mind moves like a constellation rather than a line—and every project I touch carries that same layered brilliance. Each "side quest" is approached with patience, intention, and a deep respect for the magic hidden in small details.
                  </p>
                  
                  <p className="break-words overflow-wrap-anywhere">
                    My focus lies in creative problem-solving, digital-first services, custom small-batch creations, and workflows designed to empower minds that think differently. I believe creativity should feel welcoming, ethical, and human—never locked behind gates or complicated rituals. Whether crafting a digital design, building a handmade piece, organizing a system from disorder, or bringing an unusual idea to life, I approach every endeavor with empathy, energy, and care.
                  </p>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground break-words overflow-wrap-anywhere">
                    I do not claim professional licensing in regulated fields. All offerings remain within legal, unregulated creative services in Kentucky, with the exception of my CNA work, which is fully licensed and regulated.
                  </p>
                  
                  <p className="text-base sm:text-lg font-semibold text-primary break-words overflow-wrap-anywhere">
                    Side quests are always open; main quests are optional. Bring your strange ideas, your half-formed dreams, your impossible-sounding concepts. If you can imagine it, I will do everything within my power to help bring it into the world—one spark of magic at a time. 🌙✨
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>

      {/* Mission & Vision Cards */}
      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/40 hover:border-primary/30 transition-all hover-lift">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">Mission Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed break-words">
                    The Creator of Side Quests exists to transform messy ideas, odd jobs, and creative sparks into meaningful, tangible results. We provide accessible, flexible, and human-centered services that blend hands-on craftsmanship, digital expertise, and organizational wizardry. Our goal is to empower individuals, creators, and small businesses to see their visions brought to life with care, curiosity, and a touch of chaos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 hover:border-primary/30 transition-all hover-lift">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">Vision Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed break-words">
                    To be the go-to creative hub where imagination meets action, where every dream—no matter how unusual or complex—can be realized. We envision a world where creativity is inclusive, playful, ethical, and full of possibility; a space where neurodivergent thinking, obsessive attention to detail, and diverse perspectives fuel innovation and inspiration for all.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Values Section */}
      <FadeInSection delay={200}>
        <section className="section-spacing px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Core Values</h2>
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-display font-semibold text-base sm:text-lg mb-2 text-primary">Accessibility</h3>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">
                      Creativity should be accessible to everyone. We break down barriers and make creative services approachable, human, and never gatekept.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base sm:text-lg mb-2 text-primary">Neurodivergent Excellence</h3>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">
                      ADHD energy, OCD precision, and autistic creativity aren't limitations—they're superpowers that fuel innovation and unique perspectives.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base sm:text-lg mb-2 text-primary">Ethical Practice</h3>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">
                      We operate with transparency, honesty, and respect. No hidden fees, no gatekeeping, no exploitation—just fair, human-centered service.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base sm:text-lg mb-2 text-primary">Creative Freedom</h3>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">
                      Every project is unique. We embrace the weird, the wonderful, and the wildly ambitious without judgment or limitation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
