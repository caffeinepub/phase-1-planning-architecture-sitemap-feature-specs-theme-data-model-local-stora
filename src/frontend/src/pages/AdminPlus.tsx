import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, MessageCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import RequireOwner from '../components/auth/RequireOwner';
import PortfolioManagerSection from '../components/adminplus/PortfolioManagerSection';
import TestimonyManagerSection from '../components/adminplus/TestimonyManagerSection';

export default function AdminPlus() {
  return (
    <RequireOwner>
      <PageLayout
        title="Admin+ Panel"
        description="Advanced owner-only management tools for portfolios and testimonies."
      >
        <FadeInSection>
          <section className="section-spacing">
            <Tabs defaultValue="portfolios" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="portfolios" className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Portfolios
                </TabsTrigger>
                <TabsTrigger value="testimonies" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Testimonies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="portfolios">
                <PortfolioManagerSection />
              </TabsContent>

              <TabsContent value="testimonies">
                <TestimonyManagerSection />
              </TabsContent>
            </Tabs>
          </section>
        </FadeInSection>
      </PageLayout>
    </RequireOwner>
  );
}
