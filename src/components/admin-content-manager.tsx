
"use client";

import { ContentFile } from '@/lib/types';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2, Camera, CheckCircle2, X } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { upload } from '@vercel/blob/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from 'react';

interface AdminContentManagerProps {
  initialFiles: ContentFile[];
}

export function AdminContentManager({ initialFiles }: AdminContentManagerProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [fileToDelete, setFileToDelete] = useState<ContentFile | null>(null);
  const [fileToEdit, setFileToEdit] = useState<ContentFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<string>('');
  const [editThumb, setEditThumb] = useState('');
  const [editThumbFile, setEditThumbFile] = useState<File | null>(null);
  const [editDownloadable, setEditDownloadable] = useState(true);
  
  const editThumbInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async () => {
    if (!db || !fileToDelete) return;
    setIsDeleting(true);
    try {
      const blobResponse = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileToDelete.url }),
      });

      if (!blobResponse.ok) {
        console.warn("Blob deletion might have failed or file already gone from storage.");
      }

      if (fileToDelete.thumbnailUrl) {
        await fetch('/api/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: fileToDelete.thumbnailUrl }),
        });
      }

      await deleteDoc(doc(db, 'files', fileToDelete.id));
      
      toast({
        title: "Asset Purged",
        description: "The item has been removed from the vault and cloud storage.",
      });
      setFileToDelete(null);
    } catch (error) {
      console.error("Deletion error:", error);
      toast({
        variant: "destructive",
        title: "Purge Failed",
        description: "An error occurred while cleaning up the storage clusters.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (file: ContentFile) => {
    setFileToEdit(file);
    setEditName(file.name);
    setEditType(file.type);
    setEditThumb(file.thumbnailUrl || '');
    setEditThumbFile(null);
    setEditDownloadable(file.isDownloadable !== false);
  };

  const uploadToBlob = async (targetFile: File): Promise<string> => {
    try {
      const newBlob = await upload(targetFile.name, targetFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      return newBlob.url;
    } catch (err: any) {
      console.error("Edit thumbnail upload error:", err);
      throw err;
    }
  };

  const handleUpdate = async () => {
    if (!db || !fileToEdit) return;
    setIsUpdating(true);
    try {
      let finalThumb = editThumb;
      if (editThumbFile) {
        if (fileToEdit.thumbnailUrl) {
          await fetch('/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: fileToEdit.thumbnailUrl }),
          });
        }
        finalThumb = await uploadToBlob(editThumbFile);
      }

      await updateDoc(doc(db, 'files', fileToEdit.id), {
        name: editName,
        type: editType || 'other',
        thumbnailUrl: finalThumb || null,
        isDownloadable: editDownloadable,
      });
      toast({
        title: "Metadata Synced",
        description: "Asset properties updated successfully.",
      });
      setFileToEdit(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Could not update asset properties.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-headline font-bold">Content Library</h2>
          <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Secure Sync Active
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {initialFiles.length} nodes active
        </div>
      </div>
      
      {initialFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialFiles.map((file) => (
            <ContentCard 
              key={file.id} 
              file={file} 
              isAdmin 
              onDelete={() => setFileToDelete(file)} 
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/20 border-2 border-dashed border-border/40 rounded-2xl">
          <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No active data streams detected.</p>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && !isDeleting && setFileToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground">
              This will permanently delete <span className="text-foreground font-bold">{fileToDelete?.name}</span> from storage . This action is irreversible
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">Abort</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDelete(); }} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold uppercase tracking-widest text-[10px] h-11"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Conform Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!fileToEdit} onOpenChange={(open) => !open && !isUpdating && setFileToEdit(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Asset Reconfiguration</DialogTitle>
            <DialogDescription className="font-medium">Update the metadata for this digital asset.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity Tag</Label>
              <input 
                id="edit-name" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Classification</Label>
              <input 
                id="edit-type" 
                value={editType} 
                onChange={(e) => setEditType(e.target.value)} 
                className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground">Public Availability</Label>
                <p className="text-[9px] text-muted-foreground">Allow public users to download this file.</p>
              </div>
              <Switch 
                checked={editDownloadable} 
                onCheckedChange={setEditDownloadable} 
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Thumbnail Override</Label>
              <div className="flex gap-2">
                <input type="file" className="hidden" ref={editThumbInputRef} accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) setEditThumbFile(f); }} />
                <Button variant="outline" size="sm" className="h-11 w-full rounded-xl gap-2 border-primary/20 hover:border-primary/50 bg-muted/10" onClick={() => editThumbInputRef.current?.click()}>
                  {editThumbFile ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <Camera className="h-4 w-4" />}
                  {editThumbFile ? "New Reference Set" : "Update Visual Reference"}
                </Button>
                {editThumbFile && <Button variant="ghost" size="icon" className="h-11 w-11 text-destructive" onClick={() => setEditThumbFile(null)}><X className="h-5 w-5" /></Button>}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="rounded-xl" onClick={() => setFileToEdit(null)} disabled={isUpdating}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating} className="rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] h-11 px-6">
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUpdating ? "Syncing..." : "Commit Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
