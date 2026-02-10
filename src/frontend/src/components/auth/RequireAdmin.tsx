import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldX } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  if (isInitializing || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Login with Internet Identity
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel. Admin privileges are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Return to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
