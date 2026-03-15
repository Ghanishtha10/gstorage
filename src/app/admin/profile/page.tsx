
"use client";

import { useState, useEffect } from 'react';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Save, Image as ImageIcon, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Fetch current profile data
  const adminProfileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: adminProfile, isLoading: isProfileLoading } = useDoc(adminProfileRef);

  useEffect(() => {
    if (adminProfile) {
      setDisplayName(adminProfile.displayName || '');
      setPhotoURL(adminProfile.photoURL || '');
      setBio(adminProfile.bio || '');
    } else if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [adminProfile, user]);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !db) return;
    setIsUpdatingProfile(true);
    
    const finalPhotoURL = photoURL || `https://picsum.photos/seed/${auth.currentUser.uid}/200/200`;

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: finalPhotoURL
      });

      // Update Public Profile in Firestore
      const profileData = {
        displayName,
        photoURL: finalPhotoURL,
        bio: bio.trim(),
        updatedAt: new Date().toISOString(),
        role: 'System Administrator'
      };

      setDoc(doc(db, 'public_profiles', 'admin'), profileData, { merge: true })
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: `public_profiles/admin`,
            operation: 'write',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Profile Updated",
        description: "Your administrative profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your profile information.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Account & Identity</h1>
        <p className="text-muted-foreground">Manage your public presence and system information.</p>
      </div>

      <Card className="bg-card border-border/40 shadow-xl">
        <CardHeader className="border-b border-border/10 bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Settings
          </CardTitle>
          <CardDescription>Customize how you appear across the system.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-primary/20 ring-4 ring-background shadow-2xl transition-transform group-hover:scale-105">
                <AvatarImage src={photoURL || `https://picsum.photos/seed/${user?.uid || 'admin'}/200/200`} />
                <AvatarFallback className="text-2xl">AD</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full pointer-events-none">
                <ImageIcon className="text-white h-8 w-8" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">{displayName || 'Administrator'}</p>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{user?.email || 'admin@gstorage.com'}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Master Admin"
                className="bg-background/50 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL">Avatar URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="photoURL" 
                  value={photoURL} 
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  className="bg-background/50 h-11"
                />
                <Button variant="outline" size="icon" className="h-11 w-11 shrink-0" onClick={() => setPhotoURL(`https://picsum.photos/seed/${Math.random()}/200/200`)}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <Info className="h-3 w-3 text-primary" /> Bio
              </Label>
              <Textarea 
                id="bio" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell users something about yourself..."
                className="bg-background/50 min-h-[120px] resize-none"
                maxLength={160}
              />
              <div className="flex justify-end">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {bio.length} / 160 characters
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 border-t border-border/10 px-8 py-6">
          <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="w-full gap-2 h-12 text-md font-bold shadow-lg shadow-primary/20">
            {isUpdatingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Profile Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
