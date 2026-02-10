import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';

export default function Terms() {
  return (
    <PageLayout
      title="Terms of Service"
      description="Please read these terms carefully before using our services."
    >
      <FadeInSection>
        <Card className="border-border/40 hover-lift">
          <CardContent className="pt-6 space-y-6">
            <section>
              <CardTitle className="text-xl mb-3">1. Acceptance of Terms</CardTitle>
              <p className="text-muted-foreground">
                By accessing and using Arcane Artifacts, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">2. Use of Service</CardTitle>
              <p className="text-muted-foreground">
                You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">3. Product Information</CardTitle>
              <p className="text-muted-foreground">
                We strive to provide accurate information about our artifacts. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">4. Purchases and Payment</CardTitle>
              <p className="text-muted-foreground">
                All purchases are subject to product availability. We reserve the right to refuse or cancel any order for any reason. Payment must be made in ICP tokens through our secure blockchain-based system.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">5. Intellectual Property</CardTitle>
              <p className="text-muted-foreground">
                The content, organization, graphics, design, and other matters related to Arcane Artifacts are protected under applicable copyrights and other proprietary laws. Copying, redistribution, or publication of any such matters is strictly prohibited.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">6. Limitation of Liability</CardTitle>
              <p className="text-muted-foreground">
                Arcane Artifacts shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">7. Changes to Terms</CardTitle>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">8. Contact Information</CardTitle>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at contact@arcaneartifacts.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </FadeInSection>
    </PageLayout>
  );
}
