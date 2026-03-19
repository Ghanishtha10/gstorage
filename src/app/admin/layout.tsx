"use client";

import { AdminSidebar } from '@/components/admin-sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { useUser, useAuth, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Database, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: profile } = useDoc(profileRef);

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

  const adminName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Master Admin';
  const adminPhoto = profile?.photoURL || user?.photoURL || `https://picsum.photos/seed/admin/100/100`;

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden fixed inset-0">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        <header className="h-16 border-b border-border/40 flex items-center px-4 md:px-8 bg-card/80 backdrop-blur-md shrink-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="md:hidden">
              <MobileNav />
            </div>
            <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="font-headline font-bold text-base sm:text-lg tracking-tight truncate">G <span className="text-primary">storage</span></span>
            </Link>
          </div>
          
          <div className="ml-auto flex items-center gap-3 sm:gap-6 shrink-0">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-bold leading-none">{adminName}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Session Secure</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 pl-3 sm:pl-4 border-l border-border/40">
              <Link href="/admin/profile">
                <Avatar className="h-9 w-9 border border-primary/20 hover:ring-2 hover:ring-primary/50 transition-all duration-300">
                  <AvatarImage src={adminPhoto} />
                  <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-full" 
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background/50 custom-scrollbar">
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}