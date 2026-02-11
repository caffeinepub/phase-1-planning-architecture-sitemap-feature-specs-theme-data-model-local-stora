import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Eye, EyeOff, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useGetMaskedAdminAccessCode, useUpdateAdminAccessCode, useGetAdminAccessLog, useGetLoginAttempts } from '../../../hooks/useQueries';
import { toast } from 'sonner';
import ErrorState from '../../system/ErrorState';

export default function SecuritySettingsView() {
  const [newCode, setNewCode] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showNewCode, setShowNewCode] = useState(false);
  const [showCurrentCode, setShowCurrentCode] = useState(false);
  const [showConfirmCode, setShowConfirmCode] = useState(false);

  const { data: maskedCode, isLoading: codeLoading } = useGetMaskedAdminAccessCode();
  const { data: accessLog = [], isLoading: logLoading, error: logError, refetch: refetchLog } = useGetAdminAccessLog();
  const { data: loginAttempts = [], isLoading: attemptsLoading, refetch: refetchAttempts } = useGetLoginAttempts();
  const updateCodeMutation = useUpdateAdminAccessCode();

  const handleUpdateCode = async () => {
    if (currentCode.length !== 5) {
      toast.error('Current access code must be exactly 5 characters');
      return;
    }

    if (newCode.length !== 5) {
      toast.error('New access code must be exactly 5 characters');
      return;
    }

    if (newCode !== confirmCode) {
      toast.error('New codes do not match');
      return;
    }

    try {
      await updateCodeMutation.mutateAsync({ newCode: newCode.trim().toUpperCase(), currentCode: currentCode.trim().toUpperCase() });
      toast.success('Admin Access Code Updated Successfully');
      setNewCode('');
      setCurrentCode('');
      setConfirmCode('');
    } catch (error: any) {
      if (error.message && error.message.includes('invalid')) {
        toast.error('Current access code is invalid');
      } else {
        toast.error('Failed to update access code');
      }
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Security Settings</h2>
        <p className="text-muted-foreground">Manage admin access and security</p>
      </div>

      {/* Change Admin Access Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Change Admin Access Code
          </CardTitle>
          <CardDescription>
            Update the admin access code for dashboard entry (5 characters)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Access Code</Label>
            {codeLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input value={maskedCode || '*****'} disabled className="font-mono text-center tracking-widest" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-code">Current Code (5 characters)</Label>
            <div className="relative">
              <Input
                id="current-code"
                type={showCurrentCode ? 'text' : 'password'}
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value.toUpperCase())}
                maxLength={5}
                className="font-mono text-center tracking-widest pr-10"
                placeholder="*****"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowCurrentCode(!showCurrentCode)}
              >
                {showCurrentCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-code">New Code (5 characters)</Label>
            <div className="relative">
              <Input
                id="new-code"
                type={showNewCode ? 'text' : 'password'}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                maxLength={5}
                className="font-mono text-center tracking-widest pr-10"
                placeholder="*****"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewCode(!showNewCode)}
              >
                {showNewCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-code">Confirm New Code</Label>
            <div className="relative">
              <Input
                id="confirm-code"
                type={showConfirmCode ? 'text' : 'password'}
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value.toUpperCase())}
                maxLength={5}
                className="font-mono text-center tracking-widest pr-10"
                placeholder="*****"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmCode(!showConfirmCode)}
              >
                {showConfirmCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleUpdateCode}
            disabled={currentCode.length !== 5 || newCode.length !== 5 || confirmCode.length !== 5 || updateCodeMutation.isPending}
            className="w-full"
          >
            {updateCodeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Access Code'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Admin Access Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Access Log</CardTitle>
              <CardDescription>Successful admin access entries</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchLog()}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {logLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : logError ? (
            <ErrorState
              title="Failed to load access log"
              description="Unable to fetch admin access log entries"
              onRetry={() => refetchLog()}
            />
          ) : accessLog.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No access log entries yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {accessLog.map((entry: any) => (
                <div key={entry.id} className="p-3 border rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Principal: {entry.principal.toString()}</span>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Success
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(entry.timestamp)}
                  </div>
                  {entry.browserInfo && (
                    <p className="text-xs text-muted-foreground">Browser: {entry.browserInfo}</p>
                  )}
                  {entry.deviceType && (
                    <p className="text-xs text-muted-foreground">Device: {entry.deviceType}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Attempts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Login Attempts</CardTitle>
              <CardDescription>All admin login attempts (successful and failed)</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchAttempts()}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {attemptsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : loginAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No login attempts yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loginAttempts.map((attempt: any) => (
                <div key={attempt.id} className="p-3 border rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Principal: {attempt.principal.toString()}</span>
                    <Badge variant={attempt.successful ? 'outline' : 'destructive'}>
                      {attempt.successful ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(attempt.timestamp)}
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
