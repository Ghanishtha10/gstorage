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
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-10 sm:right-10 z-50 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <div className="bg-card/85 backdrop-blur-3xl border border-border/40 p-4 sm:p-6 sm:pl-8 sm:pr-8 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4 sm:gap-8 hover:ring-2 hover:ring-primary/40 transition-all duration-500 group cursor-default min-w-0 sm:min-w-[320px] border-t-white/10">
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Administrator</span>
          </div>
          <span className="text-sm sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors truncate w-full">{adminName}</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold truncate">{adminTag}</span>
          </div>
        </div>
        
        <div className="relative shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-sm group-hover:blur-md transition-all" />
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl relative z-10">
            <AvatarImage src={adminPhoto} />
            <AvatarFallback><UserCircle className="h-6 w-6 sm:h-8 sm:w-8" /></AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-3 w-3 sm:h-4 sm:w-4 bg-green-500 border-2 border-card rounded-full shadow-lg z-20" />
        </div>
      </div>
    </div>
  );
}
