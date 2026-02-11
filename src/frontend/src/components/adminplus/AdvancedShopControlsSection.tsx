import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// TODO: Backend methods not yet implemented
// import { useGetAllProducts, useOverrideProductPrice, useSetProductVisibility, useGetStoreConfig, useSetStoreActive } from '../../hooks/useQueries';

export default function AdvancedShopControlsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Shop Controls</CardTitle>
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
  );
}
