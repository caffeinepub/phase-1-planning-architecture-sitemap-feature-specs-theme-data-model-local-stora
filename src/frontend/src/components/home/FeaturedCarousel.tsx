import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface FeaturedItem {
  id: number;
  title: string;
  description: string;
  category: string;
  link: string;
}

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    title: 'The Crimson Codex',
    description: 'An ancient tome bound in dragon leather, containing spells of immense power.',
    category: 'Grimoire',
    link: '/shop',
  },
  {
    id: 2,
    title: 'Amulet of Eternal Flame',
    description: 'A mystical pendant that radiates warmth and protects against dark magic.',
    category: 'Jewelry',
    link: '/shop',
  },
  {
    id: 3,
    title: 'Staff of the Archmage',
    description: 'Carved from the heartwood of the World Tree, this staff amplifies magical abilities.',
    category: 'Weapon',
    link: '/shop',
  },
  {
    id: 4,
    title: 'Crystal of Foresight',
    description: 'A rare crystal that allows glimpses into possible futures.',
    category: 'Artifact',
    link: '/shop',
  },
];

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  const currentItem = featuredItems[currentIndex];

  return (
    <div className="relative">
      <Card className="border-arcane-gold/30 bg-card/80 backdrop-blur-sm overflow-hidden hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-arcane-gold uppercase tracking-wider">
              {currentItem.category}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="h-8 w-8 hover:bg-arcane-gold/10 hover:text-arcane-gold"
                aria-label="Previous item"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8 hover:bg-arcane-gold/10 hover:text-arcane-gold"
                aria-label="Next item"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl">{currentItem.title}</CardTitle>
          <CardDescription className="text-base">{currentItem.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Link to={currentItem.link}>
              <Button className="gap-2">
                View Details
              </Button>
            </Link>
            <div className="flex gap-2">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-arcane-gold'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to item ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
