import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-arcane-gold" />
                  <CardTitle className="text-lg">Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">contact@arcaneartifacts.com</p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-arcane-gold" />
                  <CardTitle className="text-lg">Location</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Mystical Quarter<br />
                  Realm of Forgotten Lore
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-arcane-gold" />
                  <CardTitle className="text-lg">Hours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
