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
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-card/85 backdrop-blur-2xl border border-border/40 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-between gap-3 sm:gap-5 hover:ring-1 hover:ring-primary/30 transition-all duration-500 group cursor-default min-w-0 sm:min-w-[240px] border-t-white/5">
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <ShieldCheck className="h-2.5 w-2.5 text-primary" />
            <span className="text-[8px] sm:text-[9px] font-bold text-primary uppercase tracking-[0.1em] group-hover:tracking-[0.15em] transition-all">Admin</span>
          </div>
          <span className="text-xs sm:text-sm font-bold leading-tight group-hover:text-primary transition-colors truncate w-full">{adminName}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold truncate opacity-80">{adminTag}</span>
          </div>
        </div>
        
        <div className="relative shrink-0">
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11 border border-primary/20 group-hover:scale-105 transition-all duration-500 shadow-md relative z-10">
            <AvatarImage src={adminPhoto} />
            <AvatarFallback><UserCircle className="h-5 w-5 sm:h-6 sm:w-6" /></AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-card rounded-full shadow-sm z-20" />
        </div>
      </div>
    </div>
  );
}
