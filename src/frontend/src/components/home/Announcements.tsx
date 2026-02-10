import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar } from 'lucide-react';

const announcements = [
  {
    id: 1,
    title: 'New Collection: Celestial Artifacts',
    description: 'Discover rare items from the Celestial Realm, now available in our shop.',
    date: 'February 8, 2026',
    badge: 'New',
  },
  {
    id: 2,
    title: 'Winter Solstice Sale',
    description: 'Special discounts on select grimoires and enchanted jewelry through the end of the month.',
    date: 'February 5, 2026',
    badge: 'Sale',
  },
];

export default function Announcements() {
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="border-border/40 hover:border-arcane-gold/30 transition-all hover-lift">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
                    {announcement.badge}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {announcement.date}
                  </div>
                </div>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                <CardDescription className="mt-2">{announcement.description}</CardDescription>
              </div>
              <Sparkles className="h-5 w-5 text-arcane-gold flex-shrink-0" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
