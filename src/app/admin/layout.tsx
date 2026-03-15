"use client";

import { AdminSidebar } from '@/components/admin-sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from 'firebase/auth';

export default function AdminLayout({
  children,
}: {
  children: React.Node;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-[10px]">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 border-b border-border/40 flex items-center px-4 md:px-8 bg-card/50 backdrop-blur shrink-0 z-10">
          <div className="md:hidden flex items-center gap-1 mr-4">
            <MobileNav />
            <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" title="Go to Homepage">
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest truncate">
            Admin / <span className="text-primary">G storage</span>
          </h2>
          
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">System Online</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-destructive md:hidden" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background/50">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
