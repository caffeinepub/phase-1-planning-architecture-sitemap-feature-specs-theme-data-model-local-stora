import { useRandomQuotes } from '@/hooks/useRandomQuotes';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';

/**
 * Displays 2-3 random quotes in an unobtrusive pull-quote style
 * Quotes change on each page navigation
 */
export default function RandomQuotes() {
  const quotes = useRandomQuotes(3);

  if (quotes.length === 0) return null;

  return (
    <div className="quotes-container">
      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          <Card 
            key={`${quote}-${index}`} 
            className="quote-card"
          >
            <div className="flex gap-3 items-start">
              <Quote className="h-5 w-5 text-primary/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm md:text-base text-foreground/90 italic leading-relaxed">
                {quote}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
