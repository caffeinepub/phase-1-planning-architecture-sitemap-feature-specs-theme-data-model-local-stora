import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar } from 'lucide-react';

export default function BlogLore() {
  const posts = [
    {
      title: 'The Legend of the Crimson Amulet',
      excerpt: 'Deep within the vaults of the ancient kingdom, a crimson amulet lay dormant for centuries...',
      category: 'Lore',
      date: 'January 15, 2026',
    },
    {
      title: 'Identifying Authentic Grimoires',
      excerpt: 'Learn the telltale signs of genuine arcane tomes and how to spot forgeries...',
      category: 'Guide',
      date: 'January 10, 2026',
    },
    {
      title: 'The Rise and Fall of the Mage Guilds',
      excerpt: 'A historical account of the great mage guilds that once ruled the mystical realms...',
      category: 'History',
      date: 'January 5, 2026',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Lore & Chronicles
          </h1>
          <p className="text-lg text-muted-foreground">
            Stories, legends, and knowledge from the arcane world
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <Card key={index} className="border-border/40 hover:border-arcane-gold/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-arcane-gold hover:underline">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Read More</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for Future */}
        <Card className="mt-8 border-border/40 bg-accent/20">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              More chronicles coming soon. Check back regularly for new stories and lore!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
