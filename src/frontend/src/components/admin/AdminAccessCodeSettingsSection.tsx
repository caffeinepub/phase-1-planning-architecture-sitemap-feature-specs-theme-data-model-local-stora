import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUpdateMasterAdminAccessCode, useGetMaskedAdminAccessCode } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminAccessCodeSettingsSection() {
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: maskedCode, isLoading: maskedCodeLoading } = useGetMaskedAdminAccessCode();
  const updateMutation = useUpdateMasterAdminAccessCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!newCode.trim() || !confirmCode.trim()) {
      setError('All fields are required');
      return;
    }

    // Enforce exactly 5 characters
    if (newCode.trim().length !== 5) {
      setError('New code must be exactly 5 characters');
      return;
    }

    if (confirmCode.trim().length !== 5) {
      setError('Confirmation code must be exactly 5 characters');
      return;
    }

    if (newCode !== confirmCode) {
      setError('New codes do not match');
      return;
    }

    try {
      const result = await updateMutation.mutateAsync(newCode.trim().toUpperCase());

      if (result === 'Master Access Code Updated Successfully') {
        setSuccess(true);
        setNewCode('');
        setConfirmCode('');
        toast.success('Configurable Admin Access Code Updated Successfully');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Failed to update access code. Please try again.');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Unauthorized')) {
        setError('You do not have permission to change the access code');
      } else {
        setError('Failed to update access code. Please try again.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Admin Access Code Settings
        </CardTitle>
        <CardDescription>
          Manage the configurable admin access code for dashboard entry
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Important notice about permanent master code */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Note:</strong> The permanent master admin code <span className="font-mono font-semibold">7583A</span> cannot be changed and will always grant access. 
            This form updates only the configurable secondary admin access code.
          </AlertDescription>
        </Alert>

        {/* Display masked current configurable code */}
        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Configurable Access Code</span>
            <span className="text-lg font-mono tracking-widest">
              {maskedCodeLoading ? '...' : maskedCode || '•••••'}
            </span>
          </div>
        </div>

        {success ? (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Configurable Admin Access Code Updated Successfully.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newCode">New Configurable Code (5 characters)</Label>
            <Input
              id="newCode"
              type="password"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="Enter new code"
              maxLength={5}
              disabled={updateMutation.isPending}
              className="font-mono text-center tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmCode">Confirm New Code (5 characters)</Label>
            <Input
              id="confirmCode"
              type="password"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value.toUpperCase())}
              placeholder="Re-enter new code"
              maxLength={5}
              disabled={updateMutation.isPending}
              className="font-mono text-center tracking-widest"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={updateMutation.isPending || newCode.trim().length !== 5 || confirmCode.trim().length !== 5}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Configurable Code
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
