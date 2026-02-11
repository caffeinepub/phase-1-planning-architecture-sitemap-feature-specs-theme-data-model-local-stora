import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import AdminAccessIntro from '../components/intro/AdminAccessIntro';
import { useSubmitAdminAccessAttempt, useGetAdminEntryLockoutStatus } from '../hooks/useQueries';
import { setAdminAccessUnlocked } from '../lib/adminAccessSession';
import { getClientDetails } from '../lib/clientDetails';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { isAdminEntryLockedOut, setAdminEntryLockedOut } from '../lib/adminEntryLockout';
import { useQueryClient } from '@tanstack/react-query';
import { normalizeAccessCode, isValidCodeFormat } from '../lib/adminAccessCode';
import { ROUTE_PATHS } from '../lib/routePaths';

export default function AdminAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const submitMutation = useSubmitAdminAccessAttempt();
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: backendLockedOut, isFetched: lockoutFetched } = useGetAdminEntryLockoutStatus();
  const queryClient = useQueryClient();

  const principalString = identity?.getPrincipal().toString() || '';
  
  // Check lockout status (only relevant if we have an identity)
  const localLockedOut = principalString ? isAdminEntryLockedOut(principalString) : false;
  
  useEffect(() => {
    if (principalString && lockoutFetched && backendLockedOut) {
      setAdminEntryLockedOut(principalString);
    }
  }, [lockoutFetched, backendLockedOut, principalString]);

  const isLockedOut = localLockedOut || backendLockedOut;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (isLockedOut) {
      setError('Account permanently locked out. Contact administrator.');
      return;
    }

    const normalizedCode = normalizeAccessCode(accessCode);

    if (!isValidCodeFormat(normalizedCode)) {
      setError('Access code must be exactly 5 characters');
      return;
    }

    try {
      const { browserInfo, deviceType } = getClientDetails();
      const result = await submitMutation.mutateAsync({
        accessCode: normalizedCode,
        browserInfo,
        deviceType,
      });

      if (result === 'Access Granted') {
        setSuccess(true);
        setAdminAccessUnlocked();
        
        // Invalidate role and permission queries to refresh admin status
        await queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
        await queryClient.invalidateQueries({ queryKey: ['callerPermissions'] });
        await queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
        
        // Navigate immediately after showing success
        navigate({ to: ROUTE_PATHS.admin, search: { granted: '1' } });
      } else {
        setError('Invalid access code. Please try again.');
      }
    } catch (err: any) {
      console.error('Access attempt error:', err);
      if (err.message?.includes('locked out')) {
        if (principalString) {
          setAdminEntryLockedOut(principalString);
        }
        setError('Account permanently locked out due to repeated failed attempts. Contact administrator.');
      } else {
        setError(err.message || 'Failed to verify access code');
      }
    }
  };

  const isLoading = actorFetching || submitMutation.isPending;

  return (
    <PageLayout
      title="Admin Access"
      description="Secure administrative access control"
    >
      {/* Mystical Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <AdminAccessIntro />
        </section>
      </FadeInSection>

      <FadeInSection delay={100}>
        <section className="section-spacing px-4 sm:px-6">
          <Card className="max-w-md mx-auto border-arcane-gold/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Administrator Access</CardTitle>
              <CardDescription>
                Enter your access code to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLockedOut ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-destructive font-medium">
                      Account Locked
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This account has been permanently locked due to repeated failed access attempts.
                      Please contact the administrator.
                    </p>
                  </div>
                </div>
              ) : success ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Access Granted
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Redirecting to admin dashboard...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessCode">Administrator Access</Label>
                    <Input
                      id="accessCode"
                      type="text"
                      placeholder="Enter 5-character code"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      maxLength={5}
                      disabled={isLoading}
                      className="text-center text-lg tracking-widest uppercase"
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || accessCode.length !== 5}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Access code is case-insensitive and must be exactly 5 characters
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
