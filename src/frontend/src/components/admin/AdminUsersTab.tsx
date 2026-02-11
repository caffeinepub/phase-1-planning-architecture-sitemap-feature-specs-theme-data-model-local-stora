import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Shield, AlertCircle } from 'lucide-react';
import { useListAdmins } from '../../hooks/useQueries';
import ErrorState from '../system/ErrorState';

export default function AdminUsersTab() {
  const { data: admins = [], isLoading, error, refetch } = useListAdmins();
  const [principalFilter, setPrincipalFilter] = useState('');

  const filteredAdmins = admins.filter((admin) =>
    admin.principal.toString().toLowerCase().includes(principalFilter.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load users" onRetry={refetch} />;
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-arcane-gold" />
          User & Admin Management
        </CardTitle>
        <CardDescription>
          {admins.length} {admins.length === 1 ? 'admin' : 'admins'} registered
          {filteredAdmins.length !== admins.length && ` (${filteredAdmins.length} shown)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter */}
        <div>
          <Label htmlFor="principal-filter">Filter by Principal</Label>
          <Input
            id="principal-filter"
            placeholder="Enter principal..."
            value={principalFilter}
            onChange={(e) => setPrincipalFilter(e.target.value)}
          />
        </div>

        {/* Admins List */}
        {filteredAdmins.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {admins.length === 0
                ? 'No admins registered yet.'
                : 'No admins match your filter.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.principal.toString()}
                className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-arcane-gold" />
                      <h4 className="font-semibold">
                        {admin.isOwner ? 'Owner' : 'Admin'}
                      </h4>
                    </div>
                    <p className="font-mono text-xs break-all text-muted-foreground">
                      {admin.principal.toString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {admin.isOwner && (
                      <Badge variant="default" className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30">
                        Owner
                      </Badge>
                    )}
                    {admin.fullPermissions && (
                      <Badge variant="outline">Full Permissions</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {admin.canCreateProduct && (
                    <Badge variant="secondary" className="justify-center">Create Product</Badge>
                  )}
                  {admin.canEditProduct && (
                    <Badge variant="secondary" className="justify-center">Edit Product</Badge>
                  )}
                  {admin.canDeleteProduct && (
                    <Badge variant="secondary" className="justify-center">Delete Product</Badge>
                  )}
                  {admin.canManageUsers && (
                    <Badge variant="secondary" className="justify-center">Manage Users</Badge>
                  )}
                  {admin.canApplyDiscounts && (
                    <Badge variant="secondary" className="justify-center">Apply Discounts</Badge>
                  )}
                  {admin.canViewMetrics && (
                    <Badge variant="secondary" className="justify-center">View Metrics</Badge>
                  )}
                </div>

                {!admin.isOwner && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Permissions
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Remove Admin
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
