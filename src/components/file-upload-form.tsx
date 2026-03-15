"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useFirestore, useFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2, Video, Headphones, Camera, HardDrive, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileType } from '@/lib/types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit for cloud storage prototype

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [fileType, setFileType] = useState<FileType>('');
  const [customThumbUrl, setCustomThumbUrl] = useState('');
  
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const { firestore: db, storage } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (file) {
      setDisplayName(file.name);
      if (file.type.startsWith('image/')) setFileType('image');
      else if (file.type.startsWith('video/')) setFileType('video');
      else if (file.type.startsWith('audio/')) setFileType('audio');
      else if (file.type === 'application/pdf') setFileType('document');
      else setFileType('other');

      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "For this prototype, files must be under 50MB.",
        });
        setFile(null);
      }
    }
  }, [file, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setThumbFile(selected);
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
    if (!file || !db || !storage) return;

    setIsUploading(true);
    
    try {
      // 1. Upload main file to Firebase Storage
      const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      const fileSnapshot = await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileSnapshot.ref);

      // 2. Handle Thumbnail upload if exists
      let finalThumb = customThumbUrl;
      if (thumbFile) {
        const thumbRef = ref(storage, `thumbnails/${Date.now()}-${thumbFile.name}`);
        const thumbSnapshot = await uploadBytes(thumbRef, thumbFile);
        finalThumb = await getDownloadURL(thumbSnapshot.ref);
      }

      // 3. Save metadata to Firestore
      await addDoc(collection(db, 'files'), {
        name: displayName || file.name,
        url: fileUrl,
        thumbnailUrl: finalThumb || null,
        type: fileType || 'other',
        mimeType: file.type,
        size: file.size,
        tags: ['General'],
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "File securely uploaded to cloud storage.",
      });
      router.push('/admin');
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Could not complete the cloud upload.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-card border-border/40 overflow-hidden shadow-xl">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="flex items-center gap-2 text-primary">
          <HardDrive className="h-5 w-5" />
          <span>Secure Asset Intake</span>
        </CardTitle>
        <CardDescription>Uploads are now supported via Cloud Storage (Max 50MB).</CardDescription>
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
                {isDragging ? "Drop to upload" : "Select or drag asset"}
              </h4>
              <p className="text-sm text-muted-foreground text-balance">PDFs, Archives, Media, and more. Max 50MB.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/40 border-border/60 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {fileType === 'image' && <ImageIcon className="h-5 w-5 text-primary" />}
                  {fileType === 'video' && <Video className="h-5 w-5 text-primary" />}
                  {fileType === 'audio' && <Headphones className="h-5 w-5 text-primary" />}
                  {fileType === 'document' && <FileText className="h-5 w-5 text-primary" />}
                  {!['image', 'video', 'audio', 'document'].includes(fileType) && <Upload className="h-5 w-5 text-primary" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kind / Category</Label>
                <input 
                  id="fileType" 
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                  placeholder="e.g. PDF, Archive, Source..."
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preview Thumbnail (Optional)</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    id="thumbUrl" 
                    value={thumbFile ? `[Asset Selected: ${thumbFile.name}]` : customThumbUrl} 
                    onChange={(e) => {
                      setCustomThumbUrl(e.target.value);
                      setThumbFile(null);
                    }}
                    placeholder="URL or use the upload button..."
                    className="flex h-11 flex-1 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background"
                    readOnly={!!thumbFile}
                  />
                  <input type="file" className="hidden" ref={thumbInputRef} accept="image/*" onChange={handleThumbChange} />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => thumbInputRef.current?.click()} 
                    className="h-11 px-6 border-primary/20 hover:border-primary/50 text-xs font-bold uppercase"
                  >
                    <Camera className="h-4 w-4 mr-2" /> {thumbFile ? "Change" : "Upload"}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-xl shadow-xl shadow-primary/20 mt-4 active:scale-[0.98] transition-all" 
              onClick={handleUpload} 
              disabled={isUploading || !file}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Transferring to Cloud...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Finalize Cloud Upload
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
