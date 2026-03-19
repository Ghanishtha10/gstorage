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
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700 hidden sm:block">
      <div className="bg-card/80 backdrop-blur-xl border border-border/40 p-3 pl-4 pr-5 rounded-2xl shadow-2xl flex items-center gap-4 hover:ring-2 hover:ring-primary/40 transition-all duration-500 group cursor-default">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold leading-none group-hover:text-primary transition-colors">{adminName}</span>
          <div className="flex items-center gap-1 mt-1">
            <ShieldCheck className="h-2.5 w-2.5 text-primary" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{adminTag}</span>
          </div>
        </div>
        
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:scale-110 transition-transform duration-500">
            <AvatarImage src={adminPhoto} />
            <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  );
}
