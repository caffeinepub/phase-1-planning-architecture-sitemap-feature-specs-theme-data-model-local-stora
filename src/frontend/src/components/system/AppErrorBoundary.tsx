import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Wrench } from 'lucide-react';
import { writeErrorLog, getCurrentRoute, sanitizeErrorMessage } from '../../lib/errorLogging';

interface Props {
  children: ReactNode;
  onShowTroubleshooting?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Top-level error boundary that prevents blank screens and provides recovery UI
 */
export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to local storage
    writeErrorLog({
      route: getCurrentRoute(),
      message: sanitizeErrorMessage(error.message || 'Component error'),
      stack: error.stack?.substring(0, 1000),
      userAgent: navigator.userAgent.substring(0, 200),
    });

    console.error('Error boundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-lg w-full border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
              </div>
              <CardDescription>
                The application encountered an unexpected error. This has been logged for troubleshooting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-muted-foreground break-words">
                    {sanitizeErrorMessage(this.state.error.message)}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReload}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                
                {this.props.onShowTroubleshooting && (
                  <Button
                    onClick={this.props.onShowTroubleshooting}
                    variant="outline"
                    className="gap-2"
                    size="lg"
                  >
                    <Wrench className="h-4 w-4" />
                    Troubleshoot
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                If this problem persists, try clearing your browser cache and cookies.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
