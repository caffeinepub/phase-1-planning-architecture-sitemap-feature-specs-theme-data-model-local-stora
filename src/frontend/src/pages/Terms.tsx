import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 10, 2026
          </p>
        </div>

        <Card className="border-border/40">
          <CardContent className="pt-6 space-y-6">
            <section>
              <CardTitle className="text-xl mb-3">1. Acceptance of Terms</CardTitle>
              <p className="text-muted-foreground">
                By accessing and using Arcane Artifacts, you accept and agree to be bound by the terms 
                and provision of this agreement. This is a placeholder for Phase 1 and will be replaced 
                with actual legal terms reviewed by legal counsel.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">2. Use of Service</CardTitle>
              <p className="text-muted-foreground">
                You agree to use this service only for lawful purposes and in accordance with these Terms. 
                Placeholder text for Phase 1 - actual terms to be added.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">3. User Accounts</CardTitle>
              <p className="text-muted-foreground">
                When you create an account with us via Internet Identity, you are responsible for 
                maintaining the security of your account. Placeholder text for Phase 1.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">4. Intellectual Property</CardTitle>
              <p className="text-muted-foreground">
                The service and its original content, features, and functionality are owned by Arcane 
                Artifacts and are protected by international copyright, trademark, and other intellectual 
                property laws. Placeholder text for Phase 1.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">5. Limitation of Liability</CardTitle>
              <p className="text-muted-foreground">
                In no event shall Arcane Artifacts be liable for any indirect, incidental, special, 
                consequential or punitive damages. Placeholder text for Phase 1 - actual legal terms 
                to be added after legal review.
              </p>
            </section>

            <Separator className="bg-border/40" />

            <section>
              <CardTitle className="text-xl mb-3">6. Changes to Terms</CardTitle>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time. Placeholder text 
                for Phase 1.
              </p>
            </section>
          </CardContent>
        </Card>

        <Card className="mt-6 border-arcane-gold/30 bg-accent/20">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> This is placeholder legal text for Phase 1 development. 
              Actual terms of service will be drafted and reviewed by legal counsel before production deployment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
