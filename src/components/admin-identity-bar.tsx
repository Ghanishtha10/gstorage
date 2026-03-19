
"use client";

import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, UserCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
      <Link href="/admin-info" className="block group">
        <div className="bg-card/90 backdrop-blur-2xl border border-primary/20 p-2 sm:p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-3 sm:gap-4 hover:ring-2 hover:ring-primary/50 transition-all duration-500 min-w-0 sm:min-w-[260px] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col items-start flex-1 min-w-0 relative z-10">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Authorized Admin</span>
            </div>
            <span className="text-sm font-bold leading-tight group-hover:text-primary transition-colors truncate w-full">{adminName}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate opacity-80 mt-0.5">{adminTag}</span>
          </div>
          
          <div className="relative shrink-0 z-10">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/20 group-hover:scale-105 transition-all duration-500 shadow-xl">
              <AvatarImage src={adminPhoto} />
              <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              <ExternalLink className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
