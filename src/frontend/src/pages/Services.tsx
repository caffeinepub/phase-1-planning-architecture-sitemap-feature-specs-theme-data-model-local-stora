import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Search, Shield, BookOpen, Sparkles } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Search,
      title: 'Artifact Authentication',
      description: 'Expert verification and documentation of arcane items to ensure authenticity and provenance.',
      features: ['Historical research', 'Magical signature analysis', 'Certificate of authenticity'],
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Protected vaults for your most precious artifacts with enchanted security measures.',
      features: ['Climate-controlled environment', 'Magical wards', 'Insurance coverage'],
    },
    {
      icon: BookOpen,
      title: 'Lore Consultation',
      description: 'Deep dive into the history and magical properties of your artifacts with our scholars.',
      features: ['Historical context', 'Usage guidance', 'Power assessment'],
    },
    {
      icon: Sparkles,
      title: 'Restoration Services',
      description: 'Careful restoration of damaged artifacts while preserving their magical essence.',
      features: ['Non-invasive techniques', 'Magical preservation', 'Documentation of process'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive support for collectors and enthusiasts of arcane artifacts
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-border/40 hover:border-arcane-gold/50 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-arcane-gold" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-arcane-gold">✦</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="border-arcane-gold/30 bg-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Interested in Our Services?</CardTitle>
            <CardDescription>
              Contact us to discuss how we can assist with your artifact needs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/contact">
              <Button size="lg">Get in Touch</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
