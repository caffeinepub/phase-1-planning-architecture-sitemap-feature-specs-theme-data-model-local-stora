import { Bell, User, Plus, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useGetAdminNotifications } from '../../hooks/useAdminNotifications';
import type { DashboardSection } from '../../pages/Admin';

interface AdminTopBarProps {
  onSectionChange: (section: DashboardSection) => void;
  onMobileMenuToggle: () => void;
  isMobileSidebarOpen: boolean;
}

export default function AdminTopBar({ 
  onSectionChange, 
  onMobileMenuToggle,
  isMobileSidebarOpen,
}: AdminTopBarProps) {
  const { data: notifications } = useGetAdminNotifications();

  const totalNotifications = notifications
    ? Number(notifications.newQuotes) +
      Number(notifications.newOrders) +
      Number(notifications.newTestimonies) +
      Number(notifications.newMessagesCount)
    : 0;

  const handleQuickCreate = (action: 'product' | 'coupon' | 'portfolio') => {
    switch (action) {
      case 'product':
        onSectionChange('shop');
        break;
      case 'coupon':
        onSectionChange('coupons');
        break;
      case 'portfolio':
        onSectionChange('portfolio');
        break;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8 lg:ml-64">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
            aria-label={isMobileSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold hidden sm:block">Admin Control Panel</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Create */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Create</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleQuickCreate('product')}>
                Create Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickCreate('coupon')}>
                Create Coupon
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickCreate('portfolio')}>
                Upload Portfolio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {totalNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </Badge>
            )}
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
