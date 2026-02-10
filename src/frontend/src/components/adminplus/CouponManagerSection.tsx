import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Ticket, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetCouponsActiveState, useSetCouponsActiveState } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function CouponManagerSection() {
  const { data: couponsEnabled = true, isLoading } = useGetCouponsActiveState();
  const setCouponsActive = useSetCouponsActiveState();

  const handleToggle = async () => {
    try {
      await setCouponsActive.mutateAsync(!couponsEnabled);
      toast.success(couponsEnabled ? 'Coupons disabled globally' : 'Coupons enabled globally');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update coupon state');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Global Coupon Master Switch
          </CardTitle>
          <CardDescription>
            Enable or disable all coupon usage across the entire store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading coupon state...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Coupon System Status</div>
                  <div className="text-sm text-muted-foreground">
                    {couponsEnabled 
                      ? 'Coupons are currently enabled and can be applied at checkout' 
                      : 'Coupons are currently disabled store-wide'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={couponsEnabled ? 'default' : 'secondary'}>
                    {couponsEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Switch
                    checked={couponsEnabled}
                    onCheckedChange={handleToggle}
                    disabled={setCouponsActive.isPending}
                  />
                </div>
              </div>

              {!couponsEnabled && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Coupons are currently disabled. Customers cannot apply coupon codes at checkout, and existing coupon codes will not provide discounts.
                  </AlertDescription>
                </Alert>
              )}

              {couponsEnabled && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Coupons are active. Valid coupon codes can be applied during checkout for discounts.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Understanding the global coupon control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <div className="font-medium min-w-[80px]">Enabled:</div>
            <div>All valid coupons can be applied at checkout. Customers will see the coupon input field and can receive discounts.</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[80px]">Disabled:</div>
            <div>The coupon input field is hidden or disabled in the cart. Even if a customer tries to apply a code, it will be rejected with a message.</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[80px]">Backend:</div>
            <div>The backend enforces this setting. Orders cannot be created with coupon discounts when coupons are globally disabled.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
