import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useGetAdminInbox, useSendAdminMessage } from '../../hooks/useAdminMessaging';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export default function AdminMessagingTab() {
  const { data: inboxItems = [], isLoading, error, refetch } = useGetAdminInbox();
  const sendMessage = useSendAdminMessage();

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [validationError, setValidationError] = useState('');

  const validatePrincipal = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError('Customer Principal cannot be empty');
      return false;
    }

    try {
      Principal.fromText(input.trim());
      setValidationError('');
      return true;
    } catch (error) {
      setValidationError('Invalid Principal format');
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!validatePrincipal(selectedCustomer)) return;

    if (!messageContent.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        customerId: selectedCustomer.trim(),
        message: messageContent.trim(),
      });

      toast.success('Message sent successfully');
      setMessageContent('');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Inbox refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh inbox');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load messaging inbox</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Send Message Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Message to Customer
          </CardTitle>
          <CardDescription>
            Send a message to a specific customer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-principal">Customer Principal ID</Label>
            <Input
              id="customer-principal"
              placeholder="Enter customer principal..."
              value={selectedCustomer}
              onChange={(e) => {
                setSelectedCustomer(e.target.value);
                if (validationError) validatePrincipal(e.target.value);
              }}
              onBlur={() => {
                if (selectedCustomer.trim()) validatePrincipal(selectedCustomer);
              }}
            />
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-content">Message Content</Label>
            <Textarea
              id="message-content"
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              disabled={!selectedCustomer.trim() || !!validationError}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={
              !selectedCustomer.trim() ||
              !messageContent.trim() ||
              !!validationError ||
              sendMessage.isPending
            }
            className="w-full"
          >
            {sendMessage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Messages will appear in the customer's Inbox page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Inbox List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer Inbox Items
              </CardTitle>
              <CardDescription>
                View all messages and items sent to customers
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading inbox items...
            </div>
          ) : inboxItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No inbox items found. Send your first message to a customer above.
            </p>
          ) : (
            <div className="space-y-3">
              {inboxItems.map((item) => (
                <div
                  key={Number(item.id)}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{item.messageType}</Badge>
                        {!item.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            Unread
                          </Badge>
                        )}
                      </div>
                      <code className="text-xs font-mono text-muted-foreground block truncate">
                        Customer: {item.customerId.toString()}
                      </code>
                    </div>
                  </div>
                  <p className="text-sm">{item.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
