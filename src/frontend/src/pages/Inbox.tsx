import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Inbox as InboxIcon, Mail, Gift, RefreshCw, Loader2 } from 'lucide-react';
import { useGetCustomerInbox, useMarkMessageAsRead } from '../hooks/useQueries';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ErrorState from '../components/system/ErrorState';
import { toast } from 'sonner';
import type { InboxItem } from '../hooks/useQueries';

export default function Inbox() {
  const { data: inboxItems = [], isLoading, error, refetch } = useGetCustomerInbox();
  const markAsRead = useMarkMessageAsRead();

  const handleMarkAsRead = async (messageId: bigint) => {
    try {
      await markAsRead.mutateAsync(messageId);
      toast.success('Message marked as read');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark message as read');
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

  if (isLoading) {
    return (
      <PageLayout title="Inbox" description="Your messages and notifications">
        <FadeInSection>
          <section className="section-spacing px-4 sm:px-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Inbox" description="Your messages and notifications">
        <FadeInSection>
          <section className="section-spacing px-4 sm:px-6">
            <ErrorState title="Failed to load inbox" onRetry={refetch} />
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Inbox" description="Your messages and notifications">
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <InboxIcon className="h-5 w-5" />
                    Your Inbox
                  </CardTitle>
                  <CardDescription>
                    Messages and notifications from administrators
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
              {inboxItems.length === 0 ? (
                <div className="text-center py-12">
                  <InboxIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your inbox is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inboxItems.map((item) => (
                    <Card key={Number(item.id)} className={!item.isRead ? 'border-primary/50' : ''}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {item.messageType === 'message' ? (
                              <Mail className="h-5 w-5 text-primary" />
                            ) : (
                              <Gift className="h-5 w-5 text-primary" />
                            )}
                            <Badge variant={!item.isRead ? 'default' : 'outline'}>
                              {item.messageType}
                            </Badge>
                            {!item.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          {!item.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(item.id)}
                              disabled={markAsRead.isPending}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                        <p className="text-sm">{item.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
