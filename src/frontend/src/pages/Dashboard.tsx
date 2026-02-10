import { useState, useMemo } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMyOrders, useGetMySavedArtifacts, useGetAllProducts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Package, Heart, ShoppingBag, Scroll } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import InventoryPanel from '../components/dashboard/InventoryPanel';
import GuildOrdersPanel from '../components/dashboard/GuildOrdersPanel';
import ErrorState from '../components/system/ErrorState';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: orders = [], isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useGetMyOrders();
  const { data: savedArtifacts = [], isLoading: savedLoading, error: savedError, refetch: refetchSaved } = useGetMySavedArtifacts();
  const { data: products = [] } = useGetAllProducts();
  const [activeTab, setActiveTab] = useState('profile');

  // Build product lookup for saved artifacts
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach(p => map.set(p.id.toString(), p));
    return map;
  }, [products]);

  if (!identity) {
    return (
      <PageLayout title="Dashboard" description="Manage your profile and orders">
        <FadeInSection>
          <Card className="border-border/40 text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                Please log in to access your dashboard.
              </p>
            </CardContent>
          </Card>
        </FadeInSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Your Dashboard"
      description="Manage your profile, orders, and saved artifacts."
    >
      <FadeInSection>
        <section className="section-spacing">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 h-auto flex-wrap">
              <TabsTrigger value="profile" className="gap-2 py-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 py-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">My Orders</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2 py-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2 py-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
              </TabsTrigger>
              <TabsTrigger value="guild" className="gap-2 py-2">
                <Scroll className="h-4 w-4" />
                <span className="hidden sm:inline">Quests</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              {profileLoading ? (
                <Card className="border-border/40">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-arcane-gold" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userProfile ? (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Name</p>
                          <p className="font-medium">{userProfile.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="font-medium">{userProfile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Principal ID</p>
                          <p className="font-mono text-xs break-all">{identity.getPrincipal().toString()}</p>
                        </div>
                      </>
                    ) : (
                      <Alert>
                        <AlertDescription>
                          Profile information not available.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {ordersError ? (
                <ErrorState error={ordersError} onRetry={refetchOrders} />
              ) : ordersLoading ? (
                <Card className="border-border/40">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-arcane-gold" />
                      My Orders
                    </CardTitle>
                    <CardDescription>
                      {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          You haven't placed any orders yet. Visit the Shop to get started!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id.toString()}
                            className="p-4 rounded-lg border border-border/40 bg-card/50"
                          >
                            <div className="flex items-start justify-between mb-2 flex-col sm:flex-row gap-2">
                              <div>
                                <p className="font-semibold">Order #{order.id.toString()}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.productIds.length} {order.productIds.length === 1 ? 'item' : 'items'}
                                </p>
                              </div>
                              <Badge className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
                                {Number(order.totalAmount)} ICP
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Saved Artifacts Tab */}
            <TabsContent value="saved">
              {savedError ? (
                <ErrorState error={savedError} onRetry={refetchSaved} />
              ) : savedLoading ? (
                <Card className="border-border/40">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-arcane-gold" />
                      Saved Artifacts
                    </CardTitle>
                    <CardDescription>
                      {savedArtifacts.length} {savedArtifacts.length === 1 ? 'artifact' : 'artifacts'} saved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedArtifacts.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          You haven't saved any artifacts yet. Browse the Shop to find items you like!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedArtifacts.map((artifact) => {
                          const product = productMap.get(artifact.productId.toString());
                          
                          if (!product) {
                            return (
                              <div
                                key={artifact.productId.toString()}
                                className="p-4 rounded-lg border border-border/40 bg-card/50"
                              >
                                <p className="text-sm text-muted-foreground">
                                  Product no longer available
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={artifact.productId.toString()}
                              className="p-4 rounded-lg border border-border/40 bg-card/50 hover:border-arcane-gold/50 transition-colors"
                            >
                              <h4 className="font-semibold mb-1">{product.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {product.description}
                              </p>
                              <p className="text-lg font-bold text-arcane-gold">
                                {Number(product.price)} ICP
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Inventory/Cart Tab */}
            <TabsContent value="inventory">
              <InventoryPanel />
            </TabsContent>

            {/* Guild Orders Tab */}
            <TabsContent value="guild">
              <GuildOrdersPanel />
            </TabsContent>
          </Tabs>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
