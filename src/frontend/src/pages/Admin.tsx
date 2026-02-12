import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
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
import AdminLoreKnowledgeView from '../components/adminDashboard/views/AdminLoreKnowledgeView';
import { CheckCircle } from 'lucide-react';

export type DashboardSection = 
  | 'home'
  | 'shop'
  | 'coupons'
  | 'portfolio'
  | 'testimonies'
  | 'requests'
  | 'inbox'
  | 'lore'
  | 'security';

function AdminDashboardContent() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');
  const [showGrantedMessage, setShowGrantedMessage] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { granted?: string | number };

  useEffect(() => {
    // Check if we just arrived from successful admin access
    if (search.granted === '1' || search.granted === 1) {
      setShowGrantedMessage(true);
      
      // Clear the search param after showing the message
      setTimeout(() => {
        navigate({ to: '/admin', replace: true });
      }, 100);
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowGrantedMessage(false);
      }, 3000);
    }
  }, [search.granted, navigate]);

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
      case 'lore':
        return <AdminLoreKnowledgeView />;
      case 'security':
        return <SecuritySettingsView />;
      default:
        return <DashboardHomeView onNavigate={setActiveSection} />;
    }
  };

  return (
    <>
      {showGrantedMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Access Granted</span>
          </div>
        </div>
      )}
      
      <AdminDashboardShell 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderContent()}
      </AdminDashboardShell>
    </>
  );
}

export default function Admin() {
  return (
    <RequireAdminAccessGate>
      <AdminDashboardContent />
    </RequireAdminAccessGate>
  );
}
