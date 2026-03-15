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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">G <span className="text-primary">storage</span></span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Files
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Personalize Appearance</h1>
            <p className="text-muted-foreground">Choose a color accent that fits your style. Your choice is saved locally.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRESETS.map((preset) => {
              const isActive = accent === preset.id;
              return (
                <Card 
                  key={preset.id}
                  className={cn(
                    "cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 relative overflow-hidden group",
                    isActive ? "ring-2 ring-primary bg-primary/5" : "bg-card/50 hover:bg-card"
                  )}
                  onClick={() => setAccent(preset.id as any)}
                >
                  <CardHeader className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-4 w-4 rounded-full shadow-sm", preset.color)} />
                        <CardTitle className="text-sm font-bold">{preset.name}</CardTitle>
                      </div>
                      {isActive && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </CardHeader>
                  <div className={cn(
                    "h-1 w-full mt-auto transition-colors",
                    isActive ? preset.color : "bg-transparent group-hover:bg-muted"
                  )} />
                </Card>
              );
            })}
          </div>

          <div className="pt-8 border-t border-border/40 text-center">
            <Button size="lg" asChild className="px-8 font-bold shadow-lg shadow-primary/20 h-12">
              <Link href="/">Apply & Return</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} G storage secure systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}