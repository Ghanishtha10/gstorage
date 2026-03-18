
"use client";

import Link from 'next/link';
import { ArrowLeft, Music, Headphones, Volume2, Disc, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MusicLibraryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30 pb-24">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <Music className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-headline font-bold text-xl tracking-tight uppercase">Music <span className="text-primary">Library</span></span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Exit Library
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/5 group relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/20 animate-pulse" />
               <Headphones className="h-10 w-10 text-primary relative z-10 animate-bounce" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight uppercase">Aura & Beats</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] sm:text-xs max-w-lg mx-auto leading-relaxed">
              Synchronized audio streams for high-performance productivity and creative focus.
            </p>
          </div>

          <Card className="bg-card/50 border-border/40 overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/5">
            <CardHeader className="bg-muted/10 border-b border-border/10 pb-6 pt-6 px-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <CardTitle className="text-xl font-bold flex items-center gap-3">
                     <Disc className="h-6 w-6 text-primary animate-spin-slow" /> Global Stream
                   </CardTitle>
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Extended Synchronization Active</CardDescription>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                  <Volume2 className="h-3 w-3 text-secondary animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">Optimized</span>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full bg-black/5 min-h-[800px]">
                 <iframe 
                  src="https://open.spotify.com/embed/playlist/7A0Jnb8AqB669RawoU8Tll?utm_source=generator&theme=0" 
                  width="100%" 
                  height="800" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="w-full h-full border-0 rounded-b-[2rem]"
                 />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Horizontal Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t border-border/40 z-50 flex items-center px-4 sm:px-8">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
              <Disc className="h-6 w-6 text-primary animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-primary truncate">Music Player</p>
              <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-tight">System Audio Synchronization Active</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <div className="flex items-center gap-4">
              <div className="h-1 w-48 sm:w-64 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress-glow w-[65%]" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">03:45 / 05:20</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Live Streaming</span>
            </div>
            <Button size="icon" variant="ghost" className="h-10 w-10 text-primary hover:bg-primary/10 rounded-full">
              <Play className="h-5 w-5 fill-primary" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} G storage audio systems. High fidelity synchronization active.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress-glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; filter: brightness(1.2); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-progress-glow {
          animation: progress-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
