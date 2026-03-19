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
    <div className="fixed bottom-10 right-10 z-50 animate-in fade-in slide-in-from-bottom-12 duration-700 hidden sm:block">
      <div className="bg-card/85 backdrop-blur-3xl border border-border/40 p-6 pl-10 pr-10 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.4)] flex items-center justify-between gap-8 hover:ring-2 hover:ring-primary/40 transition-all duration-500 group cursor-default min-w-[380px] border-t-white/10">
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-1 group-hover:tracking-[0.4em] transition-all">Administrator</span>
          <span className="text-lg sm:text-xl font-bold leading-none group-hover:text-primary transition-colors truncate w-full">{adminName}</span>
          <div className="flex items-center gap-2 mt-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold truncate">{adminTag}</span>
          </div>
        </div>
        
        <div className="relative shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-sm group-hover:blur-md transition-all" />
          <Avatar className="h-20 w-20 border-2 border-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl relative z-10">
            <AvatarImage src={adminPhoto} />
            <AvatarFallback><UserCircle className="h-10 w-10" /></AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-4 border-card rounded-full shadow-lg z-20" />
        </div>
      </div>
    </div>
  );
}
