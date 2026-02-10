import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Scroll, AlertCircle } from 'lucide-react';
import { useGetAllGuildOrders } from '../../hooks/useQueries';

export default function GuildOrdersPanel() {
  const { data: guildOrders = [], isLoading, error } = useGetAllGuildOrders();

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scroll className="h-5 w-5 text-arcane-gold" />
            Guild Orders & Quests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load guild orders. {error instanceof Error ? error.message : 'Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (guildOrders.length === 0) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scroll className="h-5 w-5 text-arcane-gold" />
            Guild Orders & Quests
          </CardTitle>
          <CardDescription>
            Collaborative quests and special orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              No guild orders available at the moment. Check back later for new quests!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scroll className="h-5 w-5 text-arcane-gold" />
          Guild Orders & Quests
        </CardTitle>
        <CardDescription>
          {guildOrders.length} {guildOrders.length === 1 ? 'quest' : 'quests'} available
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {guildOrders.map((order) => (
          <div
            key={order.id.toString()}
            className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{order.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.description}
                </p>
              </div>
              <Badge
                variant={order.status === 'open' ? 'secondary' : 'default'}
                className={order.status === 'open' ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
              >
                {order.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Reward: </span>
                <span className="font-bold text-arcane-gold">{Number(order.reward)} ICP</span>
              </div>
              {order.assignedTo && (
                <div>
                  <span className="text-muted-foreground">Assigned to: </span>
                  <span className="font-mono text-xs">
                    {order.assignedTo.toString().slice(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
