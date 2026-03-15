"use client";

import Link from 'next/link';
import { useCollection, useMemoFirebase, useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2, LayoutDashboard, UserCircle, ShieldCheck, LogOut, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
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

  const handleLogout = async () => {
    await signOut(auth);
    router.refresh();
  };

  const adminName = adminProfile?.displayName || user?.displayName || 'Master Admin';
  const adminPhoto = adminProfile?.photoURL || user?.photoURL || `https://picsum.photos/seed/admin/100/100`;
  const adminBio = adminProfile?.bio || 'System Administrator';

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Database className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">G <span className="text-primary">storage</span></span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary transition-all hover:bg-primary/10" title="Customize Theme">
              <Link href="/themes">
                <Palette className="h-4 w-4" />
              </Link>
            </Button>
            <ThemeToggle />
            {!isAuthLoading && (
              user ? (
                <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-border/40">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold leading-none">{adminName}</span>
                    <Link href="/admin/profile" className="text-[10px] text-muted-foreground hover:text-primary transition-colors">Edit Profile</Link>
                  </div>
                  <Link href="/admin">
                    <Avatar className="h-8 w-8 border border-primary/20 hover:ring-2 hover:ring-primary/50 transition-all duration-300 hover:scale-110">
                      <AvatarImage src={adminPhoto} />
                      <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild className="text-sm font-bold tracking-tight hover:text-primary">
                  <Link href="/login">Admin Login</Link>
                </Button>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 pb-32">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/40 pb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2 text-foreground uppercase tracking-tight">File Storage</h1>
              <p className="text-muted-foreground text-sm font-medium">Securely browsing the global digital asset vault.</p>
            </div>
            {!isLoading && files && (
              <div className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 uppercase tracking-[0.2em] animate-pulse">
                {files.length} items active
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Scanning Data Streams...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files?.map((file: any, index: number) => (
                <ContentCard key={file.id} file={file} index={index} />
              ))}
            </div>
          )}
          
          {!isLoading && (!files || files.length === 0) && (
            <div className="text-center py-32 bg-card border-2 border-dashed border-border/50 rounded-3xl animate-in fade-in zoom-in duration-500">
              <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">The vault is currently empty.</p>
            </div>
          )}
        </section>
      </main>

      {/* Discord-style Admin Profile Bar */}
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-right-12 slide-in-from-bottom-12 zoom-in-95 duration-1000 ease-out max-w-[calc(100vw-3rem)] sm:max-w-md">
        <div className="bg-card/90 backdrop-blur-xl border border-border/40 p-2 pr-4 rounded-xl shadow-2xl flex items-center gap-3 group hover:ring-2 hover:ring-primary/40 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-inner group-hover:border-primary/50 transition-colors">
              <AvatarImage src={adminPhoto} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-card rounded-full shadow-sm" title="Online" />
          </div>
          <div className="flex flex-col items-start text-left overflow-hidden">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
              <span className="text-xs font-bold tracking-tight truncate group-hover:text-primary transition-colors">{adminName}</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest line-clamp-1">{adminBio}</span>
          </div>
          {user && (
            <div className="flex items-center gap-1 pl-2 border-l border-border/40">
              <Link href="/admin" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" title="Admin Dashboard">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:bg-destructive/10 sm:hidden" 
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-border/40 py-12 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
          <p>© {new Date().getFullYear()} G storage secure systems. Encrypted connection active.</p>
        </div>
      </footer>
    </div>
  );
}
