
"use client";

import Link from 'next/link';
import { ArrowLeft, Music, Headphones, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MusicLibraryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <Music className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-headline font-bold text-xl tracking-tight uppercase text-foreground">File <span className="text-primary">Storage</span></span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Exit Library
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-2 mb-8">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5 group relative overflow-hidden">
               <Headphones className="h-8 w-8 text-primary relative z-10 animate-bounce" />
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase text-foreground">File Storage</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] max-w-lg mx-auto">
              Securely browsing the global digital asset vault.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">High Fidelity Stream Active</span>
            </div>
            
            <div className="w-full flex justify-center">
              <iframe 
                style={{ borderRadius: '12px', border: 'none' }} 
                src="https://open.spotify.com/embed/playlist/7A0Jnb8AqB669RawoU8Tll?utm_source=generator&theme=0" 
                width="100%" 
                height="600" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="shadow-2xl shadow-primary/10 max-w-4xl"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} File Storage Audio Systems. Secure connection encrypted.</p>
        </div>
      </footer>
    </div>
  );
}
