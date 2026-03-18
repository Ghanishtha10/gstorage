
"use client";

import Link from 'next/link';
import { useCollection, useMemoFirebase, useUser, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2, UserCircle, ShieldCheck, Palette, Headphones, ArrowRight, Disc, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export default function Home() {
  const db = useFirestore();
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

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Database className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-headline font-bold text-lg sm:text-xl tracking-tight uppercase">File <span className="text-primary">Storage</span></span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary transition-all hover:bg-primary/10" title="Music Player">
              <Link href="/music">
                <Headphones className="h-4 w-4" />
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

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/40 pb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldCheck className="h-3 w-3 text-primary animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Secure Vault Online</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-headline font-bold mb-2 text-foreground uppercase tracking-tight">File Storage</h1>
              <p className="text-muted-foreground text-sm sm:text-base font-medium">Securely browsing the global digital asset vault.</p>
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
              
              <Card className="group relative overflow-hidden bg-primary/5 border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl flex flex-col items-center justify-center p-8 aspect-video sm:aspect-auto">
                <Link href="/music" className="absolute inset-0 z-10" aria-label="Open Music Player" />
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Headphones className="h-8 w-8 text-primary animate-bounce" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Music Player</h3>
                  <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1 group-hover:text-primary transition-colors">
                    Access Audio Library <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Card>
            </div>
          )}
          
          {!isLoading && (!files || files.length === 0) && (
            <div className="text-center py-20 sm:py-32 bg-card border-2 border-dashed border-border/50 rounded-2xl sm:rounded-3xl animate-in fade-in zoom-in duration-500">
              <Database className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] sm:text-xs px-4">The vault is currently empty.</p>
            </div>
          )}

          {/* Music Bar - In Flow Positioning */}
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto">
            <Link href="/music" className="block">
              <div className="bg-card/90 backdrop-blur-xl border border-border/40 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between group hover:ring-2 hover:ring-primary/40 transition-all duration-500 hover:scale-[1.01]">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <Disc className="h-6 w-6 text-primary animate-spin-slow" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary truncate">Music Player</p>
                    <p className="text-[9px] text-muted-foreground font-medium truncate uppercase tracking-tight">System Audio Synchronization Active</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Stream Ready</span>
                  </div>
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 fill-primary-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 sm:py-12 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} File Storage Secure Systems. Encrypted connection active.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
