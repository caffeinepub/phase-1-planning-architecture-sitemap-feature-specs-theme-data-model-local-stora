import { useState } from 'react';
import RequireAdmin from '../components/auth/RequireAdmin';
import RequireAdminAccessGate from '../components/auth/RequireAdminAccessGate';
import AdminDashboardShell from '../components/adminDashboard/AdminDashboardShell';
import DashboardHomeView from '../components/adminDashboard/views/DashboardHomeView';
import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminCouponsTab from '../components/admin/AdminCouponsTab';
import PortfolioManagerView from '../components/adminDashboard/views/PortfolioManagerView';
import AdminTestimoniesTab from '../components/admin/AdminTestimoniesTab';
import AdminRequestsTab from '../components/admin/AdminRequestsTab';
import AdminMessagingTab from '../components/admin/AdminMessagingTab';
import SecuritySettingsView from '../components/adminDashboard/views/SecuritySettingsView';

export type DashboardSection = 
  | 'home'
  | 'shop'
  | 'coupons'
  | 'portfolio'
  | 'testimonies'
  | 'requests'
  | 'inbox'
  | 'security';

function AdminDashboardContent() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHomeView onNavigate={setActiveSection} />;
      case 'shop':
        return <AdminProductsTab />;
      case 'coupons':
        return <AdminCouponsTab />;
      case 'portfolio':
        return <PortfolioManagerView />;
      case 'testimonies':
        return <AdminTestimoniesTab />;
      case 'requests':
        return <AdminRequestsTab />;
      case 'inbox':
        return <AdminMessagingTab />;
      case 'security':
        return <SecuritySettingsView />;
      default:
        return <DashboardHomeView onNavigate={setActiveSection} />;
    }
  };

  return (
    <AdminDashboardShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AdminDashboardShell>
  );
}

export default function Admin() {
  return (
    <RequireAdmin>
      <RequireAdminAccessGate>
        <AdminDashboardContent />
      </RequireAdminAccessGate>
    </RequireAdmin>
  );
}
