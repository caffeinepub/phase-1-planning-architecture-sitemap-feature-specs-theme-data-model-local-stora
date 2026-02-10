import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, DollarSign, Package, Users, RefreshCw, Loader2 } from 'lucide-react';
import { useGetAnalyticsSnapshot } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AnalyticsSnapshotSection() {
  const { data: analytics, isLoading, error, refetch } = useGetAnalyticsSnapshot();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['analyticsSnapshot'] });
      await refetch();
      toast.success('Analytics refreshed successfully');
    } catch (error: any) {
      toast.error('Failed to refresh analytics');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load analytics</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Analytics Snapshot</h2>
          <p className="text-muted-foreground">
            Quick overview of total orders, recent activity, and sales performance
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analytics ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders.toString()}</div>
              <p className="text-xs text-muted-foreground">All-time order count</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(Number(analytics.totalRevenue) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeProducts.toString()}</div>
              <p className="text-xs text-muted-foreground">Visible in shop</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers.toString()}</div>
              <p className="text-xs text-muted-foreground">Registered profiles</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Analytics Information</CardTitle>
          <CardDescription>Understanding your site metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <div className="font-medium min-w-[120px]">Total Orders:</div>
            <div>The cumulative count of all orders placed through the shop</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[120px]">Total Revenue:</div>
            <div>Sum of all order amounts after discounts, representing total sales</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[120px]">Active Products:</div>
            <div>Number of products currently visible to customers in the shop</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[120px]">Total Users:</div>
            <div>Count of registered user profiles with saved information</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[120px]">Updates:</div>
            <div>Analytics refresh automatically after new orders. Use the refresh button for manual updates.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
