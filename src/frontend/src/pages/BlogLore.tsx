import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';

const blogPosts = [
  {
    id: 1,
    title: 'The Legend of the Crimson Codex',
    excerpt: 'Discover the ancient tale of the most powerful grimoire ever created, bound in dragon leather and sealed with blood magic.',
    date: 'February 1, 2026',
    category: 'Lore',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Caring for Enchanted Artifacts',
    excerpt: 'Essential tips and best practices for maintaining the magical properties of your artifact collection.',
    date: 'January 28, 2026',
    category: 'Guide',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'The Rise and Fall of the Archmage Council',
    excerpt: 'A historical account of the legendary council that once governed all magical affairs across the realms.',
    date: 'January 25, 2026',
    category: 'History',
    readTime: '12 min read',
  },
  {
    id: 4,
    title: 'Identifying Authentic Mystical Artifacts',
    excerpt: 'Learn how to distinguish genuine magical items from clever forgeries and replicas.',
    date: 'January 20, 2026',
    category: 'Guide',
    readTime: '6 min read',
  },
];

export default function BlogLore() {
  return (
    <PageLayout
      title="Lore & Knowledge"
      description="Explore the rich history, legends, and practical wisdom of the mystical world."
    >
      <FadeInSection>
        <section className="section-spacing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post, index) => (
              <FadeInSection key={post.id} delay={index * 100}>
                <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="mt-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
