
"use client";

import { useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, UserCircle, Github, Twitter, MessageSquare, Settings, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  const adminPhoto = profile?.photoURL || `https://picsum.photos/seed/admin/300/300`;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 md:p-12 flex flex-col items-center selection:bg-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Navigation */}
        <div className="flex justify-start mb-8 sm:mb-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="group gap-2 text-muted-foreground hover:text-primary uppercase tracking-widest text-[10px] font-bold bg-background/50 backdrop-blur rounded-full px-4 border border-border/40">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Return to Vault
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Sidebar Section: Avatar and Quick Stats */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Avatar className="h-48 w-48 sm:h-56 sm:w-56 border-8 border-background shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <AvatarImage src={adminPhoto} />
                <AvatarFallback><UserCircle className="h-32 w-32 text-muted-foreground" /></AvatarFallback>
              </Avatar>
              <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-2xl shadow-xl z-20 border-4 border-background">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-2 px-2">
              <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight uppercase leading-none">{adminName}</h1>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs">{adminTag}</p>
              </div>
            </div>

            {user && (
              <Button asChild variant="outline" className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur">
                <Link href="/admin/profile">
                  <Settings className="h-4 w-4" /> System Configuration
                </Link>
              </Button>
            )}
          </div>

          {/* Main Content section */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="bg-card/40 backdrop-blur-xl border-border/40 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
              <CardContent className="p-8 sm:p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Globe className="h-5 w-5" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Administrative Narrative</h3>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {profile?.aboutMe || "The lead administrator of the File Storage secure digital repository. Managing data integrity and security protocols with precision and a commitment to digital privacy."}
                  </p>
                </div>

                <div className="pt-8 border-t border-border/10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Social Connectors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {profile?.discord ? (
                      <a href={profile.discord} target="_blank" rel="noopener noreferrer" 
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-[#5865F2]/5 border border-[#5865F2]/20 hover:bg-[#5865F2] hover:text-white transition-all duration-300">
                        <MessageSquare className="h-6 w-6" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">Discord</span>
                          <span className="text-xs font-bold">Join Server</span>
                        </div>
                      </a>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-border/40 opacity-40 flex items-center gap-4">
                         <MessageSquare className="h-6 w-6" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">N/A</span>
                      </div>
                    )}

                    {profile?.twitter ? (
                      <a href={profile.twitter} target="_blank" rel="noopener noreferrer" 
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-[#1DA1F2]/5 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300">
                        <Twitter className="h-6 w-6" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">Twitter</span>
                          <span className="text-xs font-bold">Follow</span>
                        </div>
                      </a>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-border/40 opacity-40 flex items-center gap-4">
                         <Twitter className="h-6 w-6" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">N/A</span>
                      </div>
                    )}

                    {profile?.github ? (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" 
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 border border-border/20 hover:bg-foreground hover:text-background transition-all duration-300">
                        <Github className="h-6 w-6" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">GitHub</span>
                          <span className="text-xs font-bold">Source</span>
                        </div>
                      </a>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-border/40 opacity-40 flex items-center gap-4">
                         <Github className="h-6 w-6" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">N/A</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <p className="text-[9px] text-muted-foreground/30 font-bold uppercase tracking-[0.5em] font-mono">
                System Node Protocol: GS-{new Date().getFullYear()} // Secure Link Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

