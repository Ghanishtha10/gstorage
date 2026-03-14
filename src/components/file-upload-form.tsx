"use client";

import { useState } from 'react';
import { addFile } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setTags([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      // In a real app, you'd upload to Storage first, then save to DB
      // Here we simulate the URL since we focus on DB persistence
      const fakeUrl = file.type.startsWith('image/') 
        ? `https://picsum.photos/seed/${Math.random()}/800/600`
        : `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`;

      await addFile({
        name: file.name,
        url: fakeUrl,
        type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'document'),
        mimeType: file.type,
        size: file.size,
        tags: tags.length > 0 ? tags : ['General'],
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "File Saved",
        description: "Your file metadata is now persisted in Firestore.",
      });
      router.push('/admin');
      router.refresh();
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
        <CardDescription>Upload a file to your secure storage locker.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {!file ? (
          <div className="border-2 border-dashed border-border/60 rounded-2xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h4 className="font-semibold text-lg">Choose a file or drag and drop</h4>
              <p className="text-sm text-muted-foreground">Any file type (Max 20MB)</p>
            </label>
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

            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-12" onClick={handleUpload} disabled={isUploading}>
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
