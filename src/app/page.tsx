
"use client";

import Link from 'next/link';
import { useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const db = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  
  const filesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'files'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: files, isLoading } = useCollection(filesQuery);

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
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            {!isAuthLoading && (
              user ? (
                <Button variant="outline" asChild className="text-sm font-medium border-primary/20 hover:bg-primary/10 hover:text-primary gap-2">
                  <Link href="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" asChild className="text-sm font-medium">
                  <Link href="/login">Admin Login</Link>
                </Button>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/40 pb-6">
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2 text-foreground">Files</h1>
              <p className="text-muted-foreground">Browse all verified assets and documents.</p>
            </div>
            {!isLoading && files && (
              <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {files.length} items available
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Loading files...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files?.map((file: any) => (
                <ContentCard key={file.id} file={file} />
              ))}
            </div>
          )}
          
          {!isLoading && (!files || files.length === 0) && (
            <div className="text-center py-32 bg-card border-2 border-dashed border-border/50 rounded-2xl">
              <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No content has been uploaded yet.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} G storage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
