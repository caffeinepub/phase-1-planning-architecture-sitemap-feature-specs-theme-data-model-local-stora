import { Button } from '@/components/ui/button';
import { Wand2, Mail } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import MysticalBorder from '../components/MysticalBorder';

export default function Services() {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Enchanted Services"
      description="Discover a realm of possibilities for custom items, magical trinkets, and personalized treasures."
    >
      {/* Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                ✨ Welcome to the Enchanted Services of The Creator of Side Quests ✨
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Welcome, curious wanderer, to the Services Page of The Creator of Side Quests. Here, you'll discover a realm of possibilities for custom items, magical trinkets, and personalized treasures. Each creation is infused with care, imagination, and a touch of wonder. If you don't see exactly what you're dreaming of, you are always welcome to submit a custom request or a quote, and we'll craft it together.
              </p>
              <p className="text-lg font-semibold text-arcane-gold">
                Dive in, and explore the many realms of what can be made just for you:
              </p>
            </div>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Mystical Home & Enchanted Decor */}
      <FadeInSection delay={50}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              🌿 Mystical Home & Enchanted Decor
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Bring magic into your space with items that transform your home into a sanctuary of charm:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>Whispering wall decals and vinyl spells to adorn your walls</li>
              <li>Layered wood and 3D printed signs imbued with names, quotes, or symbols</li>
              <li>Glimmering 3D printed planters and vases, perfect for enchanted plants</li>
              <li>Candle holders, coasters, and trays that shimmer with subtle enchantments</li>
              <li>Seasonal ornaments and keepsakes that tell a story of their own</li>
              <li>Custom picture frames, shadow boxes, and framed art with magical layers</li>
              <li>Geometric sculptures and whimsical 3D accents that catch the light just so</li>
              <li>Wall hooks, decorative knobs, and other functional charms for your home</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Fashion & Enchanted Accessories */}
      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              👑 Fashion & Enchanted Accessories
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Wear your magic with confidence. Each piece is uniquely crafted to reflect your spirit:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>T-shirts, hoodies, and hats personalized with sigils, names, or symbols</li>
              <li>Bags, totes, and aprons decorated with mystical vinyl designs</li>
              <li>3D printed jewelry: earrings, rings, pendants, charms, and bracelets</li>
              <li>Magical hair accessories and headbands, hand-cut and enchanted</li>
              <li>Custom keychains, bag charms, and luggage tags for your travels</li>
              <li>Shoes and clothing adorned with personalized mystical appliqués</li>
              <li>Jewelry trays, watch holders, and other enchanted organizers</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Office & Workshop Wonders */}
      <FadeInSection delay={150}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              📜 Office & Workshop Wonders
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Infuse everyday tasks with charm and whimsy:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>Planner stickers, tabs, and dashboards with magical motifs</li>
              <li>Personalized journals, notebooks, and embossed notepads</li>
              <li>Desk organizers, cable holders, pen cups, and desktop charms</li>
              <li>Labeling systems and wall-mounted organizers to keep chaos at bay</li>
              <li>Decorative trays, business card holders, and other practical treasures</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Gifts & Keepsakes from the Arcane */}
      <FadeInSection delay={200}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              🎁 Gifts & Keepsakes from the Arcane
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Gift a little magic with treasures made to delight and astonish:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>Custom keychains, jewelry boxes, and personalized photo frames</li>
              <li>Mini trophies, keepsake ornaments, and magical cake toppers</li>
              <li>Wedding, birthday, and anniversary gifts imbued with personal enchantments</li>
              <li>Vinyl-decorated candles, mugs, and coasters to light up hearts</li>
              <li>3D printed figurines, resin charms, and miniature wonders</li>
              <li>Personalized bookmarks, magnets, and luggage tags</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Kids & Whimsical Learning */}
      <FadeInSection delay={250}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              🌈 Kids & Whimsical Learning
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Spark curiosity and imagination with enchanted creations for little adventurers:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>Alphabet and number puzzles, magical learning toys</li>
              <li>3D printed animals, figurines, and mini collectible companions</li>
              <li>DIY craft kits, sticker sheets, and scrapbooking treasures</li>
              <li>Room decor, wall decals, and personalized name plaques</li>
              <li>Custom board game pieces, tokens, and tabletop treasures</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Celebrations & Seasonal Magic */}
      <FadeInSection delay={300}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              🎉 Celebrations & Seasonal Magic
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Every celebration deserves enchantment:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>Invitations, save-the-dates, and custom envelopes</li>
              <li>Cake toppers, banners, and table place cards</li>
              <li>Holiday decorations, Easter baskets, and Halloween masks</li>
              <li>Graduation, anniversary, and seasonal keepsakes to mark moments</li>
              <li>Personalized signage for weddings, birthdays, and magical gatherings</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Niche & Hobby Charms */}
      <FadeInSection delay={350}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              🛠️ Niche & Hobby Charms
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              For adventurers, dreamers, and creators, a touch of magic in every hobby:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>Cosplay props, 3D printed masks, armor, and mystical accessories</li>
              <li>Miniature furniture, game terrain, and tabletop collectibles</li>
              <li>Custom tokens, dice, and board game organizers</li>
              <li>Tech accessories enchanted with personalization: phone stands, laptop decals, keycaps</li>
              <li>3D printed camera props, headphone stands, and magical gadgets</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* DIY & Enchanted Craft Kits */}
      <FadeInSection delay={400}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
              🎨 DIY & Enchanted Craft Kits
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Create your own magic at home with thoughtfully crafted kits:
            </p>
            <ul className="space-y-2 text-foreground/80 list-disc list-inside">
              <li>DIY sticker sheets, greeting cards, and scrapbooking sets</li>
              <li>Ornament, wall art, and home decor kits</li>
              <li>Jewelry, keychain, and accessory kits for creative spells</li>
              <li>Puzzle, plant holder, and vinyl decal kits for endless imagination</li>
              <li>Kits for seasonal crafting, personal enchantments, and whimsical adventures</li>
            </ul>
          </MysticalBorder>
        </section>
      </FadeInSection>

      {/* Closing Invitation */}
      <FadeInSection delay={450}>
        <section className="section-spacing px-4 sm:px-6">
          <MysticalBorder className="max-w-5xl mx-auto">
            <div className="text-center space-y-6">
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                Every creation at The Creator of Side Quests is a journey, a tiny adventure made just for you. If your heart dreams of something unique, something unseen here, send us a request or a quote, and together we'll bring it to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/submit-request' })}
                  className="gap-2"
                >
                  <Wand2 className="h-5 w-5" />
                  Submit Custom Request
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/contact' })}
                  className="gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Request a Quote
                </Button>
              </div>
            </div>
          </MysticalBorder>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
