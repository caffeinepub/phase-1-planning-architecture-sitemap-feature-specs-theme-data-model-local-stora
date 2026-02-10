import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSetAdminPassword } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export default function AdminPasswordResetSection() {
  const setAdminPassword = useSetAdminPassword();

  const [principalInput, setPrincipalInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSetPassword = async () => {
    if (!validatePrincipal(principalInput)) return;

    if (!passwordInput.trim()) {
      toast.error('Password cannot be empty');
      return;
    }

    if (passwordInput.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      // Simple hash for demonstration - in production, use proper hashing
      const passwordHash = btoa(passwordInput);
      
      await setAdminPassword.mutateAsync({
        admin: principalInput.trim(),
        passwordHash,
      });

      toast.success('Admin password set successfully');
      setPrincipalInput('');
      setPasswordInput('');
      setShowPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set admin password');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Change Admin Passwords
          </CardTitle>
          <CardDescription>
            Securely reset or update any admin login password at any time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Passwords are never displayed after submission. Store them securely.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="admin-principal">Admin Principal ID</Label>
            <Input
              id="admin-principal"
              placeholder="Enter admin principal..."
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

          <div className="space-y-2">
            <Label htmlFor="admin-password">New Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={!principalInput.trim() || !!validationError}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={!passwordInput}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters required
            </p>
          </div>

          <Button
            onClick={handleSetPassword}
            disabled={
              !principalInput.trim() ||
              !passwordInput.trim() ||
              !!validationError ||
              passwordInput.length < 8 ||
              setAdminPassword.isPending
            }
            className="w-full"
          >
            {setAdminPassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <KeyRound className="mr-2 h-4 w-4" />
            Set Admin Password
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This will overwrite any existing password for the specified admin. The admin will need to use the new password for authentication.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Security Guidelines</CardTitle>
          <CardDescription>Best practices for admin password management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <div className="font-medium min-w-[100px]">Length:</div>
            <div>Use passwords with at least 12 characters for better security</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[100px]">Complexity:</div>
            <div>Include uppercase, lowercase, numbers, and special characters</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[100px]">Storage:</div>
            <div>Never share passwords via insecure channels. Use a password manager.</div>
          </div>
          <div className="flex gap-2">
            <div className="font-medium min-w-[100px]">Rotation:</div>
            <div>Consider changing admin passwords periodically for enhanced security</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
