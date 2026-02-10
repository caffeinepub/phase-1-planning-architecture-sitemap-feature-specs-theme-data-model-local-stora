import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface ErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export default function ErrorState({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  description 
}: ErrorStateProps) {
  const isOnline = useOnlineStatus();

  const errorMessage = description || error?.message || 'An unexpected error occurred';
  const isOfflineError = !isOnline || errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch');

  return (
    <Alert variant="destructive" className="my-4">
      {isOfflineError ? (
        <WifiOff className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>{isOfflineError ? 'Connection Issue' : title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>
          {isOfflineError 
            ? 'Unable to connect to the network. Please check your internet connection and try again.'
            : errorMessage
          }
        </p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
