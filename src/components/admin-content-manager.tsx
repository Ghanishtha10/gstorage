"use client";

import { ContentFile } from '@/lib/types';
import { ContentCard } from '@/components/content-card';
import { Database, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
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
import { useState } from 'react';

interface AdminContentManagerProps {
  initialFiles: ContentFile[];
}

export function AdminContentManager({ initialFiles }: AdminContentManagerProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/20 border-2 border-dashed border-border/40 rounded-2xl">
          <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Your storage locker is currently empty.</p>
        </div>
      )}

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
    </section>
  );
}
