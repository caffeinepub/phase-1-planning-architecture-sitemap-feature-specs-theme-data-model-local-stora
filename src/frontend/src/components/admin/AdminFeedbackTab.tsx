import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, AlertCircle } from 'lucide-react';
import { useGetAllFeedback } from '../../hooks/useQueries';
import ErrorState from '../system/ErrorState';

export default function AdminFeedbackTab() {
  const { data: feedbackList = [], isLoading, error, refetch } = useGetAllFeedback();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((feedback: any) => {
      const matchesSearch = !searchQuery || 
        feedback.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.userId.toString().toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
        (feedback.category && feedback.category.toLowerCase() === categoryFilter.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [feedbackList, searchQuery, categoryFilter]);

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load feedback" onRetry={refetch} />;
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-arcane-gold" />
          User Feedback
        </CardTitle>
        <CardDescription>
          {feedbackList.length} total {feedbackList.length === 1 ? 'submission' : 'submissions'}
          {filteredFeedback.length !== feedbackList.length && ` (${filteredFeedback.length} shown)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="feedback-search">Search Feedback</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="feedback-search"
                placeholder="Search by message or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category-filter">Filter by Category</Label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="all">All Categories</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {feedbackList.length === 0
                ? 'No feedback has been submitted yet.'
                : 'No feedback matches your filters.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((feedback: any) => {
              const statusVariant = 
                feedback.status.__kind__ === 'completed' ? 'default' :
                feedback.status.__kind__ === 'reviewed' ? 'secondary' :
                'outline';

              return (
                <div
                  key={feedback.id.toString()}
                  className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">Feedback #{feedback.id.toString()}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        From: <span className="font-mono text-xs">{feedback.userId.toString()}</span>
                      </p>
                    </div>
                    <Badge variant={statusVariant}>
                      {feedback.status.__kind__}
                    </Badge>
                  </div>

                  <p className="text-sm">{feedback.message}</p>

                  {feedback.status.__kind__ !== 'open' && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Admin Response:</p>
                      <p className="text-sm">
                        {feedback.status.value?.response || 'No response provided'}
                      </p>
                    </div>
                  )}

                  {feedback.status.__kind__ === 'open' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Review
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        Complete
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
