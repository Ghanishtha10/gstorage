import { AdminSidebar } from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="h-16 border-b border-border/40 flex items-center px-8 bg-card/50 backdrop-blur shrink-0">
          <h2 className="text-sm font-medium text-muted-foreground tracking-tight">Admin / G storage</h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">System Online</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
