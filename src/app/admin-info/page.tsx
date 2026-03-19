
"use client";

import { useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, UserCircle, Github, Twitter, MessageSquare, LayoutDashboard, Settings, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AdminInfoPage() {
  const db = useFirestore();
  const { user } = useUser();

  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: profile, isLoading } = useDoc(profileRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-pulse">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accessing Identity Records...</p>
        </div>
      </div>
    );
  }

  const adminName = profile?.displayName || 'Master Admin';
  const adminTag = profile?.bio || 'Lead System Architect';
  const adminPhoto = profile?.photoURL || `https://picsum.photos/seed/admin/200/200`;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center justify-center selection:bg-primary/30">
      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary uppercase tracking-widest text-[10px] font-bold">
          <ArrowLeft className="h-4 w-4" /> Return to Vault
        </Button>
      </Link>

      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative group mx-auto w-fit">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Avatar className="h-32 w-32 sm:h-48 sm:w-48 border-4 border-primary/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
            <AvatarImage src={adminPhoto} />
            <AvatarFallback><UserCircle className="h-24 w-24 text-muted-foreground" /></AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-background border-2 border-primary p-2 rounded-full shadow-xl z-20">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-headline font-bold tracking-tight uppercase">{adminName}</h1>
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs sm:text-sm">{adminTag}</p>
          </div>
          
          <Card className="bg-card/50 backdrop-blur border-border/40 max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
            <CardContent className="pt-8 pb-8 px-6 text-center space-y-6">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {profile?.bio || "The lead administrator of the File Storage secure digital repository. Managing data integrity and security protocols with precision."}
              </p>

              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {profile?.discord && (
                  <a href={profile.discord} target="_blank" rel="noopener noreferrer" className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-muted/30 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:-translate-y-1">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {profile?.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-muted/30 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:-translate-y-1">
                    <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-muted/30 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:-translate-y-1">
                    <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {!profile?.discord && !profile?.twitter && !profile?.github && (
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">No social links configured.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {user && (
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
            <Button asChild className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20">
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" /> Control Panel
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] gap-2 border-primary/20 hover:border-primary/50">
              <Link href="/admin/profile">
                <Settings className="h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-[0.5em]">Identity Hash: {adminName.length * 3242}-GS-2024</p>
        </div>
      </div>
    </div>
  );
}
