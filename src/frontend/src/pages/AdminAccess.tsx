import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
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

  const isLockedOut = localLockedOut || (lockoutFetched && backendLockedOut);
  const isLoggingIn = loginStatus === 'logging-in';
  const isSessionLoading = isInitializing || actorFetching;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Prevent submission if actor is not ready
    if (!actor) {
      setError('Loading your session...');
      return;
    }

    const trimmedCode = accessCode.trim().toUpperCase();

    if (trimmedCode.length !== 5) {
      setError('Access code must be exactly 5 characters');
      setAccessCode('');
      return;
    }

    if (isLockedOut) {
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
        
        // Invalidate and refetch role/permission queries before redirect
        await queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
        await queryClient.invalidateQueries({ queryKey: ['callerPermissions'] });
        
        // Wait for queries to refetch
        await queryClient.refetchQueries({ queryKey: ['currentUserRole'] });
        
        // Auto-redirect to admin dashboard after queries are refreshed
        setTimeout(() => {
          navigate({ to: '/admin' });
        }, 1500);
      } else {
        setError('Access Denied');
        setAccessCode('');
      }
    } catch (err: any) {
      // Differentiate between initialization errors and backend denial
      if (err.message === 'Actor not available') {
        setError('Loading your session...');
      } else if (err.message && err.message.includes('locked')) {
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

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
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
                ) : !isAuthenticated ? (
                  <LogIn className="h-8 w-8 text-primary" />
                ) : (
                  <Shield className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">Administrative Access</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Not authenticated - show login required */}
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    You must be logged in with Internet Identity to access the admin dashboard.
                  </p>
                  <Button
                    onClick={handleLogin}
                    className="w-full"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Login with Internet Identity
                      </>
                    )}
                  </Button>
                </div>
              ) : isSessionLoading ? (
                /* Session loading - show loading state */
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading your session...</p>
                </div>
              ) : success ? (
                /* Success - show access granted */
                <div className="text-center space-y-4">
                  <p className="text-lg font-semibold text-green-600">Access Granted</p>
                  <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>
              ) : isLockedOut ? (
                /* Locked out - show lockout message */
                <div className="text-center space-y-4">
                  <p className="text-sm text-destructive font-semibold">
                    Account permanently locked out due to repeated code attempts. Contact administrator.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    To regain access, you must create a new account with a different Internet Identity.
                  </p>
                </div>
              ) : (
                /* Authenticated and ready - show code entry form */
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
                      disabled={submitMutation.isPending || !actor}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center font-semibold">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitMutation.isPending || accessCode.trim().length !== 5 || !actor}
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
