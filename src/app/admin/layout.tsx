
"use client";

import { AdminSidebar } from '@/components/admin-sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="h-16 border-b border-border/40 flex items-center px-4 md:px-8 bg-card/50 backdrop-blur shrink-0">
          <div className="md:hidden mr-4">
            <MobileNav />
          </div>
          <h2 className="text-sm font-medium text-muted-foreground tracking-tight">Admin / G storage</h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">System Online</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
