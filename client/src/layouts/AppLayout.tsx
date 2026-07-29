import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export function AppLayout() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-aurora" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent/20 blur-[120px] animate-aurora [animation-delay:6s]" />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/60 bg-card/30 backdrop-blur-xl lg:block">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex min-h-screen w-full flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
