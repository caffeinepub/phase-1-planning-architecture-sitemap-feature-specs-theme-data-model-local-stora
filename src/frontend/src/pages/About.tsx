import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scroll, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About Arcane Artifacts
          </h1>
          <p className="text-lg text-muted-foreground">
            Preserving the mystical heritage of forgotten realms
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-8 border-border/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Scroll className="h-6 w-6 text-arcane-gold" />
              <CardTitle>Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground">
              Founded in the depths of ancient libraries and forgotten vaults, Arcane Artifacts 
              emerged from a passion for preserving the mystical heritage of bygone eras. Our 
              curators travel across realms, seeking out authentic relics and enchanted items 
              that carry the weight of history and the whisper of magic.
            </p>
            <p className="text-muted-foreground mt-4">
              Each artifact in our collection has been carefully authenticated and documented, 
              ensuring that collectors receive genuine pieces of arcane history. We believe 
              that these objects are more than mere curiosities—they are gateways to understanding 
              the mystical forces that shaped our world.
            </p>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6 text-arcane-gold" />
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To connect collectors with authentic arcane artifacts while preserving the 
                stories and knowledge embedded within each piece. We strive to make mystical 
                history accessible to all who seek it.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-arcane-gold" />
                <CardTitle>Our Community</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We've built a thriving community of collectors, scholars, and enthusiasts 
                who share a passion for the arcane. Together, we preserve and celebrate 
                the mystical heritage of forgotten realms.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-arcane-gold font-bold">•</span>
                <div>
                  <strong className="text-foreground">Authenticity:</strong>
                  <span className="text-muted-foreground ml-2">
                    Every artifact is verified and documented
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-arcane-gold font-bold">•</span>
                <div>
                  <strong className="text-foreground">Knowledge:</strong>
                  <span className="text-muted-foreground ml-2">
                    We share the lore and history behind each piece
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-arcane-gold font-bold">•</span>
                <div>
                  <strong className="text-foreground">Community:</strong>
                  <span className="text-muted-foreground ml-2">
                    Building connections among collectors and enthusiasts
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-arcane-gold font-bold">•</span>
                <div>
                  <strong className="text-foreground">Innovation:</strong>
                  <span className="text-muted-foreground ml-2">
                    Leveraging blockchain technology for secure, decentralized transactions
                  </span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
