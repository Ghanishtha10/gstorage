"use client";

import Link from 'next/link';
import { useCollection, useMemoFirebase, useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2, LayoutDashboard, UserCircle, ShieldCheck, Palette, Music, Headphones } from 'lucide-react';
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
    return query(collection(db, 'files'), orderBy('uploadedAt', 'desc'));
  }, [db]);

  const { data: files, isLoading } = useCollection(filesQuery);

  const adminProfileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: adminProfile } = useDoc(adminProfileRef);

  const adminName = adminProfile?.displayName || user?.displayName || 'Master Admin';
  const adminPhoto = adminProfile?.photoURL || user?.photoURL || `https://picsum.photos/seed/admin/100/100`;
  const adminBio = adminProfile?.bio || 'System Administrator';

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Database className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-headline font-bold text-lg sm:text-xl tracking-tight uppercase">G <span className="text-primary">storage</span></span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary transition-all hover:bg-primary/10" title="Music Player">
              <Link href="/music">
                <Music className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary transition-all hover:bg-primary/10" title="Customize Theme">
              <Link href="/themes">
                <Palette className="h-4 w-4" />
              </Link>
            </Button>
            <ThemeToggle />
            {!isAuthLoading && (
              user ? (
                <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-border/40">
                  <div className="hidden md:flex flex-col items-end">
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
                <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm font-bold tracking-tight hover:text-primary px-2 sm:px-3">
                  <Link href="/login">Login</Link>
                </Button>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 pb-32">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/40 pb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldCheck className="h-3 w-3 text-primary animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Secure Vault Online</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-headline font-bold mb-2 text-foreground uppercase tracking-tight">Digital Repository</h1>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Accessing globally distributed asset nodes.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="secondary" className="rounded-xl h-10 px-4 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-secondary/5">
                <Link href="/music">
                  <Headphones className="h-4 w-4" /> Music Player
                </Link>
              </Button>
              {!isLoading && files && (
                <div className="inline-flex text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 uppercase tracking-[0.2em] animate-pulse">
                  {files.length} units active
                </div>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] animate-pulse text-center">Scanning Data Streams...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {files?.map((file: any, index: number) => (
                <ContentCard key={file.id} file={file} index={index} />
              ))}
            </div>
          )}
          
          {!isLoading && (!files || files.length === 0) && (
            <div className="text-center py-20 sm:py-32 bg-card border-2 border-dashed border-border/50 rounded-2xl sm:rounded-3xl animate-in fade-in zoom-in duration-500">
              <Database className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] sm:text-xs px-4">The vault is currently empty.</p>
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-in fade-in slide-in-from-right-12 slide-in-from-bottom-12 zoom-in-95 duration-1000 ease-out max-w-[calc(100vw-2rem)] sm:max-w-md">
        <div className="bg-card/90 backdrop-blur-xl border border-border/40 p-2 pr-4 rounded-xl shadow-2xl flex items-center gap-3 group hover:ring-2 hover:ring-primary/40 transition-all duration-500 sm:hover:scale-[1.02] sm:hover:-translate-y-1">
          <div className="relative shrink-0">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-primary/20 shadow-inner group-hover:border-primary/50 transition-colors">
              <AvatarImage src={adminPhoto} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border-2 border-card rounded-full shadow-sm" title="Online" />
          </div>
          <div className="flex flex-col items-start text-left overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-hidden w-full">
              <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold tracking-tight truncate group-hover:text-primary transition-colors">{adminName}</span>
            </div>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest line-clamp-1">{adminBio}</span>
          </div>
          {user && (
            <div className="flex items-center gap-1 pl-2 border-l border-border/40 shrink-0">
              <Link href="/admin" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" title="Admin Dashboard">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-border/40 py-8 sm:py-12 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} G storage secure systems. Encrypted connection active.</p>
        </div>
      </footer>
    </div>
  );
}