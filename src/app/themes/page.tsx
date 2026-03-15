"use client";

import Link from 'next/link';
import { ArrowLeft, Palette, Check, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeAccent } from '@/components/theme-provider-wrapper';
import { cn } from '@/lib/utils';

const PRESETS = [
  { id: 'default', name: 'Sky Blue', color: 'bg-sky-400' },
  { id: 'emerald', name: 'Emerald City', color: 'bg-emerald-500' },
  { id: 'rose', name: 'Pink Rose', color: 'bg-rose-500' },
  { id: 'amber', name: 'Golden Amber', color: 'bg-amber-500' },
  { id: 'violet', name: 'Royal Violet', color: 'bg-violet-600' },
  { id: 'slate', name: 'Steel Slate', color: 'bg-slate-500' },
  { id: 'indigo', name: 'Ocean Indigo', color: 'bg-indigo-500' },
  { id: 'orange', name: 'Sun Orange', color: 'bg-orange-500' },
] as const;

export default function ThemesPage() {
  const { accent, setAccent } = useThemeAccent();

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-headline font-bold text-xl tracking-tight">G <span className="text-primary">storage</span></span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Vault
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-12">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase">Appearance Interface</h1>
            <p className="text-muted-foreground font-medium">Reconfigure the visual identity of your storage environment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRESETS.map((preset, index) => {
              const isActive = accent === preset.id;
              return (
                <Card 
                  key={preset.id}
                  className={cn(
                    "cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 relative overflow-hidden group border-border/40 animate-in fade-in slide-in-from-bottom-12 fill-mode-both",
                    isActive ? "ring-2 ring-primary bg-primary/5 shadow-2xl shadow-primary/10" : "bg-card/50 hover:bg-card hover:shadow-xl",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setAccent(preset.id as any)}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-6 w-6 rounded-xl shadow-lg transition-transform duration-500 group-hover:rotate-12", preset.color)} />
                        <CardTitle className="text-sm font-bold uppercase tracking-tight">{preset.name}</CardTitle>
                      </div>
                      {isActive && <div className="bg-primary rounded-full p-1"><Check className="h-3 w-3 text-primary-foreground" /></div>}
                    </div>
                  </CardHeader>
                  <div className={cn(
                    "h-1.5 w-full mt-auto transition-all duration-500",
                    isActive ? preset.color : "bg-transparent group-hover:bg-muted"
                  )} />
                </Card>
              );
            })}
          </div>

          <div className="pt-12 border-t border-border/40 text-center animate-in fade-in duration-1000 delay-500">
            <Button size="lg" asChild className="px-12 font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 h-14 rounded-2xl hover:scale-105 transition-transform active:scale-95">
              <Link href="/">Commit Changes</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-mono">
          <p>© {new Date().getFullYear()} G storage secure systems.</p>
        </div>
      </footer>
    </div>
  );
}
