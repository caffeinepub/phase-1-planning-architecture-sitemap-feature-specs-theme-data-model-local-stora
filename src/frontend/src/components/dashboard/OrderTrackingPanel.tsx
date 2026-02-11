import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Package, MapPin, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import {
  TRACKING_STATUS_LABELS,
  getNextStatus,
  formatTimestamp,
  FULFILLMENT_METHOD_LABELS,
  type TrackingStatus,
  type FulfillmentMethod,
  type OrderWithTracking,
} from '../../types/orderTracking';

interface OrderTrackingPanelProps {
  order: OrderWithTracking;
}

export default function OrderTrackingPanel({ order }: OrderTrackingPanelProps) {
  const tracking = order.tracking;
  const currentStatus = tracking.currentStatus as TrackingStatus;
  const nextStatus = getNextStatus(currentStatus);
  const fulfillmentMethod = tracking.fulfillmentMethod as FulfillmentMethod;

  // Get latest pop-up note
  const latestNote = tracking.popUpNotes.length > 0 
    ? tracking.popUpNotes[tracking.popUpNotes.length - 1]
    : null;

  // Get latest location update
  const latestLocation = tracking.locationUpdates.length > 0
    ? tracking.locationUpdates[tracking.locationUpdates.length - 1]
    : null;

  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-arcane-gold" />
            Order #{order.id.toString()}
          </CardTitle>
          <Badge className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
            {TRACKING_STATUS_LABELS[currentStatus]}
          </Badge>
        </div>
        <CardDescription>
          {order.productIds.length} item{order.productIds.length !== 1 ? 's' : ''} • {FULFILLMENT_METHOD_LABELS[fulfillmentMethod]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Current Status
          </h4>
          <div className="p-3 rounded-lg bg-arcane-gold/10 border border-arcane-gold/30">
            <p className="font-medium text-arcane-gold">{TRACKING_STATUS_LABELS[currentStatus]}</p>
            {tracking.statusHistory.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Updated {formatTimestamp(tracking.statusHistory[tracking.statusHistory.length - 1].timestamp)}
              </p>
            )}
          </div>
        </div>

        {/* Next Status Preview */}
        {nextStatus && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              Next Status
            </h4>
            <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="text-sm">🔒</span>
                {TRACKING_STATUS_LABELS[nextStatus]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Will be updated by admin when ready
              </p>
            </div>
          </div>
        )}

        {/* Latest Pop-up Note */}
        {latestNote && (
          <Alert className="border-arcane-gold/30 bg-arcane-gold/5">
            <MessageSquare className="h-4 w-4 text-arcane-gold" />
            <AlertDescription>
              <p className="font-medium text-sm mb-1">Admin Note:</p>
              <p className="text-sm">{latestNote.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatTimestamp(latestNote.timestamp)}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Latest Location Update */}
        {latestLocation && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Current Location
            </h4>
            <div className="p-3 rounded-lg bg-card/50 border border-border/40">
              <p className="text-sm">{latestLocation.location}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimestamp(latestLocation.timestamp)}
              </p>
            </div>
          </div>
        )}

        {/* Detailed History (Accordion) */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="history" className="border-border/40">
            <AccordionTrigger className="text-sm font-semibold">
              View Full History
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Status History */}
              {tracking.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Status Changes</h5>
                  <div className="space-y-2">
                    {[...tracking.statusHistory].reverse().map((entry, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-muted/30 border border-border/20 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {TRACKING_STATUS_LABELS[entry.status as TrackingStatus]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Location Updates */}
              {tracking.locationUpdates.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Location Updates</h5>
                  <div className="space-y-2">
                    {[...tracking.locationUpdates].reverse().map((update, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-muted/30 border border-border/20 text-sm"
                      >
                        <p>{update.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(update.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Pop-up Notes */}
              {tracking.popUpNotes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Admin Notes</h5>
                  <div className="space-y-2">
                    {[...tracking.popUpNotes].reverse().map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-muted/30 border border-border/20 text-sm"
                      >
                        <p>{note.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(note.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Order Details */}
        <div className="pt-4 border-t border-border/40 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-medium">${(Number(order.totalAmount) / 100).toFixed(2)}</span>
          </div>
          {order.appliedCouponCode && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coupon Applied:</span>
              <Badge variant="secondary">{order.appliedCouponCode}</Badge>
            </div>
          )}
          {order.discountAmount > 0n && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-${(Number(order.discountAmount) / 100).toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
