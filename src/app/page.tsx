
"use client";

import Link from 'next/link';
import { useCollection, useMemoFirebase, useUser, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2, LayoutDashboard, UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const db = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  
  const filesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'files'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: files, isLoading } = useCollection(filesQuery);

  // Fetch admin profile for the Discord-style bar
  const adminProfileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: adminProfile } = useDoc(adminProfileRef);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">G <span className="text-primary">storage</span></span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {!isAuthLoading && (
              user ? (
                <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-border/40">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold leading-none">{adminProfile?.displayName || user.displayName || 'Administrator'}</span>
                    <Link href="/admin/profile" className="text-[10px] text-muted-foreground hover:text-primary transition-colors">Edit Profile</Link>
                  </div>
                  <Link href="/admin">
                    <Avatar className="h-8 w-8 border border-primary/20 hover:ring-2 hover:ring-primary/50 transition-all">
                      <AvatarImage src={adminProfile?.photoURL || user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} />
                      <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
                  <Link href="/login">Admin Login</Link>
                </Button>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 pb-32">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/40 pb-6">
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2 text-foreground uppercase tracking-tight">Files</h1>
              <p className="text-muted-foreground">Browse the verified digital repository.</p>
            </div>
            {!isLoading && files && (
              <div className="text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 uppercase tracking-widest">
                {files.length} items
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-sm font-medium animate-pulse">Scanning repository...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files?.map((file: any) => (
                <ContentCard key={file.id} file={file} />
              ))}
            </div>
          )}
          
          {!isLoading && (!files || files.length === 0) && (
            <div className="text-center py-32 bg-card border-2 border-dashed border-border/50 rounded-3xl">
              <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">The vault is currently empty.</p>
            </div>
          )}
        </section>
      </main>

      {/* Discord-style Admin Profile Bar - MOVED TO RIGHT */}
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card/80 backdrop-blur-md border border-border/40 p-3 pl-6 rounded-2xl shadow-2xl flex items-center gap-3 group hover:scale-105 transition-all">
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span className="text-sm font-bold tracking-tight">{adminProfile?.displayName || 'Master Admin'}</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">System Admin</span>
          </div>
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-inner">
              <AvatarImage src={adminProfile?.photoURL || `https://picsum.photos/seed/admin/100/100`} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-card rounded-full" title="Online" />
          </div>
          {user && (
            <Link href="/admin" className="p-2 bg-primary/10 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} G storage secure systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
