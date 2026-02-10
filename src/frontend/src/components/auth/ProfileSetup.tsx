import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: email.trim() });
      onComplete();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-arcane-gold/10">
            <UserCircle className="h-6 w-6 text-arcane-gold" />
          </div>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            Please set up your profile to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={saveProfile.isPending || !name.trim() || !email.trim()}
            >
              {saveProfile.isPending ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
