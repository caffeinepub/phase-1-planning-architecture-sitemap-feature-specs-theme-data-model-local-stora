import { useState } from 'react';
import { useGetAllPortfolios, useGetPortfolioCategories, useGetCategoryName } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ErrorState from '../components/system/ErrorState';
import PortfolioDetailsModal from '../components/portfolio/PortfolioDetailsModal';
import type { Portfolio, PortfolioCategory } from '../backend';

export default function PortfolioPage() {
  const { data: portfolios = [], isLoading, error, refetch } = useGetAllPortfolios();
  const { data: categories = [] } = useGetPortfolioCategories();
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPortfolios = selectedCategory
    ? portfolios.filter((p) => {
        if (selectedCategory.__kind__ === 'other') {
          return p.category.__kind__ === 'other';
        }
        return p.category.__kind__ === selectedCategory.__kind__;
      })
    : portfolios;

  const handlePortfolioClick = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedPortfolio(null), 150);
    }
  };

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

  if (error) {
    return (
      <PageLayout title="Portfolio" description="Explore our completed projects">
        <ErrorState
          title="Failed to load portfolio"
          description={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Portfolio"
      description="Explore our gallery of completed projects and creative works"
    >
      {/* Category Filters */}
      <FadeInSection>
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            All
          </Button>
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={
                selectedCategory && selectedCategory.__kind__ === category.__kind__
                  ? 'default'
                  : 'outline'
              }
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>
      </FadeInSection>

      {/* Portfolio Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <FadeInSection>
          <Card className="border-border/40">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {selectedCategory
                  ? `No portfolio items in the ${getCategoryLabel(selectedCategory)} category.`
                  : 'No portfolio items available.'}
              </p>
            </CardContent>
          </Card>
        </FadeInSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio, index) => (
            <FadeInSection key={Number(portfolio.id)} delay={index * 50}>
              <Card
                className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift cursor-pointer h-full"
                onClick={() => handlePortfolioClick(portfolio)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{portfolio.title}</CardTitle>
                    <Badge variant="secondary" className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30 flex-shrink-0">
                      {getCategoryLabel(portfolio.category)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3 mt-2">
                    {portfolio.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {portfolio.artworks.length} {portfolio.artworks.length === 1 ? 'artwork' : 'artworks'}
                    </p>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>
      )}

      {/* Portfolio Details Modal */}
      <PortfolioDetailsModal
        portfolio={selectedPortfolio}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </PageLayout>
  );
}
