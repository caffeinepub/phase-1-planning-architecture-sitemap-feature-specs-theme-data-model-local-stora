import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import { useSubmitAdminAccessAttempt } from '../hooks/useQueries';
import { setAdminAccessUnlocked } from '../lib/adminAccessSession';
import { getClientDetails } from '../lib/clientDetails';

export default function AdminAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const submitMutation = useSubmitAdminAccessAttempt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!accessCode.trim()) {
      setError('Invalid Access Code');
      return;
    }

    try {
      // Capture client details at submission time
      const clientDetails = getClientDetails();
      
      const result = await submitMutation.mutateAsync({
        accessCode: accessCode.trim(),
        browserInfo: clientDetails.browserInfo,
        deviceType: clientDetails.deviceType,
      });
      
      if (result === 'AdminAccessGranted') {
        setSuccess(true);
        setAdminAccessUnlocked();
        
        // Show "Access Granted" message briefly before navigating
        setTimeout(() => {
          navigate({ to: '/admin' });
        }, 1000);
      } else {
        // Backend returns "Invalid Access Code" on failure
        setError(result);
        setAccessCode('');
      }
    } catch (err: any) {
      // Handle any errors (including lockout)
      if (err.message && err.message.includes('locked')) {
        setError(err.message);
      } else {
        setError('Invalid Access Code');
      }
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
                {success ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Shield className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">Administrative Access</CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center space-y-4">
                  <p className="text-lg font-semibold text-green-600">Access Granted</p>
                  <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>
              ) : (
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
                      disabled={submitMutation.isPending}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center font-semibold">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
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
              )}
            </CardContent>
          </Card>
        </div>
      </FadeInSection>
    </PageLayout>
  );
}
