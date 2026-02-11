import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Ticket, Plus, Loader2, AlertCircle, Send, RefreshCw } from 'lucide-react';
import { useGetAllCoupons, useCreateCoupon, useToggleCouponValidity, useSendCouponToCustomer } from '../../hooks/useAdminCoupons';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { useActor } from '../../hooks/useActor';

export default function AdminCouponsTab() {
  const { data: coupons = [], isLoading, error, refetch } = useGetAllCoupons();
  const createCoupon = useCreateCoupon();
  const toggleValidity = useToggleCouponValidity();
  const sendCoupon = useSendCouponToCustomer();
  const { actor } = useActor();

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [customerPrincipal, setCustomerPrincipal] = useState('');
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [validationError, setValidationError] = useState('');

  // Check if send coupon functionality is available
  const canSendCoupons = actor && typeof (actor as any).sendCouponToCustomer === 'function';

  const validatePrincipal = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError('Customer Principal cannot be empty');
      return false;
    }

    try {
      Principal.fromText(input.trim());
      setValidationError('');
      return true;
    } catch (error) {
      setValidationError('Invalid Principal format');
      return false;
    }
  };

  const handleCreateCoupon = async () => {
    if (!newCode.trim()) {
      toast.error('Coupon code cannot be empty');
      return;
    }

    const discount = parseInt(newDiscount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    try {
      await createCoupon.mutateAsync({
        code: newCode.trim().toUpperCase(),
        discount,
      });

      toast.success('Coupon created successfully');
      setNewCode('');
      setNewDiscount('');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create coupon');
    }
  };

  const handleToggleValidity = async (couponId: bigint, currentValidity: boolean) => {
    try {
      await toggleValidity.mutateAsync({
        couponId,
        valid: !currentValidity,
      });

      toast.success(`Coupon ${!currentValidity ? 'enabled' : 'disabled'}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle coupon validity');
    }
  };

  const handleSendCoupon = async () => {
    if (!validatePrincipal(customerPrincipal)) return;

    if (!selectedCouponCode) {
      toast.error('Please select a coupon code');
      return;
    }

    try {
      await sendCoupon.mutateAsync({
        customerId: customerPrincipal.trim(),
        couponCode: selectedCouponCode,
      });

      toast.success('Coupon sent to customer inbox');
      setCustomerPrincipal('');
      setSelectedCouponCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send coupon');
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Coupons refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh coupons');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load coupons</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Coupon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Coupon
          </CardTitle>
          <CardDescription>
            Generate discount codes for customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Coupon Code</Label>
              <Input
                id="coupon-code"
                placeholder="e.g., SAVE20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 20"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleCreateCoupon}
            disabled={!newCode.trim() || !newDiscount || createCoupon.isPending}
            className="w-full"
          >
            {createCoupon.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </CardContent>
      </Card>

      {/* Send Coupon to Customer */}
      {canSendCoupons ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Coupon to Customer
            </CardTitle>
            <CardDescription>
              Deliver a coupon directly to a customer's inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-principal">Customer Principal ID</Label>
              <Input
                id="customer-principal"
                placeholder="Enter customer principal..."
                value={customerPrincipal}
                onChange={(e) => {
                  setCustomerPrincipal(e.target.value);
                  if (validationError) validatePrincipal(e.target.value);
                }}
                onBlur={() => {
                  if (customerPrincipal.trim()) validatePrincipal(customerPrincipal);
                }}
              />
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon-select">Select Coupon</Label>
              <select
                id="coupon-select"
                className="w-full px-3 py-2 border rounded-md"
                value={selectedCouponCode}
                onChange={(e) => setSelectedCouponCode(e.target.value)}
                disabled={!customerPrincipal.trim() || !!validationError}
              >
                <option value="">Choose a coupon...</option>
                {coupons
                  .filter((c) => c.valid)
                  .map((coupon) => (
                    <option key={coupon.code} value={coupon.code}>
                      {coupon.code} - {coupon.discount}% off
                    </option>
                  ))}
              </select>
            </div>

            <Button
              onClick={handleSendCoupon}
              disabled={
                !customerPrincipal.trim() ||
                !selectedCouponCode ||
                !!validationError ||
                sendCoupon.isPending
              }
              className="w-full"
            >
              {sendCoupon.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Send Coupon
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                The coupon will appear in the customer's Inbox page and can be applied at checkout.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Coupon to Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Coupon sending functionality is not available. This feature requires backend support.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                All Coupons
              </CardTitle>
              <CardDescription>
                Manage coupon codes and validity
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No coupons created yet. Create your first coupon above.
            </p>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-mono font-bold">{coupon.code}</code>
                        <Badge variant={coupon.valid ? 'default' : 'secondary'}>
                          {coupon.valid ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {coupon.discount}% discount
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`toggle-${coupon.id}`} className="text-sm">
                      {coupon.valid ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch
                      id={`toggle-${coupon.id}`}
                      checked={coupon.valid}
                      onCheckedChange={() => handleToggleValidity(coupon.id, coupon.valid)}
                      disabled={toggleValidity.isPending}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
