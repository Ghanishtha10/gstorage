"use client";

import { ContentFile } from '@/lib/types';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface AdminContentManagerProps {
  initialFiles: ContentFile[];
}

export function AdminContentManager({ initialFiles }: AdminContentManagerProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [fileToEdit, setFileToEdit] = useState<ContentFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<ContentFile['type']>('other');
  const [editThumb, setEditThumb] = useState('');

  const handleDelete = async () => {
    if (!db || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'files', fileToDelete));
      toast({
        title: "File Deleted",
        description: "The item has been permanently removed from Firestore.",
      });
      setFileToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not remove the file from the database.",
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
  };

  const handleUpdate = async () => {
    if (!db || !fileToEdit) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'files', fileToEdit.id), {
        name: editName,
        type: editType,
        thumbnailUrl: editThumb || null,
      });
      toast({
        title: "File Updated",
        description: "Metadata changes have been synchronized.",
      });
      setFileToEdit(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not sync changes to the database.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline font-bold">Content Library</h2>
        <div className="text-sm text-muted-foreground">
          {initialFiles.length} items total
        </div>
      </div>
      
      {initialFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialFiles.map((file) => (
            <ContentCard 
              key={file.id} 
              file={file} 
              isAdmin 
              onDelete={(id) => setFileToDelete(id)} 
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/20 border-2 border-dashed border-border/40 rounded-2xl">
          <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Your storage locker is currently empty.</p>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && !isDeleting && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and will remove the file's metadata from G storage. You cannot undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!fileToEdit} onOpenChange={(open) => !open && !isUpdating && setFileToEdit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit File Metadata</DialogTitle>
            <DialogDescription>
              Modify how this file appears in the vault.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
              <Input 
                id="edit-name" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Select value={editType} onValueChange={(v) => setEditType(v as any)}>
                <SelectTrigger className="bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-thumb" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Thumbnail URL</Label>
              <Input 
                id="edit-thumb" 
                value={editThumb} 
                onChange={(e) => setEditThumb(e.target.value)}
                placeholder="https://..."
                className="bg-muted/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFileToEdit(null)} disabled={isUpdating}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating} className="gap-2">
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}