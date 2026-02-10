import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Wrench, Search, Shield, Sparkles } from 'lucide-react';

const services = [
  {
    id: 'restoration',
    icon: Wrench,
    title: 'Artifact Restoration',
    summary: 'Expert restoration services for damaged or deteriorated mystical items.',
    details: 'Our master craftsmen specialize in restoring artifacts to their original condition. We use traditional techniques combined with modern preservation methods to ensure your items retain their magical properties while being structurally sound. Services include enchantment renewal, physical repair, and protective sealing.',
    features: [
      'Enchantment renewal and stabilization',
      'Physical damage repair',
      'Protective coating application',
      'Authenticity preservation',
    ],
  },
  {
    id: 'appraisal',
    icon: Search,
    title: 'Professional Appraisal',
    summary: 'Comprehensive evaluation and authentication of mystical artifacts.',
    details: 'Our certified appraisers provide detailed assessments of your artifacts, including historical provenance, magical potency, and market value. Each appraisal includes a certificate of authenticity and a comprehensive report documenting the item\'s characteristics and significance.',
    features: [
      'Historical provenance research',
      'Magical potency assessment',
      'Market value estimation',
      'Certificate of authenticity',
    ],
  },
  {
    id: 'protection',
    icon: Shield,
    title: 'Protective Enchantments',
    summary: 'Safeguard your collection with powerful protective spells.',
    details: 'We offer a range of protective enchantments to keep your artifacts safe from theft, damage, and magical interference. Our enchantments are customized to each item and can be renewed annually to maintain maximum effectiveness.',
    features: [
      'Anti-theft wards',
      'Damage prevention spells',
      'Environmental protection',
      'Annual renewal service',
    ],
  },
  {
    id: 'consultation',
    icon: Sparkles,
    title: 'Collector Consultation',
    summary: 'Expert guidance for building and maintaining your collection.',
    details: 'Whether you\'re a new collector or a seasoned enthusiast, our consultants provide personalized advice on acquisition strategies, collection management, and investment opportunities. We help you make informed decisions and avoid common pitfalls in the artifact market.',
    features: [
      'Personalized acquisition strategies',
      'Collection management advice',
      'Market trend analysis',
      'Investment guidance',
    ],
  },
];

export default function ServiceDetailsAccordion() {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <AccordionItem
            key={service.id}
            value={service.id}
            className="border border-border/40 rounded-lg overflow-hidden hover:border-arcane-gold/30 transition-all"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/50">
              <div className="flex items-center gap-4 text-left">
                <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-arcane-gold" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.summary}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="border-0 bg-accent/20 p-4">
                <p className="text-muted-foreground mb-4">{service.details}</p>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-arcane-gold flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
