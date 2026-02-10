import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, UserMinus, Shield, Crown, Loader2, AlertCircle } from 'lucide-react';
import { useListAdmins, usePromoteAdmin, useDemoteAdmin } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export default function AdminRegistrySection() {
  const { data: admins = [], isLoading } = useListAdmins();
  const promoteAdmin = usePromoteAdmin();
  const demoteAdmin = useDemoteAdmin();

  const [principalInput, setPrincipalInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const validatePrincipal = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError('Principal cannot be empty');
      return false;
    }

    try {
      Principal.fromText(input.trim());
      setValidationError('');
      return true;
    } catch (error) {
      setValidationError('Invalid principal format');
      return false;
    }
  };

  const handlePromote = async () => {
    if (!validatePrincipal(principalInput)) return;

    try {
      await promoteAdmin.mutateAsync(principalInput.trim());
      toast.success('Admin promoted successfully');
      setPrincipalInput('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to promote admin');
    }
  };

  const handleDemote = async (principal: string) => {
    try {
      await demoteAdmin.mutateAsync(principal);
      toast.success('Admin demoted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to demote admin');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Promote / Demote Admins
          </CardTitle>
          <CardDescription>
            Grant or remove admin permissions instantly by entering a user's Principal ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal-input">Principal ID</Label>
            <Input
              id="principal-input"
              placeholder="Enter principal (e.g., aaaaa-aa...)"
              value={principalInput}
              onChange={(e) => {
                setPrincipalInput(e.target.value);
                if (validationError) validatePrincipal(e.target.value);
              }}
              onBlur={() => {
                if (principalInput.trim()) validatePrincipal(principalInput);
              }}
            />
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          <Button
            onClick={handlePromote}
            disabled={!principalInput.trim() || !!validationError || promoteAdmin.isPending}
            className="w-full"
          >
            {promoteAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <UserPlus className="mr-2 h-4 w-4" />
            Promote to Admin
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Promoted admins will have access to the Admin panel but not the Admin+ owner controls.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Admin Registry
          </CardTitle>
          <CardDescription>
            List of all users with admin or owner privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading admin registry...
            </div>
          ) : admins.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No admins registered yet
            </p>
          ) : (
            <div className="space-y-2">
              {admins.map((admin) => (
                <div
                  key={admin.principal.toString()}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {admin.isOwner ? (
                      <Crown className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <code className="text-xs font-mono truncate">
                      {admin.principal.toString()}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={admin.isOwner ? 'default' : 'secondary'}>
                      {admin.isOwner ? 'Owner' : 'Admin'}
                    </Badge>
                    {!admin.isOwner && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDemote(admin.principal.toString())}
                        disabled={demoteAdmin.isPending}
                      >
                        {demoteAdmin.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        <UserMinus className="h-3 w-3" />
                      </Button>
                    )}
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
