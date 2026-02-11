import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useGetCallerUserProfile } from '../hooks/useQueries';

// TODO: Backend methods not yet implemented
// import { useSubmitRequest } from '../hooks/useQueries';

export default function SubmitRequest() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <PageLayout
      title="Submit Request"
      description="Submit a custom request"
    >
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Submit a Request</h1>
          <p className="text-muted-foreground">Tell us about your custom project</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Form</CardTitle>
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
