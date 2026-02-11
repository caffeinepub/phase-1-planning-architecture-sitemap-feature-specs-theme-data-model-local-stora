import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

// TODO: Backend methods not yet implemented
// import { useGetCustomerInbox, useMarkMessageAsRead } from '../hooks/useQueries';

export default function Inbox() {
  return (
    <PageLayout
      title="My Inbox"
      description="View your messages and notifications"
    >
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">Your messages and notifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                This feature requires backend implementation. Coming soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
