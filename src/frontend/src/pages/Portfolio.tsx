import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // TODO: Integrate with backend portfolio data
  const isLoading = false;
  const portfolioItems: any[] = [];

  const categories = ['all', 'painting', 'digitalArt', 'sculpture', 'photography', 'illustration'];

  return (
    <PageLayout
      title="Portfolio"
      description="Explore our completed projects and creative works"
    >
      <FadeInSection>
        <div className="section-spacing">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4">
              Our Portfolio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of our finest creations and completed projects
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            ))}
          </div>

          {/* Portfolio Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : portfolioItems.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ImageIcon className="h-12 w-12 opacity-50" />
                      <p>No portfolio items available yet. Check back soon for our latest work!</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </FadeInSection>
    </PageLayout>
  );
}
