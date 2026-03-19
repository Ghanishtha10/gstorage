
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
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/admin-info" className="block group">
        <div className="bg-card/95 backdrop-blur-xl border border-primary/20 p-1.5 pr-4 rounded-full shadow-lg hover:shadow-primary/20 hover:ring-2 hover:ring-primary/40 transition-all duration-300 flex items-center gap-3 max-w-[240px]">
          <div className="relative shrink-0">
            <Avatar className="h-8 w-8 border border-primary/20 group-hover:scale-105 transition-transform duration-300">
              <AvatarImage src={adminPhoto} />
              <AvatarFallback><UserCircle className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full shadow-sm" />
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
              {adminName}
            </span>
            <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold truncate opacity-70">
              {adminTag}
            </span>
          </div>
          
          <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors ml-auto" />
        </div>
      </Link>
    </div>
  );
}
