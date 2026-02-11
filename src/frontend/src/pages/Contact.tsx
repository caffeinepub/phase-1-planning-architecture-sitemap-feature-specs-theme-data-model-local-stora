import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Clock } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si';
import { toast } from 'sonner';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ContactPageFAQ from '../components/contact/ContactPageFAQ';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with our team for inquiries, support, or collaboration opportunities."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <FadeInSection>
          <Card className="border-border/40 hover-lift">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeInSection>

        {/* Contact Information */}
        <FadeInSection delay={100}>
          <div className="space-y-6">
            <Card className="border-border/40 hover-lift">
              <CardHeader>
                <CardTitle>Contact the Keepers of the Artifacts</CardTitle>
                <CardDescription>
                  Other Ways to Reach Us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Narrative Introduction */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    If the path of the website is not the road you choose, your request, custom quote, or sacred quest may still be delivered through the enchanted messenger gates of <strong>Facebook Messenger</strong>, <strong>Instagram</strong>, and <strong>TikTok</strong>, where our Keepers receive transmissions from travelers afar.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Witness our recorded chronicles upon <strong>YouTube</strong>, where both short-form visions and long-form tales of relics, discoveries, and journeys are revealed.
                  </p>
                </div>

                {/* Social Media Links */}
                <div className="flex gap-4 items-center justify-start flex-wrap">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-arcane-gold transition-colors"
                    aria-label="Facebook Messenger"
                  >
                    <SiFacebook className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-arcane-gold transition-colors"
                    aria-label="Instagram"
                  >
                    <SiInstagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-arcane-gold transition-colors"
                    aria-label="TikTok"
                  >
                    <SiTiktok className="h-6 w-6" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-arcane-gold transition-colors"
                    aria-label="YouTube"
                  >
                    <SiYoutube className="h-6 w-6" />
                  </a>
                </div>

                {/* Divider */}
                <div className="border-t border-border/40" />

                {/* Contact Details with Icons */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-arcane-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href="mailto:thecreatorofsidequests@gmail.com"
                        className="text-sm text-muted-foreground hover:text-arcane-gold transition-colors"
                      >
                        thecreatorofsidequests@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-arcane-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Sanctum Location</p>
                      <p className="text-sm text-muted-foreground">
                        Ashland, Kentucky — where the hidden vault of artifacts quietly rests.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-arcane-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Hours of Invocation</p>
                      <p className="text-sm text-muted-foreground">
                        The gates of the Keepers remain open <strong>Monday through Thursday, from 10:30 a.m. until 10:30 p.m.</strong>, when requests, quotes, and quests (for they are one and the same) may be submitted.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        From <strong>Friday through Sunday</strong>, the Keepers enter sacred rest, and <strong>no quests or requests shall be accepted</strong> until the gates open once more.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeInSection>
      </div>

      {/* FAQ Section */}
      <FadeInSection delay={200}>
        <section className="section-spacing">
          <ContactPageFAQ />
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
