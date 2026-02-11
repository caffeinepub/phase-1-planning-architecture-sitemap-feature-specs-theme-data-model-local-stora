import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Activity, FileText, Shield, Crown, Loader2, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { useGetHealthCheck, useGetAdminAccessLog, useGetLoginAttempts, useGetEvents } from '../../hooks/useSystemSettings';
import { useIsCallerOwner } from '../../hooks/useQueries';
import { toast } from 'sonner';
import AdminRegistrySection from '../adminplus/AdminRegistrySection';
import AdminPasswordResetSection from '../adminplus/AdminPasswordResetSection';
import AdvancedShopControlsSection from '../adminplus/AdvancedShopControlsSection';

export default function AdminSystemSettingsTab() {
  const { data: health, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useGetHealthCheck();
  const { data: accessLog = [], isLoading: accessLogLoading, error: accessLogError, refetch: refetchAccessLog } = useGetAdminAccessLog();
  const { data: loginAttempts = [], isLoading: loginAttemptsLoading, error: loginAttemptsError, refetch: refetchLoginAttempts } = useGetLoginAttempts();
  const { data: events = [], isLoading: eventsLoading, error: eventsError, refetch: refetchEvents } = useGetEvents();
  const { data: isOwner = false, isLoading: ownerLoading } = useIsCallerOwner();

  const handleRefreshHealth = async () => {
    try {
      await refetchHealth();
      toast.success('Health status refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh health status');
    }
  };

  const handleRefreshAccessLog = async () => {
    try {
      await refetchAccessLog();
      toast.success('Access log refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh access log');
    }
  };

  const handleRefreshLoginAttempts = async () => {
    try {
      await refetchLoginAttempts();
      toast.success('Login attempts refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh login attempts');
    }
  };

  const handleRefreshEvents = async () => {
    try {
      await refetchEvents();
      toast.success('Events refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh events');
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>
                Current system status and deployment information
              </CardDescription>
            </div>
            <Button onClick={handleRefreshHealth} variant="outline" size="sm" disabled={healthLoading}>
              {healthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {healthError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load health status. The system may be experiencing issues.
              </AlertDescription>
            </Alert>
          ) : healthLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading health status...
            </div>
          ) : health ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={health.status === 'ok' ? 'default' : 'destructive'}>
                  {health.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm text-muted-foreground">{health.deployedVersion}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Environment</span>
                <span className="text-sm text-muted-foreground">{health.environment}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Build</span>
                <span className="text-sm text-muted-foreground">{health.build}</span>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Admin Access Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Access Log
              </CardTitle>
              <CardDescription>
                Successful admin access attempts
              </CardDescription>
            </div>
            <Button onClick={handleRefreshAccessLog} variant="outline" size="sm" disabled={accessLogLoading}>
              {accessLogLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {accessLogError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load access log. You may not have permission to view this data.
              </AlertDescription>
            </Alert>
          ) : accessLogLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading access log...
            </div>
          ) : accessLog.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No access log entries found
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {accessLog.map((entry) => (
                <div key={entry.id.toString()} className="p-3 border rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-muted-foreground truncate">
                      {entry.principal.toString()}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      {new Date(Number(entry.timestamp) / 1000000).toLocaleString()}
                    </span>
                  </div>
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
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Login Attempts
              </CardTitle>
              <CardDescription>
                All admin login attempts (successful and failed)
              </CardDescription>
            </div>
            <Button onClick={handleRefreshLoginAttempts} variant="outline" size="sm" disabled={loginAttemptsLoading}>
              {loginAttemptsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loginAttemptsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load login attempts. You may not have permission to view this data.
              </AlertDescription>
            </Alert>
          ) : loginAttemptsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading login attempts...
            </div>
          ) : loginAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No login attempts recorded
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loginAttempts.map((attempt) => (
                <div key={attempt.id.toString()} className="p-3 border rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-muted-foreground truncate">
                      {attempt.principal.toString()}
                    </code>
                    <div className="flex items-center gap-2">
                      <Badge variant={attempt.successful ? 'default' : 'destructive'}>
                        {attempt.successful ? 'Success' : 'Failed'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(Number(attempt.timestamp) / 1000000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Events
              </CardTitle>
              <CardDescription>
                Application event log
              </CardDescription>
            </div>
            <Button onClick={handleRefreshEvents} variant="outline" size="sm" disabled={eventsLoading}>
              {eventsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {eventsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load events. You may not have permission to view this data.
              </AlertDescription>
            </Alert>
          ) : eventsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No events recorded
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id.toString()} className="p-3 border rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          event.level === 'error'
                            ? 'destructive'
                            : event.level === 'warning'
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {event.level}
                      </Badge>
                      <span className="text-sm">{event.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(Number(event.timestamp) / 1000000).toLocaleString()}
                    </span>
                  </div>
                  <code className="text-xs font-mono text-muted-foreground block truncate">
                    {event.principal.toString()}
                  </code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Owner-Only Sections */}
      {ownerLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading owner permissions...
            </div>
          </CardContent>
        </Card>
      ) : isOwner ? (
        <>
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Owner-Only Controls</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              The following sections are only accessible to the owner
            </p>
          </div>

          <AdminRegistrySection />
          <AdminPasswordResetSection />
          <AdvancedShopControlsSection />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Owner-Only Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Additional system settings and controls are available only to the owner. These include admin registry management, password resets, and advanced shop controls.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
