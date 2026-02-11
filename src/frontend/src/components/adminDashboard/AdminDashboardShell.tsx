import { ReactNode } from 'react';
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
  return (
    <div className="min-h-screen bg-background">
      <AdminTopBar onSectionChange={onSectionChange} />
      
      <div className="flex">
        <AdminSidebarNav
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
