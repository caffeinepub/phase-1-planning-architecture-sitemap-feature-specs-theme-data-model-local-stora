import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Database, Download, AlertCircle, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useGetBackupMetadata, useCreateBackup, useRestoreFromBackup } from '../../hooks/useBackupRecovery';
import { toast } from 'sonner';
import { useState } from 'react';

export default function BackupRecoverySection() {
  const { data: backupMetadata, isLoading, error, refetch } = useGetBackupMetadata();
  const createBackup = useCreateBackup();
  const restoreFromBackup = useRestoreFromBackup();
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const handleCreateBackup = async () => {
    try {
      const backupId = await createBackup.mutateAsync();
      toast.success(`Backup created successfully (ID: ${backupId.toString()})`);
    } catch (error: any) {
      console.error('Backup creation error:', error);
      toast.error(error.message || 'Failed to create backup. You may not have permission.');
    }
  };

  const handleRestoreBackup = async () => {
    if (!backupMetadata) {
      toast.error('No backup available to restore');
      return;
    }

    try {
      await restoreFromBackup.mutateAsync(backupMetadata.id);
      toast.success('System restored from backup successfully');
      setIsRestoreDialogOpen(false);
    } catch (error: any) {
      console.error('Restore error:', error);
      toast.error(error.message || 'Failed to restore from backup. You may not have permission.');
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Backup metadata refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh backup metadata');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const formatDataSize = (size: bigint) => {
    const sizeNum = Number(size);
    if (sizeNum < 1024) return `${sizeNum} bytes`;
    if (sizeNum < 1024 * 1024) return `${(sizeNum / 1024).toFixed(2)} KB`;
    return `${(sizeNum / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Recovery
            </CardTitle>
            <CardDescription>
              Create and restore system backups for data recovery
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
      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load backup metadata. You may not have permission to view this data.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading backup information...
          </div>
        ) : (
          <>
            {/* Backup Metadata Display */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Latest Backup</h4>
              {backupMetadata ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Backup ID</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {backupMetadata.id.toString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Last Backup</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(backupMetadata.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Data Size</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDataSize(backupMetadata.dataSize)}
                    </span>
                  </div>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      A backup snapshot is available and ready for recovery if needed.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No backup found. Create your first backup to enable system recovery.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleCreateBackup}
                disabled={createBackup.isPending}
                className="flex-1"
              >
                {createBackup.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Create Backup Now
                  </>
                )}
              </Button>

              <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={!backupMetadata || restoreFromBackup.isPending}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Restore from Backup
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm System Restore</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        <strong>Warning:</strong> This action will restore all system data to the state
                        captured in the backup.
                      </p>
                      <p>
                        Any changes made after the backup timestamp will be lost. This includes:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Orders and requests</li>
                        <li>Testimonies and feedback</li>
                        <li>Coupons and user data</li>
                        <li>Product inventory changes</li>
                      </ul>
                      {backupMetadata && (
                        <p className="pt-2">
                          <strong>Backup Date:</strong> {formatTimestamp(backupMetadata.timestamp)}
                        </p>
                      )}
                      <p className="pt-2 text-destructive font-medium">
                        Are you sure you want to proceed with the restore?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={restoreFromBackup.isPending}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRestoreBackup}
                      disabled={restoreFromBackup.isPending}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {restoreFromBackup.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        'Restore System'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Information Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Note:</strong> Backups are automatically created during critical operations
                and canister upgrades. Manual backups can be created at any time for additional
                safety. Only admins with full permissions can create and restore backups.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}
