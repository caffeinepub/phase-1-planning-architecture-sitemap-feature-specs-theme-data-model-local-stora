import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// TODO: Backend methods not yet implemented
// import { useGetMaskedAdminAccessCode, useUpdateAdminAccessCode, useGetAdminAccessLog, useGetLoginAttempts } from '../../../hooks/useQueries';

export default function SecuritySettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
        <p className="text-muted-foreground">Manage admin access and security</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Access Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This feature requires backend implementation. Coming soon.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This feature requires backend implementation. Coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
