import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const milestones = [
  {
    year: '1823',
    title: 'Foundation',
    description: 'Arcane Artifacts was established by a guild of master collectors seeking to preserve mystical heritage.',
  },
  {
    year: '1901',
    title: 'Global Expansion',
    description: 'Opened branches across major cities, becoming the premier destination for rare artifacts.',
  },
  {
    year: '1987',
    title: 'Digital Archives',
    description: 'Pioneered the digitization of artifact records, creating the most comprehensive database in existence.',
  },
  {
    year: '2024',
    title: 'Blockchain Integration',
    description: 'Launched on the Internet Computer, bringing decentralized security to artifact authentication.',
  },
];

export default function TimelineSection() {
  return (
    <section className="py-12">
      <h2 className="section-title">Our Journey</h2>
      <p className="section-description">
        Over two centuries of dedication to preserving and sharing the world's mystical heritage.
      </p>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-arcane-gold/50 via-arcane-gold/30 to-transparent hidden md:block" />
        
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative flex gap-6 items-start">
              {/* Timeline dot */}
              <div className="hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-arcane-gold/10 border-2 border-arcane-gold/50 flex-shrink-0">
                <Sparkles className="h-6 w-6 text-arcane-gold" />
              </div>
              
              <Card className="flex-1 border-border/40 hover:border-arcane-gold/30 transition-all hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-display font-bold text-arcane-gold">
                      {milestone.year}
                    </span>
                  </div>
                  <CardTitle>{milestone.title}</CardTitle>
                  <CardDescription>{milestone.description}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
