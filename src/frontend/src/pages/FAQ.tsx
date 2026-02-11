import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import FAQIntro from '../components/intro/FAQIntro';

const faqs = [
  {
    id: 'what-is',
    category: 'General',
    question: 'What is Arcane Artifacts?',
    answer: 'Arcane Artifacts is a premier marketplace for authentic mystical artifacts, enchanted items, and rare relics. We connect collectors with genuine magical items while preserving their history and lore.',
  },
  {
    id: 'authentication',
    category: 'Products',
    question: 'How do you authenticate artifacts?',
    answer: 'Every artifact undergoes rigorous examination by our team of certified experts. We verify historical provenance, analyze magical signatures, and conduct physical inspections. Each authenticated item comes with a certificate of authenticity.',
  },
  {
    id: 'shipping',
    category: 'Orders',
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days. Expedited options are available for most items. Due to the mystical nature of our artifacts, some items may require special handling and additional time.',
  },
  {
    id: 'returns',
    category: 'Orders',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Artifacts must be returned in their original condition with all documentation. Some rare or custom items may have different return terms.',
  },
  {
    id: 'care',
    category: 'Products',
    question: 'How should I care for my artifacts?',
    answer: 'Each artifact comes with specific care instructions. Generally, keep items away from direct sunlight, extreme temperatures, and moisture. We recommend annual maintenance checks for enchanted items.',
  },
  {
    id: 'payment',
    category: 'Orders',
    question: 'What payment methods do you accept?',
    answer: 'We accept ICP (Internet Computer Protocol) tokens for all transactions. This ensures secure, decentralized payments on the blockchain.',
  },
  {
    id: 'restoration',
    category: 'Services',
    question: 'Do you offer restoration services?',
    answer: 'Yes! Our master craftsmen specialize in artifact restoration, including enchantment renewal, physical repair, and protective sealing. Visit our Services page for more information.',
  },
  {
    id: 'appraisal',
    category: 'Services',
    question: 'Can you appraise my artifacts?',
    answer: 'Absolutely. We provide professional appraisal services including historical research, magical potency assessment, and market value estimation. Each appraisal includes a certificate of authenticity.',
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <PageLayout
      title="Frequently Asked Questions"
      description="Find answers to common questions about our artifacts, services, and policies."
    >
      {/* Mystical Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <FAQIntro />
        </section>
      </FadeInSection>

      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ Accordion */}
          {categories.map((category) => {
            const categoryFaqs = filteredFaqs.filter((faq) => faq.category === category);
            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-display font-bold mb-4 text-arcane-gold">
                  {category}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {categoryFaqs.map((faq) => (
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
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No questions match your search.
            </div>
          )}
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
