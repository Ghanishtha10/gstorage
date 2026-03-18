
"use client";

import Link from 'next/link';
import { ArrowLeft, Music, Headphones, Volume2, Disc, Play, Clock, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Manually curated track list inspired by the requested playlist
const TRACKS = [
  { id: 1, title: "Midnight Coffee", artist: "Lofi Girl", duration: "2:45" },
  { id: 2, title: "Rainy Window", artist: "Cloudy Beats", duration: "3:12" },
  { id: 3, title: "Summer Breeze", artist: "Dreamy Moods", duration: "2:58" },
  { id: 4, title: "Study Session", artist: "Focus Flow", duration: "4:05" },
  { id: 5, title: "Urban Twilight", artist: "Night Owl", duration: "3:30" },
  { id: 6, title: "Ethereal Echoes", artist: "Space Walker", duration: "2:50" },
  { id: 7, title: "Golden Hour", artist: "Sunsets", duration: "3:15" },
  { id: 8, title: "Mist in the Valley", artist: "Nature Sounds", duration: "4:20" },
  { id: 9, title: "Neon Nights", artist: "Retro Wave", duration: "3:45" },
  { id: 10, title: "Silent Streets", artist: "Lonely City", duration: "2:30" },
  { id: 11, title: "Autumn Leaves", artist: "Season Change", duration: "3:05" },
  { id: 12, title: "Cozy Cabin", artist: "Fireplace", duration: "5:00" },
  { id: 13, title: "Drifting Away", artist: "Sleepy Head", duration: "3:55" },
  { id: 14, title: "Morning Dew", artist: "Garden Beats", duration: "2:40" },
  { id: 15, title: "Ocean Waves", artist: "Beach Side", duration: "6:15" },
  { id: 16, title: "Star Gazing", artist: "Galactic", duration: "3:25" },
  { id: 17, title: "Wind Chimes", artist: "Breeze", duration: "2:10" },
  { id: 18, title: "Deep Focus", artist: "Concentration", duration: "4:40" },
  { id: 19, title: "Late Night Drive", artist: "Highway", duration: "3:50" },
  { id: 20, title: "Quiet Library", artist: "Bookworm", duration: "3:00" },
  { id: 21, title: "Soft Rainfall", artist: "Stormy", duration: "5:30" },
  { id: 22, title: "Gentle Piano", artist: "Classical Lofi", duration: "3:10" },
  { id: 23, title: "Vinyl Crackle", artist: "Old School", duration: "2:55" },
  { id: 24, title: "Floating Clouds", artist: "Atmosphere", duration: "4:15" },
  { id: 25, title: "Secret Garden", artist: "Hidden", duration: "3:35" },
  { id: 26, title: "Moonlight Sonata (Lofi)", artist: "Classical Beats", duration: "4:00" },
  { id: 27, title: "Sakura Petals", artist: "Tokyo Vibes", duration: "2:50" },
  { id: 28, title: "Midnight Subway", artist: "City Pulse", duration: "3:20" },
  { id: 29, title: "Lost in Thought", artist: "Pensive", duration: "3:45" },
  { id: 30, title: "Starlit Path", artist: "Night Sky", duration: "3:10" },
];

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
          <div className="text-center space-y-2 mb-8">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5 group relative overflow-hidden">
               <Headphones className="h-8 w-8 text-primary relative z-10 animate-bounce" />
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase text-foreground">Aura & Beats</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] max-w-lg mx-auto">
              Securely streaming your digital audio collection.
            </p>
          </div>

          <div className="w-full">
            <Card className="bg-card/50 border-border/40 overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/5">
              <CardHeader className="bg-muted/10 border-b border-border/10 pb-4 pt-4 px-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <CardTitle className="text-lg font-bold flex items-center gap-2">
                       <Disc className="h-5 w-5 text-primary animate-spin-slow" /> Global Stream
                     </CardTitle>
                     <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Synchronization Active</CardDescription>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                    <Volume2 className="h-3 w-3 text-secondary animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">High Fidelity</span>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[650px] w-full px-6">
                  <div className="space-y-1 py-4">
                    {TRACKS.map((track) => (
                      <div 
                        key={track.id} 
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 bg-muted/50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:fill-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{track.title}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-muted-foreground">
                          <div className="hidden sm:flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="h-4 w-4 hover:text-primary transition-colors" />
                            <Share2 className="h-4 w-4 hover:text-primary transition-colors" />
                          </div>
                          <div className="flex items-center gap-1 min-w-[50px] justify-end">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-mono">{track.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center py-8">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-40">
                        End of digital stream logs
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <p className="mt-4 text-[9px] text-muted-foreground text-center uppercase tracking-widest font-bold">
              The interface is currently synchronized with the lofi digital repository.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} File Storage Audio Systems. Secure connection encrypted.</p>
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
