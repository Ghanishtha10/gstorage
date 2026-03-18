
"use client";

import Link from 'next/link';
import { ArrowLeft, Music, Headphones, Volume2, Disc, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-2 mb-12">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5 group relative overflow-hidden">
               <Headphones className="h-8 w-8 text-primary relative z-10 animate-bounce" />
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase text-foreground">Aura & Beats</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] max-w-lg mx-auto">
              High-performance synchronization for creative focus.
            </p>
          </div>

          <div className="w-full">
            {/* Spotify Player */}
            <Card className="bg-card/50 border-border/40 overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/5">
              <CardHeader className="bg-muted/10 border-b border-border/10 pb-4 pt-4 px-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <CardTitle className="text-lg font-bold flex items-center gap-2">
                       <Disc className="h-5 w-5 text-primary animate-spin-slow" /> Global Stream
                     </CardTitle>
                     <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Spotify Integration Active</CardDescription>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                    <Volume2 className="h-3 w-3 text-secondary animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">Optimized</span>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full bg-black/5">
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
            <p className="mt-4 text-[9px] text-muted-foreground text-center uppercase tracking-widest font-bold">
              Note: Stream track listing is synchronized with Spotify platform limits.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} File Storage Audio Systems. High fidelity synchronization active.</p>
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
