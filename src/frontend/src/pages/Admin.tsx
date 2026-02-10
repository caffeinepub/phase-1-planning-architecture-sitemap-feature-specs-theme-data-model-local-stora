import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAdmin from '../components/auth/RequireAdmin';

export default function Admin() {
  return (
    <RequireAdmin>
      <PageLayout
        title="Admin Panel"
        description="Manage products, orders, and users."
      >
        <FadeInSection>
          <section className="section-spacing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Admin Panel
                </CardTitle>
                <CardDescription>
                  Administrative features are currently being updated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Products</h3>
                      <p className="text-sm text-muted-foreground">Manage product catalog</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Orders</h3>
                      <p className="text-sm text-muted-foreground">View and manage orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Users</h3>
                      <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </FadeInSection>
      </PageLayout>
    </RequireAdmin>
  );
}
