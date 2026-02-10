import { Outlet } from '@tanstack/react-router';
import HeaderNav from './HeaderNav';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url(/assets/generated/parchment-bg.dim_1920x1080.png)' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
