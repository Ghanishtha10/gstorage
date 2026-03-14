import Link from 'next/link';
import { getFiles } from '@/lib/store';
import { ContentCard } from '@/components/content-card';
import { Lock, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const files = await getFiles();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:rotate-6 transition-transform">
              <Lock className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">Content<span className="text-primary">Locker</span></span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin Dashboard</Link>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link href="/login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Digital Assets, <span className="text-primary">Simplified.</span></h1>
          <p className="text-muted-foreground text-lg mb-8">
            Access our secure repository of resources, organized with AI-powered intelligent tagging.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
             <div className="flex flex-col gap-2 p-4 rounded-xl border bg-muted/30">
               <ShieldCheck className="h-6 w-6 text-primary" />
               <h3 className="font-semibold text-sm">Secure Storage</h3>
               <p className="text-xs text-muted-foreground">Encrypted and protected repository.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 rounded-xl border bg-muted/30">
               <Zap className="h-6 w-6 text-secondary" />
               <h3 className="font-semibold text-sm">AI Organized</h3>
               <p className="text-xs text-muted-foreground">Smart tagging for easy discovery.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 rounded-xl border bg-muted/30">
               <Lock className="h-6 w-6 text-primary" />
               <h3 className="font-semibold text-sm">Admin Verified</h3>
               <p className="text-xs text-muted-foreground">Curated by our expert team.</p>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
            <h2 className="text-2xl font-headline font-bold">Latest Content</h2>
            <div className="text-sm text-muted-foreground">{files.length} items available</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <ContentCard key={file.id} file={file} />
            ))}
          </div>
          
          {files.length === 0 && (
            <div className="text-center py-24 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
              <p className="text-muted-foreground">No content available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 bg-muted/10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Content Locker. Securely powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}