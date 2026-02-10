import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, UserPlus, UserMinus, Loader2, AlertCircle } from 'lucide-react';
import { useQueuedAssignAdminRole, useQueuedRemoveAdminRole } from '../../hooks/useQueuedMutations';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export default function AdminUsersTab() {
  const assignAdminRole = useQueuedAssignAdminRole();
  const removeAdminRole = useQueuedRemoveAdminRole();

  const [grantPrincipal, setGrantPrincipal] = useState('');
  const [revokePrincipal, setRevokePrincipal] = useState('');
  const [grantError, setGrantError] = useState('');
  const [revokeError, setRevokeError] = useState('');

  const validatePrincipal = (principalText: string): boolean => {
    if (!principalText.trim()) {
      return false;
    }

    try {
      Principal.fromText(principalText);
      return true;
    } catch {
      return false;
    }
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantError('');

    if (!validatePrincipal(grantPrincipal)) {
      setGrantError('Invalid Principal format');
      return;
    }

    try {
      await assignAdminRole.mutateAsync(grantPrincipal);
      toast.success('Admin role granted successfully');
      setGrantPrincipal('');
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info('Role assignment queued', {
          description: 'The role will be assigned when you\'re back online.',
        });
        setGrantPrincipal('');
      } else {
        setGrantError(error.message || 'Failed to grant admin role');
        toast.error('Failed to grant admin role', {
          description: error.message || 'Please try again.',
        });
      }
    }
  };

  const handleRevokeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevokeError('');

    if (!validatePrincipal(revokePrincipal)) {
      setRevokeError('Invalid Principal format');
      return;
    }

    try {
      await removeAdminRole.mutateAsync(revokePrincipal);
      toast.success('Admin role revoked successfully');
      setRevokePrincipal('');
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info('Role revocation queued', {
          description: 'The role will be revoked when you\'re back online.',
        });
        setRevokePrincipal('');
      } else {
        setRevokeError(error.message || 'Failed to revoke admin role');
        toast.error('Failed to revoke admin role', {
          description: error.message || 'Please try again.',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Grant Admin Role */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-arcane-gold" />
            Grant Admin Role
          </CardTitle>
          <CardDescription>
            Assign admin privileges to a user by their Principal ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGrantAdmin} className="space-y-4">
            <div>
              <Label htmlFor="grant-principal">Principal ID</Label>
              <Input
                id="grant-principal"
                placeholder="Enter Principal ID..."
                value={grantPrincipal}
                onChange={(e) => {
                  setGrantPrincipal(e.target.value);
                  setGrantError('');
                }}
                className={grantError ? 'border-destructive' : ''}
              />
              {grantError && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {grantError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={!grantPrincipal.trim() || assignAdminRole.isPending}
            >
              {assignAdminRole.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Granting...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Grant Admin Role
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Revoke Admin Role */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-arcane-gold" />
            Revoke Admin Role
          </CardTitle>
          <CardDescription>
            Remove admin privileges from a user by their Principal ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRevokeAdmin} className="space-y-4">
            <div>
              <Label htmlFor="revoke-principal">Principal ID</Label>
              <Input
                id="revoke-principal"
                placeholder="Enter Principal ID..."
                value={revokePrincipal}
                onChange={(e) => {
                  setRevokePrincipal(e.target.value);
                  setRevokeError('');
                }}
                className={revokeError ? 'border-destructive' : ''}
              />
              {revokeError && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {revokeError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="destructive"
              className="w-full gap-2"
              disabled={!revokePrincipal.trim() || removeAdminRole.isPending}
            >
              {removeAdminRole.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                <>
                  <UserMinus className="h-4 w-4" />
                  Revoke Admin Role
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Admin users have full access to manage products, view all orders, and manage user roles. 
          Use these actions carefully.
        </AlertDescription>
      </Alert>
    </div>
  );
}
