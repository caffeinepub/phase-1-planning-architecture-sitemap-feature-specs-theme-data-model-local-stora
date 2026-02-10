import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertCircle } from 'lucide-react';
import { readErrorLog, clearErrorLog, type ErrorLogEntry } from '../../lib/errorLogging';
import { toast } from 'sonner';

interface TroubleshootingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TroubleshootingDialog({ open, onOpenChange }: TroubleshootingDialogProps) {
  const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load error log when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setErrorLog(readErrorLog());
    }
    onOpenChange(newOpen);
  };

  const handleClearLog = () => {
    clearErrorLog();
    setErrorLog([]);
    setShowClearConfirm(false);
    toast.success('Error log cleared');
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-arcane-gold" />
              Error Log & Troubleshooting
            </DialogTitle>
            <DialogDescription>
              View locally stored error logs for troubleshooting. This data never leaves your device.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh] pr-4">
            {errorLog.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No errors logged</p>
                <p className="text-sm mt-2">This is good news! Your app is running smoothly.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {errorLog.map((entry, index) => (
                  <div key={index} className="border border-border/40 rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{entry.message}</p>
                        {entry.route && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Route: {entry.route}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formatTimestamp(entry.timestamp)}
                      </Badge>
                    </div>
                    
                    {entry.stack && (
                      <>
                        <Separator />
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            Stack trace
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {entry.stack}
                          </pre>
                        </details>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowClearConfirm(true)}
              disabled={errorLog.length === 0}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Log
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Error Log?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all logged errors from your device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearLog}>Clear Log</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
