import RequireAdmin from '../components/auth/RequireAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Users } from 'lucide-react';
import { useGetAllProducts, useGetAllOrders } from '../hooks/useQueries';

function AdminContent() {
  const { data: products } = useGetAllProducts();
  const { data: orders } = useGetAllOrders();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Admin Panel
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage products, orders, and users
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>View and manage artifact inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <Card key={product.id.toString()} className="border-border/40">
                        <CardHeader>
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          <CardDescription>
                            Price: {Number(product.price)} cycles • Stock: {Number(product.stock)}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No products yet. Product creation UI coming in Phase 2.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and process customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id.toString()} className="border-border/40">
                        <CardHeader>
                          <CardTitle className="text-base">Order #{order.id.toString()}</CardTitle>
                          <CardDescription>
                            User: {order.userId.toString().slice(0, 10)}... • 
                            Total: {Number(order.totalAmount)} cycles
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No orders yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  User management UI coming in Phase 2.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <RequireAdmin>
      <AdminContent />
    </RequireAdmin>
  );
}
