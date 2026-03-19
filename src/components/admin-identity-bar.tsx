
"use client";

import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, UserCircle, ExternalLink } from 'lucide-react';
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
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <Link href="/admin-info" className="block group">
        <div className="bg-card/95 backdrop-blur-xl border border-primary/20 p-2 pr-6 rounded-full shadow-2xl hover:shadow-primary/20 hover:ring-2 hover:ring-primary/40 transition-all duration-300 flex items-center gap-4 min-w-[200px] sm:min-w-[280px] max-w-[320px]">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/20 group-hover:scale-105 transition-transform duration-300 shadow-inner">
              <AvatarImage src={adminPhoto} />
              <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full shadow-sm" />
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors leading-none mb-1">
              {adminName}
            </span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-2.5 w-2.5 text-primary opacity-70" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold truncate">
                {adminTag}
              </span>
            </div>
          </div>
          
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-all">
            <ExternalLink className="h-4 w-4 text-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}

