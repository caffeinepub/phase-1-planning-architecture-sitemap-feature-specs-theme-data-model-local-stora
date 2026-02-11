import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  TRACKING_STATUS_LABELS,
  TRACKING_STATUS_ORDER,
  FULFILLMENT_METHOD_LABELS,
  formatTimestamp,
  type TrackingStatus,
  type FulfillmentMethod,
  type OrderWithTracking,
} from '../../types/orderTracking';
import {
  useUpdateOrderTrackingStatus,
  useAddOrderLocationUpdate,
  useAddOrderPopUpNote,
} from '../../hooks/useQueries';

interface AdminOrderTrackingDetailModalProps {
  order: OrderWithTracking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminOrderTrackingDetailModal({
  order,
  open,
  onOpenChange,
}: AdminOrderTrackingDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [locationText, setLocationText] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [noteText, setNoteText] = useState('');

  const updateStatus = useUpdateOrderTrackingStatus();
  const addLocation = useAddOrderLocationUpdate();
  const addNote = useAddOrderPopUpNote();

  if (!order) return null;

  const tracking = order.tracking;
  const currentStatus = tracking.currentStatus as TrackingStatus;
  const fulfillmentMethod = tracking.fulfillmentMethod as FulfillmentMethod;

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateStatus.mutateAsync({
        orderId: order.id,
        newStatus: selectedStatus,
      });
      toast.success('Status updated successfully');
      setSelectedStatus('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleAddLocation = async () => {
    if (!locationText.trim()) {
      toast.error('Please enter a location');
      return;
    }

    try {
      await addLocation.mutateAsync({
        orderId: order.id,
        location: locationText.trim(),
        description: locationDescription.trim() || locationText.trim(),
      });
      toast.success('Location update added');
      setLocationText('');
      setLocationDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add location update');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter a note message');
      return;
    }

    try {
      await addNote.mutateAsync({
        orderId: order.id,
        message: noteText.trim(),
      });
      toast.success('Pop-up note added');
      setNoteText('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add note');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-arcane-gold" />
            Order #{order.id.toString()} - Tracking Management
          </DialogTitle>
          <DialogDescription>
            Update tracking status, add location updates, and send custom notes to the customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status Overview */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Status:</span>
              <Badge className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
                {TRACKING_STATUS_LABELS[currentStatus]}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fulfillment:</span>
              <span>{FULFILLMENT_METHOD_LABELS[fulfillmentMethod]}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-mono text-xs">{order.userId.toString().slice(0, 20)}...</span>
            </div>
          </div>

          <Alert className="border-blue-500/30 bg-blue-500/5">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              Customers only see status progression after you update it. They will see the next status as locked until you advance it.
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Update Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-arcane-gold" />
              <h3 className="font-semibold">Update Tracking Status</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="status-select">Select New Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status-select">
                    <SelectValue placeholder="Choose status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACKING_STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        {TRACKING_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpdateStatus}
                disabled={!selectedStatus || updateStatus.isPending}
                className="w-full"
              >
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Add Location Update */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-arcane-gold" />
              <h3 className="font-semibold">Add Location Update</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="location-input">Location</Label>
                <Textarea
                  id="location-input"
                  placeholder="e.g., Sorting facility, Ashland, KY..."
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="location-description">Description (Optional)</Label>
                <Textarea
                  id="location-description"
                  placeholder="e.g., Package at sorting facility, En route..."
                  value={locationDescription}
                  onChange={(e) => setLocationDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <Button
                onClick={handleAddLocation}
                disabled={!locationText.trim() || addLocation.isPending}
                className="w-full"
                variant="outline"
              >
                {addLocation.isPending ? 'Adding...' : 'Add Location Update'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Add Pop-up Note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-arcane-gold" />
              <h3 className="font-semibold">Add Custom Pop-up Note</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="note-input">Note Message</Label>
                <Textarea
                  id="note-input"
                  placeholder="e.g., On its way, Delayed due to weather, Package has arrived..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleAddNote}
                disabled={!noteText.trim() || addNote.isPending}
                className="w-full"
                variant="outline"
              >
                {addNote.isPending ? 'Adding...' : 'Add Pop-up Note'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Current Tracking History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Current Tracking History</h3>
            
            {/* Status History */}
            {tracking.statusHistory.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Status Changes</p>
                <div className="space-y-1">
                  {[...tracking.statusHistory].reverse().slice(0, 3).map((entry, idx) => (
                    <div key={idx} className="text-sm p-2 rounded bg-muted/30 border border-border/20">
                      <div className="flex justify-between">
                        <span>{TRACKING_STATUS_LABELS[entry.status as TrackingStatus]}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Updates */}
            {tracking.locationUpdates.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Recent Locations</p>
                <div className="space-y-1">
                  {[...tracking.locationUpdates].reverse().slice(0, 3).map((update, idx) => (
                    <div key={idx} className="text-sm p-2 rounded bg-muted/30 border border-border/20">
                      <p>{update.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(update.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pop-up Notes */}
            {tracking.popUpNotes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Recent Notes</p>
                <div className="space-y-1">
                  {[...tracking.popUpNotes].reverse().slice(0, 3).map((note, idx) => (
                    <div key={idx} className="text-sm p-2 rounded bg-muted/30 border border-border/20">
                      <p>{note.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(note.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
