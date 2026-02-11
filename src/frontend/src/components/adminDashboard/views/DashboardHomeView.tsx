import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Package, MessageSquare, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllTestimonies } from '../../../hooks/useQueries';
import type { DashboardSection } from '../../../pages/Admin';

// TODO: Backend methods not yet implemented
// import { useGetAllProductsAdmin } from '../../../hooks/useQueries';

interface DashboardHomeViewProps {
  onNavigate: (section: DashboardSection) => void;
}

export default function DashboardHomeView({ onNavigate }: DashboardHomeViewProps) {
  const { data: testimonies } = useGetAllTestimonies();
  const pendingTestimonies = testimonies?.filter(t => !t.approved) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Home</h2>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Backend not implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Backend not implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Testimonies</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTestimonies.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Backend not implemented</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => onNavigate('shop')} variant="outline" className="h-auto py-4">
            <Package className="mr-2 h-5 w-5" />
            Manage Products
          </Button>
          <Button onClick={() => onNavigate('testimonies')} variant="outline" className="h-auto py-4">
            <Star className="mr-2 h-5 w-5" />
            Review Testimonies
          </Button>
          <Button onClick={() => onNavigate('requests')} variant="outline" className="h-auto py-4">
            <MessageSquare className="mr-2 h-5 w-5" />
            View Requests
          </Button>
        </CardContent>
      </Card>

      {/* Notice */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Some features require additional backend implementation and will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
