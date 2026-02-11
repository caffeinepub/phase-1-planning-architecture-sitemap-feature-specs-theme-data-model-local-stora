import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, UserMinus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useListAdmins, usePromoteAdmin, useDemoteAdmin, useUpdateAdminPermissions } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import ErrorState from '../system/ErrorState';

export default function AdminRegistrySection() {
  const { data: admins = [], isLoading, error, refetch } = useListAdmins();
  const promoteAdmin = usePromoteAdmin();
  const demoteAdmin = useDemoteAdmin();
  const updatePermissions = useUpdateAdminPermissions();

  const [editingPermissions, setEditingPermissions] = useState<string | null>(null);

  const handlePromote = async (principalStr: string) => {
    try {
      const principal = Principal.fromText(principalStr);
      await promoteAdmin.mutateAsync(principal);
      toast.success('Admin promoted successfully');
    } catch (error: any) {
      console.error('Failed to promote admin:', error);
      toast.error(error.message || 'Failed to promote admin');
    }
  };

  const handleDemote = async (principalStr: string) => {
    try {
      const principal = Principal.fromText(principalStr);
      await demoteAdmin.mutateAsync(principal);
      toast.success('Admin demoted successfully');
    } catch (error: any) {
      console.error('Failed to demote admin:', error);
      toast.error(error.message || 'Failed to demote admin');
    }
  };

  const handlePermissionToggle = async (principalStr: string, permission: string, value: boolean) => {
    try {
      const principal = Principal.fromText(principalStr);
      await updatePermissions.mutateAsync({
        principal,
        permissions: { [permission]: value },
      });
      toast.success('Permission updated successfully');
    } catch (error: any) {
      console.error('Failed to update permission:', error);
      toast.error(error.message || 'Failed to update permission');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Registry</CardTitle>
          <CardDescription>Manage admin users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Registry</CardTitle>
          <CardDescription>Manage admin users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState title="Failed to load admins" onRetry={refetch} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Registry
        </CardTitle>
        <CardDescription>Manage admin users and their permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {admins.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No admins found</p>
        ) : (
          admins.map((admin) => {
            const principalStr = admin.principal.toString();
            const isEditing = editingPermissions === principalStr;

            return (
              <Card key={principalStr} className="border-border/40">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-mono text-xs break-all">{principalStr}</p>
                      <div className="flex gap-2 flex-wrap">
                        {admin.isOwner && <Badge variant="default">Owner</Badge>}
                        {admin.fullPermissions && <Badge variant="secondary">Full Permissions</Badge>}
                      </div>
                    </div>
                    {!admin.isOwner && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPermissions(isEditing ? null : principalStr)}
                        >
                          {isEditing ? 'Done' : 'Edit Permissions'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDemote(principalStr)}
                          disabled={demoteAdmin.isPending}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing && !admin.isOwner && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      {Object.entries(admin)
                        .filter(([key]) => key.startsWith('can') && key !== 'canDeactivateStore')
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label htmlFor={`${principalStr}-${key}`} className="text-xs">
                              {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              id={`${principalStr}-${key}`}
                              checked={value as boolean}
                              onCheckedChange={(checked) => handlePermissionToggle(principalStr, key, checked)}
                              disabled={updatePermissions.isPending}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
