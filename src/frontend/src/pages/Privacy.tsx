import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 10, 2026
          </p>
        </div>

        <Card className="border-border/40">
          <CardContent className="pt-6 space-y-6">
            <section>
              <CardTitle className="text-xl mb-3">1. Information We Collect</CardTitle>
              <p className="text-muted-foreground">
                We collect information that you provide directly to us through Internet Identity authentication 
                and profile creation. This is placeholder text for Phase 1 and will be replaced with actual 
                privacy policy reviewed by legal counsel.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">2. How We Use Your Information</CardTitle>
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our services. 
                Placeholder text for Phase 1 - actual privacy practices to be documented.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">3. Information Sharing</CardTitle>
              <p className="text-muted-foreground">
                We do not share your personal information with third parties except as described in this 
                privacy policy. Placeholder text for Phase 1.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">4. Data Security</CardTitle>
              <p className="text-muted-foreground">
                We use the Internet Computer's decentralized infrastructure to secure your data. 
                Placeholder text for Phase 1 - actual security measures to be documented.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">5. Your Rights</CardTitle>
              <p className="text-muted-foreground">
                You have the right to access, update, or delete your personal information. 
                Placeholder text for Phase 1 - actual rights and procedures to be documented.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">6. Cookies and Local Storage</CardTitle>
              <p className="text-muted-foreground">
                We use local storage to enhance your experience, including storing recently viewed items 
                and session preferences. Placeholder text for Phase 1.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">7. Changes to Privacy Policy</CardTitle>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page. Placeholder text for Phase 1.
              </p>
            </section>
          </CardContent>
        </Card>

        <Card className="mt-6 border-arcane-gold/30 bg-accent/20">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> This is placeholder legal text for Phase 1 development. 
              Actual privacy policy will be drafted and reviewed by legal counsel before production deployment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
