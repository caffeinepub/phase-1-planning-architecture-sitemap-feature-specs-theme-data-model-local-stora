import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingBag, Users, MessageSquare } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAdmin from '../components/auth/RequireAdmin';
import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminFeedbackTab from '../components/admin/AdminFeedbackTab';

export default function Admin() {
  return (
    <RequireAdmin>
      <PageLayout
        title="Admin Panel"
        description="Manage products, orders, users, and feedback."
      >
        <FadeInSection>
          <section className="section-spacing">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="products" className="gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="feedback" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <AdminProductsTab />
              </TabsContent>

              <TabsContent value="orders">
                <AdminOrdersTab />
              </TabsContent>

              <TabsContent value="users">
                <AdminUsersTab />
              </TabsContent>

              <TabsContent value="feedback">
                <AdminFeedbackTab />
              </TabsContent>
            </Tabs>
          </section>
        </FadeInSection>
      </PageLayout>
    </RequireAdmin>
  );
}
