"use client";

import { useState, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !db) return;
    setIsUploading(true);
    
    try {
      // Simulation of URL generation for prototype
      const fakeUrl = file.type.startsWith('image/') 
        ? `https://picsum.photos/seed/${Math.random()}/800/600`
        : `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`;

      await addDoc(collection(db, 'files'), {
        name: file.name,
        url: fakeUrl,
        type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'document'),
        mimeType: file.type,
        size: file.size,
        tags: ['General'],
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "File Saved",
        description: "Your file metadata is now persisted in Firestore.",
      });
      router.push('/admin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Error saving file metadata to Firestore.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-card border-border/40 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" /> New Content Upload
        </CardTitle>
        <CardDescription>Select a file to add to your secure storage locker.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {!file ? (
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center space-y-4 transition-all cursor-pointer group relative",
              isDragging 
                ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" 
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              id="file-upload" 
              onChange={handleFileChange} 
            />
            <div className="pointer-events-none">
              <div className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors",
                isDragging ? "bg-primary/20" : "bg-muted/50 group-hover:bg-primary/10"
              )}>
                <Upload className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
              </div>
              <h4 className="font-semibold text-lg">
                {isDragging ? "Drop your file here" : "Choose a file or drag and drop"}
              </h4>
              <p className="text-sm text-muted-foreground">Any file type (Max 20MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/60">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {file.type.startsWith('image/') ? <ImageIcon className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Save to Firestore
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
