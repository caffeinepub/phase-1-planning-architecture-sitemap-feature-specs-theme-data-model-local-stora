import { ReactNode, useState } from 'react';
import AdminSidebarNav from './AdminSidebarNav';
import AdminTopBar from './AdminTopBar';
import type { DashboardSection } from '../../pages/Admin';

interface AdminDashboardShellProps {
  children: ReactNode;
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

export default function AdminDashboardShell({
  children,
  activeSection,
  onSectionChange,
}: AdminDashboardShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSectionChange = (section: DashboardSection) => {
    onSectionChange(section);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminTopBar 
        onSectionChange={handleSectionChange}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      
      <div className="flex">
        <AdminSidebarNav
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
