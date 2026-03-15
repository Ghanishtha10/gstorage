"use client";

import { AdminSidebar } from '@/components/admin-sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Database, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from 'firebase/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
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
          <p className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-[10px]">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden fixed inset-0">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        <header className="h-16 border-b border-border/40 flex items-center px-4 md:px-8 bg-card/80 backdrop-blur-md shrink-0 z-30">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <MobileNav />
            </div>
            <Link href="/" className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-lg tracking-tight">G <span className="text-primary">storage</span></span>
            </Link>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-destructive hover:bg-destructive/10" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background/50 custom-scrollbar">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
