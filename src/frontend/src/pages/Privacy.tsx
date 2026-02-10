import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';

export default function Privacy() {
  return (
    <PageLayout
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your personal information."
    >
      <FadeInSection>
        <Card className="border-border/40 hover-lift">
          <CardContent className="pt-6 space-y-6">
            <section>
              <CardTitle className="text-xl mb-3">1. Information We Collect</CardTitle>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, and transaction history.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">2. How We Use Your Information</CardTitle>
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">3. Information Sharing</CardTitle>
              <p className="text-muted-foreground">
                We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, or when required by law.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">4. Data Security</CardTitle>
              <p className="text-muted-foreground">
                We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. Our platform is built on the Internet Computer blockchain, providing enhanced security through decentralization.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">5. Your Rights</CardTitle>
              <p className="text-muted-foreground">
                You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us at any time.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">6. Cookies and Tracking</CardTitle>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to collect information about your browsing activities and to personalize your experience on our platform.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">7. Changes to This Policy</CardTitle>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <Separator />

            <section>
              <CardTitle className="text-xl mb-3">8. Contact Us</CardTitle>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@arcaneartifacts.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </FadeInSection>
    </PageLayout>
  );
}
