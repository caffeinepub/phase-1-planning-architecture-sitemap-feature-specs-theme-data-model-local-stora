import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MessageSquare, ShoppingCart, Plus, FileText, Tag, Image } from 'lucide-react';
import { useGetAllProductsAdmin, useGetAllTestimonies } from '../../../hooks/useQueries';
import type { DashboardSection } from '../../../pages/Admin';
import ErrorState from '../../system/ErrorState';

interface DashboardHomeViewProps {
  onNavigate: (section: DashboardSection) => void;
}

export default function DashboardHomeView({ onNavigate }: DashboardHomeViewProps) {
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProductsAdmin();
  const { data: testimonies = [], isLoading: testimoniesLoading } = useGetAllTestimonies();

  const pendingTestimonies = testimonies.filter((t: any) => !t.approved);
  const recentProducts = products.slice(0, 5);

  if (productsError) {
    return <ErrorState title="Failed to load dashboard data" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard Home</h2>
        <p className="text-muted-foreground">Welcome to your admin control center</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => onNavigate('shop')}
            >
              <Package className="h-8 w-8 text-primary" />
              <span className="font-semibold">Create Product</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => onNavigate('coupons')}
            >
              <Tag className="h-8 w-8 text-primary" />
              <span className="font-semibold">Create Coupon</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => onNavigate('portfolio')}
            >
              <Image className="h-8 w-8 text-primary" />
              <span className="font-semibold">Upload Portfolio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Products</CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{products.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Testimonies</CardDescription>
          </CardHeader>
          <CardContent>
            {testimoniesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{pendingTestimonies.length}</div>
                {pendingTestimonies.length > 0 && (
                  <Badge variant="destructive">New</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Customer Requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">View in Requests tab</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sales Summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">View in Analytics</p>
          </CardContent>
        </Card>
      </div>

      {/* Recently Added Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recently Added Products</CardTitle>
              <CardDescription>Latest products in your catalog</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('shop')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No products yet. Create your first product to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product: any) => (
                <div
                  key={product.id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.isInStock ? 'default' : 'secondary'}>
                      {product.isInStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    <span className="text-sm font-medium">{Number(product.price)} ICP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testimonies Pending Approval */}
      {pendingTestimonies.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Testimonies Pending Approval</CardTitle>
                <CardDescription>{pendingTestimonies.length} awaiting review</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate('testimonies')}>
                Review All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTestimonies.slice(0, 3).map((testimony: any) => (
                <div
                  key={testimony.id.toString()}
                  className="p-3 rounded-lg border"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{testimony.author}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {testimony.content}
                      </p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
