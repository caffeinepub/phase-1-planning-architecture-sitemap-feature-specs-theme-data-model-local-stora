import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isAdminAccessUnlocked } from '../../lib/adminAccessSession';

interface RequireAdminAccessGateProps {
  children: React.ReactNode;
}

/**
 * Gate component that checks if admin has entered the master access code
 * Redirects to /admin-access if not unlocked
 * Must be used inside RequireAdmin (admin role check happens first)
 */
export default function RequireAdminAccessGate({ children }: RequireAdminAccessGateProps) {
  const navigate = useNavigate();
  const isUnlocked = isAdminAccessUnlocked();

  useEffect(() => {
    if (!isUnlocked) {
      navigate({ to: '/admin-access', replace: true });
    }
  }, [isUnlocked, navigate]);

  if (!isUnlocked) {
    return null;
  }

  return <>{children}</>;
}
