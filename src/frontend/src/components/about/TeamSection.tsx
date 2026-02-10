import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import FlipCard from '../effects/FlipCard';

const teamMembers = [
  {
    id: 1,
    name: 'Elara Moonwhisper',
    role: 'Master Curator',
    initials: 'EM',
    bio: 'With over 30 years of experience in artifact authentication, Elara has traveled to the farthest corners of the realm.',
    expertise: 'Ancient Grimoires & Scrolls',
  },
  {
    id: 2,
    name: 'Theron Ironforge',
    role: 'Chief Appraiser',
    initials: 'TI',
    bio: 'A renowned expert in magical metallurgy and enchanted weaponry, Theron ensures every item meets our standards.',
    expertise: 'Enchanted Weapons & Armor',
  },
  {
    id: 3,
    name: 'Lyra Starweaver',
    role: 'Restoration Specialist',
    initials: 'LS',
    bio: 'Lyra possesses the rare gift of mending broken enchantments and restoring artifacts to their former glory.',
    expertise: 'Artifact Restoration',
  },
  {
    id: 4,
    name: 'Cassius Shadowmere',
    role: 'Lore Keeper',
    initials: 'CS',
    bio: 'Guardian of our extensive archives, Cassius documents the history and provenance of every artifact in our collection.',
    expertise: 'Historical Research',
  },
];

export default function TeamSection() {
  return (
    <section className="py-12">
      <h2 className="section-title">Meet Our Team</h2>
      <p className="section-description">
        Our dedicated team of experts brings centuries of combined experience in artifact curation and preservation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <FlipCard
            key={member.id}
            front={
              <Card className="border-border/40 h-full">
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-arcane-gold/30">
                    <AvatarFallback className="bg-arcane-gold/10 text-arcane-gold text-xl font-display">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
              </Card>
            }
            back={
              <Card className="border-arcane-gold/50 h-full bg-card/95">
                <CardHeader>
                  <CardTitle className="text-base text-arcane-gold">{member.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Expertise:</p>
                    <p className="text-xs text-arcane-gold">{member.expertise}</p>
                  </div>
                </CardContent>
              </Card>
            }
          />
        ))}
      </div>
    </section>
  );
}
