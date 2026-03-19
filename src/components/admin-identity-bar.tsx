"use client";

import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminIdentityBar() {
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: profile, isLoading } = useDoc(profileRef);

  if (isLoading) return null;

  const adminName = profile?.displayName || 'Master Admin';
  const adminTag = profile?.bio || 'System Architect';
  const adminPhoto = profile?.photoURL || `https://picsum.photos/seed/admin/100/100`;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700 hidden sm:block">
      <div className="bg-card/80 backdrop-blur-2xl border border-border/40 p-4 pl-6 pr-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-6 hover:ring-2 hover:ring-primary/40 transition-all duration-500 group cursor-default min-w-[280px] border-t-white/10">
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-0.5 group-hover:tracking-[0.3em] transition-all">Administrator</span>
          <span className="text-sm font-bold leading-none group-hover:text-primary transition-colors truncate w-full">{adminName}</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold truncate">{adminTag}</span>
          </div>
        </div>
        
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
            <AvatarImage src={adminPhoto} />
            <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-background rounded-full shadow-lg" />
        </div>
      </div>
    </div>
  );
}
