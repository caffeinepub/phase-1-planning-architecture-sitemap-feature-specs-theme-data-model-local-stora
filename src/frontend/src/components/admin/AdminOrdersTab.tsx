import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Search } from 'lucide-react';
import { useGetAllOrders } from '../../hooks/useQueries';

export default function AdminOrdersTab() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [principalFilter, setPrincipalFilter] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesOrderId = !orderIdFilter || order.id.toString().includes(orderIdFilter);
      const matchesPrincipal = !principalFilter || order.userId.toString().toLowerCase().includes(principalFilter.toLowerCase());
      return matchesOrderId && matchesPrincipal;
    });
  }, [orders, orderIdFilter, principalFilter]);

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-arcane-gold" />
          All Orders
        </CardTitle>
        <CardDescription>
          {orders.length} total {orders.length === 1 ? 'order' : 'orders'}
          {filteredOrders.length !== orders.length && ` (${filteredOrders.length} shown)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="order-id-filter">Filter by Order ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="order-id-filter"
                placeholder="Enter order ID..."
                value={orderIdFilter}
                onChange={(e) => setOrderIdFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="principal-filter">Filter by Principal</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="principal-filter"
                placeholder="Enter principal..."
                value={principalFilter}
                onChange={(e) => setPrincipalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Alert>
            <AlertDescription>
              {orders.length === 0 
                ? 'No orders have been placed yet.'
                : 'No orders match your filters.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id.toString()}
                className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">Order #{order.id.toString()}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.productIds.length} {order.productIds.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <Badge className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
                    {Number(order.totalAmount)} ICP
                  </Badge>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Buyer Principal:</p>
                  <p className="font-mono text-xs break-all">{order.userId.toString()}</p>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Product IDs:</p>
                  <p className="font-mono text-xs">
                    {order.productIds.map(id => id.toString()).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
