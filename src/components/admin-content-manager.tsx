"use client";

import { ContentFile } from '@/lib/types';
import { ContentCard } from '@/components/content-card';
import { Database } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface AdminContentManagerProps {
  initialFiles: ContentFile[];
}

export function AdminContentManager({ initialFiles }: AdminContentManagerProps) {
  const db = useFirestore();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'files', id));
      toast({
        title: "File Deleted",
        description: "The item has been permanently removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not remove the file from Firestore.",
      });
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
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/20 border-2 border-dashed border-border/40 rounded-2xl">
          <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Your storage locker is currently empty.</p>
        </div>
      )}
    </section>
  );
}
