"use client";

import { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle, Save, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminProfilePage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setPhotoURL(profile.photoURL || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'public_profiles', 'admin'), {
        displayName,
        bio,
        photoURL,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your public identity has been synchronized.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save profile changes to Firestore.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest">Accessing Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Security Clearance: Level 5</span>
        </div>
        <h1 className="text-3xl font-headline font-bold">Public Identity</h1>
        <p className="text-muted-foreground">Configure how you appear to the world in the storage vault.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 bg-card border-border/40">
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-2xl">
              <AvatarImage src={photoURL || `https://picsum.photos/seed/admin/200/200`} />
              <AvatarFallback><UserCircle className="h-20 w-20" /></AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <p className="font-bold text-lg">{displayName || 'Master Admin'}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{bio || 'System Administrator'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">Identity Details</CardTitle>
            <CardDescription>Updates are applied globally and in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="bg-muted/30 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Short Bio</Label>
                <Input 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Lead Developer & Architect"
                  className="bg-muted/30 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoURL" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avatar URL</Label>
                <Input 
                  id="photoURL" 
                  value={photoURL} 
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-muted/30 border-border/40"
                />
              </div>
              <Button type="submit" className="w-full gap-2 font-bold uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Saving Identity..." : "Commit Profile Updates"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
