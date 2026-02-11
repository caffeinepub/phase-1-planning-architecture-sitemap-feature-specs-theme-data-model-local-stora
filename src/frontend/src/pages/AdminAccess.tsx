import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAuth from '../components/auth/RequireAuth';
import { useSubmitAdminAccessAttempt, useGetAdminEntryLockoutStatus } from '../hooks/useQueries';
import { setAdminAccessUnlocked } from '../lib/adminAccessSession';
import { getClientDetails } from '../lib/clientDetails';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { isAdminEntryLockedOut, setAdminEntryLockedOut } from '../lib/adminEntryLockout';

function AdminAccessContent() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const submitMutation = useSubmitAdminAccessAttempt();
  const { identity } = useInternetIdentity();
  const { data: backendLockedOut, isFetched: lockoutFetched } = useGetAdminEntryLockoutStatus();

  const isAuthenticated = !!identity;
  const principalString = identity?.getPrincipal().toString() || '';
  
  const localLockedOut = isAuthenticated ? isAdminEntryLockedOut(principalString) : false;
  
  useEffect(() => {
    if (isAuthenticated && lockoutFetched && backendLockedOut && principalString) {
      setAdminEntryLockedOut(principalString);
    }
  }, [isAuthenticated, lockoutFetched, backendLockedOut, principalString]);

  const isLockedOut = localLockedOut || (lockoutFetched && backendLockedOut);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const trimmedCode = accessCode.trim().toUpperCase();

    if (trimmedCode.length !== 5) {
      setError('Access Denied');
      setAccessCode('');
      return;
    }

    // Check if this is the permanent master code - if so, bypass lockout checks
    const isPermanentMasterCode = trimmedCode === '7583A';

    if (!isPermanentMasterCode && isLockedOut) {
      setError('Account permanently locked out due to repeated code attempts. Contact administrator.');
      return;
    }

    try {
      const clientDetails = getClientDetails();
      
      const result = await submitMutation.mutateAsync({
        accessCode: trimmedCode,
        browserInfo: clientDetails.browserInfo,
        deviceType: clientDetails.deviceType,
      });
      
      // Backend returns "Access Granted" on success, "Access Denied" on failure
      if (result === 'Access Granted') {
        setSuccess(true);
        setAdminAccessUnlocked();
        
        // Auto-redirect to admin dashboard
        setTimeout(() => {
          navigate({ to: '/admin' });
        }, 1000);
      } else {
        setError('Access Denied');
        setAccessCode('');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('locked')) {
        if (isAuthenticated && principalString) {
          setAdminEntryLockedOut(principalString);
        }
        setError('Account permanently locked out due to repeated code attempts. Contact administrator.');
      } else {
        setError('Access Denied');
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
                ) : isLockedOut ? (
                  <AlertCircle className="h-8 w-8 text-destructive" />
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
              ) : isLockedOut ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-destructive font-semibold">
                    Account permanently locked out due to repeated code attempts. Contact administrator.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    To regain access, you must create a new account with a different Internet Identity.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="accessCode" className="text-sm font-medium">
                      5-Character Access Code
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
                    disabled={submitMutation.isPending || accessCode.trim().length !== 5}
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

export default function AdminAccess() {
  return (
    <RequireAuth>
      <AdminAccessContent />
    </RequireAuth>
  );
}
