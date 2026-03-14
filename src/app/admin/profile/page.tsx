
"use client";

import { useState, useEffect } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Tag, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const tagsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'tags'), orderBy('name', 'asc'));
  }, [db]);

  const { data: tags, isLoading: isTagsLoading } = useCollection(tagsQuery);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || `https://picsum.photos/seed/${auth.currentUser.uid}/200/200`
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

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim() || !db) return;
    setIsAddingTag(true);
    try {
      const tagId = newTagName.toLowerCase().replace(/\s+/g, '-');
      await addDoc(collection(db, 'tags'), {
        id: tagId,
        name: newTagName.trim(),
        isAISuggested: false,
        createdAt: new Date().toISOString()
      });
      setNewTagName('');
      toast({ title: "Tag Added", description: `"${newTagName}" is now available.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add tag." });
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'tags', id));
      toast({ title: "Tag Removed" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete tag." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Account & Settings</h1>
        <p className="text-muted-foreground">Manage your identity and global organization rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <Card className="bg-card border-border/40 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Identity
            </CardTitle>
            <CardDescription>Update your public-facing administrator details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20 ring-4 ring-background shadow-xl">
                <AvatarImage src={photoURL || `https://picsum.photos/seed/${user?.uid || 'admin'}/200/200`} />
                <AvatarFallback className="text-2xl">AD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-bold text-lg">{displayName || 'Administrator'}</p>
                <p className="text-xs text-muted-foreground font-mono">{user?.email || 'admin@gstorage.com'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Master Admin"
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
                  />
                  <Button variant="outline" size="icon" onClick={() => setPhotoURL(`https://picsum.photos/seed/${Math.random()}/200/200`)}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic">Leave empty to use a random seed avatar.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/40 px-6 py-4">
            <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="w-full gap-2">
              {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Global Tags Section */}
        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-secondary" /> Tag Management
            </CardTitle>
            <CardDescription>Configure the categories available for file organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddTag} className="flex gap-2">
              <Input 
                placeholder="New tag name..." 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <Button type="submit" size="icon" disabled={isAddingTag} className="shrink-0 bg-secondary hover:bg-secondary/90">
                {isAddingTag ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </form>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {isTagsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" />
                </div>
              ) : tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-sm font-medium">{tag.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No global tags defined.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
