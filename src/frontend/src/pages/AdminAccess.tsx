import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAdmin from '../components/auth/RequireAdmin';
import { useVerifyAdminAccess } from '../hooks/useQueries';
import { setAdminAccessUnlocked } from '../lib/adminAccessSession';
import { getClientDetails } from '../lib/clientDetails';

function AdminAccessContent() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const verifyMutation = useVerifyAdminAccess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Allow submission regardless of length for client-side validation
    if (accessCode.length !== 5) {
      setError('Access Denied');
      setAccessCode('');
      return;
    }

    try {
      // Capture client details at submission time
      const clientDetails = getClientDetails();
      
      const isValid = await verifyMutation.mutateAsync({
        code: accessCode,
        browserInfo: clientDetails.browserInfo,
        deviceType: clientDetails.deviceType,
      });
      
      if (isValid) {
        setSuccess(true);
        setAdminAccessUnlocked();
        
        // Show "Access Granted" message briefly before navigating
        setTimeout(() => {
          navigate({ to: '/admin' });
        }, 1000);
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
                      disabled={verifyMutation.isPending}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center font-semibold">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={verifyMutation.isPending}
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
              )}
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
