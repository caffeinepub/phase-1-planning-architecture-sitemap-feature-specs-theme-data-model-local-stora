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
        body: messageBody,
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
    try {
      const orderId = await convertToOrder.mutateAsync(request.id);
      toast.success(`Request converted to Order #${orderId.toString()}`);
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
                  <Button
                    onClick={handleConvertToOrder}
                    disabled={convertToOrder.isPending}
                    className="w-full"
                  >
                    {convertToOrder.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    Convert to Order
                  </Button>
                )}

                {request.convertedOrderId && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Converted to Order #{request.convertedOrderId.toString()}
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
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Customer</Label>
                  <p className="text-sm font-medium">{request.name}</p>
                  <p className="text-sm text-muted-foreground">{request.email}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Principal</Label>
                  <p className="text-xs font-mono break-all">{request.submittedBy.toString()}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-muted-foreground">Pricing Preference</Label>
                  <p className="text-sm">{pricingText}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm whitespace-pre-wrap">{request.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {request.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attachments ({request.attachments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.attachments.map((attachment, idx) => {
                      const url = attachment.blob.getDirectURL();
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 border rounded-md">
                          <span className="text-sm truncate flex-1">{attachment.filename}</span>
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
                                a.download = attachment.filename;
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
                </CardContent>
              </Card>
            )}

            {/* Action History */}
            {request.actionHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Action History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {request.actionHistory.map((action, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{action.actionType}</span>
                        <span className="text-muted-foreground"> by </span>
                        <span className="font-mono text-xs">{action.admin.toString().slice(0, 10)}...</span>
                        {action.timestamp > 0n && (
                          <span className="text-muted-foreground text-xs ml-2">
                            {new Date(Number(action.timestamp)).toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Message */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Send Message to Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="message-body">Message</Label>
                  <Textarea
                    id="message-body"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    disabled={sendMessage.isPending}
                  />
                </div>

                <div>
                  <Label>Attachments (optional)</Label>
                  <MessageAttachmentPicker
                    attachments={messageAttachments}
                    onChange={setMessageAttachments}
                    disabled={sendMessage.isPending}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessage.isPending || !messageBody.trim()}
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
                <CardTitle className="text-base">Send Coupon to Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <Input
                    id="coupon-code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    disabled={sendCoupon.isPending}
                  />
                </div>

                <Button
                  onClick={handleSendCoupon}
                  disabled={sendCoupon.isPending || !couponCode.trim()}
                  className="w-full"
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
