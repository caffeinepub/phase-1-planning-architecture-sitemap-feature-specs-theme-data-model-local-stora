import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days. Expedited options are available for most items. Due to the mystical nature of our artifacts, some items may require special handling and additional time.',
  },
  {
    id: 'authenticity',
    question: 'How do you verify artifact authenticity?',
    answer: 'Every artifact undergoes rigorous authentication by our team of experts. We examine historical provenance, magical signatures, and physical characteristics. Each verified item comes with a certificate of authenticity.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Artifacts must be returned in their original condition with all documentation. Some rare or custom items may have different return terms, which will be clearly stated at the time of purchase.',
  },
  {
    id: 'care',
    question: 'How should I care for my artifacts?',
    answer: 'Each artifact comes with specific care instructions. Generally, keep items away from direct sunlight, extreme temperatures, and moisture. We recommend annual maintenance checks for enchanted items to ensure their magical properties remain stable.',
  },
];

export default function ContactPageFAQ() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Quick answers to common questions about our artifacts and services.
        </p>
      </div>
      
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border border-border/40 rounded-lg px-6 hover:border-arcane-gold/30 transition-all"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-semibold">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
