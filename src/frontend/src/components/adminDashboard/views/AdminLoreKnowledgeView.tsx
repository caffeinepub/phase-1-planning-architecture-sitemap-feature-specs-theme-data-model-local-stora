import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ROUTE_PATHS } from '../../../lib/routePaths';

export default function AdminLoreKnowledgeView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lore and Knowledge</h1>
        <p className="text-muted-foreground mt-2">
          Manage blog posts, articles, and knowledge base content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lore and Knowledge Management
          </CardTitle>
          <CardDescription>
            View and manage your blog posts and knowledge articles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Lore and Knowledge section displays blog posts and articles to your visitors. 
            Currently, posts are managed statically in the codebase.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={ROUTE_PATHS.lore}>
              <Button variant="outline" className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Coming Soon</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Create and edit blog posts directly from the dashboard</li>
              <li>Rich text editor with media upload support</li>
              <li>Post scheduling and draft management</li>
              <li>Category and tag organization</li>
              <li>SEO optimization tools</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
