import { useState } from 'react';
import { useSearchArtifacts } from '../hooks/useSearchArtifacts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Star, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ErrorState from '../components/system/ErrorState';

export default function SearchArtifacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: results = [], isLoading, error, refetch } = useSearchArtifacts(debouncedQuery, category);

  const handleSearch = () => {
    setDebouncedQuery(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryLabel = (cat: string): string => {
    const labels: Record<string, string> = {
      all: 'All Categories',
      testimony: 'Testimonies',
      product: 'Products',
      portfolio: 'Portfolio',
      design: 'Designs',
      service: 'Services',
      certificate: 'Certificates',
      caseStudy: 'Case Studies',
      tutorial: 'Tutorials',
    };
    return labels[cat] || cat;
  };

  return (
    <PageLayout
      title="Search Artifacts"
      description="Search through testimonies and other artifacts"
    >
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          {/* Search Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                Search Artifacts
              </CardTitle>
              <CardDescription>
                Find testimonies, products, and other artifacts by keyword
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search-input">Search Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-input"
                      type="text"
                      placeholder="Enter keywords to search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} size="default">
                      <Search className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-filter" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category-filter" className="w-full sm:w-64">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="testimony">Testimonies</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="design">Designs</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="certificate">Certificates</SelectItem>
                    <SelectItem value="caseStudy">Case Studies</SelectItem>
                    <SelectItem value="tutorial">Tutorials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <ErrorState title="Failed to load search results" onRetry={refetch} />
          ) : !debouncedQuery ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter keywords and click Search to find artifacts
                </p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">
                  No results found for "{debouncedQuery}"
                  {category !== 'all' && ` in ${getCategoryLabel(category)}`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                {category !== 'all' && ` in ${getCategoryLabel(category)}`}
              </p>

              {results.map((result) => (
                <Card key={`${result.source}-${result.artifact.id.toString()}`} className="hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base sm:text-lg break-words">{result.artifact.title}</CardTitle>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {getCategoryLabel(result.source)}
                          </Badge>
                        </div>
                        <CardDescription className="break-words">
                          {result.artifact.description}
                        </CardDescription>
                      </div>
                      {result.artifact.rating && (
                        <div className="flex items-center gap-1 self-start">
                          <Star className="h-4 w-4 fill-testimony-star text-testimony-star" />
                          <span className="text-sm font-medium">{result.artifact.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                      <span>Relevance: {(result.relevanceScore * 100).toFixed(0)}%</span>
                      {result.artifact.media && (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>Has media</span>
                        </div>
                      )}
                    </div>

                    {result.source === 'testimony' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/testimonies">
                            View on Testimonies Page
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
