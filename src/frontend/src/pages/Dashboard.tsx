import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useGetCallerUserProfile } from '../hooks/useQueries';

// TODO: Backend methods not yet implemented
// import { useGetMyOrders, useGetAllProducts } from '../hooks/useQueries';

export default function Dashboard() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <PageLayout
      title="My Dashboard"
      description="Manage your account and orders"
    >
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome{userProfile?.name ? `, ${userProfile.name}` : ''}!</h1>
          <p className="text-muted-foreground">Manage your account and view your orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                This feature requires backend implementation. Coming soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
