"use client";

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle, Save, ShieldCheck, Camera, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminProfilePage() {
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setPhotoURL(profile.photoURL || '');
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setPhotoFile(selected);
    }
  };

  const uploadToBlob = async (targetFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', targetFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to transmit asset to server.');
    }

    const blob = await response.json();
    return blob.url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setIsSaving(true);
    try {
      let finalPhotoURL = photoURL;
      
      if (photoFile) {
        finalPhotoURL = await uploadToBlob(photoFile);
      }

      await setDoc(doc(db, 'public_profiles', 'admin'), {
        displayName,
        bio,
        photoURL: finalPhotoURL,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your public identity has been synchronized.",
      });
      setPhotoFile(null);
      setPhotoURL(finalPhotoURL);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not save profile changes.",
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Security Clearance: Level 5</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold">Public Identity</h1>
        <p className="text-muted-foreground text-sm">Configure how you appear to the world in the storage vault.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card className="lg:col-span-1 bg-card border-border/40 h-fit">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identity Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20 shadow-2xl transition-transform duration-500 sm:group-hover:scale-105">
                <AvatarImage src={photoFile ? URL.createObjectURL(photoFile) : (photoURL || `https://picsum.photos/seed/admin/200/200`)} />
                <AvatarFallback><UserCircle className="h-16 w-16 sm:h-20 sm:w-20" /></AvatarFallback>
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-8 w-8" />
              </button>
            </div>
            <div className="text-center space-y-1 overflow-hidden w-full">
              <p className="font-bold text-lg truncate px-2">{displayName || 'Master Admin'}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider line-clamp-2 px-4">{bio || 'System Administrator'}</p>
            </div>
            <Button variant="outline" size="sm" className="md:hidden w-full mt-2" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Identity Details</CardTitle>
            <CardDescription className="text-xs">Updates are applied globally and in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Display Name</Label>
                <input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Short Bio</Label>
                <input 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Lead Developer & Architect"
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Avatar Configuration</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      id="photoURL" 
                      value={photoFile ? `[File Selected: ${photoFile.name}]` : photoURL} 
                      onChange={(e) => {
                        setPhotoURL(e.target.value);
                        setPhotoFile(null);
                      }}
                      placeholder="Paste image URL here..."
                      className="flex h-11 flex-1 rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      readOnly={!!photoFile}
                    />
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="shrink-0 h-11 rounded-xl border-primary/20 hover:border-primary/50 gap-2 font-bold uppercase tracking-widest text-[10px]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  {photoFile && (
                    <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                      <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-[10px] font-bold text-primary truncate flex-1">{photoFile.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive shrink-0"
                        onClick={() => {
                          setPhotoFile(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full gap-2 font-bold uppercase tracking-widest text-[10px] h-12 shadow-xl shadow-primary/20 mt-4 rounded-xl" disabled={isSaving}>
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
