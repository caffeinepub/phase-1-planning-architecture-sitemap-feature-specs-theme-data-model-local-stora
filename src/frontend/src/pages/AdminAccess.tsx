import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
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

export default function AdminAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const submitMutation = useSubmitAdminAccessAttempt();
  const { identity, login, isInitializing, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: backendLockedOut, isFetched: lockoutFetched } = useGetAdminEntryLockoutStatus();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const principalString = identity?.getPrincipal().toString() || '';
  
  const localLockedOut = isAuthenticated ? isAdminEntryLockedOut(principalString) : false;
  
  useEffect(() => {
    if (isAuthenticated && lockoutFetched && backendLockedOut && principalString) {
      setAdminEntryLockedOut(principalString);
    }
  }, [isAuthenticated, lockoutFetched, backendLockedOut, principalString]);

  const isLockedOut = localLockedOut || backendLockedOut;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isAuthenticated) {
      setError('Please log in first');
      return;
    }

    if (isLockedOut) {
      setError('Account permanently locked out. Contact administrator.');
      return;
    }

    const normalizedCode = accessCode.trim().toUpperCase();

    if (normalizedCode.length !== 5) {
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
        
        queryClient.setQueryData(['isAdmin'], true);
        
        navigate({ to: '/admin', search: { granted: 1 } });
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

  const isLoading = isInitializing || actorFetching || submitMutation.isPending;

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
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAuthenticated ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Please log in with Internet Identity to access the admin panel
                  </p>
                  <Button
                    onClick={handleLogin}
                    disabled={loginStatus === 'logging-in'}
                    className="w-full"
                    size="lg"
                  >
                    {loginStatus === 'logging-in' ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Login with Internet Identity
                      </>
                    )}
                  </Button>
                </div>
              ) : isLockedOut ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  </div>
                  <p className="text-destructive font-semibold">
                    Account Permanently Locked
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This account has been locked due to repeated failed access attempts. Please contact the administrator.
                  </p>
                </div>
              ) : success ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-success" />
                  </div>
                  <p className="text-success font-semibold">Access Granted</p>
                  <p className="text-sm text-muted-foreground">Redirecting to admin panel...</p>
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
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter 5-character code"
                      maxLength={5}
                      className="text-center text-lg tracking-widest uppercase"
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || accessCode.trim().length !== 5}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Access'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
