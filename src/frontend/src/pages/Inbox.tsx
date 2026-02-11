import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Gift, RefreshCw, Download, ExternalLink, Paperclip } from 'lucide-react';
import { useListCallerInbox } from '../hooks/useQueries';
import ErrorState from '../components/system/ErrorState';
import PageLayout from '../components/layout/PageLayout';

export default function Inbox() {
  const { data: inboxItems = [], isLoading, error, refetch, isFetching } = useListCallerInbox();

  if (isLoading) {
    return (
      <PageLayout
        title="Inbox"
        description="Messages and coupons from Arcane Artifacts"
      >
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Inbox"
        description="Messages and coupons from Arcane Artifacts"
      >
        <ErrorState title="Failed to load inbox" onRetry={refetch} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Inbox"
      description="Messages and coupons from Arcane Artifacts"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {inboxItems.length} item{inboxItems.length !== 1 ? 's' : ''}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {inboxItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your inbox is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Messages and coupons from admins will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {inboxItems.map((item, idx) => {
              if (item.__kind__ === 'message') {
                const message = item.value;
                return (
                  <Card key={`message-${idx}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Message from Admin</CardTitle>
                        </div>
                        <Badge variant="outline">Message</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">From:</p>
                        <p className="text-xs font-mono break-all">{message.sender.toString()}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                      </div>

                      {message.attachments.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">
                                Attachments ({message.attachments.length})
                              </p>
                            </div>
                            <div className="space-y-2">
                              {message.attachments.map((attachment, attIdx) => {
                                const url = attachment.blob.getDirectURL();
                                return (
                                  <div key={attIdx} className="flex items-center justify-between p-2 border rounded-md">
                                    <span className="text-sm truncate flex-1">{attachment.filename}</span>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => window.open(url, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          const a = document.createElement('a');
                                          a.href = url;
                                          a.download = attachment.filename;
                                          a.click();
                                        }}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}

                      {message.timestamp > 0n && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(message.timestamp)).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              } else if (item.__kind__ === 'coupon') {
                const coupon = item.value;
                return (
                  <Card key={`coupon-${idx}`} className="border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Gift className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Coupon Received</CardTitle>
                        </div>
                        <Badge>Coupon</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">From:</p>
                        <p className="text-xs font-mono break-all">{coupon.sender.toString()}</p>
                      </div>

                      <Separator />

                      <div className="p-4 bg-primary/10 rounded-md text-center">
                        <p className="text-sm text-muted-foreground mb-1">Coupon Code</p>
                        <p className="text-2xl font-bold font-mono">{coupon.code}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {coupon.discount.toString()}% discount
                        </p>
                      </div>

                      {coupon.timestamp > 0n && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(coupon.timestamp)).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
