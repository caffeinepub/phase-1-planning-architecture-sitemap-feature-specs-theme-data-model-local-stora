import { Home, Package, Tag, Image, MessageSquare, FileText, Inbox, BookOpen, Shield, LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { clearAdminAccessUnlocked } from '../../lib/adminAccessSession';
import type { DashboardSection } from '../../pages/Admin';
import { cn } from '../../lib/utils';
import { ROUTE_PATHS } from '../../lib/routePaths';

interface AdminSidebarNavProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Dashboard Home', icon: Home },
  { id: 'shop', label: 'Shop Admin', icon: Package },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'portfolio', label: 'Portfolio Manager', icon: Image },
  { id: 'testimonies', label: 'Testimonies Manager', icon: MessageSquare },
  { id: 'requests', label: 'Customer Requests & Quotes', icon: FileText },
  { id: 'inbox', label: 'Inbox / Messaging', icon: Inbox },
  { id: 'lore', label: 'Lore and Knowledge', icon: BookOpen },
  { id: 'security', label: 'Security Settings', icon: Shield },
];

export default function AdminSidebarNav({ 
  activeSection, 
  onSectionChange,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarNavProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminAccessUnlocked();
    navigate({ to: ROUTE_PATHS.adminAccess });
  };

  const handleNavClick = (section: DashboardSection) => {
    onSectionChange(section);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Control Panel</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
