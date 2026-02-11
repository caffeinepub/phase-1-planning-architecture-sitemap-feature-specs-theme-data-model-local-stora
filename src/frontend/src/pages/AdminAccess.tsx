import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertCircle, Loader2 } from 'lucide-react';
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

    if (!accessCode.trim()) {
      setError('Please enter an access code');
      return;
    }

    try {
      const isValid = await verifyMutation.mutateAsync(accessCode);
      
      if (isValid) {
        // Set session flag and navigate to admin dashboard
        setAdminAccessUnlocked();
        navigate({ to: '/admin' });
      } else {
        setError('Access Denied: Invalid access code');
        setAccessCode('');
      }
    } catch (err: any) {
      console.error('Admin access verification error:', err);
      setError('Access Denied: Invalid access code or authorization error');
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
              <CardDescription className="text-base">
                This dashboard requires two-step security verification:
                <ol className="mt-3 space-y-1 text-left list-decimal list-inside">
                  <li>Internet Identity admin role (verified ✓)</li>
                  <li>Master access code (enter below)</li>
                </ol>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="accessCode" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Master Access Code
                  </label>
                  <Input
                    id="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter 5-digit code"
                    maxLength={5}
                    className="text-center text-lg tracking-widest font-mono"
                    disabled={verifyMutation.isPending}
                    autoFocus
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyMutation.isPending || !accessCode.trim()}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify & Enter Dashboard
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Each access attempt is logged with timestamp and principal ID for security audit purposes.
                </p>
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
