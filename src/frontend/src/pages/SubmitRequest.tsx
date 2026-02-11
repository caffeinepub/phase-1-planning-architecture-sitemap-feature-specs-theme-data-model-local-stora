import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useCreateRequest } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAuth from '../components/auth/RequireAuth';
import RequestMediaPicker, { RequestMediaItem } from '../components/requests/RequestMediaPicker';
import { toast } from 'sonner';

function SubmitRequestForm() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const createRequest = useCreateRequest();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState<'flexible' | 'range'>('flexible');
  const [priceRange, setPriceRange] = useState('');
  const [media, setMedia] = useState<RequestMediaItem[]>([]);

  // Prefill from profile when loaded
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('You must be logged in to submit a request');
      return;
    }

    if (!name.trim() || !email.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (pricingType === 'range' && !priceRange.trim()) {
      toast.error('Please enter a price range');
      return;
    }

    try {
      const requestData = {
        name: name.trim(),
        email: email.trim(),
        description: description.trim(),
        attachments: media.map(m => ({
          blob: m.blob,
          filename: m.isVideo ? 'video.mp4' : 'photo.jpg',
        })),
        pricingPreference: pricingType === 'flexible' 
          ? { __kind__: 'flexible' as const }
          : { __kind__: 'range' as const, value: priceRange.trim() },
      };

      await createRequest.mutateAsync(requestData);
      toast.success('Request submitted successfully!');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      console.error('Failed to submit request:', error);
      toast.error(error.message || 'Failed to submit request. This feature will be available once the backend is updated.');
    }
  };

  if (profileLoading) {
    return (
      <PageLayout title="Submit Request" description="Request a custom quote">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Submit a Request"
      description="Tell us about your custom project or freelance job"
    >
      <FadeInSection>
        <section className="section-spacing">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Custom Request Form</CardTitle>
              <CardDescription>
                Fill out the form below to request a custom quote for your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      disabled={createRequest.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={createRequest.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your custom project, freelance job, or special request in detail..."
                    rows={6}
                    required
                    disabled={createRequest.isPending}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Pricing Preference *</Label>
                  <RadioGroup
                    value={pricingType}
                    onValueChange={(value) => setPricingType(value as 'flexible' | 'range')}
                    disabled={createRequest.isPending}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible" className="cursor-pointer font-normal">
                        Flexible - Open to your pricing
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="range" id="range" />
                      <Label htmlFor="range" className="cursor-pointer font-normal">
                        Price Range - I have a budget in mind
                      </Label>
                    </div>
                  </RadioGroup>

                  {pricingType === 'range' && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="priceRange">Your Budget Range</Label>
                      <Input
                        id="priceRange"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        placeholder="e.g., $500 - $1000"
                        disabled={createRequest.isPending}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <RequestMediaPicker
                    media={media}
                    onChange={setMedia}
                    disabled={createRequest.isPending}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={createRequest.isPending}
                    className="flex-1"
                  >
                    {createRequest.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                    disabled={createRequest.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}

export default function SubmitRequest() {
  return (
    <RequireAuth>
      <SubmitRequestForm />
    </RequireAuth>
  );
}
