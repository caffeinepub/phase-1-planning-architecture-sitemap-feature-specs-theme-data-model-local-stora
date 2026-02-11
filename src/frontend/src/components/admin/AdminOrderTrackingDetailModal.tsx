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
import { Input } from '@/components/ui/input';
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
        status: selectedStatus,
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
      toast.error('Please enter a note');
      return;
    }

    try {
      await addNote.mutateAsync({
        orderId: order.id,
        note: noteText.trim(),
      });
      toast.success('Pop-up note added');
      setNoteText('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add note');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Tracking Management</DialogTitle>
          <DialogDescription>
            Update tracking status, add location updates, and manage customer-visible notes for Order #{order.id.toString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="flex items-center gap-2">
              <Badge variant="default">{TRACKING_STATUS_LABELS[currentStatus]}</Badge>
              <span className="text-sm text-muted-foreground">
                {FULFILLMENT_METHOD_LABELS[fulfillmentMethod]}
              </span>
            </div>
          </div>

          <Separator />

          {/* Update Status */}
          <div className="space-y-3">
            <Label>Update Tracking Status</Label>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {TRACKING_STATUS_ORDER.map((status) => (
                    <SelectItem key={status} value={status}>
                      {TRACKING_STATUS_LABELS[status as TrackingStatus]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdateStatus}
                disabled={!selectedStatus || updateStatus.isPending}
              >
                {updateStatus.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Status changes are immediately visible to customers on their order tracking page.
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Add Location Update */}
          <div className="space-y-3">
            <Label>Add Location Update</Label>
            <Input
              placeholder="Location (e.g., Distribution Center, City Name)"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
            />
            <Button
              onClick={handleAddLocation}
              disabled={!locationText.trim() || addLocation.isPending}
              className="w-full"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {addLocation.isPending ? 'Adding...' : 'Add Location Update'}
            </Button>
          </div>

          <Separator />

          {/* Add Pop-up Note */}
          <div className="space-y-3">
            <Label>Add Customer Pop-up Note</Label>
            <Textarea
              placeholder="Enter a note that will be prominently displayed to the customer..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleAddNote}
              disabled={!noteText.trim() || addNote.isPending}
              className="w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {addNote.isPending ? 'Adding...' : 'Add Pop-up Note'}
            </Button>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Pop-up notes appear prominently at the top of the customer's tracking view.
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Current Tracking History */}
          <div className="space-y-3">
            <Label>Current Tracking History</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tracking.statusHistory.length === 0 && tracking.locationUpdates.length === 0 && tracking.popUpNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tracking history yet</p>
              ) : (
                <div className="space-y-2">
                  {/* Status History */}
                  {tracking.statusHistory.map((entry, index) => (
                    <div key={`status-${index}`} className="p-3 border rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{TRACKING_STATUS_LABELS[entry.status]}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Location Updates */}
                  {tracking.locationUpdates.map((entry, index) => (
                    <div key={`location-${index}`} className="p-3 border rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm font-medium">{entry.location}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pop-up Notes */}
                  {tracking.popUpNotes.map((entry, index) => (
                    <div key={`note-${index}`} className="p-3 border rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{entry.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
