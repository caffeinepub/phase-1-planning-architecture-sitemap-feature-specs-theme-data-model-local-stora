import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isAdminAccessUnlocked, clearAdminAccessUnlocked } from '../../lib/adminAccessSession';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { ROUTE_PATHS } from '../../lib/routePaths';

interface RequireAdminAccessGateProps {
  children: React.ReactNode;
}

/**
 * Gate component that checks if admin has entered the master access code
 * and verifies backend admin status
 * Redirects to /admin-access if not unlocked or if backend verification fails
 */
export default function RequireAdminAccessGate({ children }: RequireAdminAccessGateProps) {
  const navigate = useNavigate();
  const isUnlocked = isAdminAccessUnlocked();
  const { data: isAdmin, isLoading, isFetched } = useIsCallerAdmin();

  useEffect(() => {
    // If session is not unlocked, redirect to admin access page
    if (!isUnlocked) {
      navigate({ to: ROUTE_PATHS.adminAccess, replace: true });
      return;
    }

    // If we've fetched the admin status and it's false, clear unlock and redirect
    if (isFetched && isAdmin === false) {
      clearAdminAccessUnlocked();
      navigate({ to: ROUTE_PATHS.adminAccess, replace: true });
    }
  }, [isUnlocked, isAdmin, isFetched, navigate]);

  // Show loading state while checking backend admin status
  if (isUnlocked && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!isUnlocked || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
