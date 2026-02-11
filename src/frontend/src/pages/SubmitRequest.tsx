import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSubmitRequest } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequestMediaPicker from '../components/requests/RequestMediaPicker';
import SubmitRequestIntro from '../components/intro/SubmitRequestIntro';
import type { RequestMediaItem } from '../components/requests/RequestMediaPicker';

export default function SubmitRequest() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const submitRequest = useSubmitRequest();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [pricingPreference, setPricingPreference] = useState<string>('flexible');
  const [media, setMedia] = useState<RequestMediaItem[]>([]);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
      toast.error('Please log in to submit a request');
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const requestData = {
        name: name.trim(),
        email: email.trim(),
        description: description.trim(),
        pricingPreference,
        media: media.map(m => ({
          blob: m.blob,
          mediaType: m.isVideo ? 'video' : 'photo',
        })),
      };

      await submitRequest.mutateAsync(requestData);
      toast.success('Request submitted successfully! We will review it shortly.');
      
      // Reset form
      setDescription('');
      setPricingPreference('flexible');
      setMedia([]);
      
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      console.error('Failed to submit request:', error);
      toast.error(error.message || 'Failed to submit request');
    }
  };

  if (!identity) {
    return null;
  }

  return (
    <PageLayout
      title="Submit Custom Request"
      description="Tell us about your custom project needs"
    >
      {/* Mystical Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <SubmitRequestIntro />
        </section>
      </FadeInSection>

      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Custom Request Form
              </CardTitle>
              <CardDescription>
                Describe your custom project and we'll get back to you with a quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your custom project in detail..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                </div>

                {/* Pricing Preference */}
                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing Preference</Label>
                  <Select value={pricingPreference} onValueChange={setPricingPreference}>
                    <SelectTrigger id="pricing">
                      <SelectValue placeholder="Select pricing preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="budget">Budget Range</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Media Attachments */}
                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <RequestMediaPicker
                    media={media}
                    onChange={setMedia}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitRequest.isPending}
                  className="w-full"
                  size="lg"
                >
                  {submitRequest.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
