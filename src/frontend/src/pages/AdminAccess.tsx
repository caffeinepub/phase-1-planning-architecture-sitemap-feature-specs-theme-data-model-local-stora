import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAdmin from '../components/auth/RequireAdmin';
import { useVerifyAdminAccess } from '../hooks/useQueries';
import { setAdminAccessUnlocked } from '../lib/adminAccessSession';

function AdminAccessContent() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const verifyMutation = useVerifyAdminAccess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accessCode.length !== 5) {
      setError('Access Denied');
      return;
    }

    try {
      const isValid = await verifyMutation.mutateAsync(accessCode);
      
      if (isValid) {
        setAdminAccessUnlocked();
        navigate({ to: '/admin' });
      } else {
        setError('Access Denied');
        setAccessCode('');
      }
    } catch (err: any) {
      setError('Access Denied');
      setAccessCode('');
    }
  };

  return (
    <PageLayout
      title="Admin Access"
      description="Secure administrative access control"
    >
      <FadeInSection>
        <div className="section-spacing flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Administrative Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="accessCode" className="text-sm font-medium">
                    Access Code
                  </label>
                  <Input
                    id="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    maxLength={5}
                    className="text-center text-lg tracking-widest font-mono"
                    disabled={verifyMutation.isPending}
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyMutation.isPending || accessCode.length !== 5}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Enter Dashboard
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </FadeInSection>
    </PageLayout>
  );
}

export default function AdminAccess() {
  return (
    <RequireAdmin>
      <AdminAccessContent />
    </RequireAdmin>
  );
}
