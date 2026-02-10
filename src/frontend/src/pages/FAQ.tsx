import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: 'How do I authenticate an artifact?',
      answer: 'All artifacts in our shop come with certificates of authenticity. For external items, we offer authentication services through our Services page.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept payments in cycles through the Internet Computer network. Traditional payment methods will be added in future updates.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary depending on the artifact and your location. Mystical items require special handling and typically take 7-14 business days.',
    },
    {
      question: 'Can I return an artifact?',
      answer: 'Due to the unique nature of arcane artifacts, returns are evaluated on a case-by-case basis. Please contact us within 7 days of receipt.',
    },
    {
      question: 'How do I care for my artifacts?',
      answer: 'Each artifact comes with specific care instructions. Generally, keep them away from direct sunlight, moisture, and mundane electronics.',
    },
    {
      question: 'Do you offer appraisals?',
      answer: 'Yes! Our expert scholars can appraise your artifacts. Visit our Services page to learn more about our consultation offerings.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our artifacts and services
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>
              Click on a question to see the answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="mt-8 border-arcane-gold/30 bg-accent/20">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <p className="text-sm text-muted-foreground">
              Feel free to <a href="/contact" className="text-arcane-gold hover:underline">contact us</a> directly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
