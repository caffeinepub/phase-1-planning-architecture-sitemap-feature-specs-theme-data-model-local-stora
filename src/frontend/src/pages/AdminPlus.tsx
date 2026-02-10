import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, DollarSign, BarChart3, ShieldAlert } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireOwner from '../components/auth/RequireOwner';
import AdvancedShopControlsSection from '../components/adminplus/AdvancedShopControlsSection';
import CouponManagerSection from '../components/adminplus/CouponManagerSection';
import AdminRegistrySection from '../components/adminplus/AdminRegistrySection';
import AdminPasswordResetSection from '../components/adminplus/AdminPasswordResetSection';
import AnalyticsSnapshotSection from '../components/adminplus/AnalyticsSnapshotSection';

export default function AdminPlus() {
  return (
    <RequireOwner>
      <PageLayout
        title="Admin+ Panel"
        description="Advanced owner-only management tools and master controls."
      >
        <FadeInSection>
          <section className="section-spacing space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Site Analytics Snapshot
                </CardTitle>
                <CardDescription>
                  Quick overview of total orders, recent activity, and sales performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsSnapshotSection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Shop Controls
                </CardTitle>
                <CardDescription>
                  Emergency shop disable, price overrides, and product visibility management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedShopControlsSection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Global Coupon Manager
                </CardTitle>
                <CardDescription>
                  Enable or disable all coupon usage across the entire store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CouponManagerSection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Admin Registry
                </CardTitle>
                <CardDescription>
                  Promote or demote admins and manage admin permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRegistrySection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Admin Password Management
                </CardTitle>
                <CardDescription>
                  Securely reset or update admin login passwords
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPasswordResetSection />
              </CardContent>
            </Card>
          </section>
        </FadeInSection>
      </PageLayout>
    </RequireOwner>
  );
}
