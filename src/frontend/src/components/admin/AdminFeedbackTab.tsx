import { useState, useMemo } from 'react';
import { useGetAllFeedback } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, MessageSquare } from 'lucide-react';
import ErrorState from '../system/ErrorState';
import type { Feedback } from '../../backend';

export default function AdminFeedbackTab() {
  const { data: feedback, isLoading, error, refetch } = useGetAllFeedback();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract category from feedback message
  const extractCategory = (message: string): string => {
    const match = message.match(/^\[([^\]]+)\]/);
    return match ? match[1] : 'General';
  };

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    if (!feedback) return [];

    return feedback.filter((item) => {
      const category = extractCategory(item.message);
      const matchesSearch = 
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userId.toString().toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [feedback, searchQuery, categoryFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!feedback) return [];
    const cats = feedback.map((item) => extractCategory(item.message));
    return ['all', ...Array.from(new Set(cats))];
  }, [feedback]);

  const getStatusBadge = (status: Feedback['status']) => {
    if (status.__kind__ === 'open') {
      return <Badge variant="default">Open</Badge>;
    } else if (status.__kind__ === 'reviewed') {
      return <Badge variant="secondary">Reviewed</Badge>;
    } else if (status.__kind__ === 'completed') {
      return <Badge variant="outline">Completed</Badge>;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load feedback"
        description="There was an error loading the feedback submissions."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>
            Review and manage feedback submissions from users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search feedback or principal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback List */}
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No feedback found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || categoryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No feedback submissions yet'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredFeedback.map((item) => {
                  const category = extractCategory(item.message);
                  const messageWithoutCategory = item.message.replace(/^\[[^\]]+\]\s*/, '');

                  return (
                    <Card key={item.id.toString()}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{category}</Badge>
                              {getStatusBadge(item.status)}
                            </div>
                            <CardDescription className="text-xs font-mono break-all">
                              From: {item.userId.toString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {messageWithoutCategory}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Summary */}
          {feedback && feedback.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredFeedback.length} of {feedback.length} feedback submission{feedback.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
