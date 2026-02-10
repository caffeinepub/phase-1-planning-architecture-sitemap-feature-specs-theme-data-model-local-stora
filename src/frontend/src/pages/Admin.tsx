import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireAdmin from '../components/auth/RequireAdmin';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import AdminRequestsTab from '../components/admin/AdminRequestsTab';
import AdminTestimoniesTab from '../components/admin/AdminTestimoniesTab';

function AdminContent() {
  return (
    <PageLayout
      title="Admin Dashboard"
      description="Manage orders, requests, and testimonies"
    >
      <FadeInSection>
        <section className="section-spacing">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="testimonies">Testimonies</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <AdminOrdersTab />
            </TabsContent>

            <TabsContent value="requests">
              <AdminRequestsTab />
            </TabsContent>

            <TabsContent value="testimonies">
              <AdminTestimoniesTab />
            </TabsContent>
          </Tabs>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}

export default function Admin() {
  return (
    <RequireAdmin>
      <AdminContent />
    </RequireAdmin>
  );
}
