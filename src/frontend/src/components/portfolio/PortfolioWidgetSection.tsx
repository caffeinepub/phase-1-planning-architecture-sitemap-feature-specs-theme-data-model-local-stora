import { Link } from '@tanstack/react-router';
import { useGetAllPortfolios } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FolderOpen } from 'lucide-react';
import FadeInSection from '../effects/FadeInSection';
import type { PortfolioCategory } from '../../backend';

export default function PortfolioWidgetSection() {
  const { data: portfolios = [], isLoading } = useGetAllPortfolios();
  
  const previewPortfolios = portfolios.slice(0, 3);

  const getCategoryLabel = (category: PortfolioCategory): string => {
    switch (category.__kind__) {
      case 'painting':
        return 'Painting';
      case 'digitalArt':
        return 'Digital Art';
      case 'sculpture':
        return 'Sculpture';
      case 'photography':
        return 'Photography';
      case 'illustration':
        return 'Illustration';
      case 'typography':
        return 'Typography';
      case 'other':
        return category.other || 'Other';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return null;
  }

  if (portfolios.length === 0) {
    return null;
  }

  return (
    <FadeInSection>
      <section className="section-spacing">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title text-left mb-2">Our Portfolio</h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore our gallery of completed projects and creative works
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {previewPortfolios.map((portfolio) => (
            <Card
              key={Number(portfolio.id)}
              className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <FolderOpen className="h-5 w-5 text-arcane-gold flex-shrink-0" />
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(portfolio.category)}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {portfolio.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {portfolio.artworks.length} {portfolio.artworks.length === 1 ? 'artwork' : 'artworks'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/portfolio">
            <Button size="lg" className="gap-2">
              View Full Portfolio
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </FadeInSection>
  );
}
