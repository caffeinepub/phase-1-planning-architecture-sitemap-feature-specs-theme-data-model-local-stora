import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Loader2 } from 'lucide-react';
import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminFeedbackTab from '../components/admin/AdminFeedbackTab';
import AdminRequestsTab from '../components/admin/AdminRequestsTab';
import AdminTestimoniesTab from '../components/admin/AdminTestimoniesTab';
import AdminMessagingTab from '../components/admin/AdminMessagingTab';
import AdminCouponsTab from '../components/admin/AdminCouponsTab';
import AdminAnalyticsTab from '../components/admin/AdminAnalyticsTab';
import AdminSystemSettingsTab from '../components/admin/AdminSystemSettingsTab';
import RequireAdmin from '../components/auth/RequireAdmin';
import RequireAdminAccessGate from '../components/auth/RequireAdminAccessGate';
import { useGetCallerPermissions } from '../hooks/useQueries';
import { useGetAdminNotifications } from '../hooks/useAdminNotifications';
import { toast } from 'sonner';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('products');
  const { data: notifications, isLoading: notificationsLoading, refetch: refetchNotifications } = useGetAdminNotifications();
  const { data: permissions, isLoading: permissionsLoading } = useGetCallerPermissions();

  const handleRefreshNotifications = async () => {
    try {
      await refetchNotifications();
      toast.success('Notifications refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh notifications');
    }
  };

  const canAccessSettings = permissions?.isOwner || permissions?.fullPermissions;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage products, orders, users, and system settings
        </p>
      </div>

      {/* Notification Counts */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dashboard Notifications</CardTitle>
              <CardDescription>Quick overview of pending items</CardDescription>
            </div>
            <Button
              onClick={handleRefreshNotifications}
              variant="outline"
              size="sm"
              disabled={notificationsLoading}
            >
              {notificationsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">New Requests</span>
              <span className="text-2xl font-bold">
                {notificationsLoading ? '—' : notifications?.newQuotes.toString() || '0'}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">New Orders</span>
              <span className="text-2xl font-bold">
                {notificationsLoading ? '—' : notifications?.newOrders.toString() || '0'}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">New Testimonies</span>
              <span className="text-2xl font-bold">
                {notificationsLoading ? '—' : notifications?.newTestimonies.toString() || '0'}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">Inbox Messages</span>
              <span className="text-2xl font-bold">
                {notificationsLoading ? '—' : notifications?.newMessagesCount.toString() || '0'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">
            Orders
            {!notificationsLoading && notifications && Number(notifications.newOrders) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.newOrders.toString()}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {!notificationsLoading && notifications && Number(notifications.newQuotes) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.newQuotes.toString()}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="testimonies">
            Testimonies
            {!notificationsLoading && notifications && Number(notifications.newTestimonies) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.newTestimonies.toString()}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messaging">
            Inbox
            {!notificationsLoading && notifications && Number(notifications.newMessagesCount) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.newMessagesCount.toString()}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings" disabled={!canAccessSettings && !permissionsLoading}>
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <AdminProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrdersTab />
        </TabsContent>

        <TabsContent value="requests">
          <AdminRequestsTab />
        </TabsContent>

        <TabsContent value="testimonies">
          <AdminTestimoniesTab />
        </TabsContent>

        <TabsContent value="messaging">
          <AdminMessagingTab />
        </TabsContent>

        <TabsContent value="coupons">
          <AdminCouponsTab />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTab />
        </TabsContent>

        <TabsContent value="feedback">
          <AdminFeedbackTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalyticsTab />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSystemSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Admin() {
  return (
    <RequireAdmin>
      <RequireAdminAccessGate>
        <AdminDashboardContent />
      </RequireAdminAccessGate>
    </RequireAdmin>
  );
}
