import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import LoreKnowledgeIntro from '../components/intro/LoreKnowledgeIntro';

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
    title: 'The History of Mystical Seals',
    excerpt: 'Explore the evolution of protective seals and their role in safeguarding powerful artifacts throughout history.',
    date: 'January 25, 2026',
    category: 'History',
    readTime: '6 min read',
  },
];

export default function BlogLore() {
  return (
    <PageLayout
      title="Lore & Knowledge"
      description="Explore the rich history, legends, and practical wisdom of the mystical world."
    >
      {/* Mystical Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <LoreKnowledgeIntro />
        </section>
      </FadeInSection>

      {/* Blog Posts Grid */}
      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                    <BookOpen className="h-4 w-4" />
                    Read More
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
