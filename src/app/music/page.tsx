
"use client";

import Link from 'next/link';
import { ArrowLeft, Music, Headphones, Volume2, Disc, Play, Clock, ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const TRACKS = [
  { title: "Snowman", artist: "WYS", duration: "3:12" },
  { title: "Relief", artist: "l'Indécis", duration: "2:45" },
  { title: "Morning", artist: "j'san", duration: "3:01" },
  { title: "Affection", artist: "Jinsang", duration: "2:58" },
  { title: "5:32 PM", artist: "The Deli", duration: "3:20" },
  { title: "A Way of Life", artist: "Kupla", duration: "2:34" },
  { title: "Pure Imagination", artist: "Rook1e", duration: "2:15" },
  { title: "I'm Closing My Eyes", artist: "potsu", duration: "3:05" },
  { title: "Better Days", artist: "Lakey Inspired", duration: "3:40" },
  { title: "Softly", artist: "Clairo", duration: "2:55" },
  { title: "Get You", artist: "Daniel Caesar", duration: "3:50" },
  { title: "Japanese Garden", artist: "Lofi Fruits", duration: "2:20" },
];

export default function MusicLibraryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <Music className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-headline font-bold text-xl tracking-tight uppercase">File <span className="text-primary">Storage</span></span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Exit Library
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-2 mb-12">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5 group relative overflow-hidden">
               <Headphones className="h-8 w-8 text-primary relative z-10 animate-bounce" />
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase text-foreground">Aura & Beats</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] max-w-lg mx-auto">
              High-performance synchronization for creative focus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Spotify Player */}
            <Card className="lg:col-span-2 bg-card/50 border-border/40 overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/5">
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
                <div className="w-full bg-black/5 h-[800px]">
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

            {/* Manual Track List */}
            <Card className="bg-card/50 border-border/40 rounded-[2rem] shadow-xl shadow-primary/5 h-fit lg:h-[870px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <ListMusic className="h-4 w-4 text-primary" /> Playlist Log
                </CardTitle>
                <CardDescription className="text-[10px] font-medium">Manual override track verification.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] lg:h-[750px] px-6">
                  <div className="space-y-1 pb-6">
                    {TRACKS.map((track, i) => (
                      <div key={i} className="group flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-all cursor-default border border-transparent hover:border-primary/10">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{track.title}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[10px] font-medium text-muted-foreground/60">{track.duration}</span>
                          <Play className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
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
