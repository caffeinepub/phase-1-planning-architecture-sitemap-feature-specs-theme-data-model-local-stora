import { ReactNode } from 'react';
import { useGetCallerPermissions } from '../../hooks/useQueries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Loader2 } from 'lucide-react';
import type { AdminPermissions } from '../../backend';

interface AdminPermissionGateProps {
  children: ReactNode;
  requiredPermission: (permissions: AdminPermissions) => boolean;
  fallbackMessage?: string;
}

export default function AdminPermissionGate({
  children,
  requiredPermission,
  fallbackMessage = 'You do not have permission to access this section',
}: AdminPermissionGateProps) {
  const { data: permissions, isLoading, isFetched } = useGetCallerPermissions();

  // Show loading state while fetching permissions
  if (isLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If no permissions found, deny access
  if (!permissions) {
    return (
      <Alert variant="destructive" className="my-8">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>{fallbackMessage}</AlertDescription>
      </Alert>
    );
  }

  // Check if user has required permission (owner always has access)
  const hasPermission = permissions.isOwner || permissions.fullPermissions || requiredPermission(permissions);

  if (!hasPermission) {
    return (
      <Alert variant="destructive" className="my-8">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>{fallbackMessage}</AlertDescription>
      </Alert>
    );
  }

  // User has permission, render children
  return <>{children}</>;
}
