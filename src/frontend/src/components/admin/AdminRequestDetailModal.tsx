import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Send, Gift, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useApproveRequest, useDeclineRequest, useSendMessageToCustomer, useSendCouponToCustomer, useConvertRequestToOrder } from '../../hooks/useQueries';
import type { RequestDetail } from '../../types/phase5b';

interface AdminRequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RequestDetail | null;
  isLoading: boolean;
}

export default function AdminRequestDetailModal({
  open,
  onOpenChange,
  request,
  isLoading,
}: AdminRequestDetailModalProps) {
  const [message, setMessage] = useState('');
  const [couponId, setCouponId] = useState('');
  const [showDeclineInput, setShowDeclineInput] = useState(false);

  const approveRequest = useApproveRequest();
  const declineRequest = useDeclineRequest();
  const sendMessage = useSendMessageToCustomer();
  const sendCoupon = useSendCouponToCustomer();
  const convertToOrder = useConvertRequestToOrder();

  const handleApprove = async () => {
    if (!request) return;
    try {
      await approveRequest.mutateAsync(request.id);
      toast.success('Request approved successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to approve request:', error);
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleDecline = async () => {
    if (!request) return;
    if (!showDeclineInput) {
      setShowDeclineInput(true);
      return;
    }
    try {
      await declineRequest.mutateAsync(request.id);
      toast.success('Request declined');
      setShowDeclineInput(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to decline request:', error);
      toast.error(error.message || 'Failed to decline request');
    }
  };

  const handleSendMessage = async () => {
    if (!request || !message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    try {
      await sendMessage.mutateAsync({
        customerId: request.submittedBy,
        message: message.trim(),
      });
      toast.success('Message sent successfully');
      setMessage('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleSendCoupon = async () => {
    if (!request || !couponId.trim()) {
      toast.error('Please enter a coupon ID');
      return;
    }
    try {
      const parsedCouponId = BigInt(couponId.trim());
      await sendCoupon.mutateAsync({
        customerId: request.submittedBy,
        couponId: parsedCouponId,
      });
      toast.success('Coupon sent successfully');
      setCouponId('');
    } catch (error: any) {
      console.error('Failed to send coupon:', error);
      if (error.message && error.message.includes('Cannot convert')) {
        toast.error('Invalid coupon ID format. Please enter a valid number.');
      } else {
        toast.error(error.message || 'Failed to send coupon');
      }
    }
  };

  const handleConvertToOrder = async () => {
    if (!request) {
      toast.error('No request selected');
      return;
    }
    try {
      await convertToOrder.mutateAsync(request.id);
      toast.success('Request converted to order successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to convert to order:', error);
      toast.error(error.message || 'Failed to convert to order');
    }
  };

  const getStatusLabel = (status: any): string => {
    if (typeof status === 'object' && status.__kind__) {
      return status.__kind__;
    }
    return String(status);
  };

  const isPending = (status: any): boolean => {
    if (typeof status === 'object' && status.__kind__) {
      return status.__kind__ === 'pending';
    }
    return status === 'pending';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            Review and manage custom request submission
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !request ? (
          <p className="text-muted-foreground">No request data available</p>
        ) : (
          <div className="space-y-6">
            {/* Request Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Request #{request.id.toString()}</h3>
                <Badge variant={getStatusLabel(request.status) === 'approved' ? 'default' : getStatusLabel(request.status) === 'declined' ? 'destructive' : 'secondary'}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{request.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium break-all">{request.email}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Submitted by:</span>
                  <p className="font-mono text-xs break-all">{request.submittedBy.toString()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <p className="text-sm p-3 bg-accent/10 rounded-lg">{request.description}</p>
            </div>

            {/* Pricing Preference */}
            <div className="space-y-2">
              <Label>Pricing Preference</Label>
              <p className="text-sm p-3 bg-accent/10 rounded-lg">
                {typeof request.pricingPreference === 'object' && request.pricingPreference.__kind__ === 'flexible' 
                  ? 'Flexible' 
                  : typeof request.pricingPreference === 'object' && request.pricingPreference.__kind__ === 'range'
                    ? `Range: ${request.pricingPreference.value}`
                    : String(request.pricingPreference)}
              </p>
            </div>

            {/* Media Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Attachments ({request.attachments.length})</Label>
                <div className="grid grid-cols-3 gap-2">
                  {request.attachments.map((item, index) => (
                    <div key={index} className="relative">
                      {item.filename.match(/\.(mp4|mov|avi|webm)$/i) ? (
                        <video
                          src={item.blob.getDirectURL()}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <img
                          src={item.blob.getDirectURL()}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {isPending(request.status) && (
              <div className="space-y-3 pt-4 border-t">
                <Label>Admin Actions</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleApprove}
                    disabled={approveRequest.isPending}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {approveRequest.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={declineRequest.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {declineRequest.isPending ? 'Declining...' : 'Decline'}
                  </Button>
                </div>
              </div>
            )}

            {/* Send Message */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Send Message to Customer</Label>
              <Textarea
                placeholder="Enter message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessage.isPending}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {sendMessage.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>

            {/* Send Coupon */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Send Coupon to Customer</Label>
              <Input
                type="number"
                placeholder="Enter coupon ID (numeric)"
                value={couponId}
                onChange={(e) => setCouponId(e.target.value)}
              />
              <Button
                onClick={handleSendCoupon}
                disabled={!couponId.trim() || sendCoupon.isPending}
                className="w-full"
              >
                <Gift className="mr-2 h-4 w-4" />
                {sendCoupon.isPending ? 'Sending...' : 'Send Coupon'}
              </Button>
            </div>

            {/* Convert to Order */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Convert to Order</Label>
              <Button
                onClick={handleConvertToOrder}
                disabled={convertToOrder.isPending}
                className="w-full"
                variant="outline"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {convertToOrder.isPending ? 'Converting...' : 'Convert to Order'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
