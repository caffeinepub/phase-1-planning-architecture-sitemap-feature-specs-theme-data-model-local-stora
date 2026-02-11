import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useUpdateAdminAccessCode } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminAccessCodeSettingsSection() {
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateMutation = useUpdateAdminAccessCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!currentCode.trim() || !newCode.trim() || !confirmCode.trim()) {
      setError('All fields are required');
      return;
    }

    if (newCode !== confirmCode) {
      setError('New codes do not match');
      return;
    }

    if (newCode.length < 4) {
      setError('New code must be at least 4 characters');
      return;
    }

    try {
      const result = await updateMutation.mutateAsync({
        currentCode: currentCode.trim(),
        newCode: newCode.trim(),
      });

      if (result) {
        setSuccess(true);
        setCurrentCode('');
        setNewCode('');
        setConfirmCode('');
        toast.success('Admin access code updated successfully');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Current access code is invalid');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('invalid')) {
        setError('Current access code is invalid');
      } else if (err.message && err.message.includes('Unauthorized')) {
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
          Master Admin Access Code
        </CardTitle>
        <CardDescription>
          Change the master admin access code used to unlock the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Access code updated successfully. The new code will be required for all future admin access attempts.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentCode">Current Access Code</Label>
            <Input
              id="currentCode"
              type="password"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value.toUpperCase())}
              placeholder="Enter current code"
              disabled={updateMutation.isPending}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newCode">New Access Code</Label>
            <Input
              id="newCode"
              type="password"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="Enter new code"
              disabled={updateMutation.isPending}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmCode">Confirm New Code</Label>
            <Input
              id="confirmCode"
              type="password"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value.toUpperCase())}
              placeholder="Re-enter new code"
              disabled={updateMutation.isPending}
              className="font-mono"
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
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Access Code
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
