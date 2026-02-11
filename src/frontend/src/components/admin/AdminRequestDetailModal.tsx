import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Send, Gift, ShoppingCart, Download, ExternalLink, Loader2 } from 'lucide-react';
import type { RequestDetail, MessageAttachment } from '../../types/phase5b';
import { useApproveRequest, useDeclineRequest, useSendMessageToCustomer, useSendCouponToCustomer, useConvertRequestToOrder } from '../../hooks/useQueries';
import MessageAttachmentPicker from './MessageAttachmentPicker';
import { toast } from 'sonner';

interface AdminRequestDetailModalProps {
  request: RequestDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminRequestDetailModal({
  request,
  open,
  onOpenChange,
}: AdminRequestDetailModalProps) {
  const [messageBody, setMessageBody] = useState('');
  const [messageAttachments, setMessageAttachments] = useState<MessageAttachment[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [orderPrice, setOrderPrice] = useState('');

  const approveRequest = useApproveRequest();
  const declineRequest = useDeclineRequest();
  const sendMessage = useSendMessageToCustomer();
  const sendCoupon = useSendCouponToCustomer();
  const convertToOrder = useConvertRequestToOrder();

  if (!request) return null;

  const isApproved = request.status.__kind__ === 'approved';
  const isDeclined = request.status.__kind__ === 'declined';
  const isPending = request.status.__kind__ === 'pending';

  const handleApprove = async () => {
    try {
      await approveRequest.mutateAsync(request.id);
      toast.success('Request approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleDecline = async () => {
    try {
      await declineRequest.mutateAsync(request.id);
      toast.success('Request declined');
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline request');
    }
  };

  const handleSendMessage = async () => {
    if (!messageBody.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        customerId: request.submittedBy,
        subject: `Re: Request #${request.id.toString()}`,
        message: messageBody,
        attachments: messageAttachments,
      });
      toast.success('Message sent to customer');
      setMessageBody('');
      setMessageAttachments([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleSendCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      await sendCoupon.mutateAsync({
        customerId: request.submittedBy,
        couponCode: couponCode.trim(),
      });
      toast.success('Coupon sent to customer');
      setCouponCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send coupon');
    }
  };

  const handleConvertToOrder = async () => {
    if (!orderPrice.trim()) {
      toast.error('Please enter an order price');
      return;
    }

    const price = parseFloat(orderPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const orderId = await convertToOrder.mutateAsync({
        requestId: request.id,
        price: BigInt(Math.floor(price * 100)), // Convert to cents
      });
      toast.success(`Request converted to Order #${orderId.toString()}`);
      setOrderPrice('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert to order');
    }
  };

  const pricingText = request.pricingPreference.__kind__ === 'flexible' 
    ? 'Flexible' 
    : request.pricingPreference.value;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Request #{request.id.toString()}</DialogTitle>
          <DialogDescription>
            Review and manage custom request details
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Status and Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Status & Actions</CardTitle>
                  <Badge variant={isApproved ? 'default' : isDeclined ? 'destructive' : 'outline'}>
                    {request.status.__kind__}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {isPending && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleApprove}
                      disabled={approveRequest.isPending}
                      className="flex-1"
                    >
                      {approveRequest.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={handleDecline}
                      disabled={declineRequest.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      {declineRequest.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Decline
                    </Button>
                  </div>
                )}

                {isApproved && !request.convertedOrderId && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="order-price">Order Price (in ICP)</Label>
                      <Input
                        id="order-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 10.50"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleConvertToOrder}
                      disabled={convertToOrder.isPending || !orderPrice.trim()}
                      className="w-full"
                    >
                      {convertToOrder.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Convert to Order
                    </Button>
                  </div>
                )}

                {request.convertedOrderId && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Converted to Order:</span>{' '}
                      #{request.convertedOrderId.toString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{request.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{request.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pricing Preference</p>
                  <Badge variant="outline">{pricingText}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{request.description}</p>
                </div>

                {request.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Attachments ({request.attachments.length})
                      </p>
                      <div className="space-y-2">
                        {request.attachments.map((item, idx) => {
                          const url = item.blob.getDirectURL();
                          return (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded-md">
                              <span className="text-sm truncate flex-1">{item.filename}</span>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(url, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = item.filename;
                                    a.click();
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Submitted By</p>
                  <p className="text-xs font-mono break-all">{request.submittedBy.toString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action History */}
            {request.actionHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Action History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.actionHistory.map((action, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-muted/30 border border-border/20">
                        <p>{action.actionType}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.timestamp > 0n ? new Date(Number(action.timestamp)).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Message */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Message to Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="message-body">Message</Label>
                  <Textarea
                    id="message-body"
                    placeholder="Type your message here..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Attachments (Optional)</Label>
                  <MessageAttachmentPicker
                    attachments={messageAttachments}
                    onChange={setMessageAttachments}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageBody.trim() || sendMessage.isPending}
                  className="w-full"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Send Coupon */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Send Coupon to Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <Input
                    id="coupon-code"
                    placeholder="e.g., SAVE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSendCoupon}
                  disabled={!couponCode.trim() || sendCoupon.isPending}
                  className="w-full"
                  variant="outline"
                >
                  {sendCoupon.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Gift className="h-4 w-4 mr-2" />
                  )}
                  Send Coupon
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
