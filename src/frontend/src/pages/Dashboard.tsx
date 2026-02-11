import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ShoppingBag, RefreshCw } from 'lucide-react';
import { useGetCallerUserProfile, useGetMyOrders, useGetAllProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ErrorState from '../components/system/ErrorState';
import OrderTrackingPanel from '../components/dashboard/OrderTrackingPanel';
import type { OrderWithTracking } from '../types/orderTracking';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: orders = [], isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useGetMyOrders();
  const { data: products = [] } = useGetAllProducts();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (profileFetched && userProfile === null && identity) {
      setShowProfileSetup(true);
    } else if (userProfile) {
      setShowProfileSetup(false);
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile, profileFetched, identity]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: email.trim() });
      toast.success('Profile saved successfully');
      setShowProfileSetup(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    }
  };

  const handleRefreshOrders = () => {
    refetchOrders();
    toast.info('Refreshing orders...');
  };

  if (showProfileSetup) {
    return (
      <PageLayout title="Complete Your Profile" description="Set up your account information">
        <FadeInSection>
          <section className="section-spacing">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>Please complete your profile to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
                    {saveProfile.isPending ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Dashboard" description="Manage your profile and orders">
      <FadeInSection>
        <section className="section-spacing">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {profileLoading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ) : userProfile ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-name">Name</Label>
                        <Input
                          id="profile-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-email">Email</Label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button type="submit" disabled={saveProfile.isPending}>
                        {saveProfile.isPending ? 'Saving...' : 'Update Profile'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={handleRefreshOrders}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Orders
                  </Button>
                </div>

                {ordersError ? (
                  <ErrorState
                    title="Failed to load orders"
                    onRetry={refetchOrders}
                  />
                ) : ordersLoading ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <p className="text-muted-foreground">You haven't placed any orders yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: OrderWithTracking) => (
                      <OrderTrackingPanel key={order.id.toString()} order={order} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
