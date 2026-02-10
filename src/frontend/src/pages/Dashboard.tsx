import RequireAuth from '../components/auth/RequireAuth';
import ProfileSetup from '../components/auth/ProfileSetup';
import { useGetCallerUserProfile, useGetMyOrders, useGetMySavedArtifacts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Package, Heart } from 'lucide-react';
import { useState } from 'react';

function DashboardContent() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: orders } = useGetMyOrders();
  const { data: savedArtifacts } = useGetMySavedArtifacts();
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);

  const showProfileSetup = !profileLoading && isFetched && userProfile === null && !profileSetupComplete;

  if (showProfileSetup) {
    return <ProfileSetup onComplete={() => setProfileSetupComplete(true)} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Dashboard
          </h1>
          {userProfile && (
            <p className="text-lg text-muted-foreground">
              Welcome back, {userProfile.name}
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                {userProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-lg">{userProfile.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg">{userProfile.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading profile...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id.toString()} className="border-border/40">
                        <CardHeader>
                          <CardTitle className="text-base">Order #{order.id.toString()}</CardTitle>
                          <CardDescription>
                            {order.productIds.length} item(s) • Total: {Number(order.totalAmount)} cycles
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No orders yet. Start shopping to see your orders here!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Artifacts Tab */}
          <TabsContent value="saved">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Saved Artifacts</CardTitle>
                <CardDescription>Your collection of favorite items</CardDescription>
              </CardHeader>
              <CardContent>
                {savedArtifacts && savedArtifacts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedArtifacts.map((artifact, idx) => (
                      <Card key={idx} className="border-border/40">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Product ID: {artifact.productId.toString()}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No saved artifacts yet. Browse the shop and save your favorites!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
